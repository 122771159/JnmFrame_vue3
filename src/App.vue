<script setup>
import layout from '@/layout/index.vue';
const { proxy } = getCurrentInstance();
const useSystemStore = proxy.$store.system.useSystemStore();
const { is_dark } = toRefs(useSystemStore);
onMounted(() => {
  if (is_dark.value) {
    useSystemStore.dark_html();
  } else {
    useSystemStore.light_html();
  }
});
</script>

<template>
  <layout></layout>
  <!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped></style>
