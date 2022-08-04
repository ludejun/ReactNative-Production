package com.rn.production;

import android.app.Application;
import android.content.Context;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import com.rn.production.BuildConfig;
import com.rn.production.opensettings.*;
import com.theweflex.react.WeChatPackage; // react-native-wechat https://github.com/yorkie/react-native-wechat/blob/master/docs/build-setup-android.md
import cn.jiguang.plugins.push.JPushModule; // https://github.com/jpush/jpush-react-native/blob/master/example/android/app/src/main/java/com/example/MainApplication.java
//import com.github.wumke.RNExitApp.RNExitAppPackage; // https://github.com/wumke/react-native-exit-app
// import com.rnfs.RNFSPackage; // 添加文件系统依赖 https://www.npmjs.com/package/react-native-fs



public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new WeChatPackage()); // react-native-wechat
          packages.add(new OpenSettingsPackage()); // OpenSettingsPackage
          // packages.add(new RNExitAppPackage()); // react-native-exit-app
          // packages.add(new MainReactPackage()); // 添加文件系统依赖 https://www.npmjs.com/package/react-native-fs
          // packages.add(new RNFSPackage()); // 添加文件系统依赖 https://www.npmjs.com/package/react-native-fs
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    //调用此方法：点击通知让应用从后台切到前台 https://github.com/jpush/jpush-react-native/blob/master/example/android/app/src/main/java/com/example/MainApplication.java
    JPushModule.registerActivityLifecycle(this);
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.loyal.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
