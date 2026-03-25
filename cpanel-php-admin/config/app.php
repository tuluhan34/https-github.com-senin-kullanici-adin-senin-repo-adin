<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    ]);
    session_start();
}

define('APP_NAME', 'PHP Admin Panel');
define('BASE_PATH', dirname(__DIR__));
define('BASE_URL', '/cpanel-php-admin');
define('APP_DEBUG', false);

date_default_timezone_set('Europe/Istanbul');

error_reporting(E_ALL);
ini_set('display_errors', APP_DEBUG ? '1' : '0');
ini_set('log_errors', '1');
