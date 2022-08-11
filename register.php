<?php

    require 'mysql.php';
    session_start();
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $username_entered = $json_obj['username'];
    $password_entered = $json_obj['password'];

    $stmt0 = $mysqli->prepare("SELECT COUNT(*) username from users where username = ?");
    
    if(!$stmt0)
    {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed1"
        ));
        exit;
    }

    $stmt0->bind_param('s', $username_entered);
    $stmt0->execute();
    $stmt0->bind_result($cnt);
    $stmt0->fetch();

    //CHECK for existing users
    if($cnt > 0)
    { 
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Username exists, choose another or go back to login"
        ));
        exit;
    }
    $stmt0->close();

    $hashed_password = password_hash($password_entered, PASSWORD_BCRYPT);

    $stmt = $mysqli->prepare("INSERT into users (username, hashed_password) values (?, ?)");
    if(!$stmt)
    {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed2"
        ));
        exit;
    }

    $stmt->bind_param('ss', $username_entered, $hashed_password);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Successful Registration"
    ));
    exit;
    ?>