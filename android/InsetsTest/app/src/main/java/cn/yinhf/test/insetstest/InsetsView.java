package cn.yinhf.test.insetstest;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;
import android.view.WindowInsets;
import android.widget.FrameLayout;

/**
 * API >= 21
 * 实现绘制顶部statusBar区域半透明背景
 * 消耗顶部Insets(但并不设置paddingTop)
 * 参考DrawLayout 26处理方式 (直接重写 onApplyWindowInsets 没有采用 setOnApplyWindowInsetsListener)
 * 可设置实现 mSoftInputAdjustResize 模式
 * windowSoftInputMode 为adjustResize 才会调用
 * TODO 对windowTranslucentNavigation的支持?
 *
 * status bar 高度
 * https://www.reddit.com/r/Android/comments/37zafp/it_seems_the_status_bar_size_has_been_reduced_to/
 * https://plus.google.com/+AlexLockwood/posts/GiUNZukWf52
 */
public class InsetsView extends FrameLayout {
    private static final String TAG = "InsetsView";

    private Drawable mStatusBarBackground;
    private boolean mSoftInputAdjustResize;
    private boolean mDrawStatusBarBackground = true;
    private int mSystemWindowInsetTop;
    private int mSystemWindowInsetBottom;

    public InsetsView(Context context) {
        super(context);
        init();
    }

    public InsetsView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public InsetsView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public InsetsView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    // 参考 DrawerLayout 26 获取StatusBarBackground 的方式
    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    public static Drawable getDefaultStatusBarBackground(Context context) {
//        int[] THEME_ATTRS = {
//                android.R.attr.colorPrimaryDark
//        };
//        final TypedArray a = context.obtainStyledAttributes(THEME_ATTRS);
//        try {
//            return a.getDrawable(0);
//        } finally {
//            a.recycle();
//        }

        //TODO 不知道android 系统标准的statusBar透明度是多少,暂时参考这个库 https://github.com/niorgai/StatusBarCompat
        return new ColorDrawable(0x70000000);
    }

    private void init() {
        if (Build.VERSION.SDK_INT >= 21) {
            setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
//                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            );
            mStatusBarBackground = getDefaultStatusBarBackground(getContext());
            setWillNotDraw(false);
        }
    }

    @Override
    public WindowInsets onApplyWindowInsets(WindowInsets insets) {
        if (Build.VERSION.SDK_INT < 21) {
            // < 21 有 onApplyWindowInsets ?
            return super.onApplyWindowInsets(insets);
        }
        Log.i(TAG, "onApplyWindowInsets: top:" + insets.getSystemWindowInsetTop() + " bottom:" + insets.getSystemWindowInsetBottom() + " " + insets.toString());
        if (mCallback != null) {
            mCallback.onApplyWindowInsets(insets);
        }
        mSystemWindowInsetTop = insets.getSystemWindowInsetTop();
        WindowInsets result;
        int systemWindowInsetBottom;
        if (mSoftInputAdjustResize) {
            // TODO 如果使用透明NavBar 且windowSoftInputMode 为adjustResize 则需要通过systemWindowInsetBottom 的高度来判断是否为软键盘?
            systemWindowInsetBottom = insets.getSystemWindowInsetBottom();
            result = insets.replaceSystemWindowInsets(insets.getSystemWindowInsetLeft(), 0, insets.getSystemWindowInsetRight(), 0);
        } else {
            systemWindowInsetBottom = 0;
            result = insets.replaceSystemWindowInsets(insets.getSystemWindowInsetLeft(), 0, insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
        }
        if (systemWindowInsetBottom != mSystemWindowInsetBottom) {
            mSystemWindowInsetBottom = systemWindowInsetBottom;
            // TODO 考虑原有的paddingBottom
            setPadding(getPaddingLeft(), getPaddingTop(), getPaddingRight(), systemWindowInsetBottom);
        }
        // TODO 是否需要考虑自己的padding 将padding Consume 掉
        return result;
    }

    @Override
    public void draw(Canvas canvas) {
        super.draw(canvas);
        if (mStatusBarBackground != null && mDrawStatusBarBackground && mSystemWindowInsetTop > 0) {
            mStatusBarBackground.setBounds(0, 0, getWidth(), mSystemWindowInsetTop);
            mStatusBarBackground.draw(canvas);
        }
    }

    public void setStatusBarBackground(Drawable statusBarBackground) {
        this.mStatusBarBackground = statusBarBackground;
        invalidate();
    }

    /**
     * API >= 21
     * 设置全局的底部键盘弹出时伸缩
     */
    public void setSoftInputAdjustResize(boolean adjustResize) {
        mSoftInputAdjustResize = adjustResize;
    }

    /**
     * 设置是否需要绘制statusBar 背景
     */
    public void setDrawStatusBarBackground(boolean draw) {
        this.mDrawStatusBarBackground = draw;
        setWillNotDraw(!mDrawStatusBarBackground);
        invalidate();
    }

    private Callback mCallback;

    public void setCallback(Callback callback) {
        this.mCallback = callback;
    }

    interface Callback {
        void onApplyWindowInsets(WindowInsets insets);
    }

}
