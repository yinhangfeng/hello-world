<script lang="tsx">
// 探索高阶组件实现方式，使用 render 函数
import { defineComponent, onMounted, useCssModule } from 'vue';
import Component1 from './Component1.vue';

console.log('Component1.emits', Component1.emits);

export default defineComponent({
  props: {
    ...Component1.props,
    p3: Number
  },
  emits: {
    // Component1.emits 是一个字符串数组缺失具体类型...
    // ...Component1.emits,
    e3: () => {}
  },
  setup(props, context) {
    const { slots, emit, attrs, expose } = context;
    const $style = useCssModule();

    onMounted(() => {
      console.log('Component3 onMounted', props, 'attrs', attrs);
    });

    return () => {
      return (
        <Component1 class={$style.container} {...props}>
          {{
            header: slots.header,
            default: () => {
              return (
                <>
                  {slots.default?.({
                    defaultProp1: 'defaultProp1'
                  })}
                  <div>Component3 default slot props: {props}</div>
                  <button
                    onClick={() => {
                      emit('e3');
                    }}
                  >
                    e3
                  </button>
                </>
              );
            },
            footer: slots.footer
          }}
        </Component1>
      );
    };
  }
});
</script>
<style module>
.container {
}
</style>
