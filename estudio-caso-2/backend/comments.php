<?php
require 'db.php'; 

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $task_id = $data['task_id'] ?? null;
    $comment = $data['comment'] ?? null;

    if ($task_id && $comment) {
        $stmt = $pdo->prepare("INSERT INTO comments (task_id, comment) VALUES (?, ?)");
        if ($stmt->execute([$task_id, $comment])) {
            echo json_encode(['status' => 'success', 'id' => $pdo->lastInsertId()]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create comment.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
    }
} elseif ($method === 'GET') {
    $task_id = $_GET['task_id'] ?? null;
    if ($task_id) {
        $stmt = $pdo->prepare("SELECT * FROM comments WHERE task_id = ? ORDER BY id ASC");
        $stmt->execute([$task_id]);
        $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($comments);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Task ID is required.']);
    }
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;
    $comment = $data['comment'] ?? null;

    if ($id && $comment) {
        $stmt = $pdo->prepare("UPDATE comments SET comment = ? WHERE id = ?");
        if ($stmt->execute([$comment, $id])) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update comment.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
    }
} elseif ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = $data['id'] ?? null;

    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete comment.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
?>
