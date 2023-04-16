<script setup lang="ts">
import { ref, onMounted } from 'vue';

export interface Props {
  msg: string
}
withDefaults(defineProps<Props>(), {
  msg: 'test'
})

const count = ref(0)

function increment() {
  count.value++
}

onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})

const data1 = ref({
  test1: 1,
  test2: '22',
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <button @click="increment" :xxx="count" v-bind="data1" >Count is: {{ count }}</button>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. What's next?
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
