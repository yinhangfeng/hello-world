<script lang="ts">
import { defineComponent, nextTick, reactive } from 'vue'
import { debounce } from 'lodash'

export default defineComponent({
  props: {
    prop1: String,
  },

  data() {
    return {
      count: 1
    }
  },

  methods: {
    increment() {
      this.count++
      nextTick(() => {
        // 访问更新后的 DOM
      })
    },

    click() {
      // ... 对点击的响应 ...
      this.increment()
    },

    debouncedClick() {

    },
  },

  // setup 与 data methods 可以同时存在
  // 但定义的变量与函数不能冲突
  setup() {
    const state = reactive({ count: 0 })

    function increment1() {
      state.count++
    }

    // 不要忘记同时暴露 increment 函数
    return {
      state,
      // count: 111,
      increment1,
    }
  },

  created() {
    // 每个实例都有了自己的预置防抖的处理函数
    // TODO 如何让ts不报错
    this.debouncedClick = debounce(this.click, 500)
  },

  mounted() {
    this.$props.prop1

    console.log(this.count) // => 1
    // 数据属性也可以被更改
    this.count = 2

    // 在其他方法或是生命周期中也可以调用方法
    this.increment()
  },

  unmounted() {
    // 最好是在组件卸载时
    // 清除掉防抖计时器
    this.debouncedClick.cancel()
  },
})
</script>

<template>
  <div class="test1">
    <button @click="increment">increment {{ count }}</button>
    <button @click="debouncedClick">debouncedClick</button>
    <button @click="increment1">increment1 {{ state.count }}</button>
  </div>
</template>