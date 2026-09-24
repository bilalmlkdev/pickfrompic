# Changelog

All notable changes to pickfrompic will be documented in this file.

Format loosely based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Fixed

- View color details now opens the active image color instead of the hardcoded default
- HexColorPicker fills its container width
- Gradient maker saves gradients correctly
- Share links use the right dashboard routes
- Create palette name is wired to Save
- Color conversion stays in sync when navigating between colors
- Hex stop inputs accept free typing without producing NaN
- Invalid `destructive` token renamed to `danger`
- Dead dropdown animation removed
- Unused dependencies removed (`react-use-copy`, biome)
- localStorage writes wrapped so quota errors do not crash the app
- TypeScript strict mode enabled

### Added

- LICENSE
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md
- SECURITY.md
- CHANGELOG.md
- GitHub issue templates, PR template, and CI workflow

## [1.0.0] - 2026-09-16

### Added

- Image color picker with extraction, highlights, and magnifier lens
- Color converter with HEX, RGB, HSL, HSB, CMYK, LAB, LUV, HWB
- Palette generator with CSS, JSON, SVG, PNG export
- Linear and radial gradient maker
- Local dashboard for saved items
- Offline-friendly PWA setup
