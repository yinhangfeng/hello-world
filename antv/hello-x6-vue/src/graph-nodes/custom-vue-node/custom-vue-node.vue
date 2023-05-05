<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';

const props = defineProps<{
  node: any;
}>();
const getNode = inject<any>('getNode');
const node = getNode();
const label = ref<string>(node.getData().label);

node.on('change:data', (ev: any) => {
  console.log('change:data', ev);
  const { current } = ev;
  label.value = current.label;
});

onMounted(() => {
  console.log(props);
  console.log(node);
  console.log(node.getData());
  console.log(node.attrs);
});
</script>
<template>
  <div class="custom-vue-node">CustomVueNode {{ label }}</div>
</template>
<style>
.custom-vue-node {
  color: #999;
  /* width: 100%;
  height: 100%; */
  background-color: #fdd;
}
</style>
