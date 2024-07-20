<template>
  <div class="container">
    <div class="inputs">
      <div class="my-input">
        <base-input style="width: 100%" :label="'* 用 户 I D'" disabled v-model="tokenObj.user.id"></base-input>
      </div>
      <div class="my-input">
        <base-input style="width: 100%" :label="'* 用 户 名'" :disabled="isDisable" v-model="userInfo.username"></base-input>
      </div>
      <div class="my-input">
        <base-input style="width: 100%" :label="'姓 名'" :disabled="isDisable" v-model="userInfo.name"></base-input>
      </div>
    </div>
    <div class="my-input" v-if="!isDisable">
      <base-input
        style="width: 100%"
        placeholder=" 不 输 入 不 修 改 "
        :label="'修 改 用 户 密 码 ( 不 输 入 不 修 改 )'"
        :disabled="isDisable"
        type="password"
        v-model="userInfo.topassword"></base-input>
    </div>
    <div class="my-input" v-if="isShowRePassword">
      <base-input style="width: 100%" :label="'* 重 复 输 入 修 改 用 户 密 码'" :disabled="isDisable" type="password" v-model="userInfo.repassword"></base-input>
    </div>
    <div class="my-input" v-if="!isDisable">
      <base-input style="width: 100%" :label="'* 输 入 当 前 用 户 密 码'" :disabled="isDisable" type="password" v-model="userInfo.password"></base-input>
    </div>
    <div class="tools">
      <el-button type="primary" @click="isDisable = false" v-if="isDisable">修改信息</el-button>
      <el-button type="success" v-if="!isDisable" @click="saveUser">保存信息</el-button>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
let useUserStore = proxy.$store.user.useUserStore();
let { tokenObj } = toRefs(useUserStore);
const isDisable = ref(true);
const userInfo = reactive({});
userInfo.username = tokenObj.value.user.username;
userInfo.name = tokenObj.value.user.name;
const isShowRePassword = computed(() => {
  return !isDisable.value && (userInfo.topassword + '').length > 0;
});
const saveUser = async () => {
  if (!tokenObj.value.user.id) {
    proxy.submitFail('ID不能为空');
    return;
  }
  if (!userInfo.username) {
    proxy.submitFail('用户名不能为空');
    return;
  }
  if (!userInfo.password) {
    proxy.submitFail('当前密码不能为空');
    return;
  }
  if (userInfo.topassword) {
    if (userInfo.repassword !== userInfo.topassword) {
      proxy.submitFail('两次输入密码不同');
      return;
    }
  }
  let res = await proxy.$api.user.edit_user({ ...userInfo });
  if (res.status === 0) {
    tokenObj.value.user.username = userInfo.username;
    tokenObj.value.user.name = userInfo.name;
    isDisable.value = true;
    proxy.submitOk(res.data);
  }
};
</script>
<style scoped lang="scss">
.inputs {
  display: flex;
  flex-wrap: wrap;
}
.tools {
  padding: 8px;
}
@media screen and (max-width: 768px) {
  .my-input {
    width: 100%;
  }
}
@media screen and (min-width: 768px) {
  .my-input {
    width: 50%;
  }
}
</style>
