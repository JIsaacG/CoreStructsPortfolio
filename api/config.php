<?php
/**
 * Configuración del endpoint de contacto.
 *
 * No contiene ni un secreto, y por eso sí se versiona. Todo lo delicado —el
 * buzón que se autentica y su contraseña— sale del entorno, que en Hostinger
 * se rellena en hPanel → tu sitio → Variables de entorno.
 *
 * Para desarrollo local, un archivo `.env` junto a este lo suple. Ese sí está
 * en `.gitignore`, y el entorno real siempre le gana: si el hosting define una
 * variable, el `.env` no la pisa.
 *
 * Variables que lee (las cuatro primeras son obligatorias):
 *
 *   SMTP_USER        buzón que se autentica
 *   SMTP_PASS        su contraseña
 *   MAIL_FROM        remitente; tiene que ser el mismo que SMTP_USER
 *   MAIL_TO          destino de las solicitudes, separado por comas
 *
 *   SMTP_HOST        smtp.hostinger.com
 *   SMTP_PORT        465
 *   SMTP_SECURE      true en el 465, false en el 587 (STARTTLS)
 *   MAIL_FROM_NAME   el nombre que ve quien recibe
 *   ALLOWED_ORIGINS  dominios ajenos permitidos, separados por comas
 *   RATE_LIMIT       envíos por IP y ventana
 *   RATE_WINDOW      segundos de la ventana
 *   MAIL_DEBUG       true devuelve el diálogo SMTP en la respuesta
 */

declare(strict_types=1);

/**
 * Un `.env` junto a este archivo, solo para desarrollo. Se carga en `$_ENV`,
 * nunca encima de una variable que el servidor ya haya definido.
 */
$loadDotEnv = static function (string $file): void {
    if (!is_readable($file)) {
        return;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $name = trim($parts[0]);
        $value = trim($parts[1]);

        // Las comillas envolventes se admiten y no forman parte del valor.
        if (strlen($value) >= 2 && ($value[0] === '"' || $value[0] === "'") && $value[-1] === $value[0]) {
            $value = substr($value, 1, -1);
        }

        if ($name === '' || isset($_ENV[$name]) || isset($_SERVER[$name]) || getenv($name) !== false) {
            continue;
        }

        $_ENV[$name] = $value;
    }
};

$loadDotEnv(__DIR__ . '/.env');

/** Una variable del entorno, mire donde mire PHP, o null si no está puesta. */
$env = static function (string $name): ?string {
    $value = $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name);

    if ($value === false || $value === null) {
        return null;
    }

    $value = trim((string) $value);

    return $value === '' ? null : $value;
};

/** "true", "1", "yes" u "on"; cualquier otra cosa es false. */
$flag = static function (?string $value, bool $default): bool {
    if ($value === null) {
        return $default;
    }

    return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
};

/** Una lista separada por comas, sin huecos. */
$list = static function (?string $value): array {
    if ($value === null) {
        return [];
    }

    return array_values(
        array_filter(array_map('trim', explode(',', $value)), static fn($item) => $item !== ''),
    );
};

return [
    'smtp_host' => $env('SMTP_HOST') ?? 'smtp.hostinger.com',
    'smtp_port' => (int) ($env('SMTP_PORT') ?? 465),
    'smtp_secure' => $flag($env('SMTP_SECURE'), true),

    'smtp_user' => $env('SMTP_USER'),
    'smtp_pass' => $env('SMTP_PASS'),

    'mail_from' => $env('MAIL_FROM') ?? $env('SMTP_USER'),
    'mail_from_name' => $env('MAIL_FROM_NAME') ?? 'CoreStruct',

    'mail_to' => $list($env('MAIL_TO')),

    // Que esté vacía no abre ninguna puerta: el endpoint deja pasar igualmente
    // al propio dominio del sitio, y esta lista solo añade orígenes ajenos.
    'allowed_origins' => $list($env('ALLOWED_ORIGINS')),

    'rate_limit' => (int) ($env('RATE_LIMIT') ?? 5),
    'rate_window' => (int) ($env('RATE_WINDOW') ?? 600),

    'debug' => $flag($env('MAIL_DEBUG'), false),
];
