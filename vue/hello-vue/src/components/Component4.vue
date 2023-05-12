<script lang="ts">
import { h, defineComponent, onMounted, useCssModule } from 'vue';
import Component1 from './Component1.vue';
import Component3 from './Component3.vue';
import { capitalize } from 'lodash-es';
import { toHandlerKey } from '@vue/shared';

function createEmitFunctions(emits: string[], emit: any) {
  const result: Record<string, any> = {};
  for (const emitName of emits) {
    const handlerKey = toHandlerKey(emitName);
    // `on${capitalize(emitName)}`
    result[handlerKey] = (...args: any) => {
      return emit(emitName, ...args);
    };
  }
  return result;
}

// 比较完美的高阶组件方案，处理事件转发
export default defineComponent({
  extends: Component1,
  // props: {
  //   ...Component1.props,
  //   p3: Number
  // },
  emits: {
    // Component1.emits 是一个字符串数组缺失具体类型...
    // ...Component1.emits,
    e4: (d: number) => {}
  },
  setup(props, context) {
    console.log('Component4 setup', props, context);
    const { slots, emit, attrs, expose } = context;
    const $style = useCssModule();

    const emits = createEmitFunctions(Component1.emits, emit);
    console.log('Component4 createEmitFunctions emits', emits);

    onMounted(() => {
      console.log('Component4 onMounted', props, 'attrs', attrs);
    });

    return (...args) => {
      console.log('Component4 render', args);
      return h(Component1, { ...props, ...emits }, slots);
      // return (
      //   <Component1 class={$style.container}>
      //     {{
      //       header: slots.header,
      //       default: () => {
      //         return (
      //           <>
      //             {slots.default?.({
      //               defaultProp1: 'defaultProp1'
      //             })}
      //             <div>Component4 default slot props: {props}</div>
      //             <button
      //               onClick={() => {
      //                 emit('e3');
      //               }}
      //             >
      //               e3
      //             </button>
      //           </>
      //         );
      //       },
      //       footer: slots.footer
      //     }}
      //   </Component1>
      // );
    };
  }
});
</script>
<style module>
.container {
}
</style>
