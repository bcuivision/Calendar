<?php
    session_start();
    header("Content-Type: application/json");

    //send JSON from php to confirm that we clear front end JS token
    if(session_destroy())
    {
        echo json_encode(array(
            "success" => true,
            "message" => "User Logout Failed"
        ));
        exit;
    }
    else
    {
        echo json_encode(array(
            "success" => false,
            "message" => "User Logout Failed"
        ));
        exit;
    }

?>