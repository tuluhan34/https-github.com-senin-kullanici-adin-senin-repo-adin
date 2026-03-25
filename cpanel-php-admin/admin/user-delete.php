<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('/admin/users.php');
}

if (!verify_csrf($_POST['csrf_token'] ?? null)) {
    set_flash('danger', 'Invalid security token.');
    redirect('/admin/users.php');
}

$userId = (int) ($_POST['id'] ?? 0);
$currentUser = current_user();

if ($userId <= 0) {
    set_flash('danger', 'Invalid user id.');
    redirect('/admin/users.php');
}

if ($currentUser && (int) $currentUser['id'] === $userId) {
    set_flash('warning', 'You cannot delete your own account.');
    redirect('/admin/users.php');
}

try {
    $stmt = db()->prepare('DELETE FROM users WHERE id = :id');
    $stmt->execute([':id' => $userId]);
    set_flash('success', 'User deleted successfully.');
} catch (Throwable $exception) {
    set_flash('danger', 'Could not delete user.');
}

redirect('/admin/users.php');
