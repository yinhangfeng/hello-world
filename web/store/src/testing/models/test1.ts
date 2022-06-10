import { createSelector } from 'reselect';
import { AnyModel, effect, Model, reducer } from '../..';

interface BaseModelState {
  count: number;
}

abstract class BaseModel<
  TModel extends AnyModel,
  TState extends BaseModelState
> extends Model<TModel, TState> {
  @reducer()
  increment(state: BaseModelState) {
    state.count += 1;
  }
}

interface Test1State extends BaseModelState {
  xxx?: number;
  func?: () => void;
}

interface Test1ModelComputed {
  count1: number;
  count2: number;
  count3: number;
}
type Test1ModelComputed1 = Test1Model['computed'];

export default class Test1Model extends BaseModel<Test1Model, Test1State> {
  static config = {
    name: 'test1',
    undoable: true,
    immer: true,
  };

  state = {
    count: 0,
    func: () => {},
  };

  computed = this.createComputed({
    count1: (state) => {
      // console.log('count1 getter');
      return state.count + 1;
    },
    count2: (state, computed: Test1ModelComputed) => {
      // console.log('count2 getter');
      return state.count + computed.count1;
    },
    count3: createSelector(
      (state: Test1State) => state.count,
      (state: Test1State, computed: Test1ModelComputed) => computed.count1,
      (count, count1) => {
        // console.log('count3 getter', count, count1);
        return count + count1;
      }
    ),
  });

  @reducer()
  increment(state: BaseModelState) {
    super.increment(state);
  }

  @reducer()
  decrement(state: Test1State) {
    state.count -= 1;
    return state;
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
  async asyncSetState(d: number) {
    await new Promise((resolve) => {
      setTimeout(resolve, 1);
    });

    this.setState((state) => {
      state.count += d;
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
