<template>
  <div style="height: 100%">
    <div style="width: 100%; height: 100%; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-between">
      <div style="width: 100%">
        <el-select multiple v-model="value" placeholder="您要选择的权限" :render-after-expand="false" style="width: 100%">
          <el-option v-for="item in data" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div style="width: 150px">
        <el-button style="width: 100%" type="primary" @click="savePerms">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const data = ref();
const value = ref([]);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
const generateData = () => {
  const data = [];
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      value: i,
      label: 'Level three 1-1-1',
    });
  }
  return data;
};
onMounted(() => {
  proxy.$api.role.permsById({ id: props.id }).then((res) => {
    value.value = res.data.map((item) => item.id);
  });

  proxy.$api.role.perms().then((res) => {
    data.value = res.data.map((item) => {
      return {
        key: item.id,
        value: item.id,
        label: item.other,
      };
    });
  });
});
//computed监听value变化

const savePerms = () => {
  proxy.$api.role.deleteAddPerms({ role_id: props.id, perms: value.value }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
    }
  });
};
</script>

<style lang="scss" scoped></style>
