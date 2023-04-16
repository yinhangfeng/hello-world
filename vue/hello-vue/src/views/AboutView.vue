<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0)

function increment() {
  count.value++
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="increment" :xxx="count" >Count is: {{ count }}</button>
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
