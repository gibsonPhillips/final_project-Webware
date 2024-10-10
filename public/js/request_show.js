
window.onload = async function () {
    let result = await fetch("/request_access", { method: "POST" });
    if(result.redirected) {
        window.location.href = result.url;
        return;
    }

    let submit_button = document.getElementById("submit-button");

    submit_button.onclick = async function () {
        let title = document.getElementById("showtitle").value;
        let date = document.getElementById("date").value;
        let time = document.getElementById("time").value;
        let description = document.getElementById("description").value;

        let result = await fetch("/request_show", { 
            method: "POST",
            body: JSON.stringify({
                title,
                date,
                time,
                description
            })
        });

        window.location.href = result.url;
    }
}