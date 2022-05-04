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
package io.github.bonigarcia.browserwatcher;

import static java.lang.invoke.MethodHandles.lookup;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;

public class CreateTxtFiles {

    static final Logger log = getLogger(lookup().lookupClass());

    public static void main(String[] args) throws Exception {
        List<List<String>> data = data();
        for (int i = 0; i < data.size(); i++) {
            int index = Integer.parseInt(data.get(i).get(2));
            String filename = String.format("%02d", index) + "_"
                    + data.get(i).get(1).replaceAll("https://", "") + "_"
                    + data.get(i).get(0) + ".txt";
            try (PrintWriter pw = new PrintWriter(new FileWriter(filename))) {
            }
        }
    }

    static List<List<String>> data() {
        List<String> browsers = Arrays.asList("CHROME", "FIREFOX", "EDGE");
        List<String> websites = getUrlsFromFile("websites.txt");
        List<List<String>> cartesianProduct = new ArrayList<>();

        for (int i = 0; i < websites.size(); i++) {
            for (String browser : browsers) {
                cartesianProduct.add(Arrays.asList(browser, websites.get(i),
                        String.valueOf(i + 1)));
            }
        }
        return cartesianProduct;
    }

    static List<String> getUrlsFromFile(String filename) {
        ClassLoader classLoader = CreateTxtFiles.class.getClassLoader();
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
