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
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;

import io.github.bonigarcia.browserwatcher.test.parent.LocalHostParentTest;
import io.github.bonigarcia.wdm.config.DriverManagerType;

@Disabled("Unavailable in MV3 extensions")
public class ContentSecurityPolictyTest extends LocalHostParentTest {

    @TestConfiguration
    public static class SecurityConfiguration {
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http)
                throws Exception {
            http.headers(headers -> headers
                    .xssProtection(xss -> xss.headerValue(
                            XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
                    .contentSecurityPolicy(
                            cps -> cps.policyDirectives("default-src 'self'")));
            return http.build();
        }
    }

    @ParameterizedTest
    @EnumSource(names = { "CHROME", "EDGE" })
    public void cspChromiumTest(DriverManagerType browserType) {
        openLocalHost("csp_error.html", 3);
        disableCsp();
        openLocalHost("csp_error.html", 0);
    }

    @ParameterizedTest
    @EnumSource(names = { "FIREFOX" })
    public void cspFirefoxTest(DriverManagerType browserType) {
        openLocalHost("csp_error.html", -1);
        disableCsp();
        openLocalHost("csp_error.html", 0);
    }

}
