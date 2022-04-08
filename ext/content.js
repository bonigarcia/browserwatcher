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

let growlFunction = "" + function Growl() {
    var positionOption = {
        topLeft: 'topLeft',
        topRight: 'topRight',
        bottomLeft: 'bottomLeft',
        bottomRight: 'bottomRight',
        center: 'center'
    };

    var options = {
        fadeInDuration: 1000,
        fadeOutDuration: 1000,
        fadeInterval: 50,
        visibleDuration: 5000,
        postHoverVisibleDuration: 500,
        position: positionOption.topRight,
        sticky: false,
        showClose: true
    };

    var info = function(params) {
        params.notifyClass = 'growl-info';
        return addNotify(params);
    };

    var success = function(params) {
        params.notifyClass = 'growl-success';
        return addNotify(params);
    };

    var error = function(params) {
        params.notifyClass = 'growl-error';
        return addNotify(params);
    };

    var warning = function(params) {
        params.notifyClass = 'growl-warning';
        return addNotify(params);
    };

    var notify = function(params) {
        params.notifyClass = 'growl-notify';
        return addNotify(params);
    };

    var custom = function(params) {
        return addNotify(params);
    };

    var addNotify = function(params) {
        if (!params.title && !params.text) {
            return null;
        }

        var frag = document.createDocumentFragment();

        var item = document.createElement('div');
        item.classList.add('growl-item');
        item.classList.add(params.notifyClass);
        item.style.opacity = 0;

        item.options = getOptions(params);

        if (params.title) {
            item.appendChild(addTitle(params.title));
        }
        if (params.text) {
            item.appendChild(addText(params.text));
        }
        if (item.options.showClose) {
            item.appendChild(addClose(item));
        }

        item.visibleDuration = item.options.visibleDuration;

        var hideNotify = function() {
            item.fadeInterval = fade('out', item.options.fadeOutDuration, item);
        };

        var resetInterval = function() {
            clearTimeout(item.interval);
            clearTimeout(item.fadeInterval);
            item.style.opacity = null;
            item.visibleDuration = item.options.postHoverVisibleDuration;
        };

        var hideTimeout = function() {
            item.interval = setTimeout(hideNotify, item.visibleDuration);
        };

        frag.appendChild(item);
        var container = getNotifyContainer(item.options.position);
        container.appendChild(frag);

        item.addEventListener("mouseover", resetInterval);

        fade('in', item.options.fadeInDuration, item);

        if (!item.options.sticky) {
            item.addEventListener("mouseout", hideTimeout);
            hideTimeout();
        }

        return item;
    };

    var addText = function(text) {
        var item = document.createElement('div');
        item.classList.add('growl-text');
        item.innerHTML = text;
        return item;
    };

    var addTitle = function(title) {
        var item = document.createElement('div');
        item.classList.add('growl-title');
        item.innerHTML = title;
        return item;
    };

    var addClose = function(parent) {
        var item = document.createElement('span');
        item.classList.add('vn-close');
        item.addEventListener('click', function() { remove(parent); });
        return item;
    };

    var getNotifyContainer = function(position) {
        var positionClass = getPositionClass(position);
        var container = document.querySelector('.' + positionClass);
        return container ? container : createNotifyContainer(positionClass);
    };

    var createNotifyContainer = function(positionClass) {
        var frag = document.createDocumentFragment();
        container = document.createElement('div');
        container.classList.add('growl-container');
        container.classList.add(positionClass);
        container.setAttribute('role', 'alert');

        frag.appendChild(container);
        if (document.body) {
            document.body.appendChild(frag);
        }

        return container;
    };

    var getPositionClass = function(option) {
        switch (option) {
            case positionOption.topLeft:
                return 'vn-top-left';
            case positionOption.bottomRight:
                return 'vn-bottom-right';
            case positionOption.bottomLeft:
                return 'vn-bottom-left';
            case positionOption.center:
                return 'vn-center';
            default:
                return 'vn-top-right';
        }
    };

    var getOptions = function(opts) {
        return {
            fadeInDuration: opts.fadeInDuration || options.fadeInDuration,
            fadeOutDuration: opts.fadeOutDuration || options.fadeOutDuration,
            fadeInterval: opts.fadeInterval || options.fadeInterval,
            visibleDuration: opts.visibleDuration || options.visibleDuration,
            postHoverVisibleDuration: opts.postHoverVisibleDuration || options.postHoverVisibleDuration,
            position: opts.position || options.position,
            sticky: opts.sticky != null ? opts.sticky : options.sticky,
            showClose: opts.showClose != null ? opts.showClose : options.showClose
        };
    };

    var remove = function(item) {
        item.style.display = 'none';
        item.outerHTML = '';
        item = null;
    };

    var fade = function(type, ms, el) {
        var isIn = type === 'in',
            opacity = isIn ? 0 : el.style.opacity || 1,
            goal = isIn ? 0.8 : 0,
            gap = options.fadeInterval / ms;

        if (isIn) {
            el.style.display = 'block';
            el.style.opacity = opacity;
        }

        function func() {
            opacity = isIn ? opacity + gap : opacity - gap;
            el.style.opacity = opacity;

            if (opacity <= 0) {
                remove(el);
                checkRemoveContainer();
            }
            if ((!isIn && opacity <= goal) || (isIn && opacity >= goal)) {
                window.clearInterval(fading);
            }
        }

        var fading = window.setInterval(func, options.fadeInterval);
        return fading;
    };

    var checkRemoveContainer = function() {
        var item = document.querySelector('.growl-item');
        if (!item) {
            var container = document.querySelectorAll('.growl-container');
            for (var i = 0; i < container.length; i++) {
                container[i].outerHTML = '';
                container[i] = null;
            }
        }
    };

    return {
        info: info,
        success: success,
        error: error,
        warning: warning,
        notify: notify,
        custom: custom,
        options: options,
        positionOption: positionOption
    };
};

let logGatheringCode = growlFunction + "var originalConsole = {}; (" + function() {
    if (!localStorage.getItem("_browserWatcherLog")) {
        localStorage.setItem("_browserWatcherLog", "true");
    }

    console.log("* * * Cross Browser Watcher * * *");
    console._bwLogs = [];

    const consoleMethodNames = ["log", "warn", "error", "info", "dir", "time", "timeEnd", "table", "count"];
    const eventListenerNames = ["error", "unhandledrejection", "messageerror", "securitypolicyviolation"];


    if (localStorage.getItem("_browserWatcherGrowl") && localStorage.getItem("_browserWatcherGrowl") == "true") {
        console.growl = new Growl();
    }
    else {
        delete console.growl;
    }

    consoleMethodNames.forEach(methodName => {
        let originalMethod = (originalConsole[methodName] = console[methodName]);

        console[methodName] = function() {
            let params = Array.prototype.slice.call(arguments, 1);
            let message = params.length ? Array.from(arguments) : arguments[0];
            if (localStorage.getItem("_browserWatcherLog") && localStorage.getItem("_browserWatcherLog") == "true") {
                console._bwLogs.push({ datetime: getDateTime(), wrapper: "console", type: methodName, message: message });
            }

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
            if (localStorage.getItem("_browserWatcherLog") && localStorage.getItem("_browserWatcherLog") == "true") {
                console._bwLogs.push({ datetime: getDateTime(), wrapper: "listener", type: listenerName, message: errorMessage });
            }

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

} + ")();";


let logGatheringScript = document.createElement("script");
logGatheringScript.textContent = logGatheringCode;
(document.head || document.documentElement).appendChild(logGatheringScript);

let restoreLogCode = "(" + function() {
    console.log("Using original console for logging");
    Object.keys(originalConsole).forEach(methodName => {
        console[methodName] = originalConsole[methodName]
    })
    delete console._bwLogs;
} + ")();";

chrome.storage.sync.get("_cbwatcherLogGathering", function(data) {
    if (data["_cbwatcherLogGathering"] && data["_cbwatcherLogGathering"] == "false") {
        let restoreLogScript = document.createElement("script");
        restoreLogScript.textContent = restoreLogCode;
        (document.head || document.documentElement).appendChild(restoreLogScript);
    }
});

/*
chrome.storage.sync.get("_cbwatcherJavaScriptLibs", function(data) {
    if (data["_cbwatcherJavaScriptLibs"]) {
        injectJsLibs(data["_cbwatcherJavaScriptLibs"]);
    }
});

chrome.storage.sync.get("_cbwatcherInjectCssShets", function(data) {
    if (data["_cbwatcherInjectCssShets"]) {
        injectCssSheets(data["_cbwatcherInjectCssSheets"]);
    }
});

chrome.storage.sync.get("_cbwatcherJavaScriptCode", function(data) {
    if (data["_cbwatcherJavaScriptCode"]) {
        injectJsCode(data["_cbwatcherJavaScriptCode"]);
    }
});
*/

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



