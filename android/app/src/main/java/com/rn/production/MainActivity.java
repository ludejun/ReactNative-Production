package com.rn.production;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // https://github.com/crazycodeboy/react-native-splash-screen
import android.content.res.Configuration;
import android.content.res.Resources;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "rnProduction";
  }

  // 设置全屏且状态栏透明 https://www.jianshu.com/p/8075ccc84d07
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme); // https://github.com/crazycodeboy/react-native-splash-screen
    super.onCreate(savedInstanceState);

    View decorView = getWindow().getDecorView();
    decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    if (Build.VERSION.SDK_INT >= 21) {
        getWindow().setStatusBarColor(Color.TRANSPARENT);
    }
  }

  // 禁止字体缩放
  @Override
  public Resources getResources() {
    Resources res = super.getResources();
    Configuration config=new Configuration();
    config.setToDefaults();
    res.updateConfiguration(config,res.getDisplayMetrics());
    return res;
  }

}
