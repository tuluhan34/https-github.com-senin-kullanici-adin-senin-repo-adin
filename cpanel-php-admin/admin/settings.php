<?php
declare(strict_types=1);

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

require_admin();

$pageTitle = 'Settings';
$errors = [];
$search = clean_text($_GET['search'] ?? '', 120);
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 10;
$currentUser = current_user();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf($_POST['csrf_token'] ?? null)) {
        set_flash('danger', 'Invalid security token.');
        redirect('/admin/settings.php');
    }

    $action = clean_text($_POST['action'] ?? '', 20);

    if ($action === 'delete') {
        $id = (int) ($_POST['id'] ?? 0);

        if ($id > 0) {
            $stmt = db()->prepare('DELETE FROM settings WHERE id = :id');
            $stmt->execute([':id' => $id]);
            set_flash('success', 'Setting deleted successfully.');
        } else {
            set_flash('danger', 'Invalid setting id.');
        }

        redirect('/admin/settings.php');
    }

    $keyName = clean_text($_POST['key_name'] ?? '', 64);
    $valueText = clean_text($_POST['value_text'] ?? '', 2000);
    $description = clean_text($_POST['description'] ?? '', 255);

    if (!preg_match('/^[a-z0-9_]{2,64}$/', $keyName)) {
        $errors[] = 'Key must contain only lowercase letters, numbers and underscore.';
    }

    if ($valueText === '') {
        $errors[] = 'Value is required.';
    }

    if (count($errors) === 0) {
        if ($action === 'create') {
            $stmt = db()->prepare('INSERT INTO settings (key_name, value_text, description, updated_by) VALUES (:key_name, :value_text, :description, :updated_by)');
            try {
                $stmt->execute([
                    ':key_name' => $keyName,
                    ':value_text' => $valueText,
                    ':description' => $description,
                    ':updated_by' => (int) ($currentUser['id'] ?? 0)
                ]);
                set_flash('success', 'Setting created successfully.');
                redirect('/admin/settings.php');
            } catch (Throwable $exception) {
                $errors[] = 'This setting key already exists.';
            }
        }

        if ($action === 'update') {
            $id = (int) ($_POST['id'] ?? 0);
            if ($id <= 0) {
                $errors[] = 'Invalid setting id.';
            } else {
                $stmt = db()->prepare('UPDATE settings SET key_name = :key_name, value_text = :value_text, description = :description, updated_by = :updated_by, updated_at = NOW() WHERE id = :id');
                try {
                    $stmt->execute([
                        ':key_name' => $keyName,
                        ':value_text' => $valueText,
                        ':description' => $description,
                        ':updated_by' => (int) ($currentUser['id'] ?? 0),
                        ':id' => $id
                    ]);
                    set_flash('success', 'Setting updated successfully.');
                    redirect('/admin/settings.php');
                } catch (Throwable $exception) {
                    $errors[] = 'Could not update setting. Key may already exist.';
                }
            }
        }
    }
}

$editId = (int) ($_GET['edit'] ?? 0);
$editItem = null;

if ($editId > 0) {
    $editStmt = db()->prepare('SELECT id, key_name, value_text, description FROM settings WHERE id = :id LIMIT 1');
    $editStmt->execute([':id' => $editId]);
    $editItem = $editStmt->fetch();
}

$where = '1=1';
$params = [];
if ($search !== '') {
    $where = '(key_name LIKE :search OR value_text LIKE :search)';
    $params[':search'] = '%' . $search . '%';
}

$countStmt = db()->prepare('SELECT COUNT(*) FROM settings WHERE ' . $where);
$countStmt->execute($params);
$totalItems = (int) $countStmt->fetchColumn();
$totalPages = max(1, (int) ceil($totalItems / $perPage));

if ($page > $totalPages) {
    $page = $totalPages;
}

$offset = ($page - 1) * $perPage;
$listSql = 'SELECT s.id, s.key_name, s.value_text, s.description, s.updated_at, u.name AS updated_by_name
            FROM settings s
            LEFT JOIN users u ON u.id = s.updated_by
            WHERE ' . $where . '
            ORDER BY s.id DESC
            LIMIT ' . (int) $perPage . ' OFFSET ' . (int) $offset;
$listStmt = db()->prepare($listSql);
$listStmt->execute($params);
$settings = $listStmt->fetchAll();

require_once __DIR__ . '/../includes/layout-header.php';
?>
<div class="row g-3">
    <div class="col-lg-5">
        <div class="card">
            <div class="card-body">
                <h5><?php echo $editItem ? 'Edit Setting' : 'Create Setting'; ?></h5>

                <?php if (count($errors) > 0): ?>
                    <div class="alert alert-danger">
                        <ul class="mb-0">
                            <?php foreach ($errors as $err): ?>
                                <li><?php echo e($err); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form method="post">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="action" value="<?php echo $editItem ? 'update' : 'create'; ?>">
                    <?php if ($editItem): ?>
                        <input type="hidden" name="id" value="<?php echo e((string) $editItem['id']); ?>">
                    <?php endif; ?>

                    <div class="mb-3">
                        <label class="form-label">Key</label>
                        <input type="text" class="form-control" name="key_name" value="<?php echo e((string) ($editItem['key_name'] ?? '')); ?>" required>
                        <small class="text-muted">Example: site_title, support_email</small>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Value</label>
                        <textarea class="form-control" name="value_text" rows="3" required><?php echo e((string) ($editItem['value_text'] ?? '')); ?></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Description</label>
                        <input type="text" class="form-control" name="description" value="<?php echo e((string) ($editItem['description'] ?? '')); ?>">
                    </div>

                    <button type="submit" class="btn btn-primary"><?php echo $editItem ? 'Update' : 'Create'; ?></button>
                    <?php if ($editItem): ?>
                        <a href="<?php echo e(app_url('/admin/settings.php')); ?>" class="btn btn-secondary">Cancel</a>
                    <?php endif; ?>
                </form>
            </div>
        </div>
    </div>

    <div class="col-lg-7">
        <div class="card">
            <div class="card-body">
                <form method="get" class="row g-2 mb-3">
                    <div class="col-md-8">
                        <input type="text" name="search" class="form-control" placeholder="Search settings" value="<?php echo e($search); ?>">
                    </div>
                    <div class="col-md-4">
                        <button class="btn btn-outline-primary w-100" type="submit">Search</button>
                    </div>
                </form>

                <div class="table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                            <th>Updated By</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php if (count($settings) === 0): ?>
                            <tr><td colspan="4" class="text-center text-muted">No settings found.</td></tr>
                        <?php endif; ?>
                        <?php foreach ($settings as $item): ?>
                            <tr>
                                <td><?php echo e((string) $item['key_name']); ?></td>
                                <td><?php echo e((string) $item['value_text']); ?></td>
                                <td><?php echo e((string) ($item['updated_by_name'] ?? '-')); ?></td>
                                <td>
                                    <div class="table-actions">
                                        <a class="btn btn-sm btn-outline-primary" href="<?php echo e(app_url('/admin/settings.php?edit=' . (int) $item['id'])); ?>">Edit</a>
                                        <form method="post" data-confirm="Delete this setting?">
                                            <?php echo csrf_field(); ?>
                                            <input type="hidden" name="action" value="delete">
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
                                <?php $query = http_build_query(['search' => $search, 'page' => $p]); ?>
                                <li class="page-item <?php echo $p === $page ? 'active' : ''; ?>">
                                    <a class="page-link" href="<?php echo e(app_url('/admin/settings.php?' . $query)); ?>"><?php echo e((string) $p); ?></a>
                                </li>
                            <?php endfor; ?>
                        </ul>
                    </nav>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/../includes/layout-footer.php'; ?>
