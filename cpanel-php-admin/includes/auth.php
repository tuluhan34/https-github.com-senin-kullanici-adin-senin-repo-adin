<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/functions.php';

function current_user(): ?array
{
    static $user = null;

    if ($user !== null) {
        return $user;
    }

    $userId = (int) ($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        $user = null;
        return null;
    }

    $stmt = db()->prepare('SELECT id, name, email, role, is_active FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $userId]);
    $record = $stmt->fetch();

    if (!$record || (int) $record['is_active'] !== 1) {
        unset($_SESSION['user_id']);
        $user = null;
        return null;
    }

    $user = $record;
    return $user;
}

function is_logged_in(): bool
{
    return current_user() !== null;
}

function is_admin(): bool
{
    $user = current_user();
    return $user !== null && $user['role'] === 'admin';
}

function require_login(): void
{
    if (!is_logged_in()) {
        set_flash('warning', 'Please login first.');
        redirect('/admin/login.php');
    }
}

function require_admin(): void
{
    require_login();

    if (!is_admin()) {
        set_flash('danger', 'You are not authorized for this action.');
        redirect('/admin/index.php');
    }
}

function attempt_login(string $email, string $password): bool
{
    $stmt = db()->prepare('SELECT id, password_hash, is_active FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || (int) $user['is_active'] !== 1) {
        return false;
    }

    if (!password_verify($password, (string) $user['password_hash'])) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];

    return true;
}

function logout_user(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool) $params['secure'], (bool) $params['httponly']);
    }

    session_destroy();
}
