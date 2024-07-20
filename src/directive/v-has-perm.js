import store from '@/store';
import { ElMessage } from 'element-plus';
/**
 * 自定义按钮权限指令 `v-has-perm`
 * single: v-has-perm="'sys:user:add'"
 * array : v-has-perm="['sys:user:add','sys:user:edit']"
 */
export const hasPerm = {
  mounted(el, binding) {
    // 拿到DOM绑定需要的按钮权限
    const { value } = binding;
    if (!value) {
      throw new Error("need perms! Like v-has-perm=\"['sys:user:add','sys:user:edit']\"");
    }
    const requiredPermList = value instanceof Array ? value : [value];
    let { isLogin, tokenObj } = toRefs(store.user.useUserStore());
    let hasPerm = false;
    if (isLogin.value) {
      if (tokenObj.value.user.id === 1) {
        hasPerm = true;
      } else {
        hasPerm = tokenObj.value.perms.some((btnPerm) => {
          return requiredPermList.includes(btnPerm.perm);
        });
      }
    }

    if (!hasPerm) {
      if (isLogin.value) {
        ElMessage.error({
          message: '您没有访问权限',
          type: 'warning',
        });
      }
      el.parentNode && el.parentNode.removeChild(el);
    }
  },
};
