<template>
  <div v-if="isLogin && $route.meta.isParentView" class="layui-layout-admin back-color" ref="layout">
    <div class="masking" v-show="openMasking" @click="change_side"></div>
    <div class="layui-header">
      <div ref="logo" class="layui-logo text-color bg-c-color"><img src="../assets/vue.svg" alt="logo" /><cite ref="name">后台管理</cite></div>
      <Header @change-menu="change_side" @reload="StartReload"></Header>
    </div>
    <div ref="aside" class="layui-side bg-c-color">
      <Menu @select-menu="change_side"></Menu>
    </div>
    <div ref="tab" class="layui-tab">
      <Tabs></Tabs>
    </div>
    <div ref="body" class="layui-body back-color p-10" v-loading="isLoading" :element-loading-background="is_dark ? '#2d3033' : '#f5f7f9'">
      <router-view v-slot="{ Component }" v-if="isShow && !isLoading" @loaded="FinishReload">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
    <div ref="footer" class="layui-footer bg-c-color"></div>
  </div>
  <div v-else-if="!isLogin || !$route.meta.isParentView" class="h-full">
    <router-view></router-view>
  </div>
</template>
<script setup>
import { harClass, addClass, removeClass, hasClass } from '@/utils/classUtils.js';
import Menu from './component/Menu.vue';
import Header from './component/Header.vue';
import Tabs from './component/Tabs.vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
let useSystemStore = proxy.$store.system.useSystemStore();
let useUserStore = proxy.$store.user.useUserStore();
let { isMobileMenuShrink, isMenuShrink, windowWidth, menuIcon } = toRefs(useSystemStore);
let { isLogin, routerList } = toRefs(useUserStore);
let { is_dark } = toRefs(useSystemStore);
const windowWidthChangeNum = ref(0);
const layout = ref();
const name = ref();
const logo = ref();
const aside = ref();

const body = ref();
const footer = ref();
const tab = ref();
// 刷新
const isShow = ref(true);
// 是否Loading
const isLoading = ref(false);
const StartReload = () => {
  isShow.value = false;
  nextTick(() => {
    isShow.value = true;
  });
  isLoading.value = true;
  setTimeout(() => {
    FinishReload();
  }, 800);
};
// 完成刷新结束刷新loading
const FinishReload = () => {
  isLoading.value = false;
};
// 定义函数用于更新窗口宽度的值
// 函数防抖
let timeId = ref();
const updateWindowWidth = () => {
  clearTimeout(timeId.value);
  timeId.value = setTimeout(() => {
    windowWidth.value = window.innerWidth;
    if (windowWidth.value >= 768) {
      if (windowWidthChangeNum.value === 0) {
        menuIcon.value = 'fold';
        isMenuShrink.value = false;
        windowWidthChangeNum.value += 1;
        removeClass(name.value, 'hidden-name');
        removeClass(logo.value, 'logo-60');
        removeClass(aside.value, 'pc-aside');
        removeClass(tab.value, 'pc-body');
        removeClass(body.value, 'pc-body');
        removeClass(footer.value, 'pc-body');
      }
    } else {
      menuIcon.value = 'expand';
      isMobileMenuShrink.value = true;
      windowWidthChangeNum.value = 0;
      removeClass(layout.value, 'mobile-aside');
      removeClass(name.value, 'hidden-name');
      removeClass(logo.value, 'logo-60');
      removeClass(aside.value, 'pc-aside');
      removeClass(tab.value, 'pc-body');
      removeClass(body.value, 'pc-body');
      removeClass(footer.value, 'pc-body');
    }
  }, 300);
};
const openMasking = computed(() => {
  if (!isMobileMenuShrink.value && windowWidth.value < 768) {
    return true;
  }
});
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
  updateWindowWidth();
});

const change_side = (event = 'null') => {
  if (event === 'selectMenu') {
    if (windowWidth.value >= 768) return false;
    menuIcon.value = 'expand';
    isMobileMenuShrink.value = true;
    removeClass(layout.value, 'mobile-aside');
    return true;
  }
  if (windowWidth.value >= 768) {
    if (isMenuShrink.value) {
      menuIcon.value = 'fold';
      removeClass(name.value, 'hidden-name');
      removeClass(logo.value, 'logo-60');
      removeClass(aside.value, 'pc-aside');
      removeClass(tab.value, 'pc-body');
      removeClass(body.value, 'pc-body');
      removeClass(footer.value, 'pc-body');
      isMenuShrink.value = false;
    } else {
      addClass(name.value, 'hidden-name');
      addClass(logo.value, 'logo-60');
      addClass(aside.value, 'pc-aside');
      addClass(tab.value, 'pc-body');
      addClass(body.value, 'pc-body');
      addClass(footer.value, 'pc-body');
      menuIcon.value = 'expand';
      isMenuShrink.value = true;
    }
  } else {
    if (isMobileMenuShrink.value) {
      menuIcon.value = 'fold';
      addClass(layout.value, 'mobile-aside');
      isMobileMenuShrink.value = false;
    } else {
      menuIcon.value = 'expand';
      removeClass(layout.value, 'mobile-aside');
      isMobileMenuShrink.value = true;
    }
  }
};
</script>
<style scoped lang="scss">
.layui-layout-admin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  transition:
    left 0.3s ease 0s,
    right 0.3s ease 0s;
  // background-color: #2d3033;
  // background-color: #f5f7f9;
  // background-color: rgb(20, 20, 20);
}

@media screen and (max-width: 768px) {
  .layui-layout-admin {
    left: -200px;
  }
}

/* 头部导航 */
.layui-layout-admin .layui-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;

  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 999;
  display: flex;
}

/* logo */
.layui-layout-admin .layui-header .layui-logo {
  text-align: center;

  width: 200px;
  line-height: 50px;

  z-index: 1111111;
  transition: width 0.3s ease 0s;
  overflow: hidden;
  flex-shrink: 0;
}

.layui-layout-admin .layui-header .layui-logo img {
  height: 28px;
  vertical-align: middle;
}

/* 侧边栏 */
.layui-layout-admin .layui-side {
  box-shadow: 2px 8px 8px 0 rgba(29, 35, 41, 0.05);
  position: absolute;
  top: 50px;
  bottom: 0;
  width: 200px;

  user-select: none;
  z-index: 1000;
  transition: width 0.3s ease 0s;
}

/* 内容区域 */
.layui-layout-admin .layui-body {
  position: absolute;
  left: 200px;
  top: 95px;
  bottom: 44px;
  overflow: hidden;
  transition: left 0.3s ease 0s;
  right: 0;
  z-index: 900;
  box-sizing: border-box;
}
.layui-layout-admin .layui-tab {
  position: absolute;
  top: 58px;
  left: 200px;
  right: 0;
  height: 39px;
  z-index: 900;
  overflow: hidden;
  transition: left 0.3s ease 0s;
}
/* 手机版点击按钮切换样式 */
.mobile-aside {
  left: 0;
  right: -200px;
  position: fixed;
}

/* 电脑版 */
.pc-aside {
  width: 64px !important;
}

.pc-body {
  left: 64px !important;
}

/* 网站名隐藏 */
.hidden-name {
  display: none;
}

/* logo宽度变成64px */
.logo-60 {
  width: 64px !important;
}
.masking {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 200px;
  background-color: rgba(0, 0, 0, 0.25);
  -webkit-transition: background-color 0.3s;
  transition: background-color 0.3s;
  cursor: pointer;
  z-index: 1000;
}
.layui-layout-admin .layui-footer {
  z-index: 999;
  position: absolute;
  left: 200px;
  right: 0;
  height: 50px;
  bottom: 0;
  box-sizing: border-box;
  border-top: 1px solid var(--bg-c-color);
  box-shadow: 2px -1px 2px 0px rgba(0, 0, 0, 0.12);
  transition: left 0.3s;
  overflow: hidden;
}
</style>
