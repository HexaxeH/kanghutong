<template>
  <view class="tab-bar">
    <view class="tab-bar-border"></view>
    <view class="tab-bar-item" v-for="(item, index) in list" :key="index" @click="switchTab(item, index)" :class="{ 'special-item-wrapper': item.special }">
      <template v-if="item.special">
        <view class="special-circle">
          <image class="special-icon" :src="item.iconPath" />
        </view>
        <view class="special-text">{{ item.text }}</view>
      </template>
      <template v-else>
        <image class="tab-icon" :src="selected === index ? item.selectedIconPath : item.iconPath" />
        <view class="tab-text" :class="{ 'tab-text-active': selected === index }">{{ item.text }}</view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  selected: {
    type: Number,
    default: 0
  }
})

const list = [
  {
    pagePath: "/pages/index/index",
    iconPath: "/static/tab-home.png",
    selectedIconPath: "/static/tab-home-active.png",
    text: "首页"
  },
  {
    pagePath: "/pages/assistant/index",
    iconPath: "/static/tab-assistant.png",
    selectedIconPath: "/static/tab-assistant.png",
    text: "健康助手",
    special: true
  },
  {
    pagePath: "/pages/my/index",
    iconPath: "/static/tab-my.png",
    selectedIconPath: "/static/tab-my-active.png",
    text: "我的"
  }
]

function switchTab(item, index) {
  if (item.special) {
    // 特殊按钮（健康助手）跳转到普通页面
    uni.navigateTo({
      url: item.pagePath
    })
  } else {
    // 普通按钮跳转 TabBar 页面
    uni.switchTab({
      url: item.pagePath
    })
  }
}
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 160rpx; /* 适老化：加高高度 */
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 9999;
}

.tab-bar-border {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 2rpx;
  background-color: rgba(0, 0, 0, 0.1);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-icon {
  width: 64rpx; /* 适老化：加大图标 */
  height: 64rpx;
  margin-bottom: 8rpx;
}

.tab-text {
  font-size: 30rpx; /* 适老化：加大字体 */
  color: #909399;
  font-weight: bold;
}

.tab-text-active {
  color: #6CB5A3;
}

.special-item-wrapper {
  position: relative;
  overflow: visible; /* 允许圆圈超出 */
}

.special-circle {
  position: absolute;
  top: -25rpx; /* 向上突起 */
  left: 50%;
  transform: translateX(-50%);
  width: 160rpx;
  height: 160rpx;
  background-color: #6CB5A3;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 -4rpx 10rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.special-icon {
  width: 80rpx;
  height: 80rpx;
  /* 确保图标变为纯白色 */
  filter: brightness(0) invert(1);
}

.special-text {
  font-size: 28rpx;
  color: #6CB5A3;
  font-weight: bold;
  margin-top: 90rpx; /* 调整文字位置，避开圆圈 */
  opacity: 0; /* 根据图片，中间按钮下方似乎没有文字，或者文字隐藏。这里暂时隐藏 */
}
</style>
