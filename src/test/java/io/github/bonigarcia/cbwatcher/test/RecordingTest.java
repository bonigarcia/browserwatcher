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

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.KeyEvent;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import io.github.bonigarcia.cbwatcher.test.parent.BrowserParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

/**
 * Recording test.
 *
 * @author Boni Garcia (boni.gg@gmail.com)
 * @since 1.0.0
 */
class RecordingTest extends BrowserParentTest {

    static final int TEST_TIME_SEC = 10;
    static final int REC_TIME_SEC = 10;

    @ParameterizedTest
    @EnumSource(names = { "CHROME" })
    void webRtcTest(DriverManagerType browserType) throws Exception {
        driver.get("https://www.eldiario.es/");

        sendAltKey(KeyEvent.VK_R);
        waitSeconds(TEST_TIME_SEC);
        sendAltKey(KeyEvent.VK_W);
        waitSeconds(REC_TIME_SEC);

        // TODO: assert recording
    }

    void sendAltKey(int key) throws AWTException {
        Robot robot = new Robot();
        int vkControl = KeyEvent.VK_ALT;
        robot.keyPress(vkControl);
        robot.keyPress(key);
        robot.keyRelease(vkControl);
        robot.keyRelease(key);
    }

}
