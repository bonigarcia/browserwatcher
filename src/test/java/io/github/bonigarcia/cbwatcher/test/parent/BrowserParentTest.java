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
package io.github.bonigarcia.cbwatcher.test.parent;

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
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.slf4j.Logger;

import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;

/**
 * Parent for tests using a spring-boot web application.
 *
 * @author Boni Garcia (boni.gg@gmail.com)
 * @since 1.0.0
 */
public class BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    public WebDriver driver;

    public DriverManagerType browserType;

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
        case OPERA:
            OperaOptions operaOptions = new OperaOptions();
            operaOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
            this.driver = new OperaDriver(operaOptions);
            break;
        case FIREFOX:
            FirefoxOptions options = new FirefoxOptions();
            options.addPreference("media.navigator.permission.disabled", true);
            options.addPreference("media.navigator.streams.fake", true);
            Path zippedExtension = zipFolder(extSrc.toPath());
            this.driver = new FirefoxDriver(options);
            ((FirefoxDriver) this.driver).installExtension(zippedExtension,
                    true);
            break;
        case CHROME:
        default:
            ChromeOptions chromeOptions = new ChromeOptions();
            chromeOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
            chromeOptions.addArguments("--use-fake-ui-for-media-stream");
            chromeOptions.addArguments("--use-fake-device-for-media-stream");
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
    public List<Map<String, String>> readLogs() {
        List<Map<String, String>> logMessages = (List<Map<String, String>>) readJavaScriptVariable(
                "console._cbwatcherLogs");
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
                "window.postMessage({" + "    type: \"injectJavaScriptCode\","
                        + "    javascript: \"" + jsCode + ";\"" + "}, \"*\");");
    }

}
