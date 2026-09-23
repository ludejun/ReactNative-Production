# Changelog

## Unreleased

This pass covers the JavaScript side only.

### Fixed

- **`TextInput` imported a name that does not exist.** It pulled `deviceType`
  from the `utils` barrel, which only re-exports it under its alias `isIOS`. At
  runtime the import was `undefined`, so `if (!deviceType) return 14` always
  took the first branch and the per-device font sizing never ran.
- **Two environments had no API domain.** `Env` has eight members but
  `apiServer` defined six — `local` and `bcp` resolved to `undefined`, making
  the request base URL the string `"undefined"`. The map is now typed
  `Record<Env, string>`, so a new environment cannot be added without one.
- **The anti-double-submit `Button` never guarded anything.** It declared a
  `loading` prop and tracked `iLoading` internally, and `setLoading(true)` ran
  on press — but neither value was read anywhere, so repeat presses went
  straight through. Presses during an in-flight `onPress` are now ignored.
- **`Webview` could not be used as a navigation screen.** It declared its own
  `route` shape, which is not assignable to React Navigation's
  `ScreenComponentType`. It now uses `RouteProp` with typed params. The
  `|| restProps` fallback next to it was dead: `restProps` only carries the
  connected props, never `url` / `header` / `disableBottom`.
- **`TabScreen` required a prop nothing supplies.** Its `connect()` call is
  commented out, so `homeTodoCount` was always `undefined` and the badge always
  read 0. The prop is now optional, which is what the code actually expects.
- **The only test could never pass.** `__tests__/App-test.tsx` imported
  `'../App'`, but `App.tsx` lives in `src/` — on a case-insensitive filesystem
  that resolved to `app.json`, so React was handed an object.

### Changed

- TypeScript 4.5 → 5.9. 4.5 could not even parse the installed `@types/node`,
  and `suppressImplicitAnyIndexErrors` (removed in TS 5.5) was hiding the
  environment bug above. **0 type errors.**
- ESLint config accepts `_`-prefixed unused bindings. **0 errors.**
- Test stack realigned: it was jest 25 with babel-jest 28, `@types/jest` 27 and
  react-test-renderer 16 against React 18. Now jest 29 throughout.
- `transformIgnorePatterns` matches the React Native packages anywhere in the
  path, because pnpm nests them under `node_modules/.pnpm/…` and the preset's
  own pattern assumes a flat `node_modules`.
- The whole-`<App />` render test is replaced by unit tests over the validation
  helpers: 17 tests covering phone, bank card, ID card, URL and the password
  rules. Rendering the full app needs the entire native module surface mocked
  and does not finish in CI.
- The project uses pnpm.

### Added

- A Chinese `README_CN.md` alongside the English `README.md`, both with badges.
- `CONTRIBUTING.md` and this changelog.
- `ci.yml`: lint, type-check and test on Node 20 and 22. It deliberately does
  not build the apps — that needs Xcode and the Android SDK.
