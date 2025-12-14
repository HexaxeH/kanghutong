<template>
  <view class="home-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-space"></view>
    <view v-if="elders.length" class="elder-list">
      <view v-for="(elder, index) in elders" :key="index" class="card-container">
        <image class="kuang kuang-top" src="/static/kuang1.png" mode="scaleToFill"></image>
        <image class="kuang kuang-bottom" src="/static/kuang2.png" mode="scaleToFill"></image>
        <view class="elder-card">
          <view class="elder-info">
            <view class="avatar-wrapper">
              <image class="elder-avatar" :src="defaultAvatar" mode="aspectFill"></image>
            </view>
            <view class="elder-details">
              <text class="elder-relation">{{ elder.relation }}</text>
              <text class="elder-name">姓名：{{ elder.oldName }}&nbsp;,&nbsp;{{ elder.year }}</text>
            </view>
          </view>
          <view class="locate-btn" @click="locateElder(elder)">一键定位</view>
        </view>
      </view>
    </view>

    <view v-else class="welcome-container">
      <image class="welcome-logo" src="/static/guard.png" mode="aspectFit"></image>
      <text class="empty-text">暂无守护对象，快去添加吧</text>
      <button class="primary-btn" @click="goToAddElder">添加老人</button>
    </view>
  </view>
</template>

<script>
import { relativeMyRelative } from '../../api/homepage';
export default {
  data() {
    return {
      defaultAvatar: '/static/logo.png',
      elders: [],
      oldId: 1 // 这里需要根据实际情况设置oldId的值
    };
  },
  methods: {
    locateElder(elder) {
      // 直接使用view的点击事件
      uni.showToast({
        title: `正在定位${elder.name}...`,
        icon: 'none'
      });
      // 模拟定位功能
      setTimeout(() => {
        uni.showModal({
          title: '定位成功',
          content: `${elder.name}当前位置：小区花园`,
          showCancel: false
        });
      }, 1500);
    },
    getRelativeMyRelative () {
      relativeMyRelative(this.oldId).then(res => {
        console.log(res.data);
        this.elders = res.data;
      })
    },
    goToAddElder() {
      uni.showToast({
        title: '跳转到添加老人页面',
        icon: 'none'
      });
      // 这里可以跳转到添加老人的页面
    }
  },
  // 页面显示时，获取所有亲属关系
  onShow() {
    this.getRelativeMyRelative();
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: calc(44px + 40rpx) 32rpx 60rpx 32rpx;
}

/* 顶部状态栏占位 */
.status-bar-space {
  height: 44px;
  width: 100%;
  background-color: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.elder-list {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
  margin-top: 0;
}

.card-container {
  position: relative;
  overflow: hidden;
  padding: 6rpx;
  width: 95%;
  margin: 0 auto;
  border-radius: 48rpx;
}

.kuang {
  position: absolute;
  width: 106%;
  z-index: 0;
  display: block;
  left: -3%;
}

.kuang-top {
  top: 0;
  height: calc(100% - 40rpx);
  border-radius: 48rpx 48rpx 0 0;
}

.kuang-bottom {
  bottom: 0;
  height: 70rpx;
  width: 106%;
  border-radius: 0 0 48rpx 48rpx;
  left: -3%;
  transform: none;
  margin: 0;
  position: absolute;
  z-index: 1;
}

.elder-card {
  position: relative;
  z-index: 1;
  border-radius: 48rpx 48rpx 0 0;
  padding: 36rpx 30rpx 0;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  color: #fff;
}

.elder-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar-wrapper {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.elder-avatar {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
}

.elder-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.elder-relation {
  font-size: 40rpx;
  font-weight: bold;
}

.elder-name {
  font-size: 28rpx;
  opacity: 0.95;
}

.locate-btn {
  width: 375.25rpx;
  height: 67rpx;
  line-height: 67rpx;
  text-align: center;
  border-radius: 0 0 48rpx 48rpx;
  background-color: transparent;
  font-size: 34rpx;
  font-weight: 600;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.locate-btn:active {
  opacity: 0.85;
}

.welcome-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30rpx;
  padding: 0 60rpx;
}

.welcome-logo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 32rpx;
  padding: 40rpx;
  box-sizing: border-box;
}

.empty-text {
  font-size: 30rpx;
  color: #666;
}

.primary-btn {
  width: 360rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 999rpx;
  border: none;
  color: #fff;
  background-color: #3fb59f;
  font-size: 30rpx;
}

.primary-btn::after {
  border: none;
}
</style>
