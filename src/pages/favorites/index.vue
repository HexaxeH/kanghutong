<template>
  <view class="container">
    <view class="header">
      <text class="title">我的常用地址</text>
      <text class="subtitle">点击地址可查看地图</text>
    </view>

    <!-- Address List -->
    <view class="address-list">
      <view class="address-item" v-for="(item, index) in addressList" :key="index" @click="openLocation(item)">
        <view class="item-left">
          <text class="item-name">{{ item.name || '未知地点' }}</text>
          <text class="item-address">{{ item.address }}</text>
        </view>
        <view class="item-right" @click.stop="deleteAddress(index)">
          <text class="delete-btn">删除</text>
        </view>
      </view>
      
      <!-- Empty State -->
      <view class="empty-state" v-if="addressList.length === 0">
        <text class="empty-text">暂无收藏地址</text>
      </view>
    </view>

    <!-- Add Button -->
    <view class="footer-btn">
      <button class="add-btn" @click="addAddress">
        <text class="plus-icon">+</text>
        <text>添加新地址</text>
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const addressList = ref([])

onShow(() => {
  loadAddresses()
})

function loadAddresses() {
  const stored = uni.getStorageSync('favorite_addresses')
  if (stored) {
    try {
      addressList.value = JSON.parse(stored)
    } catch (e) {
      console.error(e)
      addressList.value = []
    }
  }
}

function saveAddresses() {
  uni.setStorageSync('favorite_addresses', JSON.stringify(addressList.value))
}

function addAddress() {
  uni.chooseLocation({
    success: function (res) {
      // res: name, address, latitude, longitude
      if (!res.name && !res.address) return // 没选
      
      const newAddr = {
        name: res.name || '标记位置',
        address: res.address || '',
        latitude: res.latitude,
        longitude: res.longitude
      }
      
      addressList.value.push(newAddr)
      saveAddresses()
      
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      })
    },
    fail: function(err) {
      // 用户取消不用提示错误
      if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
         // 如果是在模拟器上可能不支持，或者没权限
         uni.showToast({
           title: '无法打开地图',
           icon: 'none'
         })
      }
    }
  });
}

function deleteAddress(index) {
  uni.showModal({
    title: '提示',
    content: '确定要删除这个地址吗？',
    success: function (res) {
      if (res.confirm) {
        addressList.value.splice(index, 1)
        saveAddresses()
        uni.showToast({
          title: '已删除',
          icon: 'none'
        })
      }
    }
  })
}

function openLocation(item) {
  uni.openLocation({
    latitude: item.latitude,
    longitude: item.longitude,
    name: item.name,
    address: item.address,
    scale: 18
  })
}
</script>

<style>
.container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
  box-sizing: border-box;
  padding-bottom: 150rpx;
}

.header {
  margin-bottom: 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.subtitle {
  font-size: 26rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.address-item {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03);
}

.item-left {
  flex: 1;
  margin-right: 20rpx;
}

.item-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.item-address {
  font-size: 26rpx;
  color: #666;
  line-height: 1.4;
}

.item-right {
  padding: 10rpx;
}

.delete-btn {
  font-size: 26rpx;
  color: #FF5252;
  padding: 10rpx 20rpx;
  background-color: #FFF0F0;
  border-radius: 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 100rpx;
}

.empty-text {
  color: #999;
  font-size: 30rpx;
}

.footer-btn {
  position: fixed;
  bottom: 40rpx;
  left: 30rpx;
  right: 30rpx;
}

.add-btn {
  background-color: #6CB5A3;
  color: #fff;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  font-size: 32rpx;
  border: none;
}

.plus-icon {
  font-size: 40rpx;
  margin-right: 10rpx;
  line-height: 1;
  margin-top: -4rpx;
}
</style>
