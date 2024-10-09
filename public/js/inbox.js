'use strict'

let shows = {}
let inbox = []

async function reload_view() {

    let inbox = await fetch("/fetch_inbox", { 
        method: "POST",
    });

    let inbox_response = await inbox.text()
    if(!(inbox_response === "")) {
        inbox = JSON.parse(inbox_response).inbox;
    }

    let shows = await fetch("/fetch_shows", { 
        method: "POST",
    });

    let shows_response = await shows.text()
    if(!(shows_response === "")) {
        shows = JSON.parse(shows_response);
    }

    let list = document.getElementById("info-list");
    list.innerHTML = "";

    for(let item of inbox) {
        let list_child = document.createElement("li");
        let title = document.createElement("p");
        let host = document.createElement("p");
        let date = document.createElement("p");
        let time = document.createElement("p");
        let description = document.createElement("p");
        
        console.log(item);
        console.log(shows);
        title.innerText = item.title;
        host.innerText = item.host;
        date.innerText = shows[item.title].date;
        time.innerText = shows[item.title].time;
        description.innerText = shows[item.title].description;

        list_child.appendChild(title);
        list_child.appendChild(host);
        list_child.appendChild(date);
        list_child.appendChild(time);
        list_child.appendChild(description);

        list.appendChild(list_child);
    }
}

window.onload = async function () {
    let result = await fetch("/request_access", { method: "POST" });
    if(result.redirected) {
        window.location.href = result.url;
        return;
    }
    // TODO pull users from server
    reload_view()
}