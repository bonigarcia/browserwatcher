function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        _cbwatcherLogGathering: document.querySelector('input[name="log"]:checked').value
    });

    chrome.storage.sync.set({
        _cbwatcherJavaScriptLibs: document.querySelector('textarea[name="libs"]').value
    });

    chrome.storage.sync.set({
        _cbwatcherInjectCssShets: document.querySelector('textarea[name="css"]').value
    });

    chrome.storage.sync.set({
        _cbwatcherJavaScriptCode: document.querySelector('textarea[name="js"]').value
    });

    document.querySelector("#saved").style.display = "inline";

    setTimeout(function() { document.querySelector("#saved").style.display = "none"; }, 3000);
}

document.querySelector("form").addEventListener("submit", saveOptions);

chrome.storage.sync.get("_cbwatcherLogGathering", function(data) {
    if (data["_cbwatcherLogGathering"] && data["_cbwatcherLogGathering"] == "false") {
        document.querySelector("#logfalse").checked = "checked";
    }
});

chrome.storage.sync.get("_cbwatcherJavaScriptLibs", function(data) {
    if (data["_cbwatcherJavaScriptLibs"]) {
        document.querySelector('textarea[name="libs"]').value = data["_cbwatcherJavaScriptLibs"];
    }
});

chrome.storage.sync.get("_cbwatcherInjectCssSheets", function(data) {
    if (data["_cbwatcherInjectCssSheets"]) {
        document.querySelector('textarea[name="css"]').value = data["_cbwatcherInjectCssSheets"];
    }
});

chrome.storage.sync.get("_cbwatcherJavaScriptCode", function(data) {
    if (data["_cbwatcherJavaScriptCode"]) {
        document.querySelector('textarea[name="js"]').value = data["_cbwatcherJavaScriptCode"];
    }
});
