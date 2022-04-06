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

import static java.lang.invoke.MethodHandles.lookup;
import static org.assertj.core.api.Assertions.assertThat;
import static org.slf4j.LoggerFactory.getLogger;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
public class LocalHostParentTest extends BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    @LocalServerPort
    public int serverPort;

    public void openLocalHost(String testPage, int logMessagesSize) {
        driver.get("http://localhost:" + serverPort + "/" + testPage);

        List<Map<String, Object>> logMessages = readLogs();

        if (logMessagesSize == 0) {
            assertThat(logMessages).isNull();
        } else {
            for (Map<String, Object> map : logMessages) {
                log.debug("[{}] [{}.{}] {}", map.get("datetime"),
                        map.get("wrapper").toString().toUpperCase(),
                        String.format("%1$-7s",
                                map.get("type").toString().toUpperCase()),
                        map.get("message"));
            }

            assertThat(logMessages.size()).isEqualTo(logMessagesSize);
        }
    }

}
