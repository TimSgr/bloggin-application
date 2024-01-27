<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=db;dbname=test_db', 'devuser', 'devpass');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postId = $_POST['post_id'] ?? null;

    if ($postId) {
        $query = $pdo->prepare("DELETE FROM posts WHERE id = :post_id");
        $result = $query->execute(['post_id' => $postId]);

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
    } else {
        // Senden einer Fehlermeldung, wenn keine post_id übergeben wurde
        echo json_encode(['success' => false, 'error' => 'Post ID is required']);
    }
}
?>