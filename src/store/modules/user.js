import { defineStore } from 'pinia';
import sysUserApi from '@/api/system/user.js';
// 动态导入拿到所有页面 eg: {/src/views/test/index.vue: () => import("/src/views/test/index.vue")}
const views = import.meta.glob('@/views/**/**.vue');
import { useRoute, useRouter } from 'vue-router';
import store from '@/store';

export const useUserStore = defineStore(
  'user',
  () => {
    const route = useRoute();
    const router = useRouter();
    let isLogin = ref(false);
    let tokenObj = ref({});
    let userObj = ref({});
    let routerMap = ref({}); // 全路径'/system/user' -> 路由信息

    // 登录
    async function login(loginObj) {
      // window.localStorage.setItem('user2', 'hello');

      // window.localStorage.removeItem('user2');
      // tips: pinia持久化的无法通过这种方式清空数据，只能删除同样方式存储的值 eg: window.localStorage.setItem('user2', 'hello');
      // window.localStorage.clear();
      // window.sessionStorage.clear();
      if (isLogin.value) {
        return;
      }
      let result = await sysUserApi.login({
        username: loginObj.username.trim(),
        password: loginObj.password.trim(),
        rememberMe: loginObj.rememberMe,
      });
      if (result.status === 0) {
        // return;
        isLogin.value = true;
        tokenObj.value = result.data;
      } else {
        ElNotification({
          title: 'Fail',
          message: result.statusInfo?.message ?? '登录失败',
          type: 'error',
        });
        return;
      }

      return result;
    }

    // 退出登录
    function logout() {
      // 清空pinia存储的数据
      this.$reset();
      // window.localStorage.clear();
      // window.sessionStorage.clear();
      // isLogin.value = false;
      router.push(`/login?redirect=${route.fullPath}`);

      location.reload(); // 强制刷新页面
    }

    // 获取用户 & 权限数据
    async function getUserInfo() {
      const [urlsResult, permsResult] = await Promise.all([sysUserApi.urls(), sysUserApi.perms()]);

      tokenObj.value.urls = urlsResult.data;
      tokenObj.value.perms = permsResult.data;
    }

    const routerList = computed(() => {
      // 拿到后台的权限数据
      let generateRouterList1 = generateRouterList({}, tokenObj.value.urls);

      return generateRouterList1;
    });

    // 生成侧边栏菜单 & 权限路由数据
    function generateRouterList(parentObj, permList) {
      let result = [];
      if (!permList || permList.length === 0) {
        return result;
      }

      for (let index = 0; index < permList.length; index++) {
        let permItem = permList[index];

        // 填充字段数据
        if (!permItem.meta) {
          permItem.meta = {};
        }
        if (!permItem.meta.isParentView) {
          permItem.meta.isParentView = false;
        }
        if (!permItem.meta.sort) {
          permItem.meta.sort = 10000;
        }

        let title = permItem.meta.title;
        if (title) {
          if (parentObj.meta) {
            // [子级]
            // 面包屑数据
            permItem.meta.breadcrumbItemList = parentObj.meta.breadcrumbItemList.concat([title]);
            // 全路径
            permItem.meta.fullPath = permItem.path;
          } else {
            // [顶级]
            permItem.meta.breadcrumbItemList = [title];
            permItem.meta.fullPath = permItem.path;
          }
        }
        if (permItem.children.length === 1) {
          permItem.redirect = permItem.path + '/' + permItem.children[0].path;
        }
        // 组件页面显示处理
        if (permItem.meta.component) {
          permItem.component = views[`/src/views/${permItem.meta.component}.vue`];
        }

        routerMap.value[permItem.meta.fullPath] = permItem;

        // 递归处理
        if (permItem.children.length > 0) {
          permItem.children = generateRouterList(permItem, permItem.children);
          //如果为父类 就不需要component 和 path了，经过测试可能会影响url访问，可以直接通过chaildren的path访问了
          permItem.path = '';
          permItem.component = null;
        }

        result.push(permItem);
      }

      // 从小到大 升序
      result = result.sort((a, b) => {
        return a.meta.sort - b.meta.sort;
      });

      return result;
    }

    return { isLogin, login, logout, tokenObj, userObj, routerList, routerMap, getUserInfo };
  },
  {
    persist: true,
  },
);
