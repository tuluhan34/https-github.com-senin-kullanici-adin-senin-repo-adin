<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

if (is_logged_in()) {
    redirect('/admin/index.php');
}

$error = '';
$flash = get_flash();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf($_POST['csrf_token'] ?? null)) {
        $error = 'Security token is invalid. Please try again.';
    } else {
        $email = clean_text($_POST['email'] ?? '', 120);
        $password = (string) ($_POST['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            $error = 'Please enter valid login credentials.';
        } elseif (attempt_login($email, $password)) {
            set_flash('success', 'Welcome back.');
            redirect('/admin/index.php');
        } else {
            $error = 'Invalid email or password.';
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - <?php echo e(APP_NAME); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo e(app_url('/assets/css/style.css')); ?>">
</head>
<body class="auth-page">
<div class="card shadow-sm auth-card">
    <div class="card-body p-4">
        <h4 class="mb-3"><?php echo e(APP_NAME); ?></h4>
        <p class="text-muted">Please sign in to continue.</p>

        <?php if ($flash): ?>
            <div class="alert alert-<?php echo e($flash['type']); ?>"><?php echo e($flash['message']); ?></div>
        <?php endif; ?>

        <?php if ($error !== ''): ?>
            <div class="alert alert-danger"><?php echo e($error); ?></div>
        <?php endif; ?>

        <form method="post" novalidate>
            <?php echo csrf_field(); ?>
            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <button class="btn btn-primary w-100" type="submit">Login</button>
        </form>
        <div class="mt-3 small text-muted">Demo admin: admin@example.com / Admin123!</div>
    </div>
</div>
</body>
</html>
