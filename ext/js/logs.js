/*
 * (C) Copyright 2021 Boni Garcia (https://bonigarcia.github.io/)
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

var originalConsole = {};

console.log("* * * Cross Browser Watcher * * *");
console._browserWatcherLogs = [];

const consoleMethodNames = ["log", "warn", "error", "info", "dir", "time", "timeEnd", "table", "count"];
const eventListenerNames = ["error", "unhandledrejection", "messageerror", "securitypolicyviolation"];

consoleMethodNames.forEach(methodName => {
    let originalMethod = (originalConsole[methodName] = console[methodName]);

    console[methodName] = function() {
        let params = Array.prototype.slice.call(arguments, 1);
        let message = params.length ? Array.from(arguments) : arguments[0];
        console._browserWatcherLogs.push({ datetime: getDateTime(), wrapper: "console", type: methodName, message: message });

        if (console.growl) {
            let title = "console." + methodName;
            switch (methodName) {
                case "error":
                    console.growl.error({ text: message, title: title });
                    break;
                case "warn":
                    console.growl.warning({ text: message, title: title });
                    break;
                case "info":
                    console.growl.info({ text: message, title: title });
                    break;
                case "log":
                    console.growl.notify({ text: message, title: title });
                    break;
                default:
                    console.growl.success({ text: message, title: title });
                    break;
            }
        }

        originalMethod.apply(console, arguments);
    }
});

eventListenerNames.forEach(listenerName => {
    window.addEventListener(listenerName, function(e) {
        let errorMessage = "";
        if (listenerName === "securitypolicyviolation") {
            errorMessage = e.error ? `${e.error.stack}` : `${e.blockedURI} ${e.violatedDirective} ${e.originalPolicy}`;
        }
        else {
            errorMessage = e.error ? `${e.error.stack}` : `${e.type} ${e.reason}`;
        }
        console._browserWatcherLogs.push({ datetime: getDateTime(), wrapper: "listener", type: listenerName, message: errorMessage });
        if (console.growl) {
            console.growl.error({ text: errorMessage, title: "listenerName." + listenerName });
        }
        originalConsole.error(errorMessage);
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


window.addEventListener("message", function(event) {
    if (event.source == window && event.data.type == "injectJavaScriptLibs") {
        chrome.runtime.sendMessage({ type: "inject-js-lib", libs: event.data.lib });
    }
    else if (event.source == window && event.data.type == "injectCssSheets") {
        chrome.runtime.sendMessage({ type: "inject-css", css: event.data.css });
    }
    else if (event.source == window && event.data.type == "injectJavaScriptCode") {
        chrome.runtime.sendMessage({ type: "inject-js-code", javascript: event.data.js });
    }
    else if (event.source == window && event.data.type == "startRecording") {
        chrome.runtime.sendMessage({ type: "start-recording", name: event.data.name });
    }
    else if (event.source == window && event.data.type == "stopRecording") {
        chrome.runtime.sendMessage({ type: "stop-recording" });
    }
});