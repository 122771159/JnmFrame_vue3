<template>
  <div class="w-full h-full container">
    <div class="tab-left click-none" @click="scrollLeft">
      <el-icon style="height: 100%"><ArrowLeft /></el-icon>
    </div>

    <div ref="tabs" class="tabs">
      <div ref="tab" class="tab click-none bg-c-color" v-for="(item, index) in all" @click="clickTab(item.left, item.right, index)">
        <div style="white-space: nowrap; display: flex">
          <div
            style="
              font-size: 14px;
              white-space: nowrap;
              height: 100%;
              transition:
                padding-right 0.3s ease,
                padding-left 0.3s ease;
            "
            :class="{ 'activate-tab': indexNowTab === index, 'tab-padding': index !== 0 && indexNowTab !== index, 'tab-font-padding': index === 0 || indexNowTab === index }">
            {{ item.name }}
          </div>

          <el-icon v-if="index !== 0 && indexNowTab !== index" size="12" class="tab-close click-none" style="height: 100%"><Close @click="close_tab(index)"></Close> </el-icon>
        </div>
      </div>
    </div>
    <div class="tab-right click-none" @click="scrollRight">
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const tabs = ref();
const tab = ref();
const all = reactive([]);
const scrollInterval = ref(null);
import { useRoute } from 'vue-router';
const route = useRoute();
// 定义当前的激活的索引
const indexNowTab = ref(1111);
// 监听路由变化

const scrollLeft = () => {
  slowScroll(tabs.value, -200, 80);
};
const scrollRight = () => {
  slowScroll(tabs.value, 200, 80);
};
const addItem = (route, path) => {
  all.push({
    name: route.meta.title,
    left: 0,
    right: 0,
    width: 0,
    marginRight: 0,
    marginLeft: 0,
    fullPath: route.meta.fullPath,
    path: path,
  });
  nextTick(() => {
    let length = tab.value.length - 1;
    const lastTab = tab.value[length];
    let domWight = lastTab.offsetWidth;
    let marginLeft = parseInt(window.getComputedStyle(lastTab).marginLeft);
    let marginRight = parseInt(window.getComputedStyle(lastTab).marginRight);
    const left = lastTab.offsetLeft;
    const right = left + domWight + marginRight + marginLeft;
    addScroll(right);
    all[length].left = left;
    all[length].right = right;
    all[length].width = domWight;
    all[length].marginLeft = marginLeft;
    all[length].marginRight = marginRight;
    indexNowTab.value = length;
  });
};
function addScroll(right) {
  if (scrollInterval.value != null) {
    return;
  }
  const scrollLeft = tabs.value.scrollLeft;
  // 输出tabs 的宽度
  const tabsWight = Math.floor(tabs.value.offsetWidth);
  let outWidth = right - scrollLeft;
  if (outWidth <= tabsWight) {
    return false;
  } else {
    let scrollAmount = 0; //一共多少，计数用
    let step = 2; //每秒走多少
    scrollInterval.value = setInterval(function () {
      tabs.value.scrollLeft += step;
      scrollAmount += step;
      if (Math.abs(scrollAmount) >= Math.abs(outWidth)) {
        clearInterval(scrollInterval.value);
        scrollInterval.value = null;
      }
    }, 1);
  }
}
function slowScroll(container, distance, interval) {
  let scrollAmount = 0;
  let step = distance / interval;

  const scrollInterval = setInterval(function () {
    container.scrollLeft += step;
    scrollAmount += step;

    if (Math.abs(scrollAmount) >= Math.abs(distance)) {
      clearInterval(scrollInterval);
    }
  }, 1);
}

const clickTab = (left, right, index, newpath = false) => {
  if (!!newpath) {
    // 如果有新的path 则替换
    all[index].path = newpath;
  }
  if (scrollInterval.value != null) {
    return false;
  }
  let length = all.length;
  if (indexNowTab.value === index) {
    return false;
  }

  proxy.$router.push(all[index].path);
  indexNowTab.value = index;
  let tabsWidth = tabs.value.offsetWidth; // tabs的宽度
  let scrollLeft = tabs.value.scrollLeft; // 滚动条的位置
  let middleLeft = scrollLeft + tabsWidth / 2;

  if (left < middleLeft) {
    // 在中间左边
    // 获取前一个元素
    let prevTab;
    if (index === 0) {
      prevTab = all[index];
    } else {
      prevTab = all[index - 1];
    }

    if (prevTab.left < scrollLeft) {
      // 使滚动条移动到left位置处
      let distance = scrollLeft - prevTab.left;
      let scrollAmount = 0;
      let step = -2;
      scrollInterval.value = setInterval(function () {
        tabs.value.scrollLeft += step;
        scrollAmount += step;
        if (Math.abs(scrollAmount) >= Math.abs(distance)) {
          clearInterval(scrollInterval.value);
          scrollInterval.value = null;
        }
      }, 1);
    }
  } else {
    let nextTab;
    if (length - 1 === index) {
      nextTab = all[index];
    } else {
      nextTab = all[index + 1];
    }

    if (nextTab.right - scrollLeft > tabsWidth) {
      // 移动滚动条使right全部显示出来
      let distance = nextTab.right - scrollLeft - tabsWidth;
      let scrollAmount = 0;
      let step = 2;
      scrollInterval.value = setInterval(function () {
        tabs.value.scrollLeft += step;
        scrollAmount += step;
        if (Math.abs(scrollAmount) >= Math.abs(distance)) {
          clearInterval(scrollInterval.value);
          scrollInterval.value = null;
        }
      }, 1);
    }
  }
};

const close_tab = (index) => {
  if (index < indexNowTab.value) {
    indexNowTab.value -= 1;
  }
  event.stopPropagation();

  for (let i = all.length - 1; i >= index; i--) {
    if (i === index) {
      break;
    }
    if (index === all.length - 1) {
      break;
    }
    all[i].left = all[i - 1].left;
    all[i].right = all[i].left + all[i].width;
  }
  all.splice(index, 1);
  // clickTab(all[index - 1].left, all[index - 1].right, index - 1);
};
const num = ref(0);
watch(
  () => route,
  (to, from) => {
    let route = { ...to };
    let path = route.fullPath;

    if (num.value === 0) {
      num.value += 1;
      addItem(
        {
          meta: {
            title: '首页',
            fullPath: '/user/index',
          },
        },
        '/user/index',
      );
    }
    if (route.meta.fullPath) {
      let index = all.findIndex((item) => {
        if (item.name === route.meta.title && item.fullPath === route.meta.fullPath) {
          return true;
        }
      });
      if (index !== -1) {
        nextTick(() => {
          clickTab(all[index].left, all[index].right, index, path);
        });
        return false;
      }

      addItem(route, path);
    }
  },
  { deep: true, immediate: true }, // 如果要监视嵌套的路由变化，需要添加 deep: true
);
</script>
<style scoped lang="scss">
* {
  user-select: none;
}
$len: 40px;
.click-none {
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  -webkit-user-select: none;
  user-select: none;
  -moz-user-select: none;
}
.container {
  position: relative;
  .tabs {
    position: absolute;
    left: $len;
    right: $len;
    overflow-x: auto;
    overflow-y: hidden;
    height: 32px;
    display: flex;
    align-content: center;
    .tab {
      color: var(--tab-color);
      cursor: pointer;
      height: 32px;
      border-radius: 4px;
      padding: 6px 10px;
      display: flex;
      align-content: center;
      justify-content: space-between;
      margin-right: 5px;
    }
  }
  .tabs::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }
  .tab-left {
    position: absolute;
    left: 0;
    height: 32px;
    width: $len;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  .tab-right {
    position: absolute;
    right: 0;
    height: 32px;
    width: $len;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
}
.tab-close {
  color: #1e9fff;
}
.tab-close:hover {
  color: red;
}
.activate-tab {
  color: #f16702;
  font-weight: 600;
}
.tab-padding {
  padding-right: 15px;
}
.tab-font-padding {
  padding-left: 13.5px;
  padding-right: 13.5px;
}
</style>
