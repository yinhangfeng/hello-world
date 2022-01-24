/// <reference path="./test3.ts" />

namespace N1 {
  export class Test2 {
    private aaa = 1;
    private bbb() {
      return 1;
    }

    m1() {
      this.aaa = this.bbb();
      const test3 = new Test3();

      // test3.bbb1();

      test3.xxx;

      return this.aaa;
    }
  }
}
