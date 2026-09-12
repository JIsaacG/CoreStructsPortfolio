<?php
/**
 * Cliente SMTP mínimo — sin Composer, sin PHPMailer, sin extensiones raras.
 *
 * El hosting de Hostinger no tiene un `sendmail` que firme correo del dominio,
 * así que `mail()` de PHP entrega mensajes que Gmail y Outlook marcan como spam
 * o rechazan de plano. Esto abre la conexión autenticada a mano contra
 * smtp.hostinger.com y entrega el mensaje como lo haría un cliente de correo:
 * el sobre sale del buzón real del dominio, con su SPF y su DKIM.
 *
 * Todo lo que necesita son sockets TLS (`openssl`), que el plan de Hostinger
 * trae activado. Si algo falla lanza una excepción con la respuesta literal del
 * servidor, porque a la hora de depurar entrega de correo el código numérico
 * del otro lado es lo único que sirve.
 */

declare(strict_types=1);

final class SmtpError extends RuntimeException {}

final class Smtp
{
    /** @var resource|null */
    private $socket = null;

    /** Diálogo completo, para el log cuando algo sale mal. */
    private array $trace = [];

    public function __construct(
        private string $host,
        private int $port,
        private bool $secure,
        private string $user,
        private string $pass,
        private int $timeout = 20,
    ) {}

    /**
     * Entrega un mensaje ya compuesto.
     *
     * @param string $from      Buzón que firma el sobre (el autenticado).
     * @param array  $to        Destinatarios.
     * @param string $message   Cabeceras + cuerpo, con saltos CRLF.
     */
    public function send(string $from, array $to, string $message): string
    {
        if ($to === []) {
            throw new SmtpError('No hay destinatarios.');
        }

        $this->open();

        try {
            $this->expect($this->read(), 220);

            // El nombre del dominio, no el del servidor web: algunos filtros
            // comparan el EHLO con el dominio del remitente.
            $domain = substr(strrchr($from, '@') ?: '@localhost', 1);
            $this->expect($this->cmd('EHLO ' . $domain), 250);

            // STARTTLS solo aplica al 587; el 465 ya nació cifrado.
            if (!$this->secure) {
                $this->expect($this->cmd('STARTTLS'), 220);
                if (!stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                    throw new SmtpError('No se pudo iniciar TLS con STARTTLS.');
                }
                $this->expect($this->cmd('EHLO ' . $domain), 250);
            }

            $this->expect($this->cmd('AUTH LOGIN'), 334);
            $this->expect($this->cmd(base64_encode($this->user), true), 334);
            $this->expect($this->cmd(base64_encode($this->pass), true), 235);

            $this->expect($this->cmd('MAIL FROM:<' . $from . '>'), 250);
            foreach ($to as $recipient) {
                $this->expect($this->cmd('RCPT TO:<' . $recipient . '>'), 250, 251);
            }

            $this->expect($this->cmd('DATA'), 354);

            $this->trace[] = '>> [cuerpo del mensaje]';
            $this->write($message . "\r\n.\r\n");
            $accepted = $this->expect($this->read(), 250);

            // QUIT es cortesía: si el servidor ya aceptó el 250 el mensaje está
            // en su cola, y que el cierre falle no lo deshace.
            try {
                $this->cmd('QUIT');
            } catch (SmtpError) {
            }

            return trim($accepted['text']);
        } finally {
            $this->close();
        }
    }

    /** El diálogo, con las credenciales ya ocultas. */
    public function trace(): array
    {
        return $this->trace;
    }

    private function open(): void
    {
        $target = ($this->secure ? 'ssl://' : 'tcp://') . $this->host . ':' . $this->port;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => true,
                'verify_peer_name' => true,
                'SNI_enabled' => true,
                'peer_name' => $this->host,
            ],
        ]);

        $socket = @stream_socket_client(
            $target,
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context,
        );

        if ($socket === false) {
            throw new SmtpError(sprintf('No se pudo conectar a %s (%d: %s).', $target, $errno, $errstr));
        }

        stream_set_timeout($socket, $this->timeout);
        $this->socket = $socket;
    }

    private function close(): void
    {
        if (is_resource($this->socket)) {
            @fclose($this->socket);
        }
        $this->socket = null;
    }

    private function write(string $data): void
    {
        if (@fwrite($this->socket, $data) === false) {
            throw new SmtpError('Se perdió la conexión al escribir en el servidor.');
        }
    }

    /** @return array{code:int,text:string} */
    private function cmd(string $line, bool $redact = false): array
    {
        $this->trace[] = '>> ' . ($redact ? '[oculto]' : $line);
        $this->write($line . "\r\n");
        return $this->read();
    }

    /**
     * Lee una respuesta completa. SMTP parte las respuestas largas en varias
     * líneas `250-…` y cierra con `250 …`: el espacio es el final, no el salto.
     *
     * @return array{code:int,text:string}
     */
    private function read(): array
    {
        $text = '';

        while (true) {
            $line = @fgets($this->socket, 8192);

            if ($line === false) {
                $meta = is_resource($this->socket) ? stream_get_meta_data($this->socket) : ['timed_out' => true];
                throw new SmtpError(
                    !empty($meta['timed_out'])
                        ? 'El servidor no respondió dentro de ' . $this->timeout . ' s.'
                        : 'La conexión se cerró antes de recibir la respuesta.',
                );
            }

            $text .= $line;

            // Cuarto carácter espacio = última línea de la respuesta.
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
            if (strlen(rtrim($line)) === 3) {
                break;
            }
        }

        $this->trace[] = '<< ' . trim($text);

        return ['code' => (int) substr($text, 0, 3), 'text' => $text];
    }

    /**
     * @param array{code:int,text:string} $response
     * @return array{code:int,text:string}
     */
    private function expect(array $response, int ...$codes): array
    {
        if (!in_array($response['code'], $codes, true)) {
            throw new SmtpError(sprintf(
                'El servidor respondió %d cuando se esperaba %s: %s',
                $response['code'],
                implode(' o ', $codes),
                trim($response['text']),
            ));
        }

        return $response;
    }
}
