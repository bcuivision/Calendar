<?php

    require 'mysql.php';
    session_start();
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $user = $json_obj['username'];
    $title = $json_obj['title'];
    $date = $json_obj['date'];
    $time = $json_obj['time'];
    

    //verify user status by comparing $user with $_SESSION['username']
    if($user != $_SESSION['username'])
    {
        echo json_encode(array(
            "success" => false,
            "message" => "User doesn't have access to insert events"
        ));
        exit;
    }

    //insert event into events table
    $stmt = $mysqli->prepare("insert into events (user, title, date, time) values (?, ?, ?, ?)");
    
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);

        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed",
        ));
        exit;
    }
    $stmt->bind_param('ssss', $user, $title, $date, $time);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Successful Event Insertion"
    ));
    exit;
    ?>