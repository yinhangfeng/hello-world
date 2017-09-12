package cn.yinhf.test;

import android.content.res.ColorStateList;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.RippleDrawable;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * Created by yinhf on 2017/9/8.
 */

public class MyRippleDrawable extends RippleDrawable {
    private static final String TAG = "MyRippleDrawable";

    public MyRippleDrawable(@NonNull ColorStateList color, @Nullable Drawable content, @Nullable Drawable mask) {
        super(color, content, mask);
    }

    @Override
    public void draw(@NonNull Canvas canvas) {
        int maskType = -2;
        boolean mHasValidMask = false;
        try {
            Method method_getMaskType = RippleDrawable.class.getDeclaredMethod("getMaskType");
            method_getMaskType.setAccessible(true);
            maskType = (int) method_getMaskType.invoke(this, new Object[] {});

            Field field_mHasValidMask = RippleDrawable.class.getDeclaredField("mHasValidMask");
            field_mHasValidMask.setAccessible(true);
            mHasValidMask = (boolean) field_mHasValidMask.get(this);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        Log.i(TAG, "draw: maskType:" + maskType + " mHasValidMask:" + mHasValidMask);
        super.draw(canvas);
    }
}
