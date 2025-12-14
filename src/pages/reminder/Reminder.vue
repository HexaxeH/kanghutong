<template>
  <view class="reminder-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-space"></view>
    <scroll-view class="scroll-container" scroll-y @scroll="onScroll">
      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading-container">
        <uni-load-more :status="'loading'" :content-text="{ contentdown: '', contentrefresh: '加载中...', contentnomore: '' }"></uni-load-more>
      </view>
      
      <!-- 无数据状态 -->
      <view v-else-if="!isLoading && reminders.length === 0" class="empty-container">
        <view class="empty-icon">💊</view>
        <text class="empty-text">暂无提醒</text>
        <text class="empty-desc">点击右下角按钮添加提醒</text>
      </view>
      
      <view v-else class="card-list">
        <view
          v-for="(item, index) in reminders"
          :key="index"
          class="swipe-item"
        >
          <view
            class="reminder-card"
            :class="[item.status, { swiping: currentSwipeIndex === index }]"
            :style="{ transform: `translateX(${(item.swipeOffset || 0) / 2}px)` }"
            @touchstart.stop="onTouchStart($event, index)"
            @touchmove.stop="onTouchMove($event, index)"
            @touchend.stop="onTouchEnd($event, index)"
          >
            <view class="card-header">
              <text class="title">{{ item.medicationTitle }}</text>
              <view class="status-dot" :class="item.status"></view>
            </view>
            <view class="time-row">
              <text class="label">每周</text>
              <text class="desc">{{ item.medicationFrequency }}</text>
              <text class="time">{{ item.remindTime }}</text>
            </view>
          </view>
          <view 
            class="delete-action"
            @click.stop="endReminder(item.medicationId)"
          >
            <text class="delete-text">结束</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 错误提示 -->
    <view v-if="hasError && !isLoading" class="error-toast" @click="loadReminders">
      {{ errorMessage }}（点击重试）
    </view>

    <view class="fab" @click="showAddReminderDialog">
      <text class="fab-icon">+</text>
    </view>

    <AddReminderDialog
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @confirm="onAddReminderConfirm"
    ></AddReminderDialog>
  </view>
</template>

<script>
import AddReminderDialog from '../../components/Reminder/AddReminderDialog.vue';
import { fetchMedicationReminders, deleteMedicationReminder } from '../../api/reminder.js';

export default {
  components: {
    AddReminderDialog
  },
  data() {
    return {
      showAddDialog: false,
      touchStartX: 0,
      touchStartY: 0,
      currentSwipeIndex: -1,
      isScrolling: false,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      reminders: [],
      oldId: 1 // 这里需要根据实际情况设置oldId的值
    };
  },
  onLoad() {
    this.loadReminders();
  },
  
  onShow() {
    // 每次页面显示时重新加载数据，确保数据最新
    this.loadReminders();
  },
  
  // 页面卸载时清理数据，避免内存泄漏
  onUnload() {
    this.reminders = [];
    this.isLoading = false;
  },
  
  methods: {
    // 加载提醒数据
    loadReminders() {
      console.log(fetchMedicationReminders(this.oldId));
      
      try {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';
        // 清空reminders数组，确保只显示接口返回的数据
        this.reminders = [];
        // 调用接口获取数据，传入oldId参数
        fetchMedicationReminders(this.oldId).then((res) => {
          console.log('获取提醒数据成功:', res.data);
          this.reminders = res.data
        });
      } catch (error) {
        console.error('获取提醒数据失败:', error);
        this.hasError = true;
        this.errorMessage = '获取数据失败';
        // 移除默认数据，确保数据完全来自接口
        this.reminders = [];
        
        // 设置3秒后自动隐藏错误提示
        setTimeout(() => {
          this.hasError = false;
          this.errorMessage = '';
        }, 3000);
      } finally {
        this.isLoading = false;
      }
    },
    
    // 根据提醒时间设置状态
    getStatusByTime(remindTime) {
      if (!remindTime) return 'pending';
      
      const now = new Date();
      const remindDate = new Date(remindTime);
      
      // 这里可以根据实际业务逻辑判断状态
      if (remindDate > now) {
        return 'active';
      } else {
        return 'pending';
      }
    },
    
    showAddReminderDialog() {
      this.showAddDialog = true;
    },
    onAddReminderConfirm(reminderInfo) {
      this.reminders.push({
        title: reminderInfo.title,
        desc: reminderInfo.desc,
        time: reminderInfo.time,
        status: 'active',
        swipeOffset: 0
      });
      this.showAddDialog = false;
    },
    onScroll() {
      // 滚动时关闭所有滑动项
      this.reminders.forEach((item) => {
        if (item.swipeOffset < 0) {
          item.swipeOffset = 0;
        }
      });
      this.currentSwipeIndex = -1;
    },
    onTouchStart(e, index) {
      // 如果正在滚动，不处理滑动
      if (this.isScrolling) return;
      
      // 关闭其他已打开的滑动项
      this.reminders.forEach((item, i) => {
        if (i !== index && item.swipeOffset < 0) {
          item.swipeOffset = 0;
        }
      });
      
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.currentSwipeIndex = index;
      this.isScrolling = false;
    },
    onTouchMove(e, index) {
      if (this.currentSwipeIndex !== index || this.isScrolling) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - this.touchStartX;
      const deltaY = currentY - this.touchStartY;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      
      // 判断是水平滑动还是垂直滚动
      if (absDeltaY > absDeltaX && absDeltaX < 20) {
        // 垂直滚动，不处理滑动
        this.isScrolling = true;
        return;
      }
      
      // 水平滑动
      if (absDeltaX > 10) {
        // 阻止事件冒泡，防止触发scroll-view滚动
        e.stopPropagation();
      }
      
      // 只允许向左滑动
      if (deltaX < 0) {
        const swipeDistance = absDeltaX;
        // 160rpx = 80px (在375px宽度下，1px = 2rpx)
        const maxSwipe = 80;
        // swipeOffset存储为rpx值，但transform使用px
        this.reminders[index].swipeOffset = -Math.min(swipeDistance * 2, 160);
      } else if (deltaX > 0 && this.reminders[index].swipeOffset < 0) {
        // 向右滑动时，如果已经滑动过，则恢复
        const swipeDistance = deltaX;
        const currentOffset = Math.abs(this.reminders[index].swipeOffset);
        const rpxDistance = swipeDistance * 2;
        if (rpxDistance < currentOffset) {
          this.reminders[index].swipeOffset = -currentOffset + rpxDistance;
        } else {
          this.reminders[index].swipeOffset = 0;
        }
      }
    },
    onTouchEnd(e, index) {
      if (this.currentSwipeIndex !== index) return;
      
      if (this.isScrolling) {
        this.isScrolling = false;
        this.currentSwipeIndex = -1;
        return;
      }
      
      const currentOffset = Math.abs(this.reminders[index].swipeOffset);
      const threshold = 80; // 80rpx作为阈值
      const maxSwipe = 160; // 160rpx，对应80px
      
      // 如果滑动距离超过阈值，则完全展开，否则恢复
      if (currentOffset > threshold) {
        this.reminders[index].swipeOffset = -maxSwipe;
      } else {
        this.reminders[index].swipeOffset = 0;
      }
      
      this.currentSwipeIndex = -1;
      this.isScrolling = false;
    },
    endReminder(medicationId) {
      console.log(medicationId);
      
      // deleteMedicationReminder(medicationId).then(() => {
      //   console.log('删除提醒成功:', medicationId);
      // });
    }
  }
};
</script>

<style scoped>
.reminder-page {
  height: 100vh;
  background-color: #f5f5f5;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
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

.scroll-container {
		flex: 1;
		padding-top: calc(44px + 30rpx); /* 状态栏高度 + 原有顶部padding */
		padding-right: 30rpx;
		padding-bottom: 30rpx;
		padding-left: 30rpx;
		box-sizing: border-box;
	}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  padding-bottom: 40rpx;
}

.swipe-item {
  position: relative;
  overflow: hidden;
  border-radius: 24rpx;
}

.reminder-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 36rpx 36rpx 36rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
  position: relative;
  transition: all 0.3s ease;
  z-index: 2;
  touch-action: pan-y;
}

.reminder-card:active {
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
  transform: scale(0.99);
}

.reminder-card.swiping {
  transition: none;
}

.swipe-item.swiped .reminder-card {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #44a48c;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #d8d8d8;
  margin-left: 20rpx;
}

.status-dot.active {
  background-color: #63bea7;
  box-shadow: 0 0 10rpx rgba(99, 190, 167, 0.4);
}

.status-dot.pending {
  background-color: #c5c5c5;
}

.status-dot.completed {
  background-color: #ff5a52;
  box-shadow: 0 0 10rpx rgba(255, 90, 82, 0.4);
}

.time-row {
  margin-top: 8rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 26rpx;
  color: #555;
}

.desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.4;
  margin-right: 12rpx;
}

.label {
  color: #999;
  font-size: 24rpx;
}

.time {
  font-weight: 500;
  color: #333;
  font-size: 26rpx;
}

.delete-action {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 160rpx;
  background-color: #ff4d4f;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 24rpx;
  border-bottom-right-radius: 24rpx;
  z-index: 1;
}

.delete-text {
  color: #fff;
  font-size: 30rpx;
  font-weight: 500;
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 240rpx;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: #63bea7;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.fab-icon {
  color: #fff;
  font-size: 64rpx;
  line-height: 1;
}

/* 错误提示样式 */
.error-toast {
  position: fixed;
  bottom: 360rpx;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20rpx 40rpx;
  border-radius: 24rpx;
  font-size: 28rpx;
  z-index: 999;
  max-width: 80%;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.3s ease;
}

.error-toast:active {
  opacity: 0.8;
}
/* 加载状态样式 */
.loading-container {
  padding: 60rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 无数据状态样式 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.empty-icon {
  font-size: 160rpx;
  margin-bottom: 40rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 36rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #999;
}
</style>