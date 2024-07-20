<template>
  <div style="height: 100%">
    <div style="width: 100%; height: 100%; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-between">
      <div style="width: 100%"><el-tree-select v-model="value" :data="data" multiple :render-after-expand="false" style="width: 100%" /></div>
      <div style="width: 150px">
        <el-button style="width: 100%" type="primary" @click="saveUrls">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
import { Parseurls, ParseUrlsIds } from '../../utils/common';
const { proxy } = getCurrentInstance();
const value = ref();
const data = ref();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
proxy.$api.role.urls().then((r) => {
  // console.log(Parseurls(r.data));
  data.value = Parseurls(r.data);
});
proxy.$api.role.urls({ role_id: props.id }).then((r) => {
  value.value = ParseUrlsIds(r.data);
});
function saveUrls() {
  proxy.$api.role.deleteAddUrls({ role_id: props.id, urls: value.value }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
    }
  });
}
</script>

<style lang="scss" scoped></style>
