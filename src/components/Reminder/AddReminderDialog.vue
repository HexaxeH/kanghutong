<template>
  <view class="dialog-overlay">
    <view class="dialog-content">
      <!-- 弹窗标题 -->
      <view class="dialog-header">
        <text class="dialog-title">添加提醒</text>
      </view>
      
      <!-- 表单内容 -->
      <view class="dialog-body">
        <view class="form-item">
          <text class="form-label">药名：</text>
          <input class="form-input" v-model="formData.title" placeholder="请输入提醒名称" />
        </view>
        
        <view class="form-item">
          <text class="form-label">用量：</text>
          <input class="form-input" v-model="formData.desc" placeholder="请输入用药描述" />
        </view>
        
        <view class="form-item">
          <text class="form-label">提醒时间：</text>
          <view class="form-input-wrapper" @click="openTimePicker">
            <input 
              class="form-input" 
              v-model="formData.time" 
              placeholder="请选择时间" 
              readonly
            />
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">频率：</text>
          <view class="form-input-wrapper" @click="openFrequencyPicker">
            <input 
              class="form-input" 
              v-model="formData.frequency" 
              placeholder="请选择频率" 
              readonly
            />
          </view>
          <view v-if="showCustomFrequency" class="custom-frequency-input">
            <input 
              class="form-input" 
              v-model="customFrequencyText" 
              placeholder="请输入自定义频率" 
            />
          </view>
        </view>
      </view>
      
      <!-- 按钮区域 -->
      <view class="dialog-footer">
        <button class="cancel-btn" @click="onCancel">取消</button>
        <button class="confirm-btn" @click="onConfirm">确认</button>
      </view>
    </view>
    
    <!-- 时间选择器 -->
    <uni-popup ref="timePopup" type="bottom" :safe-area="false">
      <view class="picker-content">
        <view class="picker-header">
          <text class="picker-cancel" @click="closeTimePicker">取消</text>
          <text class="picker-title">选择时间</text>
          <text class="picker-confirm" @click="confirmTime">确定</text>
        </view>
        <view class="picker-body">
          <picker mode="time" :value="currentTime" @change="onTimeChange">
            <view class="picker-item">
              <text class="picker-item-text">{{ currentTime || '请选择时间' }}</text>
            </view>
          </picker>
        </view>
      </view>
    </uni-popup>
    
    <!-- 频率选择器 -->
    <uni-popup ref="frequencyPopup" type="bottom" :safe-area="false">
      <view class="picker-content">
        <view class="picker-header">
          <text class="picker-cancel" @click="closeFrequencyPicker">取消</text>
          <text class="picker-title">选择频率</text>
          <text class="picker-confirm" @click="confirmFrequency">确定</text>
        </view>
        <view class="picker-body">
          <view class="frequency-options">
            <view 
              v-for="(option, index) in frequencyOptions" 
              :key="index"
              class="frequency-option"
              :class="{ active: frequencyIndex === index }"
              @click="selectFrequency(index)"
            >
              <text>{{ option }}</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {medicationReminderSettings} from '../../api/reminder'
export default {
  data() {
    return {
      formData: {
        title: '',
        desc: '',
        time: '',
        frequency: ''
      },
      currentTime: '',
      frequencyOptions: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      frequencyIndex: -1,
      showCustomFrequency: false,
      customFrequencyText: ''
    };
  },
  mounted() {
    // 初始化当前时间
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
  },
  methods: {
    onCancel() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.formData = {
        title: '',
        desc: '',
        time: '',
        frequency: ''
      };
      this.frequencyIndex = -1;
      this.showCustomFrequency = false;
      this.customFrequencyText = '';
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;
    },
    openTimePicker() {
      this.$refs.timePopup.open();
    },
    closeTimePicker() {
      this.$refs.timePopup.close();
    },
    openFrequencyPicker() {
      this.$refs.frequencyPopup.open();
    },
    closeFrequencyPicker() {
      this.$refs.frequencyPopup.close();
    },
    onTimeChange(e) {
      this.currentTime = e.detail.value;
    },
    confirmTime() {
      this.formData.time = this.currentTime;
      this.closeTimePicker();
    },
    selectFrequency(index) {
      this.frequencyIndex = index;
      if (this.frequencyOptions[index] === '自定义') {
        this.showCustomFrequency = true;
      } else {
        this.showCustomFrequency = false;
        this.customFrequencyText = '';
      }
    },
    confirmFrequency() {
      if (this.frequencyIndex === -1) {
        uni.showToast({
          title: '请选择频率',
          icon: 'none'
        });
        return;
      }
      
      if (this.frequencyOptions[this.frequencyIndex] === '自定义') {
        // 如果选择自定义，保持输入框显示，不关闭弹窗，让用户输入
        if (!this.customFrequencyText.trim()) {
          // 如果还没有输入内容，提示用户输入
          this.closeFrequencyPicker();
          return;
        }
        this.formData.frequency = this.customFrequencyText.trim();
        this.closeFrequencyPicker();
      } else {
        this.formData.frequency = this.frequencyOptions[this.frequencyIndex];
        this.showCustomFrequency = false;
        this.customFrequencyText = '';
        this.closeFrequencyPicker();
      }
    },
    onConfirm() {
      // 简单验证
      if (!this.formData.title) {
        uni.showToast({
          title: '请输入提醒名称',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.desc) {
        uni.showToast({
          title: '请输入用药描述',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.time) {
        uni.showToast({
          title: '请选择提醒时间',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.frequency) {
        uni.showToast({
          title: '请选择频率',
          icon: 'none'
        });
        return;
      }
      
      // 提交表单数据
      const reminderInfo = {
        title: this.formData.title,
        desc: this.formData.desc,
        time: `${this.formData.frequency} ${this.formData.time}`,
        frequency: this.formData.frequency
      };
      
      this.$emit('confirm', reminderInfo);
      
      // 重置表单
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.dialog-content {
  width: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.dialog-header {
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.dialog-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.dialog-body {
  padding: 30rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 30rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.form-input-wrapper {
  width: 100%;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.custom-frequency-input {
  margin-top: 20rpx;
}

.dialog-footer {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 32rpx;
  border: none;
  background: none;
  margin: 0;
  padding: 0;
}

.cancel-btn {
  color: #666;
  border-right: 1rpx solid #f0f0f0;
}

.confirm-btn {
  color: #07c160;
}

.cancel-btn::after,
.confirm-btn::after {
  border: none;
}

.picker-content {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.picker-cancel,
.picker-confirm {
  font-size: 32rpx;
  color: #666;
}

.picker-confirm {
  color: #07c160;
}

.picker-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.picker-body {
  padding: 20rpx 0;
  max-height: 500rpx;
  overflow-y: auto;
}

.picker-item {
  padding: 20rpx 30rpx;
  text-align: center;
}

.picker-item-text {
  font-size: 32rpx;
  color: #333;
}

.frequency-options {
  display: flex;
  flex-direction: column;
}

.frequency-option {
  padding: 30rpx;
  font-size: 32rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.frequency-option:last-child {
  border-bottom: none;
}

.frequency-option.active {
  background-color: #f0f9ff;
  color: #07c160;
}
</style>