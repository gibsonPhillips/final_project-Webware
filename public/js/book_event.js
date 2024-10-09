window.onload = async function () {
    let result = await fetch("/request_access", { method: "POST" });
    if(result.redirected) {
        window.location.href = result.url;
    }
}