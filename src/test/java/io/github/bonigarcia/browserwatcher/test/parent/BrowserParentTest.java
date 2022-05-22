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
package io.github.bonigarcia.browserwatcher.test.parent;

import static io.github.bonigarcia.wdm.WebDriverManager.zipFolder;
import static java.lang.Thread.sleep;
import static java.lang.invoke.MethodHandles.lookup;
import static java.util.concurrent.TimeUnit.SECONDS;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.slf4j.Logger;

import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;

public class BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    static final String EXTENSION_ID = "kbnnckbeejhjlljpgelfponodpecfapp";

    public WebDriver driver;

    public DriverManagerType browserType;

    public static boolean isWebRtc = false;

    @BeforeEach
    public void setup(TestInfo testInfo) {
        String displayName = testInfo.getDisplayName();
        int iComma = displayName.indexOf(",");
        if (iComma != -1) {
            displayName = displayName.substring(0, iComma);
        }
        DriverManagerType driverManagerType = DriverManagerType
                .valueOfDisplayName(displayName);
        WebDriverManager.getInstance(driverManagerType).setup();
        File extSrc = new File("ext");

        switch (driverManagerType) {
        case FIREFOX:
            FirefoxOptions firefoxOptions = new FirefoxOptions();
            if (isWebRtc) {
                firefoxOptions.addPreference(
                        "media.navigator.permission.disabled", true);
                firefoxOptions.addPreference("media.navigator.streams.fake",
                        true);
            }
            firefoxOptions.addPreference("security.csp.enable", false);
            Path zippedExtension = zipFolder(extSrc.toPath());
            this.driver = new FirefoxDriver(firefoxOptions);
            ((FirefoxDriver) this.driver).installExtension(zippedExtension,
                    true);
            break;
        case EDGE:
            EdgeOptions edgeOptions = new EdgeOptions();
            edgeOptions
                    .addArguments("--whitelisted-extension-id=" + EXTENSION_ID);
            edgeOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
            if (isWebRtc) {
                edgeOptions.addArguments("--use-fake-ui-for-media-stream");
                edgeOptions.addArguments("--use-fake-device-for-media-stream");
            }
            this.driver = new EdgeDriver(edgeOptions);
            break;
        case CHROME:
        default:
            ChromeOptions chromeOptions = new ChromeOptions();
            chromeOptions
                    .addArguments("--whitelisted-extension-id=" + EXTENSION_ID);
            chromeOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
            if (isWebRtc) {
                chromeOptions.addArguments("--use-fake-ui-for-media-stream");
                chromeOptions
                        .addArguments("--use-fake-device-for-media-stream");
            }
            this.driver = new ChromeDriver(chromeOptions);
            break;
        }
    }

    @AfterEach
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> readLogs() {
        List<Map<String, Object>> logMessages = (List<Map<String, Object>>) readJavaScriptVariable(
                "console._bwLogs");
        return logMessages;
    }

    public Object readJavaScriptVariable(String jsVariable) {
        return ((JavascriptExecutor) driver)
                .executeScript("return " + jsVariable + ";");
    }

    public void waitSeconds(int seconds) {
        waitMilliSeconds(SECONDS.toMillis(seconds));
    }

    public void waitMilliSeconds(long milliseconds) {
        try {
            sleep(milliseconds);
        } catch (InterruptedException e) {
            log.warn("Exception waiting {} ms", milliseconds, e);
        }
    }

    public void injectJavaScriptCode(String jsCode) {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"injectJavaScriptCode\", js: \""
                        + jsCode + ";\" });");
    }

    public void injectJavaScriptLibs(List<String> jsLibs) {
        jsLibs.stream().forEach(this::injectJavaScriptLib);
    }

    public void injectJavaScriptLib(String jsLib) {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"injectJavaScriptLibs\", lib: \""
                        + jsLib + "\" });");
    }

    public void injectCssSheets(List<String> cssSheets) {
        cssSheets.stream().forEach(this::injectCssSheet);
    }

    public void injectCssSheet(String cssSheet) {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"injectCssSheets\", css: \""
                        + cssSheet + "\" });");
    }

    public void startRecording(String recordingName) {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"startRecording\", name: \""
                        + recordingName + "\" });");
    }

    public void stopRecording() {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"stopRecording\" } );");
    }

    public void disableCsp() {
        ((JavascriptExecutor) driver).executeScript(
                "window.postMessage({ type: \"disableCsp\" } );");
    }

    public void enableCsp() {
        ((JavascriptExecutor) driver)
                .executeScript("window.postMessage({ type: \"enableCsp\" } );");
    }

}
