<?php
header('Content-Type: application/json');
$pdo = new PDO('mysql:host=db;dbname=test_db', 'devuser', 'devpass');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_id = $_POST['id'] ?? null;

    if ($post_id) {
        $updateQuery = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = :post_id");
        $updateResult = $updateQuery->execute(['post_id' => $post_id]);

        if ($updateResult) {
            $likesQuery = $pdo->prepare("SELECT likes FROM posts WHERE id = :post_id");
            $likesQuery->execute(['post_id' => $post_id]);
            $likesResult = $likesQuery->fetch(PDO::FETCH_ASSOC);

            if ($likesResult) {
                $like_count = $likesResult['likes'];
                echo json_encode(['success' => true, 'like_count' => $like_count]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Could not fetch like count']);
            }
        } else {
            echo json_encode(['success' => false, 'error' => 'Could not update like count']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Post ID is required']);
    }
}
?>
