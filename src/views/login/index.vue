<template>
  <div class="flex-center-center h-full">
    <div class="content back-color">
      <div class="login-wrapper bg-c-color">
        <div class="left-img">
          <div class="glass">
            <div class="tips">
              <div class="title">JUMP!</div>
              <h1>跳绳比赛评分系统</h1>
              <span>金木体育科技公司研发</span>
              <span>我们邀请您使用我们的产品！</span>
            </div>
          </div>
        </div>
        <div class="right-login-form bg-c-color">
          <div class="form-wrapper">
            <h1>Log in</h1>
            <form>
              <div class="input-items">
                <span class="input-tips"> Username </span>
                <input v-model="form.username" type="text" class="inputs" placeholder="请输入您的用户名" />
              </div>
              <div class="input-items">
                <span class="input-tips"> Password </span>
                <input v-model="form.password" type="password" class="inputs" placeholder="请输入您的密码" autocomplete="off" />
                <!-- <span class="forgot">Forgot Password</span> -->
              </div>
            </form>
            <div>
              <span style="font-size: 12px; padding-right: 6px; color: #9da9bb; font-weight: 500">记住登录:</span>
              <el-switch inline-prompt active-text="Y" inactive-text="N" v-model="form.rememberMe" size="small" />
            </div>
            <button class="btn bg-c-color text-color" @click="loginUser()">Log in</button>
            <div class="siginup-tips">
              <div>没有账号?</div>
              <br />
              <div>此页面不可注册</div>
            </div>
            <div class="other-login">
              <div class="divider">
                <span class="line"></span>
                <span class="divider-text">金木</span>
                <span class="line"></span>
              </div>
              <div class="other-login-wrapper">
                <div class="other-login-item">
                  <div style="display: flex; align-items: center">
                    <span>主题:</span>
                    <el-switch v-model="dark_light_switch" @change="changeTheme" :active-action-icon="Moon" :inactive-action-icon="Sunny" style="--el-switch-on-color: #2c2c2c" />
                  </div>
                </div>
                <!-- <div class="other-login-item">
                  <img src="/WeChat.png" alt="WeChat" />
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
let useSystemStore = proxy.$store.system.useSystemStore();
let { is_dark } = toRefs(useSystemStore);
const form = reactive({});
const { login, logout } = proxy.$store.user.useUserStore();
const dark_light_switch = ref(false);
const changeTheme = (status) => {
  if (status) {
    useSystemStore.dark();
  } else {
    useSystemStore.light();
  }
};

const loginUser = async () => {
  if (!form.username) {
    proxy.submitError('用户名不能为空');
    return;
  }
  if (form.username.length < 6 || form.username.length > 30) {
    proxy.submitError('用户名不能小于6位,大于30位');
    return;
  }
  if (!form.password) {
    proxy.submitError('密码不能为空');
    return;
  }
  if (form.password.length < 6 || form.password.length > 30) {
    proxy.submitError('密码不能小于6位,大于30位');
    return;
  }
  login(form).then((res) => {
    if (res?.status === 0) {
      proxy.submitOk('登陆成功');
      proxy.$router.push(proxy.$router.currentRoute._rawValue.query.redirect || '/user/index');
    }
  });
};
onMounted(() => {
  dark_light_switch.value = is_dark.value;
});
</script>
<style scoped lang="scss">
* {
  padding: 0;
  margin: 0;
  font-family: 'Aguazyuan', Courier, monospace;
}
.content {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.content .login-wrapper {
  width: 75vw;
  height: 80vh;
  border-radius: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}
.content .login-wrapper .left-img {
  border-radius: 40px;
  flex: 1;
  background: url('/bg.png') no-repeat;
  background-size: cover;
  position: relative;
}
.content .login-wrapper .left-img .glass {
  width: 60%;
  padding: 20px;
  color: #fff;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.48);
}
.content .login-wrapper .left-img .glass .tips .title {
  width: 80px;
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  padding: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.48);
}
.content .login-wrapper .left-img .glass .tips h1 {
  margin: 15px 0;
}
.content .login-wrapper .left-img .glass .tips span {
  margin: 5px 0;
  display: block;
  font-weight: 100;
}
.content .login-wrapper .right-login-form {
  border-radius: 40px;
  flex: 1;
  position: relative;
}
.content .login-wrapper .right-login-form .form-wrapper {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content .login-wrapper .right-login-form .form-wrapper h1 {
  font-size: 30px;
  text-align: center;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items {
  margin: 20px 0;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .input-tips {
  display: inline-block;
  font-weight: 600;
  font-size: 20px;
  margin: 10px 0;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .inputs {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  border: 1px solid rgb(227, 227, 227);
  padding: 20px;
  box-sizing: border-box;
  outline: none;
  transition: 0.5s;
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .inputs:focus {
  border: 1px solid rgb(128, 106, 196);
}
.content .login-wrapper .right-login-form .form-wrapper .input-items .forgot {
  float: right;
  font-weight: 600;
  text-align: right;
  margin: 5px 0;
  font-size: 13px;
  cursor: pointer;
}
.content .login-wrapper .right-login-form .form-wrapper .btn {
  width: 100%;
  border: var(--el-border);
  height: 50px;
  border-radius: 10px;
  font-size: 25px;
  margin: 20px 0;
  cursor: pointer;
  transition: 0.4s;
}
.content .login-wrapper .right-login-form .form-wrapper .btn:hover {
  transform: scale(1.1);
}
.content .login-wrapper .right-login-form .form-wrapper .siginup-tips {
  text-align: center;
  font-weight: 600;
  margin: 10px 0;
}
.content .login-wrapper .right-login-form .form-wrapper .siginup-tips div:last-child {
  color: rgb(110, 87, 179);
  cursor: pointer;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider {
  width: 100%;
  margin: 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider .line {
  display: inline-block;
  max-width: 35%;
  width: 35%;
  flex: 1;
  height: 1px;
  background-color: rgb(162, 172, 185);
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .divider .divider-text {
  vertical-align: middle;
  margin: 0 20px;
  display: inline-block;
  width: 50px;
  color: rgb(162, 172, 185);
  white-space: normal;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item {
  width: 120px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: rgb(51, 49, 116);
  margin: 0 10px;
  transition: 0.4s;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item span {
  vertical-align: middle;
}
.content .login-wrapper .right-login-form .form-wrapper .other-login .other-login-wrapper .other-login-item:hover {
  width: 130px;
  height: 50%;
  background-color: #fff;
  border: 0;
  box-shadow: 1px 10px 32px 1px rgba(186, 175, 221, 0.37);
}

@media (max-width: 1024px) {
  .login-wrapper {
    padding: 20px;
  }
  .login-wrapper .left-img {
    display: none;
  }
  .login-wrapper .right-login-form {
    padding: 20px;
  }
  .content .login-wrapper {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
} /*# sourceMappingURL=style.css.map */
</style>
