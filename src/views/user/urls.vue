<template>
  <div class="main-container">
    <base-dialog v-if="dialogVisible" v-model="dialogVisible" title="页面修改" :before-close="handleClose">
      <url-page :row="itemUrl"></url-page>
    </base-dialog>
    <div class="view-div">
      <div style="padding: 10px">
        <el-button type="primary" @click="addItemUrl">新增页面</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column label="页面ID">
          <template #default="scope">
            <el-tag>
              {{ scope.row.id }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="页面标题">
          <template #default="scope">
            <el-tag>
              {{ scope.row.meta.title }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="父页面ID">
          <template #default="scope">
            <el-tag :type="scope.row.parentid ? '' : 'info'">
              {{ scope.row.parentid ? scope.row.parentid : '无' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="icon" width="80" align="center">
          <template #default="scope">
            <div style="width: 25px; margin: 0 auto">
              <component :is="scope.row.icon" v-if="scope.row.icon" />
              <el-tag v-else type="info">无</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="path" label="访问路径" align="center" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.children.length == 0 && scope.row.path ? '' : 'info'">{{ scope.row.children.length == 0 && scope.row.path ? scope.row.path : '无' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle @click="editUrl(scope.row)" />
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
import { Delete, Edit } from '@element-plus/icons-vue';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const tableData = ref();
const itemUrl = ref();
const dialogVisible = ref(false);

const initData = () => {
  proxy.$api.role.urls().then((res) => {
    tableData.value = res.data;
  });
};
initData();
const addItemUrl = () => {
  proxy.$api.role
    .change_url({
      url: {
        meta: {
          title: '新页面',
          sort: '',
          component: '',
          isParentView: 0,
          isNewPage: 0,
        },
      },
    })
    .then((res) => {
      proxy.$message.success('添加成功');
      initData();
    });
};
const handleClose = () => {
  initData();
  dialogVisible.value = false;
};
const editUrl = (row) => {
  dialogVisible.value = true;
  itemUrl.value = row;
};
const confirmDelete = (id) => {
  proxy.$api.role.deleteUrl({ id }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
      initData();
    }
  });
};
</script>

<style lang="scss" scoped></style>
