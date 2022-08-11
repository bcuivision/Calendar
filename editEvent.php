<?php
session_start();
require 'mysql.php';

header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$user = $json_obj['username'];
$token = $json_obj['token'];

//check if front end and back end has same username and token
if($user != $_SESSION['username'] || $token != $_SESSION['token'])
{
    printf("inconsistent username or token");
	echo json_encode(array(
		"success" => false,
		"message" => "Fail to load events | inconsistent username or token",
	));
	exit;
}

$user = $json_obj['username'];
$title = $json_obj['title'];
$date = $json_obj['date'];
$time = $json_obj['time'];
$event_id = $json_obj['event_id'];

$stmt = $mysqli->prepare("update events set title=?, date=?, time=? where event_id=?");

if(!$stmt)
{
	printf("Query Prep Failed: %s\n", $mysqli->error);
	echo json_encode(array(
		"success" => false,
		"message" => "Query Prep Failed1",
	));
	exit;
}

$stmt->bind_param('ssss',  $title, $date, $time, $event_id);
$stmt->execute();

$stmt->bind_result($title, $date, $time);

$stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Successful Event Edit"
    ));
    exit;

?>