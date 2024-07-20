import store from '@/store';
export const hasPerms = (perm = null) => {
  if (!perm) {
    return false;
  }
  const requiredPermList = perm instanceof Array ? perm : [perm];
  let { isLogin, tokenObj } = toRefs(store.user.useUserStore());
  if (isLogin.value) {
    return tokenObj.value.perms.some((btnPerm) => {
      return requiredPermList.includes(btnPerm.perm);
    });
  }
  return false;
};
