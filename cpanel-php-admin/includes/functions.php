<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/app.php';

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function app_url(string $path = ''): string
{
    $base = rtrim(BASE_URL, '/');
    $path = '/' . ltrim($path, '/');
    return $base . ($path === '/' ? '' : $path);
}

function redirect(string $path): void
{
    header('Location: ' . app_url($path));
    exit;
}

function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = [
        'type' => $type,
        'message' => $message
    ];
}

function get_flash(): ?array
{
    if (!isset($_SESSION['flash'])) {
        return null;
    }

    $flash = $_SESSION['flash'];
    unset($_SESSION['flash']);

    return $flash;
}

function valid_role(string $role): bool
{
    return in_array($role, ['admin', 'user'], true);
}

function clean_text(?string $value, int $maxLength = 255): string
{
    $text = trim((string) $value);
    $length = function_exists('mb_strlen') ? mb_strlen($text) : strlen($text);

    if ($length > $maxLength) {
        $text = function_exists('mb_substr') ? mb_substr($text, 0, $maxLength) : substr($text, 0, $maxLength);
    }

    return $text;
}
