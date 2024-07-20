<template>
  <div class="container main-container">
    <div class="card">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item" style="display: flex">
          <img style="width: 100%" :src="'https://picsum.photos/75/75?' + o" alt="iii" />
        </div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
    </div>
    <div class="card">
      <el-card class="box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
      </el-card>
    </div>
  </div>
</template>

<script setup></script>
<style scoped lang="scss">
.card {
  width: 100%;
}
.container {
  display: flex;
}
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .card {
    padding: 10px;
  }
}
@media screen and (min-width: 768px) {
  .container {
    flex-direction: row;
  }
  .card {
    padding: 0 10px;
  }
}
</style>
