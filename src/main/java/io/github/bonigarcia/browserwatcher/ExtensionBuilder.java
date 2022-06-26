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
package io.github.bonigarcia.browserwatcher;

import static java.lang.invoke.MethodHandles.lookup;
import static org.apache.commons.io.FilenameUtils.separatorsToUnix;
import static org.slf4j.LoggerFactory.getLogger;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.slf4j.Logger;

public class ExtensionBuilder {

    static final Logger log = getLogger(lookup().lookupClass());

    static final String SOURCE_FOLDER = "ext";
    static final String TARGET_FOLDER = "target";
    static final String EXTENSION_NAME = "browserwatcher";
    // static final String EXTENSION_NAME = "browserwatcher-display";
    // static final String EXTENSION_NAME = "browserwatcher-csp";
    // static final String EXTENSION_NAME = "browserwatcher-display-csp";
    static final String EXTENSION_VERSION = "1.2.0";
    static final String DEFAULT_EXTENSION = "crx";
    // static final String DEFAULT_EXTENSION = "xpi";

    public File build() throws FileNotFoundException, IOException {
        return build(DEFAULT_EXTENSION);
    }

    public File build(String extension)
            throws FileNotFoundException, IOException {
        log.debug("Building BrowserWatcher (source folder: {})", SOURCE_FOLDER);
        String extensionName = EXTENSION_NAME + "-" + EXTENSION_VERSION + "."
                + extension;
        File targetFile = new File(TARGET_FOLDER, extensionName);
        zipFolder(new File(SOURCE_FOLDER), targetFile);
        log.debug("Extension available on {}/{}", TARGET_FOLDER, extensionName);

        return targetFile;
    }

    private void zipFolder(File srcFolder, File destZipFile)
            throws FileNotFoundException, IOException {
        try (FileOutputStream fileWriter = new FileOutputStream(destZipFile);
                ZipOutputStream zip = new ZipOutputStream(fileWriter)) {
            addFolderToZip(srcFolder, srcFolder, zip);
        }
    }

    private void addFileToZip(File rootPath, File srcFile, ZipOutputStream zip)
            throws FileNotFoundException, IOException {
        if (srcFile.isDirectory()) {
            addFolderToZip(rootPath, srcFile, zip);
        } else {
            byte[] buf = new byte[1024];
            int len;
            try (FileInputStream in = new FileInputStream(srcFile)) {
                String name = srcFile.getPath();
                name = name.replace(rootPath.getPath(), "").substring(1);
                log.debug("Zipping {}", name);
                ZipEntry zipEntry = new ZipEntry(separatorsToUnix(name));
                zip.putNextEntry(zipEntry);
                while ((len = in.read(buf)) > 0) {
                    zip.write(buf, 0, len);
                }
            }
        }
    }

    private void addFolderToZip(File rootPath, File srcFolder,
            ZipOutputStream zip) throws FileNotFoundException, IOException {
        for (File fileName : srcFolder.listFiles()) {
            addFileToZip(rootPath, fileName, zip);
        }
    }

    public static void main(String[] args)
            throws FileNotFoundException, IOException {
        ExtensionBuilder extensionBuilder = new ExtensionBuilder();
        extensionBuilder.build();
    }

}