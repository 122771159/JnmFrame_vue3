<template>
  <div class="main-container">
    <base-dialog v-if="dialogVisible" v-model="dialogVisible" title="权限控制" :before-close="handleClose">
      <role-perms :id="ref_id"></role-perms>
    </base-dialog>
    <base-dialog v-if="urlsDialogVisible" v-model="urlsDialogVisible" title="页面控制" :before-close="urlHandleClose">
      <role-urls :id="ref_id"></role-urls>
    </base-dialog>
    <div style="position: relative" class="view-div">
      <div style="padding: 10px">
        <el-popover :visible="visible" placement="bottom" :width="160">
          <div style="padding: 0 3px 10px 0">
            <el-input v-model="role_name" placeholder="请输入角色名称" style="width: 100%" />
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="visible = false">取消</el-button>
            <el-button size="small" type="primary" @click="saveRole">新增</el-button>
          </div>
          <template #reference>
            <el-button type="primary" @click="visible = true">新增角色</el-button>
          </template>
        </el-popover>
      </div>
      <el-table v-has-perm="'sys:user:role'" :data="roleTableData" style="width: 100%">
        <el-table-column label="角色ID" width="100" align="center">
          <template #default="scope">
            <el-tag>
              {{ scope.row.id }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色名">
          <template #default="scope">
            <el-input v-model="scope.row.name" placeholder="请输入角色名称" style="width: 100%" @blur="changeNameRole(scope.row.name, scope.row.id)" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" bg text @click="changePerms(scope.row.id)">修改权限</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" bg text @click="changeUrls(scope.row.id)">修改页面</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
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
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const roleTableData = ref([]);
const ref_id = ref(null);
const role_name = ref(null);
const dialogVisible = ref(false);
const visible = ref(false);
const urlsDialogVisible = ref(false);
const item = Array(100)
  .fill()
  .map((_, index) => `Item ${index + 1}`);
proxy.$api.role.roles().then((res) => {
  roleTableData.value = res.data;
});
const changePerms = (id) => {
  ref_id.value = id;
  dialogVisible.value = true;
};
const changeUrls = (id) => {
  ref_id.value = id;
  urlsDialogVisible.value = true;
};
const handleClose = () => {
  dialogVisible.value = false;
};
const urlHandleClose = () => {
  urlsDialogVisible.value = false;
};
const confirmDelete = (id) => {
  proxy.$api.role.delete_role({ id }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
      proxy.$api.role.roles().then((res) => {
        roleTableData.value = res.data;
      });
    }
  });
};
const saveRole = () => {
  proxy.$api.role.addRole({ name: role_name.value }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);

      proxy.$api.role.roles().then((res) => {
        roleTableData.value = res.data;
      });
    }
  });
  visible.value = false;
  console.log(role_name.value);
};
const changeNameRole = (name, id) => {
  proxy.$api.role.changeNameRole({ name, id }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
    }
  });
};
</script>

<style lang="scss" scoped>
.hidden {
  overflow: hidden;
}
.auto {
  overflow: auto;
}
</style>
