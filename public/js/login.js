'use strict'

async function attempt_login () {
    let username = document.getElementById("username").value;
    let password = document.getElementById("current-password").value;
    
    let result = await fetch("/login_request", { 
        method: "POST", 
        body: JSON.stringify({
            username,
            password
        })
    });
    
    window.location.href = result.url;
}

window.onload = async function () {
    let login_button = document.getElementById("login-button");
    
    login_button.onclick = attempt_login;
}