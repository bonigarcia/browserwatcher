const fps = 60;
const recordingDelayMs = 1000;
const defaultWidth = 1920;
const detaultHeight = 1080;
const recordingMimeType = "video/webm;codecs=vp8,opus";
const recordingPrefix = "-recording.webm";
const normalLogo = "../icons/cbwatcher-logo.png";
const recorderLogo = "../icons/record_icon.png";

var mediaRecorder;
var isRecording = false;

chrome.commands.onCommand.addListener(function(command) {
    if (command == "start") {
        startRecording();
    } else if (command == "stop") {
        stopRecording();
    }
});

function startRecording() {
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
            chrome.browserAction.setIcon({ path: recorderLogo });

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
            readable.pipeTo(window.streamSaver.createWriteStream(getDateString() + recordingPrefix));

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
        });
    });

    waitRecording(() => {
        if (!isRecording) {
            mediaRecorder.start(1000);
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
