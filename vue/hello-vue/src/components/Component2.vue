<script setup lang="ts">
// 探索高阶组件实现方式，使用 vue 模板
import { onMounted, ref } from 'vue';
import Component1 from './Component1.vue';
import type { Props as Component1Props, Emit as Component1Emit } from './Component1.vue';
import type { CommonProps } from './types';

type Component1Instance = InstanceType<typeof Component1>;

// type Props = {
//   p3?: number
// } & Component1Instance['$props']

// 1. 继承自 Component1Props vscode 中组件使用时能正常提示继承的属性，由于 Component1Props 是在其它文件定义的 vue 编译时不会把 Component1Props 中定义的属性认为是当前组件的
// 所以 props 中只有 p3，在 inheritAttrs 未关闭的情况下会默认传递给根组件
// 这个特性可能会改变，不应该这么使用
interface Props extends Component1Props {
  p3?: number;
}

const props = defineProps<Props>();

// 同 Props
interface Emit extends Component1Emit {
  (e: 'e3'): void;
}
const emit = defineEmits<Emit>();

onMounted(() => {
  console.log('Component2 onMounted', props);
});

// 4. 未找到方便的 slots 透传方案
</script>
<!-- <script lang="ts">
  // 3. 多个 script 可以编译，但在 vscode 内会标红
export default {
  // 2. 禁用 Attributes 继承
  // 默认所有未在 props emit 中定义的属性都会继承到根元素上，设置 inheritAttrs: false 后，所有未在 props emit 中定义的属性都不会继承到根元素上
  // https://cn.vuejs.org/guide/components/attrs.html#disabling-attribute-inheritance
  inheritAttrs: false
}
</script> -->
<template>
  <Component1 :class="$style.container" v-bind="$attrs">
    <template #header="headerProps">
      <slot name="header" v-bind="headerProps"></slot>
    </template>
    <template #default="defaultProps">
      <slot v-bind="defaultProps"></slot>
      <div>Component2 default slot props: {{ props }}</div>
      <button @click.stop="emit('e3')">e3</button>
    </template>
    <template #footer="footProps">
      <slot name="footer" v-bind="footProps"></slot>
    </template>
  </Component1>
</template>
<style module>
.container {
}
</style>
