import { createApp } from 'vue';

import App from './App.vue';
import router from '@/router';
import mixin from '@/utils/mixin';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { filters } from '@/utils/filters.js';

import { createPinia } from 'pinia';
import '@/styles/index.scss';
import store from '@/store';
// import { createPersistedState } from 'pinia-plugin-persistedstate';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
const app = createApp(App);
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
app.use(ElementPlus);
// 注册所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.mixin(mixin);

app.config.globalProperties.$filters = filters;
// import DevUI from 'vue-devui';
// import 'vue-devui/style.css';
// import '@devui-design/icons/icomoon/devui-icon.css';
// import { ThemeServiceInit, infinityTheme } from 'devui-theme';

// ThemeServiceInit({ infinityTheme }, 'infinityTheme');
// app.use(DevUI);
// {
//     auto: true, // 启用所有 Store 默认持久化
//   }
// pinia.use(createPersistedState(), {
//   paths: ['user'],
// });
pinia.use(piniaPluginPersistedstate);
// 重写 $reset 方法 => 解决组合式api中无法使用问题
pinia.use(({ store }) => {
  const initialState = JSON.parse(JSON.stringify(store.$state));

  store.$reset = () => {
    store.$state = JSON.parse(JSON.stringify(initialState));
  };
});
app.use(pinia);
app.config.globalProperties.$store = store;
import api from '@/api';
app.config.globalProperties.$api = api;
// 全局组件
import myComponent from '@/components/index';
Object.keys(myComponent).forEach((key) => {
  app.component(key, myComponent[key]);
});
// 路由角色
import '@/router/role.js';
import directive from '@/directive/index.js';
Object.keys(directive).forEach((key) => {
  // console.log(key);
  app.directive(key, directive[key]);
});

import { hasPerms } from '@/utils/hasPerms.js';
app.config.globalProperties.$hasPerms = hasPerms;
app.mount('#app');
