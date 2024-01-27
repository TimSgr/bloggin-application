<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=db;dbname=test_db', 'devuser', 'devpass');

// Einfaches Beispiel ohne Validierung oder Prepared Statements
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = $_POST['content'] ?? '';
    $username = $_POST['username'] ?? 'anonym';

    $query = $pdo->prepare("INSERT INTO posts (content, username) VALUES (?, ?)");
    $result = $query->execute([$content, $username]);

    if ($result) {
        $id=$pdo->lastInsertId();
        echo json_encode(['success' => $id]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>