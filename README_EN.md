<h1 align="center">RN-Production</h1>

<p align="center">
  A React Native app framework built for shipping to the stores: camera, splash screen, privacy
  consent, QR scanning, FaceID, gesture passwords, a component library, shared helpers, RNConsole,
  pull-to-refresh, a packaging CLI, WeChat sharing, a compatible JSBridge and rematch.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react--native-0.68-61dafb?logo=react&logoColor=white" alt="react-native 0.68" />
  <img src="https://img.shields.io/badge/react-18-61dafb?logo=react&logoColor=white" alt="react 18" />
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6?logo=typescript&logoColor=white" alt="typescript 5.9" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" alt="iOS and Android" />
  <a href="https://github.com/ludejun/ReactNative-Production/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ludejun/ReactNative-Production?color=blue" alt="license" /></a>
</p>

<p align="center">
  <a href="./CHANGELOG.md">Changelog</a>
  ·
  <a href="./readme.md">中文文档</a>
</p>

---

> [!NOTE]
> **React Native is still on 0.68.**
>
> Moving to the current release (0.87) crosses the New Architecture (Fabric / TurboModules) and
> means regenerating the `ios/` and `android/` projects — work that needs Xcode and the Android SDK
> to verify, not something that can be done from the JavaScript side alone.
>
> **The JavaScript side has been brought up to date**: TypeScript 5.9 with zero type errors, ESLint
> with zero errors, and a unit test suite that runs. See [CHANGELOG.md](./CHANGELOG.md).

## Commands

```shell
pnpm install
pnpm start          # Metro
pnpm ios            # run on the iOS simulator
pnpm android        # run on Android

pnpm lint           # eslint
pnpm tslint         # tsc --noEmit
pnpm test           # jest (pure-logic unit tests)
pnpm format         # prettier + eslint --fix
```

## Before you start

**Screens the app passes through on launch:** the native splash screen → `FrontInfoCarousel`
(the one-time feature tour shown after install) → `HomeTab` → `Home`.

**Global cache keys** — rename them to suit your product:

| Key | Meaning |
| --- | --- |
| `isPopSecret` | Whether the privacy notice has been shown. Not per-user; shown once. |
| `frontInfo` | Whether the feature tour has been shown. Not per-user; shown once. |
| `userGesturePasswordObj` | The user's gesture password. Only one is kept, so effectively not per-user. |
| `isFaceId` | Whether FaceID is currently permitted. Used only on the FaceID screen; `noFaceId` means no permission, and need not be cleared on logout. |
| `lastActiveTime` | When the app last went inactive, used to decide whether re-authentication is needed on resume. |

Android Studio needs the **API level 31** SDK platform (`compileSdkVersion` is 31, `minSdkVersion`
is 24) and **JDK 11** — see [facebook/react-native#33731](https://github.com/facebook/react-native/issues/33731).

## What to change first

1. Everything marked `TODO` in the comments depends on your product.
2. The package name and bundle ID (see below).
3. The privacy notice, and the privacy usage descriptions in the iOS/Android configuration.
4. The app icon, splash screen and feature-tour images.

## Renaming the package

Doing this by hand misses things. Use
[react-native-rename](https://github.com/junedomingo/react-native-rename#readme):

```shell
pnpm add -g react-native-rename
npx react-native-rename "rnProduction" -b com.rn.production
```

A few places it does not reach:

1. `android/app/src/main/AndroidManifest.xml` — the package name in the `application` node.
2. iOS — rename and set the version in Xcode, then:

```shell
cd ios
pod deintegrate
pod install
```

## Native SDK notes

Changing native code needs a rebuild — a React Native reload is not enough.

- **WeChat sharing** is registered globally in `App.tsx`;
  [iOS Xcode setup](https://github.com/little-snow-fox/react-native-wechat-lib/blob/master/docs/build-setup-ios.md).
- **Splash screen** for iOS and Android:
  [react-native-splash-screen](https://github.com/crazycodeboy/react-native-splash-screen).
- **Android shadows**: [react-native-shadow](https://github.com/879479119/react-native-shadow#readme),
  which depends on [react-native-svg](https://github.com/react-native-community/react-native-svg).
- **WebView**:
  [getting started](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md)
  and [reference](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md).

### "No permission handler detected" after packaging

See [react-native-permissions](https://www.npmjs.com/package/react-native-permissions):

> If you see a `No permission handler detected` error: make sure that you have at least one
> permission handler set up. In some cases the Xcode cache needs to be cleared
> (Xcode → Product → Clean Build Folder).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE)
