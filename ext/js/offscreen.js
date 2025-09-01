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

let mediaRecorder;
let recordedChunks = [];
let base64 = false;

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === 'start-recording') {
        try {
            if (!message.streamId) {
                throw new Error('No stream ID provided');
            }

            const tabMediaSource = 'tab';
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: tabMediaSource,
                        chromeMediaSourceId: message.streamId
                    }
                },
                video: {
                    mandatory: {
                        chromeMediaSource: tabMediaSource,
                        chromeMediaSourceId: message.streamId,
                        minWidth: 1280,
                        minHeight: 720,
                        maxWidth: 1920,
                        maxHeight: 1080
                    }
                }
            });

            recordedChunks = [];
            const webmMimeType = 'video/webm';
            mediaRecorder = new MediaRecorder(stream, { mimeType: webmMimeType });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunks, { type: webmMimeType });
                // Recording name
                const rawRecordingName = message.name || `recording-${new Date().toISOString()}`;
                const safeRecordingName = rawRecordingName.replace(/[:\/\\?%*|"<>.]/g, "_");

                if (base64) {
                    // Convert Blob to Base64
                    const base64Data = await blobToBase64(blob);

                    // Send Base64 back to background
                    chrome.runtime.sendMessage({
                        type: 'recording-complete',
                        base64: base64Data,
                        name: message.name || safeRecordingName
                    });

                    function blobToBase64(blob) {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result.split(",")[1]); // strip "data:..."
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                    }
                    base64 = false;
                }
                else {
                    // Download webm
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const recordingName = message.name || safeRecordingName;

                    a.href = url;
                    a.download = recordingName;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 100);
                }
            };

            mediaRecorder.start(100);

        } catch (error) {
            console.error('Recording error:', error);
            chrome.runtime.sendMessage({
                type: 'recording-error',
                error: error.message
            });
        }
    }
    else if (message.type === 'stop-recording') {
        stopRecorder();
    }
    else if (message.type === 'stop-recording-base64') {
        base64 = true;
        stopRecorder();
    }

    function stopRecorder() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }
});