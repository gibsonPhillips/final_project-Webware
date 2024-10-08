'use strict'

let counter = 0;

async function attempt_login () {
    console.log(counter);
    let result = await fetch("/login_request", { method: "POST" });
    
    window.location.href = result.url;
}

window.onload = async function () {
    let login_button = document.getElementById("login-button");
    
    login_button.onclick = attempt_login;
}