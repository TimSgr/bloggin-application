<?php 
//Create Tables for later usage if they dont exist
$pdo = new PDO('mysql:host=db;dbname=test_db', 'devuser', 'devpass');

$stmt = $pdo->query("CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    likes int DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <main class="interface">
        <div class="container">
            <div class="row">
                <div class="col-md-12 text-align-center">
                    Microblogging System
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-md-3 sidebar sticky">
                    <div class="">
                        Sidebar Content
                    </div>
                </div>
                <div class="col-md-6 main_content">
                    <form id="submit_form">
                        <div class="form-group">
                            <div class="input_section">
                                <textarea class="form-control" rows="3" placeholder="your content"></textarea>
                            </div>
                            <button class="btn btn-primary" type="submit">Posten</button>
                        </div>
                    </form>
                    <div class="container">
                        <div class="row full_content"></div>
                    </div>
                </div>
                <div class="col-md-3 sticky">
                    <div class="login_section">
                        <form id="login_form">
                            <div class="form-group">
                                <input class="form-control" type="text" placeholder="Username" />
                                <input class="form-control" type="password" placeholder="Your Password" />
                                <button class="btn btn-primary" type="submit">Anmelden</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="assets/js/main.js"></script>
</body>
</html>