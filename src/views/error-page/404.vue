<template>
  <div class="w-full h-full bg-color-l-lan">404</div>
</template>
<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
if (proxy.$hasPerms('sys:user:add')) {
}
</script>
<style scoped></style>
