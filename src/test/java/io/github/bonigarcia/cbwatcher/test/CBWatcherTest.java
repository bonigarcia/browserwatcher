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
package io.github.bonigarcia.cbwatcher.test;

import static java.lang.Thread.sleep;
import static java.lang.invoke.MethodHandles.lookup;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.junit.After;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;

import io.github.bonigarcia.cbwatcher.XpiBuilder;
import io.github.bonigarcia.wdm.WebDriverManager;

public class CBWatcherTest {

    static final Logger log = getLogger(lookup().lookupClass());

    static final int POLL_TIME_MS = 500;

    private WebDriver driver;

    @BeforeClass
    public static void setupClass() {
        WebDriverManager.chromedriver().setup();
    }

    @Before
    public void setup() throws FileNotFoundException, IOException {
        ChromeOptions options = new ChromeOptions();
        XpiBuilder xpiBuilder = new XpiBuilder();
        File xpiFile = xpiBuilder.build();
        options.addExtensions(xpiFile);
        driver = new ChromeDriver(options);
    }

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @Test
    public void test() {
        String sutUrl = "https://www.20minutos.es/";
        driver.get(sutUrl);

        List<Map<String, String>> logMessages = readLogs();
        for (Map<String, String> map : logMessages) {
            log.debug("[{}] {} {}", map.get("datetime"),
                    String.format("%1$-5s", map.get("type").toUpperCase()),
                    map.get("message"));
        }

    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> readLogs() {
        List<Map<String, String>> logMessages = (List<Map<String, String>>) readJsVariable(
                "logMessages");
        return logMessages;

    }

    private Object readJsVariable(String variable) {
        Object value = null;
        for (int i = 0; i < 10; i++) {
            value = executeScript("return " + variable + ";");
            if (value != null) {
                break;
            } else {
                log.debug("{} still not present... waiting {} ms", variable,
                        POLL_TIME_MS);
                waitMilliSeconds(POLL_TIME_MS);
            }
        }
        String clazz = value != null ? value.getClass().getName() : "";
        log.trace(">>> getProperty {} {} {}", variable, value, clazz);
        return value;
    }

    public Object executeScript(String command) {
        return ((JavascriptExecutor) driver).executeScript(command);
    }

    private void waitMilliSeconds(long milliseconds) {
        try {
            sleep(milliseconds);
        } catch (InterruptedException e) {
            log.warn("Exception waiting {} ms", milliseconds, e);
        }
    }

}
