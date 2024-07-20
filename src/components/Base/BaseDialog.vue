<template>
  <div class="dialog w-full h-full" style="position: absolute; width: 100%; height: 100%; margin: 0; left: 0; bottom: 0; z-index: 9999999" :style="computedPadding">
    <el-dialog v-bind="$attrs">
      <div style="height: 100%; overflow: auto">
        <slot></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    padding: {
      type: String,
      required: false,
      default: '10px',
    },
  },

  computed: {
    computedPadding() {
      return {
        padding: this.padding,
      };
    },
  },
  watch: {
    // $attrs: {
    //   handler(newValue, oldValue) {
    //     console.log(newValue.modelValue);
    //     // 在 $attrs 变化时执行逻辑
    //   },
    //   deep: true, // 如果 $attrs 内部有对象或数组，需要设置 deep: true
    // },
    // // 其他 watch 配置
  },
};
</script>
<style scoped lang="scss">
.dialog {
  :deep(.el-dialog) {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  :deep(.el-overlay-dialog) {
    position: static;
    height: 100%;
  }
  :deep(.el-overlay) {
    position: static;
    background-color: #fff;
  }
  :deep(.el-dialog__body) {
    padding: 0;
    height: calc(100% - 54px);
  }
}
</style>
