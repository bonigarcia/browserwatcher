# Changelog

## [2.1.0] - 2025-01-01
### Added
- Include feature to record screen in Base64


## [2.0.0] - 2025-04-21
### Changed
- Migrate BrowserWatcher extension to manifest v3 (MV3)
- Update tests to MV3 features (recording only)
- Store recordings in all CI worker operating systems (linux, win, mac)

### Removed
- Remove non-supported features in MV3: console log, disabling CSP, JavaScript and CSS injection


## [1.2.0] - 2022-06-26
### Changed
- Use label "source" instead of "wrapper" for gathered logs

### Removed
- Remove support for messageerror listener


## [1.1.0] - 2022-05-25
### Added
- Include feature for disabling Content-Security-Policy (CSP)
- Include listener for XHR errors

### Changed
- Improve error message in error listener


## [1.0.0] - 2022-04-40
### Added
- Console log gathering
- Console log displaying
- Tab recording
- JavaScript and CSS injection
- Documentation
