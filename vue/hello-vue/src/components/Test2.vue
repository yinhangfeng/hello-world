<script setup lang="ts">
import { ref } from 'vue';
import Component1 from './Component1.vue';
import Component2 from './Component2.vue';
import Component3 from './Component3.vue';
// interface Props {}

// const props = defineProps<Props>()
const console = window.console;
</script>
<template>
  <div :class="$style.container">
    <Component1
      :p1="1"
      p2="22"
      @click="() => console.log('Component1 click')"
      @e1="() => console.log('Component1 e1')"
      @e2="(e) => console.log('Component1 e2', e)"
    >
      <template #header="headerProps">
        <h1>header {{ headerProps }}</h1>
      </template>

      <!-- 隐式的默认插槽 -->
      <!-- <p>default1</p>
      <p>default2</p> -->
      <!-- 使用显式的默认插槽 -->
      <template #default="defaultProps">
        <p>Component1</p>
        <p>default2</p>
        {{ defaultProps }}
      </template>

      <template #footer="{ footerProp1 }">
        <p>footer {{ footerProp1 }}</p>
      </template>
    </Component1>

    <Component2
      :p1="1"
      p2="22"
      :p3="3"
      @click="() => console.log('Component2 click')"
      @e1="() => console.log('Component2 e1')"
      @e2="(e) => console.log('Component2 e2', e)"
      @e3="() => console.log('Component2 e3')"
    >
      <template #header="headerProps">
        <h1>header {{ headerProps }}</h1>
      </template>

      <!-- 隐式的默认插槽 -->
      <!-- <p>default1</p>
      <p>default2</p> -->
      <!-- 使用显式的默认插槽 -->
      <template #default="defaultProps">
        <p>Component2</p>
        <p>default2</p>
        {{ defaultProps }}
      </template>

      <template #footer="{ footerProp1 }">
        <p>footer {{ footerProp1 }}</p>
      </template>
    </Component2>

    <Component3
      :p1="1"
      p2="22"
      :p3="3"
      @click="() => console.log('Component3 click')"
      @e1="() => console.log('Component3 e1')"
      @e2="(e) => console.log('Component3 e2', e)"
      @e3="() => console.log('Component3 e3')"
    >
      <template #header="headerProps">
        <h1>header {{ headerProps }}</h1>
      </template>

      <!-- 隐式的默认插槽 -->
      <!-- <p>default1</p>
      <p>default2</p> -->
      <!-- 使用显式的默认插槽 -->
      <template #default="defaultProps">
        <p>Component3</p>
        <p>default2</p>
        {{ defaultProps }}
      </template>

      <template #footer="{ footerProp1 }">
        <p>footer {{ footerProp1 }}</p>
      </template>
    </Component3>
  </div>
</template>
<style module>
.container {
}
</style>
