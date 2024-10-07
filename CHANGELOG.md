# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.6.0 - 2024-10-07

### Added

- Allow setting RefUID on a per row basis.

## [0.5.0] - 2024-06-06

### Added

- Allow ENS names in recipient field

### Fixed

- Correctly handle revocable attestations
- Validity check of schema UID
- Better formatting of error messages in attest dialog
- Reset active transaction each time Submit is clicked

## [0.4.0] - 2024-05-23

### Added

- Editor now allows csv header fields in the first row.
- Added expected csv format as placeholder text in the editor.

### Fixed

- Bug that required user to add a line break after dropping a CSV file into the editor.

## [0.3.0] - 2024-05-03

### Updated

- Upgraded Ethers.js to v6
- Upgraded EAS SDK to v1.5
- Upgraded Safe API kit to v2
- Upgraded Safe Protocol kit to v3
- Upgraded wagmi/view to v2

### Fixed

- Prevent editor from wrapping long lines
- Correctly handle schemas with/without additional spaces
- Editor now remembers cursor position when validating CSV data.

## [0.2.0] - 2023-10-11

### Added

- Attest Fest now supports creating attestations from regular (EOA) Ethereum addresses as well as Safe accounts.

## [0.1.0] - 2023-09-01

### Added

- Attest fest is born! 🎂
