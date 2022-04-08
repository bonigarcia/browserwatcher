$(document).ready(function() {
    chrome.storage.sync.get("_browserWatcherLogs", function(data) {
        let toggle = data["_browserWatcherLogs"] && data["_browserWatcherLogs"] == "true";
        $('#logs').prop("checked", toggle);
    });
    $("#logs").change(function() {
        if (this.checked) {
            chrome.runtime.sendMessage({ type: "inject-js-code", code: "localStorage.setItem('_browserWatcherLog', 'true');" });
            chrome.storage.sync.get("_browserWatcherLogs", function(data) {
                if (!data["_browserWatcherLogs"] || data["_browserWatcherLogs"] == "false") {
                    chrome.storage.sync.set({ _browserWatcherLogs: "true" });
                }
            });
        } else {
            chrome.runtime.sendMessage({ type: "inject-js-code", code: "localStorage.setItem('_browserWatcherLog', 'false');" });
            chrome.storage.sync.get("_browserWatcherLogs", function(data) {
                if (!data["_browserWatcherLogs"] || data["_browserWatcherLogs"] == "true") {
                    chrome.storage.sync.set({ _browserWatcherLogs: "false" });
                }
            });
        }
    })


    chrome.storage.sync.get("_browserWatcherGrowl", function(data) {
        let toggle = data["_browserWatcherGrowl"] && data["_browserWatcherGrowl"] == "true";
        $('#growl').prop("checked", toggle);
    });
    $("#growl").change(function() {
        chrome.runtime.sendMessage({ type: "inject-js-code", code: "localStorage.setItem('_browserWatcherGrowl', '" + this.checked + "');" });
        if (this.checked) {
            chrome.storage.sync.get("_browserWatcherGrowl", function(data) {
                if (!data["_browserWatcherGrowl"] || data["_browserWatcherGrowl"] == "false") {
                    chrome.storage.sync.set({ _browserWatcherGrowl: "true" });
                }
            });
        } else {
            chrome.storage.sync.get("_browserWatcherGrowl", function(data) {
                if (!data["_browserWatcherGrowl"] || data["_browserWatcherGrowl"] == "true") {
                    chrome.storage.sync.set({ _browserWatcherGrowl: "false" });
                }
            });
        }
    })


    chrome.storage.sync.get("_browserWatcherRecording", function(data) {
        let toggle = data["_browserWatcherRecording"] && data["_browserWatcherRecording"] == "true";
        $('#record').prop("checked", toggle);
    });
    $("#record").change(function() {
        if (this.checked) {
            chrome.storage.sync.get("_browserWatcherRecording", function(data) {
                if (!data["_browserWatcherRecording"] || data["_browserWatcherRecording"] == "false") {
                    chrome.runtime.sendMessage({ type: "start-recording" });
                    chrome.storage.sync.set({ _browserWatcherRecording: "true" });
                }
            });
        } else {
            chrome.storage.sync.get("_browserWatcherRecording", function(data) {
                if (!data["_browserWatcherRecording"] || data["_browserWatcherRecording"] == "true") {
                    chrome.runtime.sendMessage({ type: "stop-recording" });
                    chrome.storage.sync.set({ _browserWatcherRecording: "false" });
                }
            });
        }
    })
});