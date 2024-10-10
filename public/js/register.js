'use strict'

async function register_user () {
    let username = document.getElementById("username").value;
    let first_name = document.getElementById("first-name").value;
    let last_name = document.getElementById("last-name").value;
    let password = document.getElementById("password").value;
    let confirmed_password = document.getElementById("confirm-password").value;
    let id = document.getElementById("id").value;
    let email = document.getElementById("email").value;

    if(!(password === confirmed_password)) {
        console.log("Failure!");
        return;
    }

    let result = await fetch("/register_request", { 
        method: "POST",
        body: JSON.stringify({
            username,
            first_name,
            last_name,
            password,
            id,
            email
        }) 
    });

    window.location.href = result.url;
}

window.onload = async function () {
    let register_button = document.getElementById("register-button");
    
    register_button.onclick = register_user;
}