<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

$user = current_user();
$pageTitle = $pageTitle ?? 'Dashboard';
$flash = get_flash();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo e($pageTitle); ?> - <?php echo e(APP_NAME); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo e(app_url('/assets/css/style.css')); ?>">
</head>
<body>
<div class="app-shell">
    <aside class="sidebar">
        <h4 class="mb-3"><?php echo e(APP_NAME); ?></h4>
        <a href="<?php echo e(app_url('/admin/index.php')); ?>" class="menu-link">Dashboard</a>
        <?php if ($user && $user['role'] === 'admin'): ?>
            <a href="<?php echo e(app_url('/admin/users.php')); ?>" class="menu-link">Users</a>
            <a href="<?php echo e(app_url('/admin/settings.php')); ?>" class="menu-link">Settings</a>
        <?php endif; ?>
        <a href="<?php echo e(app_url('/admin/logout.php')); ?>" class="menu-link text-danger">Logout</a>
    </aside>

    <main class="content-wrap">
        <nav class="topbar d-flex justify-content-between align-items-center mb-3">
            <div>
                <strong><?php echo e($pageTitle); ?></strong>
            </div>
            <div class="small text-muted">
                <?php echo e($user['name'] ?? 'Guest'); ?>
                (<?php echo e($user['role'] ?? 'none'); ?>)
            </div>
        </nav>

        <?php if ($flash): ?>
            <div class="alert alert-<?php echo e($flash['type']); ?>" role="alert">
                <?php echo e($flash['message']); ?>
            </div>
        <?php endif; ?>
