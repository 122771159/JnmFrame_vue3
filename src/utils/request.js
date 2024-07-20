import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import store from '@/store';
// import { layer } from '@layui/layui-vue';
// import { localStorage } from '@/utils/storage';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000, // 请求超时时间：50s
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    if (!config.headers) {
      throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
    }
    const { isLogin, tokenObj } = toRefs(store.user.useUserStore());
    if (isLogin.value) {
      // 授权认证
      config.headers['Authorization'] = tokenObj.value.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 更新token机制，目前后端没写，暂时不处理
    const { tokenObj } = toRefs(store.user.useUserStore());
    if (response.headers?.authorization !== undefined) {
      tokenObj.value.token = response.headers.authorization;
    }
    return response.data;
  },
  (error) => {
    const { status, statusInfo } = error.response.data;
    const code = error.response.status;
    if (code == 401) {
      handleError();
    } else {
      ElMessage({
        message: statusInfo?.message ?? statusInfo ?? '系统错误',
        type: 'error',
        duration: 5 * 1000,
      });
      return Promise.reject(new Error(statusInfo?.message ?? statusInfo ?? 'Error'));
    }
  },
);

// 统一处理请求响应异常
function handleError() {
  const userStore = store.user.useUserStore();
  const { logout } = userStore;
  const { isLogin } = toRefs(userStore);
  if (isLogin.value) {
    ElMessageBox.confirm('您的登录账号已失效，请重新登录', {
      confirmButtonText: '再次登录',
      cancelButtonText: '取消',
      type: 'warning',
    }).finally(() => {
      logout();
    });
  }
}

// 导出实例
export default service;
