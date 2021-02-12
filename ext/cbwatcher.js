/*
 * (C) Copyright 2021 Boni Garcia (http://bonigarcia.github.io/)
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

let logGatheringCode = "var originalConsole = {}; (" + function() {
    console.log("* * * Cross Browser Watcher * * *");

    console._cbwatcherLogs = [];
    const consoleMethodNames = ["log", "warn", "error", "info", "dir", "time", "timeEnd", "table", "count"];
    const eventListenerNames = ["error", "unhandledrejection"];

    consoleMethodNames.forEach(methodName => {
        let originalMethod = (originalConsole[methodName] = console[methodName]);

        console[methodName] = function() {
            let params = Array.prototype.slice.call(arguments, 1);
            let message = params.length ? util.format(arguments[0], ...params) : arguments[0];
            console._cbwatcherLogs.push({ datetime: getDateTime(), type: methodName, message });

            originalMethod.apply(console, arguments);
        }
    });

    eventListenerNames.forEach(listenerName => {
        window.addEventListener(listenerName, function(e) {
            let errorMessage = e.error ? `${e.error.stack}` : `${e.type} ${e.reason}`;
            console.error(errorMessage);
            e.preventDefault();
        });
    });

    function getDateTime() {
        let now = new Date();
        let day = now.getDate().toString().padStart(2, "0");
        let month = (now.getMonth() + 1).toString().padStart(2, "0");
        let year = now.getFullYear();
        let time = now.toLocaleTimeString();
        let millis = now.getMilliseconds().toString().padStart(3, "0");
        return `${day}-${month}-${year} ${time}.${millis}`;
    }

} + ")();";

let logGatheringScript = document.createElement("script");
logGatheringScript.textContent = logGatheringCode;
(document.head || document.documentElement).appendChild(logGatheringScript);


let restoreLogCode = "(" + function() {
    console.log("Using original console for logging");
    Object.keys(originalConsole).forEach(methodName => {
        console[methodName] = originalConsole[methodName]
    })
    delete console._cbwatcherLogs;
} + ")();";

chrome.storage.sync.get("_cbwatcherLogGathering", function(data) {
    if (data["_cbwatcherLogGathering"] && data["_cbwatcherLogGathering"] == "false") {
        let restoreLogScript = document.createElement("script");
        restoreLogScript.textContent = restoreLogCode;
        (document.head || document.documentElement).appendChild(restoreLogScript);
    }
});
