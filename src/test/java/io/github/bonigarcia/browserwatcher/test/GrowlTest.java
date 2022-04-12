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
package io.github.bonigarcia.browserwatcher.test;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import io.github.bonigarcia.browserwatcher.test.parent.BrowserParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

public class GrowlTest extends BrowserParentTest {

    static final int TEST_TIME_SEC = 5;

    @ParameterizedTest
    @EnumSource(names = { "CHROME" })
    public void webRtcTest(DriverManagerType browserType) {
        driver.get("https://bonigarcia.dev/selenium-webdriver-java/");

        List<String> jsLibs = Arrays.asList(
                "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js",
                "https://ksylvest.github.io/jquery-growl/javascripts/jquery.growl.js");
        injectJavaScriptLibs(jsLibs);
        injectCssSheet(
                "https://ksylvest.github.io/jquery-growl/stylesheets/jquery.growl.css");
        injectJavaScriptCode("setTimeout(()=>{"
                + "    $.growl.notice({ title: 'Notice', message: 'This a normal message' });"
                + "    $.growl.error({ title: 'ERROR', message: 'This is an error message' });"
                + "    $.growl.warning({ title: 'Warning!', message: 'This is a warning message' });"
                + "}, 500);");

        waitSeconds(TEST_TIME_SEC);
    }

}
