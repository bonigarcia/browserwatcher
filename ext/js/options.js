function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        _bwLogGathering: document.querySelector('input[name="log"]:checked').value
    });

    chrome.storage.sync.set({
        _bwJavaScriptLibs: document.querySelector('textarea[name="libs"]').value
    });

    chrome.storage.sync.set({
        _bwInjectCssShets: document.querySelector('textarea[name="css"]').value
    });

    chrome.storage.sync.set({
        _bwJavaScriptCode: document.querySelector('textarea[name="js"]').value
    });

    document.querySelector("#saved").style.display = "inline";

    setTimeout(function() { document.querySelector("#saved").style.display = "none"; }, 3000);
}

document.querySelector("form").addEventListener("submit", saveOptions);

chrome.storage.sync.get("_bwLogGathering", function(data) {
    if (data["_bwLogGathering"] && data["_bwLogGathering"] == "false") {
        document.querySelector("#logfalse").checked = "checked";
    }
});

chrome.storage.sync.get("_bwJavaScriptLibs", function(data) {
    if (data["_bwJavaScriptLibs"]) {
        document.querySelector('textarea[name="libs"]').value = data["_bwJavaScriptLibs"];
    }
});

chrome.storage.sync.get("_bwInjectCssSheets", function(data) {
    if (data["_bwInjectCssSheets"]) {
        document.querySelector('textarea[name="css"]').value = data["_bwInjectCssSheets"];
    }
});

chrome.storage.sync.get("_bwJavaScriptCode", function(data) {
    if (data["_bwJavaScriptCode"]) {
        document.querySelector('textarea[name="js"]').value = data["_bwJavaScriptCode"];
    }
});
