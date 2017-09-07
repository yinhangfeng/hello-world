package cn.yinhf.test;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.LayerDrawable;
import android.graphics.drawable.RippleDrawable;
import android.os.Build;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.widget.FrameLayout;

/**
 * Created by yinhf on 2017/9/6.
 */

public class HotspotView extends FrameLayout {
    private static final String TAG = "HotspotView";

    public HotspotView(@NonNull Context context) {
        super(context);
        init(context);
    }

    public HotspotView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init(context);
    }

    public HotspotView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context);
    }

    @TargetApi(Build.VERSION_CODES.M)
    private void init(Context context) {
        Drawable mask = new ColorDrawable(Color.WHITE);
        ColorStateList colorStateList = new ColorStateList(
                new int[][] {new int[]{}},
                new int[] {0xff26a69a});
        RippleDrawable rippleDrawable = new RippleDrawable(colorStateList, null, mask);
//        rippleDrawable.setRadius(10);
        setBackground(rippleDrawable);
    }

    public void setTranslucentBackgroundDrawable(@Nullable Drawable background) {
        Drawable mReactBackgroundDrawable = getBackground();
        // it's required to call setBackground to null, as in some of the cases we may set new
        // background to be a layer drawable that contains a drawable that has been previously setup
        // as a background previously. This will not work correctly as the drawable callback logic is
        // messed up in AOSP
        super.setBackground(null);
        if (mReactBackgroundDrawable != null && background != null) {
            LayerDrawable layerDrawable =
                    new LayerDrawable(new Drawable[] {mReactBackgroundDrawable, background});
            super.setBackground(layerDrawable);
        } else if (background != null) {
            super.setBackground(background);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    public boolean onTouchEvent(MotionEvent ev) {
        int action = ev.getAction();
        if (action == MotionEvent.ACTION_DOWN || action == MotionEvent.ACTION_MOVE || action == MotionEvent.ACTION_UP) {
            Log.i(TAG, "dispatchTouchEvent: " + ev.getX() + " " + ev.getY());
            if (action == MotionEvent.ACTION_DOWN) {
                setPressed(true);
            } else if (action == MotionEvent.ACTION_UP) {
                setPressed(false);
            }
            drawableHotspotChanged(ev.getX(), ev.getY());
        }
        return true;
    }
}
