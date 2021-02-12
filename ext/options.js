function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        _cbwatcherLogGathering: document.querySelector('input[name="log"]:checked').value
    });

    chrome.storage.sync.set({
        _cbwatcherJavaScript: document.querySelector('textarea[name="js"]').value
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

chrome.storage.sync.get("_cbwatcherJavaScript", function(data) {
    if (data["_cbwatcherJavaScript"]) {
        document.querySelector('textarea[name="js"]').value = data["_cbwatcherJavaScript"];
    }
});
