function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        _cbwatcherLogGathering: document.querySelector('input[name="log"]:checked').value
    });
    document.querySelector("#saved").style.display = "inline";

    setTimeout(function() { document.querySelector("#saved").style.display = "none"; }, 3000);
}

document.querySelector("form").addEventListener("submit", saveOptions);
