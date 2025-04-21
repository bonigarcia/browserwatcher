document.addEventListener('DOMContentLoaded', async () => {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const statusDiv = document.getElementById('status');

    // Check current recording state
    const { isRecording } = await chrome.runtime.sendMessage({
        action: 'get-recording-state'
    });

    if (isRecording) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusDiv.textContent = 'Recording in progress...';
    }

    startBtn.addEventListener('click', async () => {
        try {
            statusDiv.textContent = 'Starting recording...';

            const response = await chrome.runtime.sendMessage({
                action: 'start-recording'
            });

            if (response.status === 'recording-started') {
                startBtn.disabled = true;
                stopBtn.disabled = false;
                statusDiv.textContent = 'Recording...';
            } else if (response.status === 'error') {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error:', error);
            statusDiv.textContent = 'Error: ' + error.message;
            startBtn.disabled = false;
        }
    });

    stopBtn.addEventListener('click', async () => {
        try {
            statusDiv.textContent = 'Stopping recording...';
            await chrome.runtime.sendMessage({ action: 'stop-recording' });
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusDiv.textContent = 'Recording saved';
            setTimeout(() => statusDiv.textContent = 'Ready', 2000);
        } catch (error) {
            console.error('Error stopping recording:', error);
            statusDiv.textContent = 'Error stopping recording';
        }
    });
});