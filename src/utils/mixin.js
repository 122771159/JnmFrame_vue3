// 抽取公用的实例 - 操作成功与失败消息提醒内容等
export default {
  data() {
    return {};
  },

  methods: {
    // 操作成功消息提醒内容
    submitOk(msg, cb) {
      this.$notify({
        title: '成功',
        message: msg || '操作成功！',
        type: 'success',
        duration: 2000,
        onClose: function () {
          cb && cb();
        },
      });
    },

    // 操作失败消息提醒内容
    submitFail(msg) {
      this.$message({
        message: msg || '网络异常，请稍后重试！',
        type: 'error',
      });
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;

      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
    },
    // 限制上传的文件大小和类型
    fileLimited(file, size) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.submitFail('只能上传 JPG 或 PNG 格式的图片');
        return false;
      }

      // 验证文件大小（假设限制为 2MB）

      const maxSize = size * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.submitFail('文件大小不能超过 ' + size + 'MB');

        return false;
      }
      return true;
    },
  },
};
