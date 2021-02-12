function saveOptions(e) {
    e.preventDefault();
    chrome.storage.sync.set({
        _cbwatcherLogGathering: document.querySelector('input[name="log"]:checked').value
    });
    window.alert("Saved");
}

document.querySelector("form").addEventListener("submit", saveOptions);