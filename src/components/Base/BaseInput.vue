<template>
  <div class="my-input">
    <span class="label">{{ label }}</span>
    <div class="input">
      <el-input style="width: 100%" v-bind="$attrs" />
    </div>
  </div>
</template>
<script>
export default {
  props: ['label'],
};
</script>
<style scoped lang="scss">
.label {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #566a7f;
}
.my-input {
  display: flex;
  padding: 8px 8px;
  flex-direction: column;
  width: 100%;
}
.input {
  width: 100%;
}
</style>
