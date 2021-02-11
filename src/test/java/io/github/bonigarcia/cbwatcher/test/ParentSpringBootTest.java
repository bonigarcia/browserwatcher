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

import static java.lang.invoke.MethodHandles.lookup;
import static org.junit.Assert.assertFalse;
import static org.slf4j.LoggerFactory.getLogger;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.util.List;
import java.util.Map;

import org.junit.After;
import org.junit.runner.RunWith;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class ParentSpringBootTest {

    static final Logger log = getLogger(lookup().lookupClass());

    @LocalServerPort
    public int serverPort;

    public WebDriver driver;

    @After
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }

    public void localhostTest() {
        driver.get("http://localhost:" + serverPort);

        List<Map<String, String>> logMessages = readLogs();

        for (Map<String, String> map : logMessages) {
            log.debug("[{}] {} {}", map.get("datetime"),
                    String.format("%1$-5s", map.get("type").toUpperCase()),
                    map.get("message"));
        }

        assertFalse(logMessages.isEmpty());

    }

    @SuppressWarnings("unchecked")
    private List<Map<String, String>> readLogs() {
        List<Map<String, String>> logMessages = (List<Map<String, String>>) ((JavascriptExecutor) driver)
                .executeScript("return console._cbwatcherLogs;");
        return logMessages;
    }

}
