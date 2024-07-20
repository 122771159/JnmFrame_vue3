<template>
  <el-scrollbar>
    <el-menu :default-active="$route.meta.fullPath" class="el-menu-vertical-demo" @select="EmitSelectMenu" :collapse="EnCollapse" :collapse-transition="false">
      <menu-item :router-list="routerList"></menu-item>
    </el-menu>
  </el-scrollbar>
</template>
<script setup>
import MenuItem from './MenuItem.vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
let useSystemStore = proxy.$store.system.useSystemStore();
let useUserStore = proxy.$store.user.useUserStore();
let { routerList } = toRefs(useUserStore);
let { isMenuShrink, windowWidth } = toRefs(useSystemStore); //  响应式
const EnCollapse = computed(() => {
  return windowWidth.value >= 768 && isMenuShrink.value;
});

const emits = defineEmits(['selectMenu']);
const EmitSelectMenu = () => {
  emits('selectMenu', 'selectMenu');
};
</script>
<style scoped lang="scss">
.el-menu {
  border-right: none;
  overflow: hidden;
}
.el-scrollbar::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
</style>
