import { effect, Model, reducer } from '../..';

interface CountState {
  count: number;
}

export default class CountModel extends Model<CountModel, CountState> {
  static config = {
    undoable: true,
  };

  name = 'count';

  state = {
    count: 0,
  };

  @reducer()
  increment(state: CountState) {
    return {
      ...state,
      count: state.count + 1,
    };
  }

  @reducer()
  decrement(state: CountState) {
    return {
      ...state,
      count: state.count - 1,
    };
  }

  @effect()
  async asyncIncrement() {
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });

    this.dispatch.increment();

    return this.state;
  }

  @effect()
  async asyncSetState(dCount: number) {
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
  }

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
