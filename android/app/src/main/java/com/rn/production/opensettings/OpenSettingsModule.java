package com.rn.production.opensettings;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
public class OpenSettingsModule extends ReactContextBaseJavaModule {
  @Override
  public String getName() {
    /**
     * return the string name of the NativeModule which represents this class in JavaScript
     * In JS access this module through React.NativeModules.OpenSettings
     */
    return "OpenSettings";
  }
  // 进入设置
  @ReactMethod
  public void openSettings(Callback cb) {
    Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      cb.invoke(false);
      return;
    }
    try {
      currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
      cb.invoke(true);
    } catch (Exception e) {
      cb.invoke(e.getMessage());
    }
  }
  @ReactMethod
  public void openApplicationsSettings(Callback cb) {
    Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      cb.invoke(false);
      return;
    }
    try {
      // Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      // Uri packageURI = Uri.parse("package:" + "com.rn.production");
      // currentActivity.startActivity(intent);

      currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + "com.rn.production")));
      cb.invoke(true);
    } catch (Exception e) {
      cb.invoke(e.getMessage());
    }
  }
  // private void goHuaWeiMainager() {

  //   // Intent intent = new Intent();
  //   // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  //   // intent.putExtra("packageName", BuildConfig.APPLICATION_ID);
  //   // ComponentName comp = new ComponentName("com.huawei.systemmanager", "com.huawei.permissionmanager.ui.MainActivity");
  //   // intent.setComponent(comp);
  //   // startActivity(intent);
  //   try {
  //       Intent intent = new Intent();
  //       intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
  //       ComponentName comp = new ComponentName("com.huawei.systemmanager", "com.huawei.permissionmanager.ui.MainActivity");
  //       intent.setComponent(comp);
  //       mContext.startActivity(intent);
  //   } catch (Exception e) {
  //       Toast.makeText(mContext, "跳转失败", Toast.LENGTH_LONG).show();
  //       e.printStackTrace();
  //       goIntentSetting();
  //   }
  // }
  /* constructor */
  public OpenSettingsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
}