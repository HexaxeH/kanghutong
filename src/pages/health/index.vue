<template>
  <view class="container">
    <view class="card">
      <view class="header">
        <text class="title">基本健康信息</text>
        <text class="edit-btn" @click="toggleEdit">{{ isEditing ? '保存' : '编辑' }}</text>
      </view>

      <view class="form-item">
        <text class="label">年纪</text>
        <input 
          class="input" 
          v-model="healthInfo.age" 
          type="number" 
          :disabled="!isEditing" 
          placeholder="请输入年龄"
        />
        <text class="unit">岁</text>
      </view>

      <view class="divider"></view>

      <view class="form-item">
        <text class="label">身高</text>
        <input 
          class="input" 
          v-model="healthInfo.height" 
          type="number" 
          :disabled="!isEditing" 
          placeholder="请输入身高"
        />
        <text class="unit">cm</text>
      </view>

      <view class="divider"></view>

      <view class="form-item">
        <text class="label">体重</text>
        <input 
          class="input" 
          v-model="healthInfo.weight" 
          type="digit" 
          :disabled="!isEditing" 
          placeholder="请输入体重"
        />
        <text class="unit">kg</text>
      </view>

      <view class="divider"></view>

      <view class="form-item vertical">
        <text class="label">过敏史</text>
        <textarea 
          class="textarea" 
          v-model="healthInfo.allergies" 
          :disabled="!isEditing" 
          placeholder="无过敏史请填“无”"
          auto-height
        />
      </view>
    </view>

    <view class="tips">
      <text>请确保信息真实有效，以便在紧急情况下提供帮助。</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isEditing = ref(false)
const healthInfo = ref({
  age: '',
  height: '',
  weight: '',
  allergies: ''
})

onMounted(() => {
  // 从本地存储加载数据
  const savedInfo = uni.getStorageSync('health_info')
  if (savedInfo) {
    healthInfo.value = savedInfo
  } else {
    // 默认初始值
    healthInfo.value = {
      age: '72',
      height: '170',
      weight: '65',
      allergies: '青霉素过敏'
    }
  }
})

function toggleEdit() {
  if (isEditing.value) {
    // 保存操作
    uni.setStorageSync('health_info', healthInfo.value)
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
  }
  isEditing.value = !isEditing.value
}
</script>

<style>
.container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.edit-btn {
  color: #6CB5A3;
  font-size: 30rpx;
  padding: 10rpx 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
}

.form-item.vertical {
  flex-direction: column;
  align-items: flex-start;
}

.label {
  width: 120rpx;
  font-size: 32rpx;
  color: #333;
}

.input {
  flex: 1;
  font-size: 32rpx;
  color: #333;
  text-align: right;
  padding-right: 20rpx;
}

.unit {
  font-size: 32rpx;
  color: #666;
  width: 60rpx;
  text-align: right;
}

.textarea {
  width: 100%;
  min-height: 100rpx;
  font-size: 32rpx;
  color: #333;
  margin-top: 20rpx;
  background-color: #f9f9f9;
  padding: 20rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
}

.divider {
  height: 2rpx;
  background-color: #eee;
}

.tips {
  padding: 0 20rpx;
  color: #999;
  font-size: 26rpx;
  text-align: center;
}
</style>
