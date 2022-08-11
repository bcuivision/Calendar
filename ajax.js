
document.addEventListener('DOMContentLoaded', function () 
{
    alert("Document loaded!");
    document.getElementById("loginBtn").addEventListener("click", loginAjax, false);
    
    //User Registration Functionalities
    let registrationForm = document.getElementById("register");
    let background = document.getElementById("background");
    let closeBtn = document.getElementById("close");

    document.getElementById("registerBtn1").addEventListener("click",openForm,false);
    document.getElementById("registerBtn2").addEventListener("click",submitForm,false);
    closeBtn.addEventListener("click",closeForm,false);

} );

function loginAjax(event) 
{
    console.log("Login Clicked!")
    const username = document.getElementById("username").value; // Get the username from the form
    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { "username": username, "password": password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if(data.success)
            {
                //*** store token in JS ***
                let token = data.token;

                //display current user on the calendar
                document.getElementById("currentUser").innerText = data.username;
                console.log("You've been logged in!");
                console.log("Username: " + data.username);

                //display log out button on the html
                var logOut = document.getElementById("logoutBtn");
                logOut.visibility = "visible";
                logOut.addEventListener("click", logoutAjax, false);

                //*** load this user's events to calendar.html ***

            }
            else
            {
                //alert user that login failed
                alert("FAILED LOGIN | " + data.message);
            }

            //clear login entries
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
        })
        .catch(err => console.error(err));
}

//fetch to logout.php
function logoutAjax(event)
{
    //fetch php to destroy session
    fetch("logout.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        
        //retrieve JSON from php to confirm that we clear front end JS token
        if(data.success)
        {
            //***clear JS token***

            alert.log("You've been logged out!");
        }
        else
        {
            //alert user that login failed
            alert("FAILED LOGIN | " + data.message);
        }
    })
    .catch(err => console.error(err));

    //remove log out button
    document.getElementById("logoutBtn").visibility = "hidden";
}

//make user registration form visible
function openForm()
{
    console.log("User Registration Form Opened");
	registrationForm.display = "block";
	background.display = "block";
}

//register new user
function submitForm()
{
    console.log("User Registration Form Submitted");

    //register user in sql by fetching to register.php
    registerAjax();

    //close user registration form
	registrationForm.display = "none";
	background.visibility = "none";
}

//close user registration form
function closeForm()
{
	registrationForm.visibility = "hidden";
	background.visibility = "hidden";
}

//fetch to register.php
function registerAjax(event)
{
    console.log("Register Button Clicked!")
    const username = document.getElementById("registerUsername").value; 
    const password = document.getElementById("registerPassword").value; 

    // Make a URL-encoded string for passing POST data:
    const data = { "username": username, "password": password };

    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())

        .then(data => {
            if(data.success)
            {
                //display successful registration message 
                alert("You have successfully registered new user: " + data.username);
            }
            else
            {
                alert("REGISTER FAILED | " + data.message);
            }

            //clear register entries
            document.getElementById("registerUsername").value = "";
            document.getElementById("registerPassword").value = "";
        })
        .catch(err => console.error(err));

}