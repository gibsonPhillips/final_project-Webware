'use strict'

let users = []

async function reload_view() {

    let result = await fetch("/fetch_users", { 
        method: "POST",
    });

    let response = await result.text()
    if(!(response === "")) {
        users = JSON.parse(response).usernames;
    }

    let list = document.getElementById("info-list");
    list.innerHTML = "";
    for(let user of users) {
        let list_child = document.createElement("li");
        let nameplate = document.createElement("p");
        let follow_button = document.createElement("button");
        nameplate.innerText = user;
        follow_button.innerText = "Follow";
        follow_button.onclick = async function () {
            follow(user);
        };

        list_child.appendChild(nameplate);
        list_child.appendChild(follow_button);

        list.appendChild(list_child);
    }
}

async function follow (username) {
    reload_view();
    let result = await fetch("/follow", { 
        method: "POST",
        body: JSON.stringify({ username })
     });
}

window.onload = async function () {
    // TODO pull users from server
    reload_view()
}