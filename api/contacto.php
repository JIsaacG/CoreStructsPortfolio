<?php
/**
 * Endpoint del formulario "Hablemos".
 *
 * El panel de cotización (`src/scripts/cotizador.js`) hace dos cosas a la vez
 * cuando alguien envía el formulario: abre WhatsApp con el mensaje ya escrito
 * —eso ocurre entero en el navegador— y manda estos mismos cuatro campos aquí,
 * para que quede una copia en el buzón del estudio aunque la persona nunca
 * llegue a pulsar "enviar" en WhatsApp. Ese segundo camino es el que resuelve
 * este archivo, porque un navegador no puede hablar SMTP.
 *
 * Recibe JSON por POST y responde JSON. Nunca devuelve la contraseña ni el
 * diálogo con el servidor salvo que `debug` esté activo en `config.php`.
 */

declare(strict_types=1);

require __DIR__ . '/smtp.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/** Respuesta JSON y salida inmediata. */
function reply(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/* ------------------------------------------------------------ configuración */

$configFile = __DIR__ . '/config.php';

if (!is_file($configFile)) {
    error_log('contacto.php: falta api/config.php.');
    reply(500, ['ok' => false, 'error' => 'server_misconfigured']);
}

$config = require $configFile;

/**
 * Sin credenciales no hay nada que hacer, y el motivo tiene que poder verse
 * desde fuera: el fallo típico al desplegar es que las variables de entorno no
 * llegan al PHP, y desde el navegador eso es indistinguible de cualquier otro
 * 500. Se devuelven los NOMBRES de lo que falta, nunca ningún valor.
 */
$missing = [];
foreach (['SMTP_USER' => 'smtp_user', 'SMTP_PASS' => 'smtp_pass', 'MAIL_FROM' => 'mail_from'] as $variable => $key) {
    if (($config[$key] ?? null) === null || $config[$key] === '') {
        $missing[] = $variable;
    }
}
if (($config['mail_to'] ?? []) === []) {
    $missing[] = 'MAIL_TO';
}

if ($missing !== []) {
    error_log('contacto.php: faltan variables de entorno: ' . implode(', ', $missing));
    reply(500, ['ok' => false, 'error' => 'server_misconfigured', 'missing' => $missing]);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $config['allowed_origins'] ?? [];

/**
 * El navegador sí manda `Origin` en un POST aunque sea del mismo sitio, así que
 * no basta con mirar si viene: hay que comparar. Un origen cuyo host es el del
 * propio servidor pasa siempre —es el formulario de este sitio llamando a su
 * propio endpoint, y así el correo sigue saliendo si un día el sitio se ve por
 * un subdominio de pruebas o por la URL temporal del hosting—. Lo que la lista
 * de `config.php` filtra es lo otro: otro dominio usando esto como relé.
 */
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST) ?? '';
    $selfHost = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    $sameSite = $originHost !== '' && strcasecmp($originHost, (string) $selfHost) === 0;

    if (!$sameSite && ($allowed === [] || !in_array($origin, $allowed, true))) {
        reply(403, ['ok' => false, 'error' => 'origin_not_allowed']);
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    reply(204, []);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['ok' => false, 'error' => 'method_not_allowed']);
}

/* ------------------------------------------------------------------ límites */

/**
 * Tope por IP. El endpoint solo puede escribirle al buzón del estudio, así que
 * el peor abuso posible es inundar ese buzón — y esto lo corta sin necesidad de
 * base de datos: un archivo por IP en el temporal del sistema.
 */
function withinRateLimit(int $limit, int $window): bool
{
    if ($limit <= 0) {
        return true;
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
    $file = sys_get_temp_dir() . '/cs-quote-' . hash('sha256', $ip) . '.json';

    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        // Si el temporal no se puede escribir se prefiere entregar el correo
        // antes que perder una solicitud real por un permiso de disco.
        return true;
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            return true;
        }

        $now = time();
        $raw = stream_get_contents($handle);
        $stamps = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        $stamps = is_array($stamps) ? $stamps : [];

        $stamps = array_values(array_filter(
            $stamps,
            static fn($stamp) => is_int($stamp) && $stamp > $now - $window,
        ));

        if (count($stamps) >= $limit) {
            return false;
        }

        $stamps[] = $now;

        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($stamps));

        return true;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/* ------------------------------------------------------------------- datos */

$raw = file_get_contents('php://input') ?: '';
$input = json_decode($raw, true);

// `$_POST` cubre el envío sin JavaScript y el `application/x-www-form-urlencoded`
// de un `navigator.sendBeacon`.
if (!is_array($input)) {
    $input = $_POST;
}

/** Un campo de texto, recortado y sin caracteres de control. */
function field(array $input, string $name, int $max): string
{
    $value = $input[$name] ?? '';
    if (!is_scalar($value)) {
        return '';
    }

    $value = trim((string) $value);
    // Los saltos de línea se conservan en la descripción; el resto de campos se
    // limpian por completo antes de tocar una cabecera de correo.
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';

    return mb_substr($value, 0, $max);
}

/** Para cabeceras: además de lo anterior, ni un salto de línea. Sin excepciones. */
function headerSafe(string $value): string
{
    return trim(str_replace(["\r", "\n"], ' ', $value));
}

$nombre  = headerSafe(field($input, 'nombre', 120));
$contacto = headerSafe(field($input, 'contacto', 160));
$tipo    = headerSafe(field($input, 'tipo', 120));
$detalle = field($input, 'detalle', 4000);
$idioma  = field($input, 'idioma', 5) === 'en' ? 'en' : 'es';
$origen  = headerSafe(field($input, 'origen', 300));

$faltan = [];
foreach (['nombre' => $nombre, 'contacto' => $contacto, 'detalle' => $detalle] as $name => $value) {
    if ($value === '') {
        $faltan[] = $name;
    }
}

if ($faltan !== []) {
    reply(422, ['ok' => false, 'error' => 'missing_fields', 'fields' => $faltan]);
}

if (!withinRateLimit((int) ($config['rate_limit'] ?? 5), (int) ($config['rate_window'] ?? 600))) {
    reply(429, ['ok' => false, 'error' => 'rate_limited']);
}

/* ---------------------------------------------------------------- mensaje */

/** Cabecera con acentos: RFC 2047, o tal cual si ya es ASCII imprimible. */
function encodeHeader(string $value): string
{
    return preg_match('/^[\x20-\x7E]*$/', $value) === 1
        ? $value
        : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

$esEmail = filter_var($contacto, FILTER_VALIDATE_EMAIL) !== false;
$recibido = date('d/m/Y H:i:s');

$plain = implode("\r\n", [
    'Nueva solicitud desde el formulario del sitio.',
    '',
    'Nombre:      ' . $nombre,
    'Contacto:    ' . $contacto,
    'Tipo:        ' . ($tipo !== '' ? $tipo : '(sin especificar)'),
    'Idioma:      ' . ($idioma === 'en' ? 'Inglés' : 'Español'),
    'Recibido:    ' . $recibido,
    'Página:      ' . ($origen !== '' ? $origen : '(desconocida)'),
    '',
    'Descripción:',
    $detalle,
    '',
    '--',
    'Enviado automáticamente por el formulario de corestructhn.com',
]);

$e = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

$filas = [
    'Nombre' => $e($nombre),
    'Contacto' => $esEmail
        ? '<a href="mailto:' . $e($contacto) . '" style="color:#2f6fe0;text-decoration:none">' . $e($contacto) . '</a>'
        : $e($contacto),
    'Tipo de solución' => $e($tipo !== '' ? $tipo : '(sin especificar)'),
    'Idioma' => $idioma === 'en' ? 'Inglés' : 'Español',
    'Recibido' => $e($recibido),
];

if ($origen !== '') {
    $filas['Página'] = '<a href="' . $e($origen) . '" style="color:#2f6fe0;text-decoration:none">' . $e($origen) . '</a>';
}

$celdas = '';
foreach ($filas as $etiqueta => $valor) {
    $celdas .=
        '<tr>' .
        '<td style="padding:8px 16px 8px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">' . $e($etiqueta) . '</td>' .
        '<td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600">' . $valor . '</td>' .
        '</tr>';
}

$html =
    '<!doctype html><html lang="es"><body style="margin:0;background:#f4f6fb;padding:24px;' .
    'font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">' .
    '<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;' .
    'background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(17,24,39,.08)">' .
    '<tr><td style="background:linear-gradient(100deg,#2ec5ff,#2f6fe0 55%,#10214a);padding:20px 28px">' .
    '<p style="margin:0;color:#ffffff;font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85">Cotización rápida</p>' .
    '<h1 style="margin:4px 0 0;color:#ffffff;font-size:19px">Nueva solicitud del sitio</h1>' .
    '</td></tr>' .
    '<tr><td style="padding:24px 28px 8px">' .
    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%">' . $celdas . '</table>' .
    '</td></tr>' .
    '<tr><td style="padding:8px 28px 28px">' .
    '<p style="margin:0 0 6px;color:#6b7280;font-size:13px">Descripción</p>' .
    '<div style="padding:14px 16px;background:#f4f6fb;border-radius:10px;border-left:3px solid #2f6fe0;' .
    'color:#111827;font-size:14px;line-height:1.6;white-space:pre-wrap">' . $e($detalle) . '</div>' .
    '</td></tr>' .
    '<tr><td style="padding:0 28px 24px;color:#9ca3af;font-size:12px;border-top:1px solid #eef1f6;padding-top:16px">' .
    'Enviado automáticamente por el formulario de corestructhn.com' .
    '</td></tr>' .
    '</table></body></html>';

$boundary = 'cs-' . bin2hex(random_bytes(12));
$fromName = (string) ($config['mail_from_name'] ?? 'CoreStruct');
$from = (string) $config['mail_from'];
$to = (array) ($config['mail_to'] ?? []);

$asunto = 'Nueva cotización — ' . ($tipo !== '' ? $tipo : 'sin especificar') . ' — ' . $nombre;

$headers = [
    'From: ' . encodeHeader($fromName) . ' <' . $from . '>',
    'To: ' . implode(', ', array_map(static fn($address) => '<' . $address . '>', $to)),
    'Subject: ' . encodeHeader($asunto),
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . substr(strrchr($from, '@') ?: '@localhost', 1) . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
];

// Responder al correo lleva directo a la persona, no al buzón del sistema.
if ($esEmail) {
    $headers[] = 'Reply-To: ' . encodeHeader($nombre) . ' <' . $contacto . '>';
}

// base64 en ambas partes: evita que una línea larga o una que empiece por punto
// rompa la transmisión, sin tener que implementar el escapado de SMTP.
$message = implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", [
    'Este mensaje requiere un lector compatible con MIME.',
    '',
    '--' . $boundary,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    trim(chunk_split(base64_encode($plain), 76, "\r\n")),
    '',
    '--' . $boundary,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    trim(chunk_split(base64_encode($html), 76, "\r\n")),
    '',
    '--' . $boundary . '--',
]);

/* ------------------------------------------------------------------ envío */

$smtp = new Smtp(
    (string) $config['smtp_host'],
    (int) $config['smtp_port'],
    (bool) ($config['smtp_secure'] ?? true),
    (string) $config['smtp_user'],
    (string) $config['smtp_pass'],
);

try {
    $accepted = $smtp->send($from, $to, $message);
} catch (Throwable $error) {
    error_log('contacto.php: ' . $error->getMessage());

    $payload = ['ok' => false, 'error' => 'send_failed'];
    if (!empty($config['debug'])) {
        $payload['detail'] = $error->getMessage();
        $payload['trace'] = $smtp->trace();
    }

    reply(502, $payload);
}

$payload = ['ok' => true];
if (!empty($config['debug'])) {
    $payload['accepted'] = $accepted;
    $payload['trace'] = $smtp->trace();
}

reply(200, $payload);
