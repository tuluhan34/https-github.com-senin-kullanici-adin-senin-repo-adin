<?php
declare(strict_types=1);

require_once __DIR__ . '/app.php';

const DB_HOST = 'localhost';
const DB_PORT = '3306';
const DB_NAME = 'CHANGE_DB_NAME';
const DB_USER = 'CHANGE_DB_USER';
const DB_PASS = 'CHANGE_DB_PASSWORD';

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
    } catch (PDOException $exception) {
        http_response_code(500);
        exit('Database connection failed. Please check config/database.php settings.');
    }

    return $pdo;
}
