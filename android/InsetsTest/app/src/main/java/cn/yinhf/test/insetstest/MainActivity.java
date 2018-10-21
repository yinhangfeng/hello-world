package cn.yinhf.test.insetstest;

import android.graphics.Color;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.widget.TextView;

/**
 * Window flag:
 * WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS 状态栏透明 颜色不可变 且内容延伸到 statusBar 下方
 * WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION 导航栏透明 颜色不可变 且内容延伸到 navigationBar 下方
 *
 * 主题:
 * 主题中设置 windowTranslucentStatus 等价于 FLAG_TRANSLUCENT_STATUS
 * 主题中设置 windowTranslucentNavigation 等价于 FLAG_TRANSLUCENT_NAVIGATION
 *
 * View flag:
 * View.SYSTEM_UI_FLAG_LAYOUT_STABLE + View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN 等价于 FLAG_TRANSLUCENT_STATUS 但颜色可调
 * View.SYSTEM_UI_FLAG_LAYOUT_STABLE + View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION 等价于 FLAG_TRANSLUCENT_NAVIGATION 但颜色可调
 */
public class MainActivity extends AppCompatActivity implements InsetsView.Callback {
    private static final String TAG = "MainActivity";

    private int mStatusBarHeight;
    private int mNavigationBarHeight;

    private InsetsView mInsetsView;
    private TextView mInfoView1;
    private TextView mInfoView2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().addFlags(
//                WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS
                WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION
                | WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS
        );

        getWindow().setStatusBarColor(Color.TRANSPARENT);

        setContentView(R.layout.activity_main);

        mInsetsView = findViewById(R.id.insets);
        mInfoView1 = findViewById(R.id.info1);
        mInfoView2 = findViewById(R.id.info2);

        mInsetsView.setCallback(this);

        getSystemUIInfo();
    }

    private void getSystemUIInfo() {
        int statusBarHeightResourceId = getResources().getIdentifier("status_bar_height", "dimen", "android");
        if (statusBarHeightResourceId > 0) {
            mStatusBarHeight = getResources().getDimensionPixelSize(statusBarHeightResourceId);
        }

        // https://stackoverflow.com/questions/20264268/how-do-i-get-the-height-and-width-of-the-android-navigation-bar-programmatically/29609679#29609679
        // 下面方式获取的并不准确
        int navigationBarHeightResourceId = getResources().getIdentifier("navigation_bar_height", "dimen", "android");
        mNavigationBarHeight = getResources().getDimensionPixelSize(navigationBarHeightResourceId);

        String msg = "getSystemUIInfo: mStatusBarHeight:" + mStatusBarHeight + " " + DisplayUtils.px2dp(mStatusBarHeight) + " mNavigationBarHeight:" + mNavigationBarHeight + " " + DisplayUtils.px2dp(mNavigationBarHeight);

        Log.i(TAG, msg);
        mInfoView1.setText(msg);
    }

    public void test1(View view) {
        getSystemUIInfo();
    }

    public void test2(View view) {
    }

    public void test3(View view) {
    }

    @Override
    public void onApplyWindowInsets(WindowInsets insets) {
        String msg = "onApplyWindowInsets: top:" + insets.getSystemWindowInsetTop() + " bottom:" + insets.getSystemWindowInsetBottom() + " " + insets.toString();
        mInfoView2.setText(msg);
    }
}
