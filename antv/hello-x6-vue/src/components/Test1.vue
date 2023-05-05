<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps<{
  ref1: any;
}>();

console.log('props:', props, props.ref1);

onMounted(() => {
  console.log('props:', props, props.ref1);
});
</script>

<template>
  <div class="test1">Test1</div>
</template>

<style scoped></style>
