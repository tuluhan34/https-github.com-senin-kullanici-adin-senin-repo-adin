<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_admin();

$pageTitle = 'Add User';
$errors = [];
$form = [
    'name' => '',
    'email' => '',
    'role' => 'user',
    'is_active' => '1'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf($_POST['csrf_token'] ?? null)) {
        $errors[] = 'Invalid security token.';
    }

    $form['name'] = clean_text($_POST['name'] ?? '', 120);
    $form['email'] = clean_text($_POST['email'] ?? '', 150);
    $form['role'] = clean_text($_POST['role'] ?? 'user', 10);
    $form['is_active'] = (isset($_POST['is_active']) && $_POST['is_active'] === '1') ? '1' : '0';
    $password = (string) ($_POST['password'] ?? '');

    if ($form['name'] === '') {
        $errors[] = 'Name is required.';
    }

    if (!filter_var($form['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required.';
    }

    if (!valid_role($form['role'])) {
        $errors[] = 'Invalid role selected.';
    }

    if (mb_strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters.';
    }

    if (count($errors) === 0) {
        $check = db()->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $check->execute([':email' => $form['email']]);

        if ($check->fetch()) {
            $errors[] = 'This email is already used.';
        }
    }

    if (count($errors) === 0) {
        $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role, is_active) VALUES (:name, :email, :password_hash, :role, :is_active)');
        $stmt->execute([
            ':name' => $form['name'],
            ':email' => $form['email'],
            ':password_hash' => password_hash($password, PASSWORD_DEFAULT),
            ':role' => $form['role'],
            ':is_active' => (int) $form['is_active']
        ]);

        set_flash('success', 'User created successfully.');
        redirect('/admin/users.php');
    }
}

require_once __DIR__ . '/../includes/layout-header.php';
?>
<div class="card">
    <div class="card-body">
        <?php if (count($errors) > 0): ?>
            <div class="alert alert-danger">
                <ul class="mb-0">
                    <?php foreach ($errors as $err): ?>
                        <li><?php echo e($err); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <form method="post" class="row g-3" novalidate>
            <?php echo csrf_field(); ?>
            <div class="col-md-6">
                <label class="form-label">Name</label>
                <input type="text" name="name" class="form-control" value="<?php echo e($form['name']); ?>" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control" value="<?php echo e($form['email']); ?>" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" required>
            </div>
            <div class="col-md-3">
                <label class="form-label">Role</label>
                <select name="role" class="form-select">
                    <option value="admin" <?php echo $form['role'] === 'admin' ? 'selected' : ''; ?>>Admin</option>
                    <option value="user" <?php echo $form['role'] === 'user' ? 'selected' : ''; ?>>User</option>
                </select>
            </div>
            <div class="col-md-3 d-flex align-items-end">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" name="is_active" value="1" id="is_active" <?php echo $form['is_active'] === '1' ? 'checked' : ''; ?>>
                    <label class="form-check-label" for="is_active">Active</label>
                </div>
            </div>
            <div class="col-12">
                <button type="submit" class="btn btn-primary">Create User</button>
                <a href="<?php echo e(app_url('/admin/users.php')); ?>" class="btn btn-secondary">Back</a>
            </div>
        </form>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/layout-footer.php'; ?>
