<script setup lang="ts">
import { ref } from 'vue';
import Component1 from './Component1.vue';
import Component2 from './Component2.vue';
import Component3 from './Component3.vue';
import Component4 from './Component4.vue';
// interface Props {}

// const props = defineProps<Props>()
const console = window.console;

function component4UpdateUe1(...args: any) {
  console.log('Component4 update:ue1', args);
}
</script>
<template>
  <div :class="$style.container">
    <div>Component1</div>
    <Component1
      :p1="1"
      p2="22"
      @click="() => console.log('Component1 click')"
      @e1="() => console.log('Component1 e1')"
      @e2="(e) => console.log('Component1 e2', e)"
      @update:ue1="(e) => console.log('Component1 update:ue1', e)"
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

    <div>Component2</div>
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

    <div>Component3</div>
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

    <div>Component4</div>
    <Component4
      :p1="1"
      p2="22"
      :p3="3"
      @click="() => console.log('Component4 click')"
      @e1="() => console.log('Component4 e1')"
      @e2="(e) => console.log('Component4 e2', e)"
      @e3="() => console.log('Component4 e3')"
      @update:ue1="component4UpdateUe1"
      @e4=""
    >
      <template #header="headerProps">
        <h1>header {{ headerProps }}</h1>
      </template>

      <!-- 使用显式的默认插槽 -->
      <template #default="defaultProps">
        <p>Component4</p>
        <p>default2</p>
        {{ defaultProps }}
      </template>

      <template #footer="{ footerProp1 }">
        <p>footer {{ footerProp1 }}</p>
      </template>
    </Component4>
  </div>
</template>
<style module>
.container {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
</style>
