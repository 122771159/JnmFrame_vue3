<template>
  <div class="header-main flex-between-center w-full bg-c-color">
    <div style="height: 100%; display: flex">
      <div class="header-icon">
        <el-icon size="24" style="margin: 0 8px; color: var(--icon-color); cursor: pointer" @click="EmitChangeMenu">
          <Expand v-show="menuIcon === 'expand'"></Expand>
          <Fold v-show="menuIcon === 'fold'"></Fold>
        </el-icon>
      </div>
      <div class="header-icon">
        <el-icon size="24" style="margin: 0 8px; color: var(--icon-color); cursor: pointer" @click="reload"><Refresh /></el-icon>
      </div>
    </div>
    <div class="user">
      <div style="display: flex; align-items: center">
        <el-switch v-model="dark_light_switch" @change="changeTheme" :active-action-icon="Moon" :inactive-action-icon="Sunny" style="--el-switch-on-color: #2c2c2c" />
      </div>
      <div class="header-icon">
        <el-icon @click="FullScreenHandle" style="margin: 0 8px; color: var(--icon-color); cursor: pointer"><FullScreen /></el-icon>
      </div>
      <el-dropdown @command="handleCommand">
        <div class="dropdown">
          <div class="avatar">
            <el-avatar :src="tokenObj.user.avatar"></el-avatar>
          </div>
          <div class="name">
            {{ tokenObj.user.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
let useSystemStore = proxy.$store.system.useSystemStore();
let useUserStore = proxy.$store.user.useUserStore();
let { menuIcon, is_dark } = toRefs(useSystemStore);
let { tokenObj } = toRefs(useUserStore);
const emits = defineEmits(['ChangeMenu', 'reload']);
const isFullScreen = ref(false);
const EmitChangeMenu = () => {
  emits('ChangeMenu', null);
};

const reload = () => {
  emits('reload', null);
};
const dark_light_switch = ref(false);
const changeTheme = (status) => {
  if (status) {
    useSystemStore.dark();
  } else {
    useSystemStore.light();
  }
};
const FullScreenHandle = () => {
  if (isFullScreen.value) {
    exitFullscreen();
  } else {
    let element = document.documentElement;
    launchFullscreen(element);
  }
  isFullScreen.value = !isFullScreen.value;
};
function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.mozRequestFullscreen) {
    element.mozRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function handleCommand(s) {
  switch (s) {
    case 'logout':
      proxy.submitOk('成功退出登录');
      useUserStore.logout();
  }
}
onMounted(() => {
  dark_light_switch.value = is_dark.value;
});
</script>
<style scoped lang="scss">
.user {
  display: flex;
  height: 100%;
}
.dropdown {
  display: flex;
  padding: 0 12px;
  .name {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #595959;
    padding: 0 10px;
    cursor: pointer;
    font-size: 14px;
  }
  .avatar {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* 解决el-dropdown获取到焦点或点击出现黑边情况 */
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}
.header-icon {
  border-top: 2px solid transparent;
  transition: border-top-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-icon:hover {
  border-top-color: rgb(100, 176, 255);
}
</style>
