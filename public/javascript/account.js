/**
 * @module account
 */
/**
 * Account function to run on page load
 * will fetch data required from server side
 */

export async function loginAccount(){
    // this will get the variables from the login html file
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    // this will pass thouse variables into the loginAccount function in the accountmanager file
    const request = await fetch(`loginAccount/${username}/${password}`);
    const response = await request.json();
    // used for debugging checking if the correct results are recieved
    console.log(response);
    console.log(username);
    console.log(password);
// if the response is success this means that the password and username are correct
    if (response[0] === "success") {
        // allowing the user access to the app
       window.location.href = "./menu.html";
    }
// if the response is a failure is means that the username and password don't match
    if (response[0] === "failure"){
        // this providing the user with a message of why there action has been processed
            alert("Error - Username or Password incorrect");
    }
}

export async function newAccount() {
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const username = document.getElementById("uname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("pword").value;
    const repassword = document.getElementById("repword").value;
    //const request = await fetch(`newAccount/${username}/${fname}/${lname}/${email}/${password}/${repassword}`);
    const payload = {
        "uname": username,
        "pword": password,
        "repword": repassword,
        "email": email,
        "fname": fname,
        "lname": lname
    };
    const response = await fetch('newAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const resJson = await response.json();
    console.log(resJson);

    if (pword ===repassword){
        alert("Error - Passwords do not match")
    }

    if (resJson[0] === "success"){
        window.location.href = "./menu.html";
    }
}
