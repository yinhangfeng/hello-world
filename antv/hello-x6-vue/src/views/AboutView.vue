<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Test1 from '@/components/Test1.vue';

const ref1 = ref<any>();

function ref1Callback(ref11) {
  ref1.value = ref11;
}

onMounted(() => {});
</script>
<template>
  <div class="about" :ref="ref1Callback">
    <test1 :ref1="ref1" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
