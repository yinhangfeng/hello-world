<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@arco-design/web-vue';
import dayjs from 'dayjs';

interface Props {}

const props = defineProps<Props>();

const date1 = ref(dayjs().toDate());
function onDate1Update(value: any) {
  date1.value = value;
  console.log('onDate1Update', value);
}
function onDate1Select(...args: any) {
  console.log('onDate1Select', args);
}
function onDate1Change(...args: any) {
  console.log('onDate1Change', args);
}
function onDate1PickerValueChange(...args: any) {
  console.log('onDate1PickerValueChange', args);
}
function onDate1PickerValueUpdate(value: any) {
  console.log('onDate1PickerValueUpdate', value);
}
</script>
<template>
  <div :class="$style.container">
    <DatePicker
      :model-value="date1"
      @update:model-value="onDate1Update"
      @select="onDate1Select"
      @change="onDate1Change"
      @picker-value-change="onDate1PickerValueChange"
      :unmount-on-close="false"
      value-format="Date"
      @update:picker-value="onDate1PickerValueUpdate"
      :show-time="true"
      show-now-btn
    />
  </div>
</template>
<style module>
.container {
}
</style>
