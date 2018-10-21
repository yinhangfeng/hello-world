package cn.yinhf.test.insetstest;

import android.content.res.Resources;
import android.util.DisplayMetrics;

public class DisplayUtils {

    private static DisplayMetrics displayMetrics = Resources.getSystem().getDisplayMetrics();

    public static int dp2px(float dp) {
        return (int) (dp * displayMetrics.density + 0.5f);
    }

    public static int px2dp(float px) {
        return (int) (px / displayMetrics.density + 0.5f);
    }

    public static int px2sp(float pixelValue) {
        return (int) (pixelValue / displayMetrics.scaledDensity + 0.5f);
    }

    public static int sp2px(float spValue) {
        return (int) (spValue * displayMetrics.scaledDensity + 0.5f);
    }

    public static DisplayMetrics getDisplayMetrics() {
        return displayMetrics;
    }

    /**
     * 获取屏幕长边的长度
     */
    public static int getLength() {
        return displayMetrics.widthPixels > displayMetrics.heightPixels ? displayMetrics.widthPixels : displayMetrics.heightPixels;
    }

    /**
     * 屏幕宽高比是否大于4:3
     */
    public static boolean isLongScreen() {
        float ratio;
        if(displayMetrics.heightPixels > displayMetrics.widthPixels) {
            ratio = (float) displayMetrics.widthPixels / displayMetrics.heightPixels;
        } else {
            ratio = (float) displayMetrics.heightPixels / displayMetrics.widthPixels;
        }
        return ratio < 0.66f;
    }
}
