<template>
  <h1>{{ count }}</h1>
  <h1>{{ $filters.sexName(1) }}</h1>
  <button @click="handleClick">click</button>
  <button @click="clear">click</button>
  <hello-world msg="adsad"></hello-world>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance(); // 从当前实例中获取proxy属性，赋值给变量proxy
let useTestStore = proxy.$store.test.useCounterStore();
let { count } = toRefs(useTestStore); //  响应式
let { increment } = useTestStore;

async function handleClick() {
  const a = 0
  
  // proxy.submitOk('保存成功');
  // proxy.submitFail('操作失败');
  increment();
}
function clear() {
  // useTestStore.$reset();
  // window.localStorage.clear();
  proxy.$api.demo.time();
}
</script>
