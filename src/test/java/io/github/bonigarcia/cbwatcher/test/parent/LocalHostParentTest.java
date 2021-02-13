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

import static com.google.common.truth.Truth.assertThat;
import static java.lang.invoke.MethodHandles.lookup;
import static org.slf4j.LoggerFactory.getLogger;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Parent for tests using a spring-boot web application.
 *
 * @author Boni Garcia (boni.gg@gmail.com)
 * @since 1.0.0
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class LocalHostParentTest extends BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    @LocalServerPort
    public int serverPort;

    public void openLocalHost(String testPage, int logMessagesSize) {
        driver.get("http://localhost:" + serverPort + "/" + testPage);

        List<Map<String, String>> logMessages = readLogs();

        if (logMessagesSize == 0) {
            assertThat(logMessages).isNull();
        } else {
            for (Map<String, String> map : logMessages) {
                log.debug("[{}] {} {}", map.get("datetime"),
                        String.format("%1$-7s", map.get("type").toUpperCase()),
                        map.get("message"));
            }

            assertThat(logMessages.size()).isEqualTo(logMessagesSize);
        }
    }

}
