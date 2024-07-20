<template>
  <template v-for="item in routerList" :key="item.path ? item.meta.path : random()">
    <!-- 一级菜单 || (item.children.length === 1 && !item.children[0].isshow) -->
    <el-menu-item @click="itemSelect(item.meta.fullPath, item.meta.isNewPage)" v-if="item.isshow && item.children.length === 0" :index="item.meta.fullPath ? item.meta.fullPath : random()">
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>
    <!-- 二级菜单 -->

    <el-sub-menu v-if="item.isshow && item.children.length !== 0" :index="item.meta.fullPath ? item.meta.fullPath : random()">
      <template #title>
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <!-- 递归 -->
      <menu-item :router-list="item.children" />
    </el-sub-menu>
  </template>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { openNewPageBlank } from '@/utils/common';
const router = useRouter();
const route = useRoute();
defineProps({
  routerList: {
    type: Array,
    default: () => [],
  },
});
// 生成5位随机数
const random = () => {
  return Math.random().toString(16).slice(-5);
};

const itemSelect = (e, r) => {
  if (r == 1) {
    openNewPageBlank(e, route.fullPath);
  } else {
    router.push({
      path: e,
    });
  }
};
</script>
<style scoped lang="scss"></style>
