<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=db;dbname=test_db', 'devuser', 'devpass');

$query = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
$posts = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($posts);
?>