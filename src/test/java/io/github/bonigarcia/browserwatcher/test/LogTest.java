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
package io.github.bonigarcia.browserwatcher.test;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;

import io.github.bonigarcia.browserwatcher.test.parent.LocalHostParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

@Disabled("Unavailable in MV3 extensions")
public class LogTest extends LocalHostParentTest {

    @ParameterizedTest
    @EnumSource(names = { "CHROME", "FIREFOX" })
    public void logTest(DriverManagerType browserType) {
        openLocalHost("index.html", 11);

        waitSeconds(5);
    }

}
