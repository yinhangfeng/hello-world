import 'dart:math';
import 'dart:async';
import 'package:js/js.dart';

import 'dart:js' as js;

String str = "aaaa";
int a = Random().nextInt(10);
String bbb = '';

String func1(String a, {int b = 1, double c = 0}) {
  bbb = '${a}_${b + c}_${DateTime.now()}';
  for (int i = 0; i < b; ++i) {
    bbb += i.toString();
  }
  return bbb;
}

void main() {
  initializeRecord();
  String result = func1(str, c: 3, b: a);
  Timer(Duration(milliseconds: 1), () {
    scheduleMicrotask(() {
      print(result);
    });
  });

  print('recordConfig: ${recordConfig?.fps}');
}
