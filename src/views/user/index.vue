<template>
  <div class="main-container">
    <base-dialog v-show="dialogVisible" v-model="dialogVisible" title="裁剪头像" :before-close="handleClose">
      <div>
        <div class="dialog-container">
          <div class="corpper">
            <img-corpper ref="corpper" @realTime="cropImage" :image="imgUrl"></img-corpper>
            <div class="w-full" style="display: flex; justify-content: space-between">
              <h6 style="display: flex; justify-content: center; line-height: 1; cursor: pointer" @click="corpper.rotateRight">
                <el-icon> <RefreshRight /> </el-icon>向右旋转90
              </h6>
              <h6 style="display: flex; justify-content: center; line-height: 1; cursor: pointer" @click="changeImage">
                <el-icon> <Refresh /> </el-icon>重新选择
              </h6>
              <h6 style="display: flex; justify-content: center; line-height: 1; cursor: pointer" @click="corpper.rotateLeft">
                <el-icon> <RefreshLeft /> </el-icon>向左旋转90
              </h6>
            </div>
          </div>

          <div class="tools">
            <img :src="base64Img" alt="预览" />
            <h6>预览头像</h6>
          </div>
        </div>
        <div style="display: flex; justify-content: center">
          <el-button type="primary" @click="saveAvatar" :loading="saveImgLoading">保存头像</el-button>
        </div>
      </div>
    </base-dialog>
    <el-card shadow="never">
      <template #header>
        <h5>资 料 详 细</h5>
        <el-tooltip class="box-item" :disabled="!visible" effect="light" content="点击头像更换头像" placement="right" v-model:visible="visible">
          <img style="width: 100px; height: auto; border-radius: 15px" :src="tokenObj.user.avatar" alt="头像" @click="changeImage" />
        </el-tooltip>

        <input style="display: none" accept="image/*" ref="inputFile" type="file" />
      </template>
      <user-info></user-info>
    </el-card>
  </div>
</template>
<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
let useUserStore = proxy.$store.user.useUserStore();
let { tokenObj } = toRefs(useUserStore);

const inputFile = ref();
const dialogVisible = ref(false);
const imgUrl = ref(null);
const corpper = ref();
const base64Img = ref();
const visible = ref(false);
const saveImgLoading = ref(false);

onMounted(() => {
  inputFile.value.onchange = (e) => {
    const file = e.target.files[0];
    let isGo = proxy.fileLimited(file, 1);

    if (!isGo) {
      inputFile.value.value = '';
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      imgUrl.value = e.target.result;
      dialogVisible.value = true;
    };
    reader.readAsDataURL(file);
  };
});
const timeId = ref();
const cropImage = () => {
  nextTick(() => {
    clearTimeout(timeId.value);
    timeId.value = setTimeout(() => {
      corpper.value.getCropData((data) => {
        base64Img.value = data;
      });
    }, 300);
  });
};
const saveAvatar = async () => {
  saveImgLoading.value = true;
  let blob = proxy.b64toBlob(base64Img.value.split(',')[1], 'image/png');
  const formData = new FormData();

  formData.append('file', blob);
  let res = await proxy.$api.user.change_avatar(formData);
  if (res.status === 0) {
    tokenObj.value.user.avatar = base64Img.value;
    dialogVisible.value = false;
    proxy.submitOk('保存成功');
  }
  saveImgLoading.value = false;
};
const handleClose = () => {
  dialogVisible.value = false;
};

const changeImage = () => {
  inputFile.value.click();
};
nextTick(() => {
  setTimeout(() => {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
    }, 1500);
  }, 300);
});
</script>
<style scoped lang="scss">
.label {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #566a7f;
}

//.inputs {
//  display: flex;
//  flex-wrap: wrap;
//}
.dialog-container {
  display: flex;
  height: 100%;
  padding: 20px 16px;

  .corpper {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 300px;
  }
}

@media screen and (max-width: 768px) {
  //.my-input {
  //  width: 100%;
  //}
  .dialog-container {
    flex-direction: column;

    .corpper {
      width: 100%;
    }

    .tools {
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-top: 1px solid #99a2aa;
      padding: 10px;
      margin: 10px 0 0 0;

      img {
        width: 50%;
        height: auto;
        border-radius: 50%;
      }
    }
  }
}

@media screen and (min-width: 768px) {
  //.my-input {
  //  width: 50%;
  //}
  .dialog-container {
    flex-direction: row;

    .corpper {
      width: 50%;
    }

    .tools {
      width: 50%;
      display: flex;
      align-items: center;
      flex-direction: column;
      height: 300px;

      img {
        width: 50%;
        height: auto;
        border-radius: 50%;
      }
    }
  }
}
</style>
