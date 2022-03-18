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
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.slf4j.Logger;

import io.github.bonigarcia.cbwatcher.test.parent.BrowserParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

/**
 * Test public websites.
 *
 * @author Boni Garcia
 * @since 1.0.0
 */
class PublicWebsitesTest extends BrowserParentTest {

    static final Logger log = getLogger(lookup().lookupClass());

    @ParameterizedTest
    @MethodSource("provider")
    void logTest(DriverManagerType browserType, String website) {
        driver.get(website);

        List<Map<String, String>> logMessages = readLogs();
        for (Map<String, String> map : logMessages) {
            log.debug("<{}><{}> [{}] {} {}", browserType, website,
                    map.get("datetime"),
                    String.format("%1$-7s", map.get("type").toUpperCase()),
                    map.get("message"));
        }
    }

    static Stream<Arguments> provider() {
        List<DriverManagerType> browsers = Arrays
                .asList(DriverManagerType.CHROME, DriverManagerType.FIREFOX);
        List<String> websites = getUrlsFromFile("websites-mini.txt");
        List<Arguments> cartesianProduct = new ArrayList<>();

        for (DriverManagerType browser : browsers) {
            for (String website : websites) {
                cartesianProduct.add(Arguments.of(browser, website));
            }
        }
        return cartesianProduct.stream();
    }

    static List<String> getUrlsFromFile(String filename) {
        ClassLoader classLoader = PublicWebsitesTest.class.getClassLoader();
        Path file = new File(classLoader.getResource(filename).getFile())
                .toPath();
        try {
            return Files.lines(file, Charset.defaultCharset())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Exception reading {}", filename, e);
            return Collections.<String>emptyList();
        }
    }

}
