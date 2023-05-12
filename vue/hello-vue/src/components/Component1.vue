<script setup lang="ts">
import { onMounted, ref } from 'vue';
export interface Props {
  p1: number;
  p2: string;
}

const props = defineProps<Props>();

export interface Emit {
  (e: 'e1'): void;
  (e: 'e2', d: string): void;
  (e: 'update:ue1', d: string): void;
}

const emit = defineEmits<Emit>();

function onUpdateUe1() {
  emit('update:ue1', 'ue1');
}

onMounted(() => {
  console.log('Component1 onMounted', props);
});
</script>
<template>
  <div :class="$style.container">
    <div>
      <button @click.stop="emit('e1')">e1</button>
      <button @click.stop="emit('e2', 'e2')">e2</button>
      <button @click.stop="onUpdateUe1">update:ue1</button>
    </div>
    <div>props: {{ props }}</div>
    <header>
      <slot name="header" headerProp1="111"></slot>
    </header>
    <main>
      <slot defaultProp1="111">default</slot>
    </main>
    <footer>
      <slot name="footer" footerProp1="footerProp1"></slot>
    </footer>
  </div>
</template>
<style module>
.container {
  display: flex;
  flex-direction: column;
  padding: 12px;
}
</style>
