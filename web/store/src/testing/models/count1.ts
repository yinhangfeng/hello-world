import { effect, Model, reducer } from '../..';

interface CountState {
  count: number;
}

export default class Count1Model extends Model<Count1Model, CountState> {
  static config = {
    name: 'count1',
    undoable: false,
  };

  state = {
    count: 0,
  };

  reducers = {
    increment: (state: CountState) => {
      return {
        ...state,
        count: state.count + 1,
      };
    },
    decrement(state: CountState) {
      return {
        ...state,
        count: state.count - 1,
      };
    },
    reset: reducer(
      {
        actionName: 'RESET',
      },
      () => {
        return {
          count: 0,
        };
      }
    ),
  };

  effects = {
    asyncIncrement: async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });

      this.dispatch.increment();

      return this.state;
    },

    asyncSetState: async (dCount: number, a: any, b: any, c: any) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });

      this.setState((state) => {
        return {
          ...state,
          count: state.count + dCount,
        };
      });

      return this.state;
    },

    asyncReset: effect({ actionName: 'ASYNC_RESET' }, async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 1);
      });

      this.setState((state) => {
        return {
          ...state,
          count: 0,
        };
      });

      return this.state;
    }),
  };

  @effect()
  async asyncSetState1(dCount: number) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });

    this.setState({
      ...this.state,
      count: this.state.count + dCount,
    });

    return this.state;
  }
}
