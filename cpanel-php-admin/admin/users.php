<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_admin();

$pageTitle = 'User Management';
$search = clean_text($_GET['search'] ?? '', 120);
$role = clean_text($_GET['role'] ?? '', 10);
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 10;

$whereParts = ['1=1'];
$params = [];

if ($search !== '') {
    $whereParts[] = '(name LIKE :search OR email LIKE :search)';
    $params[':search'] = '%' . $search . '%';
}

if (valid_role($role)) {
    $whereParts[] = 'role = :role';
    $params[':role'] = $role;
}

$whereSql = implode(' AND ', $whereParts);

$countStmt = db()->prepare('SELECT COUNT(*) FROM users WHERE ' . $whereSql);
$countStmt->execute($params);
$totalItems = (int) $countStmt->fetchColumn();
$totalPages = max(1, (int) ceil($totalItems / $perPage));

if ($page > $totalPages) {
    $page = $totalPages;
}

$offset = ($page - 1) * $perPage;

$dataSql = 'SELECT id, name, email, role, is_active, created_at FROM users WHERE ' . $whereSql . ' ORDER BY id DESC LIMIT ' . (int) $perPage . ' OFFSET ' . (int) $offset;
$dataStmt = db()->prepare($dataSql);
$dataStmt->execute($params);
$users = $dataStmt->fetchAll();

require_once __DIR__ . '/../includes/layout-header.php';
?>
<div class="card mb-3">
    <div class="card-body">
        <form method="get" class="row g-2">
            <div class="col-md-5">
                <input type="text" name="search" class="form-control" placeholder="Search name or email" value="<?php echo e($search); ?>">
            </div>
            <div class="col-md-3">
                <select name="role" class="form-select">
                    <option value="">All Roles</option>
                    <option value="admin" <?php echo $role === 'admin' ? 'selected' : ''; ?>>Admin</option>
                    <option value="user" <?php echo $role === 'user' ? 'selected' : ''; ?>>User</option>
                </select>
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-primary w-100">Filter</button>
            </div>
            <div class="col-md-2">
                <a href="<?php echo e(app_url('/admin/user-create.php')); ?>" class="btn btn-success w-100">Add User</a>
            </div>
        </form>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-striped align-middle">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Created</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <?php if (count($users) === 0): ?>
                    <tr>
                        <td colspan="7" class="text-center text-muted">No users found.</td>
                    </tr>
                <?php endif; ?>
                <?php foreach ($users as $item): ?>
                    <tr>
                        <td><?php echo e((string) $item['id']); ?></td>
                        <td><?php echo e((string) $item['name']); ?></td>
                        <td><?php echo e((string) $item['email']); ?></td>
                        <td><span class="badge bg-info text-dark"><?php echo e((string) $item['role']); ?></span></td>
                        <td><?php echo (int) $item['is_active'] === 1 ? 'Yes' : 'No'; ?></td>
                        <td><?php echo e((string) $item['created_at']); ?></td>
                        <td>
                            <div class="table-actions">
                                <a class="btn btn-sm btn-outline-primary" href="<?php echo e(app_url('/admin/user-edit.php?id=' . (int) $item['id'])); ?>">Edit</a>
                                <form method="post" action="<?php echo e(app_url('/admin/user-delete.php')); ?>" data-confirm="Delete this user?">
                                    <?php echo csrf_field(); ?>
                                    <input type="hidden" name="id" value="<?php echo e((string) $item['id']); ?>">
                                    <button class="btn btn-sm btn-outline-danger" type="submit">Delete</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <?php if ($totalPages > 1): ?>
            <nav>
                <ul class="pagination">
                    <?php for ($p = 1; $p <= $totalPages; $p++): ?>
                        <?php
                        $query = http_build_query([
                            'search' => $search,
                            'role' => $role,
                            'page' => $p
                        ]);
                        ?>
                        <li class="page-item <?php echo $p === $page ? 'active' : ''; ?>">
                            <a class="page-link" href="<?php echo e(app_url('/admin/users.php?' . $query)); ?>"><?php echo e((string) $p); ?></a>
                        </li>
                    <?php endfor; ?>
                </ul>
            </nav>
        <?php endif; ?>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/layout-footer.php'; ?>
