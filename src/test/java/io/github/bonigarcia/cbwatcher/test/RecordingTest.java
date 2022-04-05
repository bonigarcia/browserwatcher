/*
 * (C) Copyright 2022 Boni Garcia (https://bonigarcia.github.io/)
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
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.slf4j.Logger;

import io.github.bonigarcia.cbwatcher.test.parent.BrowserParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

/**
 * Recording test.
 *
 * @author Boni Garcia (boni.gg@gmail.com)
 * @since 1.0.0
 */
class RecordingTest extends BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    static final int TEST_TIME_SEC = 10;
    static final int REC_TIME_SEC = 10;
    static final int POLL_TIME_MSEC = 100;
    static final String REC_FILENAME = "recTest";
    static final String REC_EXT = ".webm";

    File targetFolder;

    @BeforeEach
    void setup() {
        targetFolder = new File(System.getProperty("user.home"), "Downloads");
    }

    @ParameterizedTest
    @EnumSource(names = { "CHROME" })
    void recTest(DriverManagerType browserType) throws Exception {
        driver.get("https://bonigarcia.dev/selenium-webdriver-java/");

        startRecording(REC_FILENAME);
        waitSeconds(TEST_TIME_SEC);
        stopRecording();

        long timeoutMs = System.currentTimeMillis()
                + TimeUnit.SECONDS.toMillis(REC_TIME_SEC);

        File recFile;
        do {
            recFile = new File(targetFolder, REC_FILENAME + REC_EXT);
            if (System.currentTimeMillis() > timeoutMs) {
                log.error("Timeout of {} seconds waiting for recording",
                        REC_TIME_SEC);
                break;
            }
            Thread.sleep(POLL_TIME_MSEC);

        } while (!recFile.exists());

        if (recFile.exists()) {
            log.debug("Recording available at {}", recFile);
        }
    }

}
