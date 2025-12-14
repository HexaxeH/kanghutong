<template>
  <view class="page-header">
    <text class="header-title">{{ title }}</text>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '页面标题'
    }
  }
};
</script>

<style scoped>
.page-header {
  padding: 30rpx 0;
  margin-bottom: 10rpx;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
</style>