/*
 * (C) Copyright 2025 Boni Garcia (https://bonigarcia.github.io/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

let isRecording = false;
let pendingStopResponse = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const handleAsync = async () => {
        if (message.action === 'start-recording') {
            try {
                await startRecording(message.name);
                isRecording = true;
                sendResponse({status: 'recording-started'});
            } catch (error) {
                sendResponse({status: 'error', message: error.message});
            }
        }
        else if (message.action === 'stop-recording') {
            await stopRecording();
            isRecording = false;
            sendResponse({status: 'recording-stopped'});
        }
        else if (message.action === 'stop-recording-base64') {
            await stopRecordingBase64();
            isRecording = false;
            pendingStopResponse = sendResponse;
        }
        else if (message.action === 'get-recording-state') {
            sendResponse({isRecording});
        }
        else if (message.type === 'recording-complete') {
            pendingStopResponse({
                status: 'recording-stopped',
                base64: message.base64,
                name: message.name
            });
            pendingStopResponse = null;
        }
    };

    handleAsync();
    return true; // Required for async response
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == "start") {
        startRecording();
    } else if (command == "stop") {
        stopRecording();
    }
});

async function startRecording(recordingName) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Create offscreen document if needed
    if (!(await chrome.offscreen.hasDocument())) {
        await chrome.offscreen.createDocument({
            url: '../html/offscreen.html',
            reasons: ['USER_MEDIA'],
            justification: 'Recording from tabCapture API'
        });
    }

    // Get the media stream ID from the service worker context
    const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tab.id
    });

    // Send to offscreen document
    await chrome.runtime.sendMessage({
        type: 'start-recording',
        streamId: streamId,
        name: recordingName
    });
}


async function stopRecording() {
    await chrome.runtime.sendMessage({type: 'stop-recording'});
}

async function stopRecordingBase64() {
    await chrome.runtime.sendMessage({type: 'stop-recording-base64'});
}