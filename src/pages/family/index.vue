<template>
  <view class="container">
    <view class="header">
      <text class="title">今日用药提醒</text>
      <text class="subtitle">{{ currentDate }} {{ currentWeek }}</text>
    </view>

    <!-- 用药列表 -->
    <view class="medication-list" v-if="medications.length > 0">
      <view class="medication-card" v-for="(item, index) in medications" :key="index">
        <view class="card-header">
          <view class="time-badge">
            <image src="/static/3.png" class="clock-icon" mode="aspectFit" />
            <text>{{ item.currentTime }}</text>
          </view>
          <text class="status-text" :class="{ taken: item.status === 0 }">
            {{ item.status === 0 ? '已服用' : '未服用' }}
          </text>
        </view>

        <view class="card-body">
          <view class="medicine-info">
            <text class="medicine-name">{{ item.medicationName }}</text>
            <text class="medicine-dose">每次 {{ item.dose }}</text>
          </view>
          <view class="relative-info">
            <text>提醒人：{{ item.relativeName }}</text>
          </view>
        </view>

        <view class="card-footer">
          <button 
            class="action-btn" 
            :class="{ disabled: item.status === 0 }"
            @click="handleFinish(item)"
            :disabled="item.status === 0"
          >
            {{ item.status === 0 ? '已完成' : '确认服药' }}
          </button>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <image src="/static/3.png" class="empty-icon" mode="aspectFit" />
      <text>今日暂无用药计划</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMedicationRecord, finishMedication } from '@/api/old.js'

const medications = ref([])
const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const currentDate = computed(() => {
  const date = new Date()
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const currentWeek = computed(() => {
  return weekDays[new Date().getDay()]
})

onShow(() => {
  getMedicationRecords()
})

async function getMedicationRecords() {
  try {
    const res = await getMedicationRecord({
      oldId: 1 // 暂时硬编码
    })

    if (res.data && res.data.length > 0) {
      processMedications(res.data)
    } else {
      // 如果没有数据，使用静态演示数据
      setStaticMedicationData()
    }
  } catch (e) {
    console.warn('获取用药记录失败，已切换为静态演示数据', e)
    setStaticMedicationData()
  }
}

function setStaticMedicationData() {
    // 构造静态演示数据（确保日期覆盖今日，频率包含今日）
    const todayStr = new Date().toISOString().split('T')[0]
    const nextYearStr = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    
    const staticData = [
      {
        medicationId: 101,
        medicationName: '阿司匹林肠溶片',
        dose: '1片',
        relativeName: '李建国',
        startTime: '2023-01-01', 
        endTime: nextYearStr,
        medicationFrequency: '[1,2,3,4,5,6,7]', // 每天
        remindTime: '["08:00", "20:00"]'
      },
      {
        medicationId: 102,
        medicationName: '降压药',
        dose: '0.5片',
        relativeName: '李建国',
        startTime: '2023-01-01',
        endTime: nextYearStr,
        medicationFrequency: '[1,2,3,4,5,6,7]',
        remindTime: '["09:00"]'
      },
      {
        medicationId: 103,
        medicationName: '钙片',
        dose: '1片',
        relativeName: '张美丽',
        startTime: '2023-01-01',
        endTime: nextYearStr,
        medicationFrequency: '[1,2,3,4,5,6,7]',
        remindTime: '["12:00"]'
      }
    ]
    processMedications(staticData)
}

function processMedications(data) {
  const today = new Date()
  const todayWeek = today.getDay() === 0 ? 7 : today.getDay() // 1-7 (Mon-Sun)
  const todayStr = today.toISOString().split('T')[0]

  let todaysMeds = []

  data.forEach(record => {
    // 1. 检查日期范围
    if (record.startTime > todayStr || record.endTime < todayStr) {
      return
    }

    // 2. 检查频率 (假设 frequency 是 "[1,3,5]" 格式的字符串)
    let frequency = []
    try {
      frequency = JSON.parse(record.medicationFrequency)
    } catch (e) {
      console.error('解析频率失败', record.medicationFrequency)
      return
    }

    if (!frequency.includes(todayWeek)) {
      return
    }

    // 3. 解析提醒时间
    let times = []
    try {
      times = JSON.parse(record.remindTime)
    } catch (e) {
      console.error('解析时间失败', record.remindTime)
      return
    }

    // 为每个时间点生成一条记录
    times.forEach(time => {
      todaysMeds.push({
        ...record,
        currentTime: time,
        status: 1 // 默认为未服用，实际应该从后端获取今日状态，这里暂时前端维护或默认为1
      })
    })
  })

  // 按时间排序
  todaysMeds.sort((a, b) => {
    return a.currentTime.localeCompare(b.currentTime)
  })

  medications.value = todaysMeds
}

async function handleFinish(item) {
  if (item.status === 0) return

  try {
    const res = await finishMedication({
      medicationId: item.medicationId,
      medicationStatus: 0 // 0已吃
    })

    if (res.code === 200) {
      item.status = 0
      uni.showToast({
        title: '已确认服药',
        icon: 'success'
      })
    }
  } catch (e) {
    uni.showToast({
      title: '操作失败',
      icon: 'none'
    })
  }
}
</script>

<style>
.container {
  padding: 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
  padding: 0 10rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.medication-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f5f5f5;
}

.time-badge {
  display: flex;
  align-items: center;
  background-color: #E8F5F2;
  padding: 8rpx 20rpx;
  border-radius: 30rpx;
  color: #6CB5A3;
  font-weight: bold;
  font-size: 32rpx;
}

.clock-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.status-text {
  font-size: 28rpx;
  color: #ff9800;
  font-weight: bold;
}

.status-text.taken {
  color: #6CB5A3;
}

.card-body {
  margin-bottom: 30rpx;
}

.medicine-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.medicine-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.medicine-dose {
  font-size: 30rpx;
  color: #666;
}

.relative-info {
  font-size: 26rpx;
  color: #999;
}

.action-btn {
  background-color: #6CB5A3;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  border: none;
}

.action-btn.disabled {
  background-color: #e0e0e0;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-state text {
  color: #999;
  font-size: 30rpx;
}
</style>
