<template>
  <div class="main-container">
    <base-dialog v-if="dialogVisible" v-model="dialogVisible" title="可访问地址修改" :before-close="handleClose">
      <perm-urls :perm="ref_id"></perm-urls>
    </base-dialog>
    <div class="view-div">
      <div style="padding: 10px">
        <el-button type="primary" @click="addItemPerm">新增权限</el-button>
      </div>

      <el-table :data="tableData" row-key="id" style="width: 100%" ref="table" :expandRowKeys="defaultExpandRow">
        <el-table-column type="expand">
          <template #default="props">
            <div m="4">
              <el-table :data="props.row.url">
                <el-table-column label="可访问地址">
                  <template #default="scope">
                    <el-tag> {{ scope.row }} </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="100" align="center">
          <template #default="scope">
            <el-tag>
              {{ scope.row.id }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="权限名" width="130">
          <template #default="scope">
            <el-input v-model="scope.row.perm" placeholder="请输入权限名" style="width: 100%" @blur="changePerm(scope.row.perm, scope.row.id)" />
          </template>
        </el-table-column>
        <el-table-column label="名称" width="110">
          <template #default="scope">
            <el-input v-model="scope.row.other" placeholder="请输入名称" style="width: 100%" @blur="changePermName(scope.row.other, scope.row.id)" />
          </template>
        </el-table-column>
        <el-table-column prop="other" label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="primary" size="small" bg text @click="changeUrls(scope.row.id)">修改可访问 地址</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-popconfirm title="你确定要删除吗?" @confirm="confirmDelete(scope.row.id)">
              <template #reference>
                <el-button type="danger" :icon="Delete" circle />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { Delete } from '@element-plus/icons-vue';

import { getCurrentInstance, nextTick } from 'vue';
const { proxy } = getCurrentInstance();
const tableData = ref();
const defaultExpandRow = ref([]);
const table = ref();
const ref_id = ref();
const dialogVisible = ref(false);

const dataInit = () => {
  proxy.$api.role.perms().then((res) => {
    tableData.value = res.data.map((item) => {
      item.url = JSON.parse(item.url);
      return item;
    });
  });
};
dataInit();
const confirmDelete = (id) => {
  proxy.$api.role.deletePerm({ id }).then((res) => {
    if (res.status === 0) {
      defaultExpandRow.value[0] = 0;
      proxy.$message.success('删除成功');
      dataInit();
    }
  });
};
const handleClose = () => {
  // dataInit();
  console.log(table.value);
  console.log(tableData.value);
  dialogVisible.value = false;
};
const changeUrls = (id) => {
  ref_id.value = tableData.value.filter((item) => item.id === id);
  dialogVisible.value = true;
  setTimeout(() => {
    defaultExpandRow.value[0] = id;
  }, 500);
};
const changePerm = (perm, id) => {
  proxy.$api.role.changePerm({ id, perm }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success('修改成功');
    }
  });
};
const changePermName = (other, id) => {
  proxy.$api.role.changePerm({ id, other }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success('修改成功');
    }
  });
};
const addItemPerm = () => {
  proxy.$api.role.addPerm({ perm: '修改这里', other: '修改这里', url: '[]' }).then((res) => {
    if (res.status === 0) {
      defaultExpandRow.value[0] = 0;
      proxy.$message.success('添加成功');
      dataInit();
    }
  });
};
</script>

<style lang="scss" scoped></style>
