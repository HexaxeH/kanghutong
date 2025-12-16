<template>
  <view class="container">
    <view class="empty-state" v-if="favorites.length === 0">
      <image src="/static/3.png" class="empty-icon" mode="aspectFit" />
      <text>暂无收藏内容</text>
    </view>
    
    <view class="favorite-list" v-else>
      <view class="favorite-item" v-for="(item, index) in favorites" :key="index">
        <view class="item-content">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-date">{{ item.date }}</text>
        </view>
        <view class="item-type">
          <text>{{ item.type === 'video' ? '视频' : '文章' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const favorites = ref([
  { title: '如何科学预防高血压？专家给出了这5点建议', date: '2023-10-25', type: 'article' },
  { title: '糖尿病患者的饮食红黑榜，建议收藏！', date: '2023-10-22', type: 'article' },
  { title: '入冬了，老年人晨练需要注意什么？', date: '2023-10-18', type: 'article' },
  { title: '8分钟居家关节操，跟着做就对了', date: '2023-10-15', type: 'video' },
  { title: '心脏不舒服？出现这些症状要警惕', date: '2023-10-10', type: 'article' }
])
</script>

<style>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  color: #999;
}
.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}
.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.favorite-item {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-right: 20rpx;
}
.item-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
}
.item-date {
  font-size: 24rpx;
  color: #999;
}
.item-type {
  font-size: 22rpx;
  color: #6CB5A3;
  background-color: rgba(108, 181, 163, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  white-space: nowrap;
}
</style>
