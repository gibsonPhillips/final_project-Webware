'use strict'

let users = [
    {"username": "Jhon Tomato 1"},
    {"username": "Jhon Tomato 2"},
    {"username": "Jhon Tomato 3"},
    {"username": "Jhon Tomato 4"},
]

async function reload_view() {
    let list = document.getElementById("info-list");
    list.innerHTML = "";
    for(let user of users) {
        let list_child = document.createElement("li");
        let nameplate = document.createElement("p");
        let approve_button = document.createElement("button");
        let deny_button = document.createElement("button");
        nameplate.innerText = user.username;
        approve_button.innerText = "Aprove";
        approve_button.onclick = async function () {
            approve(user.username, users.indexOf(user));
        };

        deny_button.innerText = "Deny";

        deny_button.onclick = async function () {
            deny(user.username, users.indexOf(user));
        };

        list_child.appendChild(nameplate);
        list_child.appendChild(approve_button);
        list_child.appendChild(deny_button);

        list.appendChild(list_child);
    }
}

async function approve (username, index) {
    console.log(username);
    users.splice(index, 1);
    reload_view();
    //let result = await fetch("/approve", { method: "POST" });
}

async function deny (username, index) {
    console.log(username);
    users.splice(index, 1);
    reload_view();
    //let result = await fetch("/deny", { method: "POST" });
}

window.onload = async function () {
    reload_view()
}