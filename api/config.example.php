<?php
/**
 * Plantilla de configuración del endpoint de contacto.
 *
 * Copia este archivo a `config.php` en el mismo directorio y rellena los
 * valores reales. `config.php` está en `.gitignore` a propósito: la contraseña
 * del buzón no debe viajar en el repositorio, así que es el único archivo del
 * proyecto que se sube al hosting a mano y no se versiona.
 *
 *   cp api/config.example.php api/config.php
 *
 * Los datos salen del panel de Hostinger, en Correos → Cuentas de correo →
 * Configuración → Configuración manual.
 */

declare(strict_types=1);

return [
    // Servidor de salida.
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_port' => 465,

    // true en el 465 (TLS desde el saludo), false en el 587 (STARTTLS).
    'smtp_secure' => true,

    // Buzón que envía. Tiene que ser una cuenta real del dominio: es la que
    // firma el sobre y la que hace que SPF y DKIM cuadren.
    'smtp_user' => 'buzon@tudominio.com',
    'smtp_pass' => 'la-contraseña-del-buzón',

    // Remitente que ve quien recibe. `mail_from` debe coincidir con
    // `smtp_user`; Hostinger rechaza enviar en nombre de otra dirección.
    'mail_from' => 'buzon@tudominio.com',
    'mail_from_name' => 'CoreStruct',

    // A dónde llegan las solicitudes del formulario. Admite varias.
    'mail_to' => ['contacto@tudominio.com'],

    // Orígenes que pueden llamar al endpoint. El navegador no necesita CORS
    // para el propio dominio; esto solo cierra la puerta a que otro sitio
    // use el formulario como relé. Vacío = solo mismo origen.
    'allowed_origins' => [
        'https://tudominio.com',
        'https://www.tudominio.com',
    ],

    // Tope de solicitudes por IP y ventana, para que el endpoint no se
    // convierta en una manguera de spam hacia el propio buzón.
    'rate_limit' => 5,
    'rate_window' => 600, // segundos

    // true solo mientras se depura: devuelve el diálogo SMTP completo en la
    // respuesta JSON. Déjalo en false en producción.
    'debug' => false,
];
