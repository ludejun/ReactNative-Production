<h1 align="center">RN-Production</h1>

<p align="center">
  面向生产、可上架的 React Native App 框架 —— 集成相机、开屏、隐私协议、扫一扫、FaceID、手势密码、
  组件库、基础函数、RNConsole、下拉刷新、自动化 CLI 打包、微信分享、高兼容 JSBridge 和 rematch。
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react--native-0.68-61dafb?logo=react&logoColor=white" alt="react-native 0.68" />
  <img src="https://img.shields.io/badge/react-18-61dafb?logo=react&logoColor=white" alt="react 18" />
  <img src="https://img.shields.io/badge/typescript-5.9-3178c6?logo=typescript&logoColor=white" alt="typescript 5.9" />
  <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey" alt="iOS 和 Android" />
  <a href="https://github.com/ludejun/ReactNative-Production/blob/master/LICENSE"><img src="https://img.shields.io/github/license/ludejun/ReactNative-Production?color=blue" alt="开源协议" /></a>
</p>

<p align="center">
  <a href="./CHANGELOG.md">更新日志</a>
  ·
  <a href="./README_EN.md">English</a>
</p>

---

> [!NOTE]
> **React Native 仍停留在 0.68。**
>
> 升级到当前版本（0.87）要跨越新架构（Fabric / TurboModules），并重新生成 `ios/` 和 `android/` 原生工程 —— 这需要 Xcode 和 Android SDK 才能验证，不是纯 JS 侧能完成的工作。
>
> **JS 侧已经完成维护**：TypeScript 升到 5.9 并做到 0 类型错误、ESLint 0 error、单元测试可运行。详见 [CHANGELOG.md](./CHANGELOG.md)。

## 命令

```shell
pnpm install
pnpm start          # Metro
pnpm ios            # 跑 iOS 模拟器
pnpm android        # 跑 Android

pnpm lint           # eslint
pnpm tslint         # tsc --noEmit
pnpm test           # jest（纯逻辑单元测试）
pnpm format         # prettier + eslint --fix
```

## 使用前须知
**App打开时，依此经过的屏幕**：启动屏（SplashScreen，这是原生实现） -> 前置跑马灯页（只在安装后显示的功能展示前置页，FrontInfoCarousel）-> HomeTab -> Home

**默认全局缓存解释，可以根据业务改名：**

- isPopSecret 隐私协议是否有弹，跟用户无关，只看一次
- frontInfo 跑马灯前置页（广告功能页）是否有显示过，跟用户无关，只看一次
- userGesturePasswordObj 用户设置的手势密码，只保留一个用户的，也可以说是跟用户无关
- isFaceId 表示当前有无权限调FaceId，只在FaceId页面使用，noFaceId表示没权限，在退出登录时可以不清除
- lastActiveTime 应用上一次变为inActive的时间，用于一定时间置于后激活是否需要校验

logout 的dispatch需要测试，logout的hook需要测试几个dispatch有没有问题

android studio的 Android SDK Platforms需要包含API Level为31的。因为build.gradle中的compileSdkVersion为31，最小的version：minSdkVersion升级到了24

android studio需要JDK11：https://github.com/facebook/react-native/issues/33731



## 使用前修改

1. 代码注释中标明 TODO的地方需要根据业务情况而定
2. 包名需要更新，更新方法见下方大项
3. 隐私协议、iOS/Android配置中关于隐私的使用描述文件
4. App Icon / 启动屏 / 前置页 图片



## 如何更新包名

在应用新项目时，需要更新包名和bundleId，人工改会有很多遗漏和问题。

```shell
pnpm add -g react-native-rename
npx react-native-rename "rnProduction" -b com.rn.production
# 具体API请参考：https://github.com/junedomingo/react-native-rename#readme
```
在更名后还是有些没有更改

1. android/app/src/main/AndroidManifest.xml
application节点中的包名com.rn.production需要替换
2. ios
Xcode中改名和版本号
```shell
cd ios
pod deintegrate
pod install
```

## 开始
```shell
pnpm start        # 启动 Metro
pnpm ios          # 跑 iOS

cd ios && pod install
```

改原生代码在测试时候需要重新打包，只用RN的reload是不行的

## RN原生SDK接入修改及API
微信分享的全局注册在App.tsx中
添加微信分享XCode配置：
https://github.com/little-snow-fox/react-native-wechat-lib/blob/master/docs/build-setup-ios.md


启动屏安卓IOS配置：
https://github.com/crazycodeboy/react-native-splash-screen


实现android端阴影效果：
https://github.com/879479119/react-native-shadow#readme


react-native-shadow依赖的组件：
https://github.com/react-native-community/react-native-svg


Webview配置&API：
Start： https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md
API： https://github.com/react-native-webview/react-native-webview/blob/master/docs/Reference.md
Deep：


## 如果打包后报权限错误请按照以下操作 [链接地址](https://www.npmjs.com/package/react-native-permissions)
> If you see a No permission handler detected error: Make sure that you have at least one permission handler set up. 
> In some cases the Xcode cache needs to be cleared (Xcode -> Product -> Clean Build Folder) 
> It is very important

升级 react-navigation@6.x：
yarn add @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack react-native-screens react-native-safe-area-context

## 参与贡献

欢迎提 issue 和 PR，流程见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 开源协议

[MIT](./LICENSE)
