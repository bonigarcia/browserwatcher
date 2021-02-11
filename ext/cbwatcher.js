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
console.log("* * * Loading Cross Browser Watcher * * *");

var logMessages = [];
const consoleMethodNames = ["log", "warn", "error", "info"];
const eventListenerNames = ["error", "unhandledrejection"];


consoleMethodNames.forEach(methodName => {
    let originalMethod = console[methodName]

    console[methodName] = function() {
        let params = Array.prototype.slice.call(arguments, 1);
        let message = params.length ? util.format(arguments[0], ...params) : arguments[0];
        logMessages.push({ datetime: getDateTime(), type: methodName, message });

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
