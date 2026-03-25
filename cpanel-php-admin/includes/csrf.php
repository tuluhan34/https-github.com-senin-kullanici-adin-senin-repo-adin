<?php
declare(strict_types=1);

require_once __DIR__ . '/functions.php';

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . e(csrf_token()) . '">';
}

function verify_csrf(?string $token): bool
{
    $sessionToken = $_SESSION['csrf_token'] ?? '';
    return is_string($token) && $sessionToken !== '' && hash_equals($sessionToken, $token);
}
