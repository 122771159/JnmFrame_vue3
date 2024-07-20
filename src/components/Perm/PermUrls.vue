<template>
  <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 10px">
    <div style="width: 100%">
      <div style="padding: 10px 0"><el-text type="primary">一行一个地址</el-text></div>
      <el-input v-model="textarea" :rows="10" type="textarea" placeholder="Please input 一行一个地址" />
    </div>
    <div style="width: 150px">
      <el-button style="width: 100%" type="primary" @click="saveUrls">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const props = defineProps({
  perm: {
    type: Object,
    required: true,
  },
});

const textarea = ref('');
let text = '';
props.perm[0].url.forEach((item) => {
  text = text + item + '\n';
});
textarea.value = text;
const saveUrls = () => {
  //将文字转为数组，换行符分割
  const urls = textarea.value.split('\n');
  //去除空格
  urls.forEach((item, index) => {
    urls[index] = item.trim();
    if (urls[index] === '') {
      urls.splice(index, 1);
    }
  });
  proxy.$api.role.changePerm({ id: props.perm[0].id, url: JSON.stringify(urls) }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success('修改成功');
      props.perm[0].url = urls;
    }
  });
};
</script>

<style lang="scss" scoped></style>
