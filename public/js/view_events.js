'use strict'

let users = []

async function reload_view() {
    let shows = await fetch("/fetch_shows", { 
        method: "POST",
    });

    let shows_response = await shows.text()
    if(!(shows_response === "")) {
        shows = JSON.parse(shows_response);
    }

    let list = document.getElementById("info-list");
    list.innerHTML = "";

    for(let show in shows) {
        let list_child = document.createElement("li");
        let title = document.createElement("p");
        let date = document.createElement("p");
        let time = document.createElement("p");
        let description = document.createElement("p");

        title.innerText = show;
        date.innerText = shows[show].date;
        time.innerText = shows[show].time;
        description.innerText = shows[show].description;

        list_child.appendChild(title);
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