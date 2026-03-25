# Pure PHP Admin Panel (cPanel Ready)

This project is a fully functional admin panel built with:

- Pure PHP (no framework)
- MySQL (phpMyAdmin import)
- HTML + CSS + Vanilla JS + Bootstrap CDN
- Session authentication
- Role-based access (admin/user)

## Folder Structure

- `config/`: app and database configuration
- `includes/`: shared functions, auth, csrf, layout templates
- `admin/`: protected admin pages
- `assets/`: CSS and JavaScript files
- `sql/`: importable MySQL dump with sample data

## Demo Login

- Admin: `admin@example.com` / `Admin123!`
- User: `user@example.com` / `User123!`

## cPanel Deployment (No SSH, No Composer)

1. Upload all files to your target folder in cPanel File Manager
   - Example folder: `public_html/cpanel-php-admin`
2. Open phpMyAdmin
3. Create database (or use existing)
4. Import `sql/admin_panel.sql`
5. Open `config/database.php` and update:
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
   - `DB_HOST` (usually `localhost`)
6. Open `config/app.php` and set `BASE_URL`
   - Example: `/cpanel-php-admin`
7. Ensure folders/files permissions:
   - folders: `755`
   - files: `644`
8. Visit:
   - `/cpanel-php-admin/admin/login.php`

## Security Implemented

- Password hashing with `password_hash`
- Password verification with `password_verify`
- Session-based authentication
- Role authorization checks on admin routes
- PDO prepared statements for all DB writes and filtered reads
- CSRF token validation on all forms
- Escaped output using `htmlspecialchars`
- Config directory protected with `.htaccess`

## Notes

- If app path differs, adjust `BASE_URL` in `config/app.php`
- Delete SQL import file after setup if preferred
