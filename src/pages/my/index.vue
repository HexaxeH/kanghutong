<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-box">
        <img class="avatar-img" src="/static/tab-my-active.png">
      </view>
      <view class="user-info">
        <text class="user-name">张大爷</text>
        <text class="user-phone">138****8888</text>
      </view>
      <view class="user-tag">
        <text>已关联子女</text>
      </view>
    </view>

    <!-- 健康数据概览 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-num">3,502</text>
        <text class="stat-label">今日步数</text>
      </view>
      <view class="divider"></view>
      <view class="stat-item">
        <text class="stat-num">120/80</text>
        <text class="stat-label">最近血压</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-grid">
      <view class="grid-item" v-for="(item, index) in menuItems" :key="index" @click="handleMenuClick(item)">
        <image class="grid-icon" :src="item.icon" mode="aspectFit" />
        <text class="grid-text">{{ item.text }}</text>
      </view>
    </view>

    <!-- 退出/切换按钮 -->
    <view class="action-btn" @click="handleSwitchRole">
      <text>切换为子女端</text>
    </view>

    <!-- 自定义TabBar -->
    <CustomTabBar :selected="2" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
import { getMyRelative } from '@/api/old.js'

const relatives = ref([])

onShow(() => {
  uni.hideTabBar()
  getRelatives()
})

async function getRelatives() {
  try {
    const res = await getMyRelative({
      oldId: 1 // 暂时硬编码，后续应从登录信息获取
    })
    if (res.code === 200) {
      relatives.value = res.data || []
    }
  } catch (e) {
    console.warn('获取亲友列表失败，已切换为静态演示数据', e)
    // 接口请求失败时的静态兜底数据
    relatives.value = [
      { relativeId: 1, relativeName: '李建国', relation: '长子', relativeTelephone: '13800138001' },
      { relativeId: 2, relativeName: '张美丽', relation: '儿媳', relativeTelephone: '13900139002' },
      { relativeId: 3, relativeName: '李小明', relation: '孙子', relativeTelephone: '13500135003' }
    ]
  }
}

const menuItems = ref([
  { icon: '/static/喜欢.png', text: '我的收藏', key: 'favorites' },
  { icon: '/static/身份信息.png', text: '健康信息', key: 'health' },
  { icon: '/static/历史账单.png', text: '亲友提醒', key: 'family' },
  { icon: '/static/邮件.png', text: '联系客服', key: 'service' },
  { icon: '/static/地址管理.png', text: '系统设置', key: 'settings' }
])

function handleMenuClick(item) {
  if (item.key === 'favorites') {
    uni.navigateTo({
      url: '/pages/favorites/index'
    })
    return
  }
  
  if (item.key === 'health') {
    uni.navigateTo({
      url: '/pages/health/index'
    })
    return
  }
  
  if (item.key === 'family') {
    uni.navigateTo({
      url: '/pages/family/index'
    })
    return
  }

  uni.showToast({
    title: `点击了：${item.text}`,
    icon: 'none'
  })
}

function handleSwitchRole() {
  uni.showModal({
    title: '提示',
    content: '确定要切换到子女端吗？',
    success: function (res) {
      if (res.confirm) {
        uni.showToast({ title: '正在切换...', icon: 'none' })
      }
    }
  })
}
</script>

<style>
.container {
  padding: 30rpx;
  padding-bottom: 200rpx; /* 30rpx + 160rpx + extra */
  background-color: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 用户卡片 */
.user-card {
  background-color: #6CB5A3;
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  color: #fff;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(108, 181, 163, 0.3);
}

.avatar-box {
  width: 120rpx;
  height: 120rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #6CB5A3;
  flex-shrink: 0;
  border: 2rpx solid #6CB5A3; /* 给AI头像加个绿色边框，类似设计图 */
}

.avatar-img {
  width: 80%;
  height: 80%;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-name { font-size: 40rpx; font-weight: bold; margin-bottom: 10rpx; }
.user-phone { font-size: 32rpx; opacity: 0.9; }

.user-tag {
  background-color: rgba(255,255,255,0.2);
  padding: 8rpx 16rpx;
  border-radius: 30rpx;
  font-size: 24rpx;
}

/* 数据概览 */
.stats-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-num { font-size: 40rpx; font-weight: bold; color: #333; margin-bottom: 10rpx; }
.stat-label { font-size: 28rpx; color: #666; }

.divider {
  width: 2rpx;
  height: 60rpx;
  background-color: #eee;
}

/* 亲友列表 */
.relatives-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
  border-left: 8rpx solid #6CB5A3;
  padding-left: 16rpx;
}

.relative-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f5f5f5;
}

.relative-item:last-child {
  border-bottom: none;
}

.relative-info {
  display: flex;
  align-items: center;
}

.relative-name {
  font-size: 32rpx;
  color: #333;
  margin-right: 16rpx;
}

.relative-relation {
  font-size: 26rpx;
  color: #999;
}

.relative-phone {
  display: flex;
  align-items: center;
  color: #6CB5A3;
  font-size: 30rpx;
}

.phone-icon {
  width: 36rpx;
  height: 36rpx;
  margin-left: 10rpx;
}

/* 菜单网格 */
.menu-grid {
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx 0;
  margin-bottom: 40rpx;
}

.grid-item {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
}

.grid-icon {
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 16rpx;
}

.grid-text {
  font-size: 30rpx;
  color: #333;
}

/* 切换按钮 */
.action-btn {
  background-color: #fff;
  border: 2rpx solid #6CB5A3;
  color: #6CB5A3;
  text-align: center;
  padding: 24rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  font-weight: bold;
}
</style>
