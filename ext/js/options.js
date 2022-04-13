function saveOptions(e) {
    e.preventDefault();

    chrome.storage.sync.set({
        _bwJavaScriptLibs: document.querySelector('textarea[name="libs"]').value
    });

    chrome.storage.sync.set({
        _bwInjectCssSheets: document.querySelector('textarea[name="css"]').value
    });

    chrome.storage.sync.set({
        _bwJavaScriptCode: document.querySelector('textarea[name="js"]').value
    });

    document.querySelector("#saved").style.display = "inline";

    setTimeout(function() { document.querySelector("#saved").style.display = "none"; }, 3000);
}

document.querySelector("form").addEventListener("submit", saveOptions);

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
