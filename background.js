var logData;
chrome.storage.sync.get("Logs", function (data) {
    logData = data.Logs;
});

chrome.storage.sync.set({ "isRunning": false }, function () {
    console.log("Running Status is False by default");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "runContentScript") {
        chrome.storage.sync.get("isRunning", function (runningStatus) {
            startContentScripts(runningStatus.isRunning);
        });
    }

    else if (request.action === "stopContentScript") {
        chrome.storage.sync.get("isRunning", function (runningStatus) {
            getProjectDetails(runningStatus.isRunning);
            return false;
        });
    }
});

function getProjectDetails(runState) {
    if (runState) {
        var activeTabId;
        var tab = getCurrentTab();
        tab.then(result => {
            activeTabId = result;
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTabId,
                    allFrames: true
                },
                func: postData,
            })
                .then(() => console.log("Get Project Details"));
        });

        chrome.storage.sync.set({ "isRunning": false }, function () {
            console.log("Running Status Updated to False");
        });
    }
    else {
        var activeTabId;
        var tab = getCurrentTab();
        tab.then(result => {
            activeTabId = result;
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTabId,
                    allFrames: true
                },
                func: startPrompt
            })
                .then(() => console.log("script injected in all frames"));
        });
    }

}

function startContentScripts(runState) {
    if (!runState) {
        var activeTabId;
        var tab = getCurrentTab();
        tab.then(result => {
            activeTabId = result;
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTabId,
                    allFrames: true
                },
                files: ['inspect.js'],
            })
                .then(() => console.log("script injected in all frames"));
        });

        chrome.storage.sync.set({ "isRunning": true }, function () {
            console.log("Running Status Updated to True");
        });

    }

    else {
        var activeTabId;
        var tab = getCurrentTab();
        tab.then(result => {
            activeTabId = result;
            chrome.scripting.executeScript({
                target: {
                    tabId: activeTabId,
                    allFrames: true
                },
                func: stopPrompt
            })
                .then(() => console.log("script injected in all frames"));
        });

    }
}

function stopPrompt() {
    alert("Stop the Previous recording in order to Start Again");
}

function startPrompt() {
    alert("Start to record first Please");
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    // console.log(tab.id);
    return tab.id;
}

function postData() {

    chrome.storage.sync.get("Logs", function (data) {

        var project = prompt("Enter your project Name");
        var projectDesc = prompt("Enter your Project Description");

        fetch('http://localhost:5000/steps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    projectName: project,
                    description: pr2,
                    steps: data.Logs
                }
            )
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    });
}



