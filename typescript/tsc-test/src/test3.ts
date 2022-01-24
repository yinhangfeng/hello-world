namespace N1 {
  interface Test3Inner {
    xxx: number;
    yyy(aaa: number): number;
  }

  export class Test3 implements Test3Inner {
    xxx: number;
    yyy(aaa: number): number {
      throw new Error('Method not implemented.');
    }
    private aaa1 = 1;
    protected bbb1() {
      return this.aaa1;
    }
  }

  const test3 = new Test3();

  // test3.bbb1();
  test3.yyy(1);
}
