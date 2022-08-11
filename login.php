<?php

require 'mysql.php';

header("Content-Type: application/json");
$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username_entered = $json_obj['username'];
$password_entered = $json_obj['password'];

$stmt = $mysqli->prepare("SELECT username, hashed_password from users where username=?");

if(!$stmt)
{
	printf("Query Prep Failed: %s\n", $mysqli->error);
	echo json_encode(array(
		"success" => false,
		"message" => "Query Prep Failed1",
	));
	exit;
}

$stmt->bind_param('s',  $user);
$user = $username_entered;
$stmt->execute();

$stmt->bind_result($username, $pwd_hash);
$stmt->fetch();

/* check for valid username and password */ 
if(password_verify($password_entered, $pwd_hash))
{
	//ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = htmlentities($username);
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); 

	//***return CSRF token to front end***

	echo json_encode(array(
		"success" => true,
		"message" => "Successful Log In!",
		"token" => $_SESSION['token']
	));
	exit;
}
else
{
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>