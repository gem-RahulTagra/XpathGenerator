document.getElementById("start").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "runContentScript" });
});

document.getElementById("stop").addEventListener("click", function () {
    chrome.runtime.sendMessage({ action: "stopContentScript" });
});



