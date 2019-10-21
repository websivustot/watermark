
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

import com.watermark.BuildConfig;
import com.watermark.R;

// @react-native-community/cameraroll
import com.reactnativecommunity.cameraroll.CameraRollPackage;
// react-native-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-image-marker
import com.jimmydaddy.imagemarker.ImageMarkerPackage;
// react-native-share
import cl.json.RNSharePackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  public PackageList(ReactNativeHost reactNativeHost) {
    this.reactNativeHost = reactNativeHost;
  }

  public PackageList(Application application) {
    this.reactNativeHost = null;
    this.application = application;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new CameraRollPackage(),
      new RNFetchBlobPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new ImageMarkerPackage(),
      new RNSharePackage()
    ));
  }
}
