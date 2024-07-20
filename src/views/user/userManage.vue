<template>
  <div class="main-container">
    <base-dialog v-if="dialogVisible" v-model="dialogVisible" title="用户编辑" :before-close="handleClose">
      <div style="padding: 20px">
        <el-form :model="form" style="width: 450px" label-position="top">
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="text" placeholder="留空不修改" />
          </el-form-item>
          <el-form-item label="是否禁用" prop="forbidden">
            <el-radio-group v-model="form.forbidden">
              <el-radio-button :label="0">正常</el-radio-button>
              <el-radio-button :label="1">禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色控制" prop="roles">
            <el-select v-model="form.roles" placeholder="选择角色" style="width: 240px">
              <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="change">修改</el-button>
        </el-form>
      </div>
    </base-dialog>
    <div class="view-div">
      <div style="padding: 10px">
        <div style="display: flex; justify-content: space-between">
          <el-button type="primary" @click="addItemUser">新增用户</el-button>
          <div>
            <el-input v-model="name_search" class="w-50 m-2" placeholder="请输入用户名搜索">
              <template #prefix>
                <el-icon style="cursor: pointer" class="el-input__icon" @click="searchUser"><search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border :default-sort="{ prop: 'create_time', order: 'descending' }">
        <el-table-column prop="id" label="用户ID" sortable>
          <template #default="scope">
            <el-tag>
              {{ scope.row.id }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template #default="scope">
            <el-tag @click="copy(scope.row.name)" style="cursor: pointer">
              {{ scope.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户名">
          <template #default="scope">
            <el-tag @click="copy(scope.row.username)" style="cursor: pointer">
              {{ scope.row.username }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="注册时间" align="center" sortable>
          <template #default="scope">
            <el-tag>
              {{ scope.row.create_time }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="forbidden" label="是否禁用" align="center" sortable>
          <template #default="scope">
            {{ scope.row.forbidden == 1 ? '禁用' : '正常' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" circle @click="editUser(scope.row.id)" />
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
import { nanoid } from 'nanoid';
import { Delete, Edit } from '@element-plus/icons-vue';
const { proxy } = getCurrentInstance();
const tableData = ref([]);
const tableDataCopy = ref([]);
import { useRoute } from 'vue-router';
const dialogVisible = ref(false);
const dialogUserId = ref(0);
const form = ref({});
const roles = ref([]);
const route = useRoute();
proxy.$api.role.roles().then((res) => {
  roles.value = res.data;
});
const init = async () => {
  let res = await proxy.$api.user.users();
  tableData.value = res.data;
  tableDataCopy.value = res.data;
};
const filterByKey = () => {
  let key = route.query.key || '';
  tableData.value = tableDataCopy.value.filter((item) => item.username.includes(key));
};
onMounted(async () => {
  await init();
  filterByKey();
});
const name_search = ref('');

const addItemUser = async () => {
  let username = nanoid() + '-null';
  let password = '123456';
  let name = '请修改姓名';
  let res = await proxy.$api.user.addUser({ username, password, name });
  if (res.status === 0) {
    proxy.$message.success(res.data);
    await init();
    filterByKey();
  }
};
// 点击复制文字
const copy = (text) => {
  var input = document.createElement('input'); // js创建一个input输入框
  input.value = text; // 将需要复制的文本赋值到创建的input输入框中
  document.body.appendChild(input); // 将输入框暂时创建到实例里面
  input.select(); // 选中输入框中的内容
  document.execCommand('Copy'); // 执行复制操作
  document.body.removeChild(input); // 最后删除实例中临时创建的input输入框，完成复制操作
  proxy.$message.success('复制成功');
};
const searchUser = () => {
  proxy.$router.push(`${route.path}?key=${name_search.value}`);
};
const confirmDelete = (id) => {
  proxy.$api.user.deleteUser({ id }).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
      init();
    }
  });
};
// 关闭dialog
const handleClose = () => {
  dialogVisible.value = false;
};
const editUser = (id) => {
  proxy.$api.user.getUser({ id }).then((res) => {
    if (res.status === 0) {
      dialogUserId.value = id;
      dialogVisible.value = true;
      form.value = res.data;
    }
  });
};
const change = () => {
  proxy.$api.user.changeUser(form.value).then((res) => {
    if (res.status === 0) {
      proxy.$message.success(res.data);
    }
  });
};
watch(
  () => route.fullPath,
  (to, form) => {
    filterByKey();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
