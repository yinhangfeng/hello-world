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
import android.os.Build;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    @TargetApi(Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // RippleDrawable 矩形mask
        Button button1 = (Button) findViewById(R.id.test1);
        button1.setBackground(null);
        Drawable mask = new ColorDrawable(Color.WHITE);
        ColorStateList colorStateList = new ColorStateList(
                new int[][] {new int[]{}},
                new int[] {0xff26a69a});
        RippleDrawable rippleDrawable = new RippleDrawable(colorStateList, null, mask);
//        rippleDrawable.setRadius(10);
        button1.setBackground(rippleDrawable);

        // 修改button 默认 RippleDrawable 颜色
        Button button2 = (Button) findViewById(R.id.test2);
//        button2.setElevation(0);
        RippleDrawable btnBg = (RippleDrawable) button2.getBackground();
//        btnBg.setHotspotBounds(0, 0, 100, 100);
        btnBg.setColor(colorStateList);

        // 用xml 定义RippleDrawable 参照android默认button RippleDrawable http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/drawable/btn_default_material.xml
        Button button4 = (Button) findViewById(R.id.test4);
        RippleDrawable btn4Bg = (RippleDrawable) getResources().getDrawable(R.drawable.ripple_test, null);
        button4.setBackground(btn4Bg);

        // RippleDrawable 使用圆角mask
        Button button5 = (Button) findViewById(R.id.test5);
        GradientDrawable mask5 = new GradientDrawable();
        mask5.setColor(0xffffffff);
        mask5.setCornerRadius(20);
        mask5.setStroke(4, 0xff26a69a);
        ColorStateList colorStateList5 = new ColorStateList(
                new int[][] {new int[]{}},
                new int[] {0xff26a69a});
        RippleDrawable rippleDrawable5 = new RippleDrawable(colorStateList5, null, mask5);
        button5.setBackground(rippleDrawable5);

    }
}
