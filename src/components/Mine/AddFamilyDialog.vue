<template>
  <view class="dialog-overlay">
    <view class="dialog-content">
      <!-- 弹窗标题 -->
      <view class="dialog-header">
        <text class="dialog-title">添加家人</text>
      </view>
      
      <!-- 表单内容 -->
      <view class="dialog-body">
        <view class="form-item">
          <text class="form-label">亲友姓名：</text>
          <input class="form-input" v-model="formData.name" placeholder="请输入亲友姓名" />
        </view>
        
        <view class="form-item">
          <text class="form-label">亲友电话：</text>
          <input class="form-input" v-model="formData.phone" placeholder="请输入亲友电话" type="number" />
        </view>
        
        <view class="form-item" @click="showRelationDialog">
          <text class="form-label">亲属关系：</text>
          <view class="relation-select">
            <text class="relation-text">{{ formData.relation || '请选择' }}</text>
            <view class="arrow"></view>
          </view>
        </view>
      </view>
      
      <!-- 按钮区域 -->
      <view class="dialog-footer">
        <button class="cancel-btn" @click="onCancel">取消</button>
        <button class="confirm-btn" @click="onConfirm">确认</button>
      </view>
    </view>
    
    <!-- 选择亲属关系弹窗 -->
    <RelationSelectDialog 
      v-if="showRelationSelect"
      @close="showRelationSelect = false"
      @select="onRelationSelect"
    ></RelationSelectDialog>
  </view>
</template>

<script>
import RelationSelectDialog from './RelationSelectDialog.vue';

export default {
  components: {
    RelationSelectDialog
  },
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        relation: ''
      },
      showRelationSelect: false
    };
  },
  methods: {
    onCancel() {
      this.$emit('close');
    },
    onConfirm() {
      // 简单验证
      if (!this.formData.name) {
        uni.showToast({
          title: '请输入亲友姓名',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入亲友电话',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.relation) {
        uni.showToast({
          title: '请选择亲属关系',
          icon: 'none'
        });
        return;
      }
      
      // 提交表单数据
      this.$emit('confirm', this.formData);
      
      // 重置表单
      this.formData = {
        name: '',
        phone: '',
        relation: ''
      };
    },
    showRelationDialog() {
      this.showRelationSelect = true;
    },
    onRelationSelect(relation) {
      this.formData.relation = relation;
      this.showRelationSelect = false;
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

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.relation-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.relation-text {
  font-size: 30rpx;
  color: #999;
}

.arrow {
  width: 20rpx;
  height: 20rpx;
  border-top: 2rpx solid #999;
  border-right: 2rpx solid #999;
  transform: rotate(45deg);
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
</style>