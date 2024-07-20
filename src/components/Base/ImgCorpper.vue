<template>
  <div style="width: 100%; height: 100%">
    <vueCropper
      style="width: 100%; height: 100%"
      ref="cropper"
      v-bind="$attrs"
      :img="image"
      :outputSize="option.outputSize"
      :outputType="option.outputType"
      :info="option.info"
      :canScale="option.canScale"
      :autoCrop="option.autoCrop"
      :autoCropWidth="option.autoCropWidth"
      :autoCropHeight="option.autoCropHeight"
      :fixedBox="option.fixedBox"
      :fixed="option.fixed"
      :fixedNumber="option.fixedNumber"
      :canMove="option.canMove"
      :canMoveBox="option.canMoveBox"
      :original="option.original"
      :centerBox="option.centerBox"
      :infoTrue="option.infoTrue"
      :full="option.full"
      :enlarge="option.enlarge"
      :mode="option.mode">
    </vueCropper>
  </div>
</template>

<script>
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';

export default {
  props: {
    image: String,
  },
  components: {
    VueCropper,
  },
  data() {
    return {
      option: {
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式 jpeg, png, webp
        info: true, // 裁剪框的大小信息
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例，这个如果设置为true，截图框会是固定比例缩放的，如果设置为false，则截图框的狂宽高比例就不固定了
        fixedNumber: [1, 1], // 截图框的宽高比例 [ 宽度 , 高度 ]
        canMove: true, // 上传图片是否可以移动
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        full: true, // 是否输出原图比例的截图
        enlarge: '1', // 图片根据截图框输出比例倍数
        mode: 'contain', // 图片默认渲染方式 contain , cover, 100px, 100% auto
      },
    };
  },
  mounted() {
    const entries = Object.entries(this.$refs.cropper);
    for (const [key, value] of entries) {
      this[key] = value;
      // console.log(key);
    }
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.$refs.cropper.reload();
    },
  },
};

// function handleResize() {
//   cropper.value.reload();
// }
// const exposeInstance = ref({});
// onMounted(() => {
//   window.addEventListener('resize', handleResize);
// });
// defineExpose(cropper.value);
</script>

<style scoped lang="scss">
.vue-cropper {
  background-image: none;
  background-color: #000;
}
</style>
