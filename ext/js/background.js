const fps = 60;
const recordingDelayMs = 1000;
const defaultWidth = 1920;
const detaultHeight = 1080;
const recordingMimeType = "video/webm;codecs=vp8,opus";
const recordingPrefix = "-browser-recording";
const recordingExtension = ".webm";
const normalLogo = "../img/browserwatcher-80.png";
const recorderLogo = "../img/browserwatcher-rec-80.png";

var mediaRecorder;
var isRecording = false;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type == "start-recording") {
            startRecording(request.name);
        }
        else if (request.type == "stop-recording") {
            stopRecording();
        }
        else if (request.type == "inject-js-code") {
            injectCode(request.code);
        }
    });

chrome.commands.onCommand.addListener(function(command) {
    if (command == "start") {
        startRecording();
    } else if (command == "stop") {
        stopRecording();
    }
});

function startRecording(recordingName) {
    let width = defaultWidth;
    let height = detaultHeight;

    chrome.windows.getCurrent(function(window) {
        width = window.width;
        height = window.height;
    })
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabCapture.capture({
            video: true,
            audio: true,
            videoConstraints: {
                mandatory: {
                    chromeMediaSource: 'tab',
                    minWidth: width,
                    minHeight: height,
                    maxWidth: width,
                    maxHeight: height,
                    maxFrameRate: fps
                },
            },
        }, function(stream) {
            let mediaConstraints = {
                mimeType: recordingMimeType
            }
            mediaRecorder = new MediaRecorder(stream, mediaConstraints);

            // Hide the downloads shelf
            chrome.downloads.setShelfEnabled(false);

            // Write stream to filesystem asynchronously
            const { readable, writable } = new TransformStream({
                transform: (chunk, ctrl) => chunk.arrayBuffer().then(b => ctrl.enqueue(new Uint8Array(b)))
            })
            const writer = writable.getWriter()
            let recName = recordingName ? recordingName : getDateString() + recordingPrefix;
            readable.pipeTo(window.streamSaver.createWriteStream(recName + recordingExtension));

            // Record tab stream
            var recordedBlobs = [];
            mediaRecorder.ondataavailable = event => {
                if (event.data && event.data.size > 0) {
                    writer.write(event.data);
                    recordedBlobs.push(event.data);
                }
            };

            // On recording stopped
            mediaRecorder.onstop = () => {
                chrome.browserAction.setIcon({ path: normalLogo });
                chrome.storage.sync.set({ _browserWatcherRecording: "false" });

                // Stop streams
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });

                // Show download shelf again
                chrome.downloads.setShelfEnabled(true);

                waitRecording(() => {
                    writer.close();
                    isRecording = false;
                });
            }

            // Stop recording tab is closed
            stream.getVideoTracks()[0].onended = function() {
                mediaRecorder.stop();
            }

            chrome.browserAction.setIcon({ path: recorderLogo });
            chrome.storage.sync.set({ _browserWatcherRecording: "true" });
        });
    });

    waitRecording(() => {
        if (!isRecording) {
            mediaRecorder.start(recordingDelayMs);
            isRecording = true;
        }
    });
}

function stopRecording() {
    if (isRecording) {
        mediaRecorder.stop();
    }
}

function waitRecording(f) {
    setTimeout(f, recordingDelayMs);
}

function getDateString() {
    let date = new Date();
    let year = date.getFullYear();
    let month = pad(date.getMonth() + 1);
    let day = pad(date.getDate());
    let hours = pad(date.getHours());
    let minutes = pad(date.getMinutes());
    let seconds = pad(date.getSeconds());
    return `${year}_${month}_${day}-${hours}_${minutes}_${seconds}`;
}

function pad(date) {
    return `${date}`.padStart(2, '0');
}

function injectLib(lib) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log("* * * Injecting JavaScript library * * *\n" + lib);
        chrome.tabs.executeScript(tabs[0].id, { file: lib });
    });
}


function injectCss(css) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log("* * * Injecting CSS * * *\n" + css);
        chrome.tabs.insertCSS(tabs[0].id, { file: css });
    });
}

function injectCode(js) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log("* * * Injecting JavaScript code * * *\n" + js);
        chrome.tabs.executeScript(tabs[0].id, { code: js });
    });
}

// Logic for diabling Content-Security-Policy (CSP)

var onHeadersReceived = function(details) {
    for (var i = 0; i < details.responseHeaders.length; i++) {
        if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
            details.responseHeaders[i].value = '';
        }
    }

    return {
        responseHeaders: details.responseHeaders
    };
};

var onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] };

chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
);

chrome.browsingData.remove({}, { serviceWorkers: true }, function() { });
