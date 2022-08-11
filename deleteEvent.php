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
?>