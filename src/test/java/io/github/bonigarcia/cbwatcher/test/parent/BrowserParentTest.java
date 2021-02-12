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
package io.github.bonigarcia.cbwatcher.test.parent;

import static java.lang.invoke.MethodHandles.lookup;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.slf4j.LoggerFactory.getLogger;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInfo;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.opera.OperaDriver;
import org.openqa.selenium.opera.OperaOptions;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import io.github.bonigarcia.wdm.WebDriverManager;
import io.github.bonigarcia.wdm.config.DriverManagerType;

/**
 * Parent for tests using a spring-boot web application.
 *
 * @author Boni Garcia (boni.gg@gmail.com)
 * @since 1.0.0
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    @LocalServerPort
    public int serverPort;

    public WebDriver driver;

    public DriverManagerType browserType;

    @BeforeEach
    public void setup(TestInfo testInfo) {
        String displayName = testInfo.getDisplayName();
        DriverManagerType driverManagerType = DriverManagerType
                .valueOf(displayName.substring(displayName.indexOf("=") + 1)
                        .toUpperCase());

        File extSrc = new File("ext");

        WebDriverManager.getInstance(driverManagerType).setup();

        switch (driverManagerType) {
        case OPERA:
            OperaOptions operaOptions = new OperaOptions();
            operaOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
            this.driver = new OperaDriver(operaOptions);
            break;

        case CHROME:
        default:
            ChromeOptions chromeOptions = new ChromeOptions();
            chromeOptions
                    .addArguments("load-extension=" + extSrc.getAbsolutePath());
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

    public void openLocalHost(String testPage, int logMessagesSize) {
        driver.get("http://localhost:" + serverPort + "/" + testPage);

        List<Map<String, String>> logMessages = readLogs();

        for (Map<String, String> map : logMessages) {
            log.debug("[{}] {} {}", map.get("datetime"),
                    String.format("%1$-7s", map.get("type").toUpperCase()),
                    map.get("message"));
        }

        assertFalse(logMessages.isEmpty());
        assertTrue(logMessages.size() == logMessagesSize);

    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> readLogs() {
        List<Map<String, String>> logMessages = (List<Map<String, String>>) ((JavascriptExecutor) driver)
                .executeScript("return console._cbwatcherLogs;");
        return logMessages;
    }

}
