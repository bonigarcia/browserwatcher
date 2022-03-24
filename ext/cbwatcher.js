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

let logGatheringCode = "var originalConsole = {}; (" + function() {
    console.log("* * * Cross Browser Watcher * * *");

    console._cbwatcherLogs = [];
    const consoleMethodNames = ["log", "warn", "error", "info", "dir", "time", "timeEnd", "table", "count"];
    const eventListenerNames = ["error", "unhandledrejection", "messageerror"];

    consoleMethodNames.forEach(methodName => {
        let originalMethod = (originalConsole[methodName] = console[methodName]);

        console[methodName] = function() {
            let params = Array.prototype.slice.call(arguments, 1);
            let message = params.length ? Array.from(arguments) : arguments[0];
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

    window.addEventListener("securitypolicyviolation", function(e) {
        let errorMessage = e.error ? `${e.error.stack}` : `${e.blockedURI} ${e.violatedDirective} ${e.originalPolicy}`;
        console.error(errorMessage);
        e.preventDefault();
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

chrome.storage.sync.get("_cbwatcherJavaScriptCode", function(data) {
    if (data["_cbwatcherJavaScriptCode"]) {
        injectJsCode(data["_cbwatcherJavaScriptCode"]);
    }
});

chrome.storage.sync.get("_cbwatcherJavaScriptLibs", function(data) {
    if (data["_cbwatcherJavaScriptLibs"]) {
        injectJsLibs(data["_cbwatcherJavaScriptLibs"]);
    }
});

window.addEventListener("message", function(event) {
    if (event.source == window && event.data.type == "injectJavaScriptCode") {
        injectJsCode(event.data.javascript);
    }
});

window.addEventListener("message", function(event) {
    if (event.source == window && event.data.type == "injectJavaScriptLibs") {
        injectJsLibs(event.data.javascript);
    }
});

function injectJsCode(code) {
    console.log("* * * Injecting custom JavaScript code * * *\n" + code);
    let injectJsScript = document.createElement("script");
    injectJsScript.textContent = code;
    (document.head || document.documentElement).appendChild(injectJsScript);
}

function injectJsLibs(libs) {
    console.log("* * * Injecting custom JavaScript libraries * * * " + libs);
    let arrayOfLibs = libs.split(/[\r\n]+/g);
    arrayOfLibs.forEach(function(lib) {
        console.log("Injecting: " + lib);
        var s = document.createElement("script");
        s.src = lib;
        s.onload = function() {
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s);
    });
}
