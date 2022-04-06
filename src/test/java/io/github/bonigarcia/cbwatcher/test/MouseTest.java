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

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;

import io.github.bonigarcia.cbwatcher.test.parent.BrowserParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

public class MouseTest extends BrowserParentTest {

    @ParameterizedTest
    @EnumSource(names = { "CHROME" })
    public void webRtcTest(DriverManagerType browserType) {
        driver.get("https://bonigarcia.dev/selenium-webdriver-java/");

        injectJavaScriptLib(
                "https://cdn.jsdelivr.net/gh/mohamedfrindi/Mouse.js/dist/mouse-min.js");
        injectJavaScriptCode(
                "setTimeout(function(){" + "    let mouse = new Mouse();"
                        + "    mouse.mouse();" + "}, 100);");

        Actions actions = new Actions(driver);
        WebElement body = driver.findElement(By.tagName("body"));
        actions.moveToElement(body);
        int numPoints = 10;
        int radius = 100;
        for (int i = 0; i <= numPoints; i++) {
            double angle = Math.toRadians(360 * i / numPoints);
            double x = Math.sin(angle) * radius;
            double y = Math.cos(angle) * radius;
            actions.moveByOffset((int) x, (int) y);
        }
        actions.build().perform();
    }

}
