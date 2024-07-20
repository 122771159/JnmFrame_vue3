<template>
  <base-wrapper class="flex-center-center bg-color-l-lan h-full">
    <div style="width: 500px; height: 400px" class="bg-color-white p-10 flex-c-center-center b-rd-10">
      <h2 class="m-b-10">JINMU</h2>
      <div class="login-page-title w-300 m-b-10 p-b-2">
        <p>登录您的账户</p>
      </div>
      <el-form ref="ruleFormRef" :model="form" style="width: 300px" label-position="top" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" :prefix-icon="User" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" :prefix-icon="Lock" type="password" />
        </el-form-item>
        <div>
          <span style="font-size: 12px; padding-right: 6px; color: #9da9bb; font-weight: 500">记住登录:</span>
          <el-switch inline-prompt active-text="Y" inactive-text="N" v-model="form.rememberMe" size="small" />
        </div>

        <el-button type="primary" class="m-y-10" style="width: 300px" @click="loginUser(ruleFormRef)">Login</el-button>
      </el-form>
    </div>
  </base-wrapper>
</template>
<script setup>
import { Lock, User } from '@element-plus/icons-vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const form = reactive({});
const ruleFormRef = ref();
const { login, logout } = proxy.$store.user.useUserStore();

const rules = reactive({
  username: [
    { required: true, message: '账号不能为空', trigger: 'blur' },
    { min: 6, max: 29, message: '长度应该大于5小于30', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 29, message: '长度应该大于5小于30', trigger: 'blur' },
  ],
});
const loginUser = async (formEl) => {
  console.log(form);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      login(form).then((res) => {
        if (res?.status === 0) {
          proxy.submitOk('登陆成功');
          proxy.$router.push(proxy.$router.currentRoute._rawValue.query.redirect || '/user/index');
        }
      });
    }
  });
};
</script>
<style scoped lang="scss">
//修改el-input的样式
//.bg-color-white {
//  flex: 0 0 auto; /* 这将禁用元素的伸缩和收缩，并使用元素的固有尺寸 */
//  width: 600px;
//  height: 400px;
//}
.text-muted {
  color: #6c757d !important;
}
.login-page-title {
  text-align: center;
  border-bottom: 1px dashed #e5e5e5;
  color: #9da9bb;
  font-size: 14px;
}
</style>
