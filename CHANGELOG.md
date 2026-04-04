# Changelog

All notable changes to the Slogr Enterprise Frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Fixed
- Loading spinner restored to brand green (#8cb63d) — was Bootstrap blue after refactor (`75bab22`)
- Initial loading state set to `true` in Sentinel, Sessions, Monitor, Alerts — prevents EmptyState flash on page load (`75bab22`)
- Removed debug `#app { background-color: brown }` from base.css (`75bab22`)

## [0.3.0] - 2026-04-04

### Added
- `apiClient.js` singleton with centralized auth headers and 401 interceptor
- `useAgentStatus`, `useFreshness`, `useDebounceFn`, `useSearch`, `useApi` composables
- `LoadingState`, `EmptyState`, `ErrorState` shared components
- Last Seen and Status columns on Sentinel (agents) page
- Freshness badges on Sessions page
- Debounced search on agent/profile/group dropdowns in Sessions, Alerts, AddSessions
- Onboarding overlay on Home page when no agents deployed
- Investigate link on Alerts table rows

### Changed
- All service files use `apiClient` instead of raw `axios` with inline auth headers
- Parallel `Promise.all` for group data and cluster data fetches (N+1 fix)
- Map marker uses inline SVG instead of external Mapbox URL

### Fixed
- DOMPurify sanitization on map popup HTML (XSS fix)
- Console.log statements removed from production code

## [0.2.0] - 2026-04-03

### Fixed
- 20 security fixes: JWT removal, XSS protection, auth headers, 401 interceptor, sessionStorage (`a5cf2a7`)

## [0.1.0] - 2026-04-02

### Added
- Traceroute page matching backend spec (`b762a7c`)

### Fixed
- 6 UI bug fixes: groups link, map lines, group validation, session restart, results auth, traceroute page (`d911984`)
