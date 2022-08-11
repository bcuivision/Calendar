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


$stmt = $mysqli->prepare("select title, date, time from events where user=?");

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
$stmt->execute();

$stmt->bind_result($title, $date, $time);

$events = array();

while($stmt->fetch())
{
    // store & pass story info to next page
    
    $t = htmlspecialchars($title);
    $d = htmlspecialchars($date);
    $ti = htmlspecialchars($time);

    array_push($events, array(
        "title" => $t,
        "date" => $d,
        "time" => $ti
    ));
}
$stmt->close();

echo json_encode(array(
    "success" => true, 
    "message" => "Successful load request",
    "events" => $events
));
exit;

?>

</body>
</html>






?>