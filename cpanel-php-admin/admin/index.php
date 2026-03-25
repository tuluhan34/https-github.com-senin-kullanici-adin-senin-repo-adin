<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

require_login();

$pageTitle = 'Dashboard';
$user = current_user();

$stats = [
    'users_total' => 0,
    'users_active' => 0,
    'settings_total' => 0
];

try {
    $stats['users_total'] = (int) db()->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $stats['users_active'] = (int) db()->query('SELECT COUNT(*) FROM users WHERE is_active = 1')->fetchColumn();
    $stats['settings_total'] = (int) db()->query('SELECT COUNT(*) FROM settings')->fetchColumn();
} catch (Throwable $exception) {
    set_flash('danger', 'Could not load dashboard statistics.');
}

require_once __DIR__ . '/../includes/layout-header.php';
?>
<div class="row g-3">
    <div class="col-md-4">
        <div class="card card-stat">
            <div class="card-body">
                <h6 class="text-muted">Total Users</h6>
                <h2><?php echo e((string) $stats['users_total']); ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card card-stat">
            <div class="card-body">
                <h6 class="text-muted">Active Users</h6>
                <h2><?php echo e((string) $stats['users_active']); ?></h2>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card card-stat">
            <div class="card-body">
                <h6 class="text-muted">Settings Entries</h6>
                <h2><?php echo e((string) $stats['settings_total']); ?></h2>
            </div>
        </div>
    </div>
</div>

<div class="card mt-3">
    <div class="card-body">
        <h5>Hello, <?php echo e((string) ($user['name'] ?? '')); ?>.</h5>
        <p class="mb-0">Role: <strong><?php echo e((string) ($user['role'] ?? '')); ?></strong></p>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/layout-footer.php'; ?>
