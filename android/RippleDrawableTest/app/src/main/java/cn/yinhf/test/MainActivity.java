package cn.yinhf.test;

import android.annotation.TargetApi;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.InsetDrawable;
import android.graphics.drawable.RippleDrawable;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RoundRectShape;
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.FrameLayout;

import java.util.Arrays;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";

    private Button button1;
    private Button button2;
    private Button button3;
    private Button button4;
    private Button button5;
    private Button button6;

    FrameLayout frame1;
    FrameLayout frame2;

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 1. RippleDrawable 矩形mask
        button1 = (Button) findViewById(R.id.btn1);
        button1.setBackground(null);
        Drawable mask = new ColorDrawable(Color.WHITE);
        ColorStateList colorStateList = new ColorStateList(
                new int[][] {new int[]{}},
                new int[] {0xff26a69a});
        RippleDrawable rippleDrawable = new RippleDrawable(colorStateList, null, mask);
//        rippleDrawable.setRadius(10);
        button1.setBackground(rippleDrawable);

        // 2. 修改button 默认 RippleDrawable 颜色
        button2 = (Button) findViewById(R.id.btn2);
//        button2.setElevation(0);
        RippleDrawable btnBg = (RippleDrawable) button2.getBackground();
//        btnBg.setHotspotBounds(0, 0, 100, 100);
        btnBg.setColor(colorStateList);

        // 3. xml 中提供style 覆盖defStyleAttr
        button3 = (Button) findViewById(R.id.btn3);

        // 4. 用xml 定义RippleDrawable 参照android默认button RippleDrawable http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/drawable/btn_default_material.xml
        button4 = (Button) findViewById(R.id.btn4);
        RippleDrawable btn4Bg = (RippleDrawable) getResources().getDrawable(R.drawable.ripple_test, null);
        button4.setBackground(btn4Bg);
        GradientDrawable mask4 = (GradientDrawable) btn4Bg.findDrawableByLayerId(android.R.id.mask);


        // 5. RippleDrawable 使用圆角mask
        button5 = (Button) findViewById(R.id.btn5);
        GradientDrawable mask5 = new GradientDrawable();
        // XXX
        // RippleDrawable getMaskType 时会判断 mask.getOpacity , 非 OPAQUE 时才会有MASK_EXPLICIT
        // GradientDrawable computeOpacity 用于重新计算当前是否有透明像素 在 infalte() 最后updateLocalState 中会调用一次
        // setColor setShape... 中会调用 但setCornerRadii 不会调用 所以使用setCornerRadii 圆角有无变化时 不会影响 getOpacity 的返回值
        // 解决方法是 初始时 将setCornerRadii 放在前面  后续更新时 可以调用setShape(null)
//        mask5.setCornerRadii(new float[] {40, 40, 0, 0, 40, 10, 0, 40});
        mask5.setColor(Color.WHITE);
//        mask5.setStroke(10, 0xff26a69a);
//        mask5.setShape(GradientDrawable.RECTANGLE);

//        GradientDrawable mask5 = (GradientDrawable) getResources().getDrawable(R.drawable.btn_shape_test, null);

//        TestDrawable mask5 = new TestDrawable();
//        mask5.test(40);

//        float[] outerRadii = new float[8];
//        Arrays.fill(outerRadii, 80);
//        RoundRectShape r = new RoundRectShape(outerRadii, null, null);
//        ShapeDrawable mask5 = new ShapeDrawable(r);
//        mask5.getPaint().setColor(Color.WHITE);
        ColorStateList colorStateList5 = new ColorStateList(
                new int[][] {new int[]{}},
                new int[] {0xff26a69a});
        MyRippleDrawable rippleDrawable5 = new MyRippleDrawable(colorStateList5, null, mask5);
//        rippleDrawable5.setPaddingMode(RippleDrawable.PADDING_MODE_STACK);
        button5.setBackground(rippleDrawable5);

        // 6. xml 中指定mask
        button6 = (Button) findViewById(R.id.btn6);
        RippleDrawable btn6Bg = (RippleDrawable) getResources().getDrawable(R.drawable.ripple_test1, null);
        button6.setBackground(btn6Bg);

        initFrame();
    }

    private void initFrame() {
        frame1 = (FrameLayout) findViewById(R.id.frame1);
        GradientDrawable bg1 = new GradientDrawable();
        bg1.setColor(0xff26a69a);
        bg1.setCornerRadii(new float[] {40, 40, 0, 0, 40, 10, 0, 40});
        frame1.setBackground(bg1);


        frame2 = (FrameLayout) findViewById(R.id.frame2);
        GradientDrawable bg2 = new GradientDrawable();
        bg2.setColor(0xff26a69a);
        bg2.setStroke(2, 0xfffff176);
        bg2.setCornerRadii(new float[] {40, 40, 0, 0, 40, 10, 0, 40});
        frame2.setBackground(bg2);
    }

    public float[] getRandomRadii() {
        float radius = (float) (Math.random() * 80);
        return new float[] {radius, radius, radius, radius, radius, radius, radius, radius};
    }

    public void test1(View v) {
        RippleDrawable rippleDrawable5 = (RippleDrawable) button5.getBackground();
        GradientDrawable mask5 = (GradientDrawable) rippleDrawable5.findDrawableByLayerId(android.R.id.mask);
//        mask5.setColor(Color.RED);
//        mask5.setStroke(10, 0xff26a69a);
        mask5.setCornerRadii(getRandomRadii());
        mask5.setCornerRadii(getRandomRadii());
        mask5.setShape(GradientDrawable.RECTANGLE);
//        rippleDrawable5.invalidateSelf();

//        ShapeDrawable mask5 = (ShapeDrawable) rippleDrawable5.findDrawableByLayerId(android.R.id.mask);
//        float radius = (float) (Math.random() * 80);
//        RoundRectShape r = new RoundRectShape(new float[] {radius, radius, radius, radius, radius, radius, radius, radius}, null, null);
//        mask5.setShape(r);
    }

    public void test2(View v) {
//        RippleDrawable rippleDrawable5 = (RippleDrawable) button5.getBackground();
//        TestDrawable mask5 = (TestDrawable) rippleDrawable5.findDrawableByLayerId(View.NO_ID);
//        mask5.test(80);
    }

    public void test3(View v) {
        RippleDrawable rippleDrawable = (RippleDrawable) button4.getBackground();
        GradientDrawable mask = (GradientDrawable) rippleDrawable.findDrawableByLayerId(android.R.id.mask);
        mask.setCornerRadii(new float[] {40, 40, 0, 0, 40, 10, 0, 40});
    }

    public void test4(View v) {
        RippleDrawable rippleDrawable = (RippleDrawable) button6.getBackground();
        GradientDrawable mask = (GradientDrawable) rippleDrawable.findDrawableByLayerId(android.R.id.mask);
        mask.setCornerRadii(new float[] {0, 0, 40, 40, 40, 10, 20, 40});
    }

    public void test5(View v) {
        GradientDrawable bg1 = (GradientDrawable) frame1.getBackground();
        float radius = (float) (Math.random() * 80);
        bg1.setCornerRadii(new float[] {radius, radius, radius, radius, radius, radius, radius, radius});
    }

    public void test6(View v) {
        GradientDrawable mask1 = new GradientDrawable();
        mask1.setCornerRadii(new float[] {40, 40, 0, 0, 40, 10, 0, 40});
        mask1.setColor(Color.WHITE);
//        mask5.setStroke(10, 0xff26a69a);
//        mask5.setShape(GradientDrawable.RECTANGLE);


        GradientDrawable mask2 = (GradientDrawable) getResources().getDrawable(R.drawable.btn_shape_test, null);

        Log.i(TAG, "test6: mask1:" + mask1.getOpacity() + " " + mask1.getAlpha() + "  mask2:" + mask2.getOpacity() + " " + mask2.getAlpha());
    }
}
