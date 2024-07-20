<template>
  <div style="height: 100%; padding: 10px; display: flex; flex-direction: column">
    <div style="width: 100%" v-if="data.children.length > 0">
      <div>
        <el-text type="warning">温馨提示 : 该页面有子页面,所以为父页面,有一些值不能修改,已经自动设置为默认值</el-text>
      </div>
      <div style="margin: 5px 0">
        <el-text type="warning">温馨提示 : 之前设置的值已经不再起作用,不能修改的选项,将采用系统默认值</el-text>
      </div>
    </div>
    <base-dialog v-if="dialogVisible" v-model="dialogVisible" title="Icon选择" :before-close="handleClose" :padding="'0px'">
      <h3 style="padding: 10px">请点击你想要的icon</h3>
      <div style="padding: 10px; display: flex; flex-wrap: wrap">
        <div v-for="(value, key) in Icons" :key="key" style="text-align: center; padding: 5px; cursor: pointer" class="icon-width">
          <component :is="value" style="color: #409eff" @click="pointIcon(key)" />
        </div>
      </div>
    </base-dialog>
    <div>
      <el-form label-position="top">
        <el-form-item label="Title">
          <el-input v-model="data.meta.title" />
        </el-form-item>
        <el-form-item label="组件名">
          <el-input v-model="data.meta.component" :disabled="data.children.length > 0" />
        </el-form-item>
        <el-form-item label="访问地址">
          <el-input v-model="data.path" :disabled="data.children.length > 0" />
        </el-form-item>
        <el-form-item label="是否在侧边展示">
          <el-switch v-model="data.isshow" />
        </el-form-item>
        <el-text type="warning">温馨提示 : 是否在新窗口打开,父类不生效</el-text>
        <el-form-item label="是否在新窗口打开">
          <el-switch v-model="data.meta.isNewPage" />
        </el-form-item>
        <el-form-item label="页面是否显示导航栏和侧边栏">
          <el-switch v-model="data.meta.isParentView" :disabled="data.children.length > 0" />
        </el-form-item>
        <el-form-item label="图标">
          <el-button style="margin-bottom: 6px" @click="checkIcon" type="primary" round size="small">选择ICON</el-button>
          <el-input v-model="data.icon" />
        </el-form-item>
        <el-form-item label="排序(数字越小越靠前)">
          <el-input type="number" v-model="data.meta.sort" />
        </el-form-item>
        <el-form-item label="重定向地址(只能写本站已经存在的)">
          <el-input v-model="data.redirect" :disabled="data.children.length > 0" />
        </el-form-item>
        <el-form-item label="父页面ID">
          <el-select v-model="data.parentid" placeholder="父页面ID">
            <el-option label="无" :value="''"></el-option>
            <el-option v-for="item in urls" :key="item.id" :label="item.id + '-' + item.meta.title" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 100%; padding: 5px 0 15px 0">
      <div style="width: 300px; margin: 0 auto">
        <el-button style="width: 100%" type="primary" @click="saveUrls">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
import * as Icons from '@element-plus/icons-vue';
const urls = ref([]);
const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
});
const data = ref();

data.value = { ...props.row };
data.value.meta = { ...props.row.meta };
if (data.value.meta.isParentView === 1) {
  data.value.meta.isParentView = true;
} else {
  data.value.meta.isParentView = false;
}
if (data.value.meta.isNewPage === 1) {
  data.value.meta.isNewPage = true;
} else {
  data.value.meta.isNewPage = false;
}
if (data.value.parentid === null) {
  data.value.parentid = '';
}
const dialogVisible = ref();
function parseUrlsToOne(Urls) {
  let arr = [];
  Urls.forEach((item) => {
    arr.push(item);
    arr = arr.concat(parseUrlsToOne(item.children));
  });
  return arr;
}
proxy.$api.role.urls().then((r) => {
  urls.value = parseUrlsToOne(r.data);
  urls.value = urls.value.filter((item) => {
    let flag = true;
    data.value.children.forEach((i) => {
      if (i.id === item.id) {
        flag = false;
      }
    });
    if (item.id !== props.row.id && flag) {
      delete item.children;
      return props.row;
    }
  });
});
const handleClose = () => {
  dialogVisible.value = false;
};
const checkIcon = () => {
  dialogVisible.value = true;
};

const pointIcon = (key) => {
  data.value.icon = key;

  handleClose();
};
const saveUrls = () => {
  let postData = { ...data.value };
  postData.children = [...data.value.children];
  postData.meta = { ...data.value.meta };
  //判断path  是不是/开头
  if (postData.path && postData.path[0] !== '/') {
    proxy.$message.error('path必须以/开头');
    return;
  }
  if (postData.redirect && postData.redirect[0] !== '/') {
    proxy.$message.error('redirect必须以/开头');
    return;
  }
  // 判断component 是不是/开头，如果有  就去掉/
  if (postData.meta.component && postData.meta.component[0] === '/') {
    postData.meta.component = postData.meta.component.slice(1);
  }
  if ((!postData.path || !postData.meta.component) && postData.parentid && postData.children.length === 0) {
    proxy.$message.error('作为子页面必须有组件名和访问路径');
    return;
  }
  if (postData.parentid === '') {
    postData.parentid = null;
  }
  if (postData.meta.isParentView === true) {
    postData.meta.isParentView = 1;
  } else {
    postData.meta.isParentView = 0;
  }
  if (postData.isshow === true) {
    postData.isshow = 1;
  } else {
    postData.isshow = 0;
  }
  if (postData.meta.isNewPage === true) {
    postData.meta.isNewPage = 1;
  } else {
    postData.meta.isNewPage = 0;
  }
  delete postData.children;
  proxy.$api.role.change_url({ url: postData }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success('修改成功');
      props.row.meta = data.value.meta;
      props.row.icon = data.value.icon;
      props.row.path = data.value.path;
      props.row.isshow = data.value.isshow;
      props.row.isParentView = data.value.isParentView;
      props.row.parentid = data.value.parentid;
      props.row.redirect = data.value.redirect;
    }
  });
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .icon-width {
    width: 20%;
  }
}
@media screen and (min-width: 768px) {
  .icon-width {
    width: 5%;
  }
}
</style>
