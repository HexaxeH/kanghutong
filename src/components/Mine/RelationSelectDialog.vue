<template>
  <view class="relation-dialog-overlay">
    <view class="relation-dialog-content">
      <!-- 弹窗标题 -->
      <view class="relation-dialog-header">
        <text class="relation-dialog-title">选择亲属关系</text>
      </view>
      
      <!-- 关系选项列表 -->
      <view class="relation-list">
        <view 
          v-for="(relation, index) in relationOptions" 
          :key="index" 
          class="relation-item"
          @click="selectRelation(relation)"
        >
          <text class="relation-name">{{ relation.name }}</text>
          <view class="relation-arrow"></view>
        </view>
      </view>
      
      <!-- 自定义关系输入 -->
      <view class="custom-relation">
        <view class="custom-input-wrapper">
          <text class="custom-label">自定义：</text>
          <input 
            class="custom-input" 
            v-model="customRelation" 
            placeholder="请输入其他关系"
            @confirm="confirmCustomRelation"
          />
        </view>
        <button class="custom-confirm-btn" @click="confirmCustomRelation">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      relationOptions: [
        { name: '父母' },
        { name: '子女' },
        { name: '配偶' },
        { name: '兄弟姐妹' },
        { name: '祖父母' },
        { name: '孙子女' },
        { name: '叔伯姑姨舅' },
        { name: '侄子侄女' },
        { name: '外甥外甥女' },
        { name: '其他' }
      ],
      customRelation: ''
    };
  },
  methods: {
    selectRelation(relation) {
      this.$emit('select', relation.name);
    },
    confirmCustomRelation() {
      if (this.customRelation.trim()) {
        this.$emit('select', this.customRelation.trim());
        this.customRelation = '';
      } else {
        uni.showToast({
          title: '请输入关系',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.relation-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.relation-dialog-content {
  width: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.relation-dialog-header {
  padding: 30rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
}

.relation-dialog-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.relation-list {
  max-height: 500rpx;
  overflow-y: auto;
}

.relation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.relation-item:last-child {
  border-bottom: none;
}

.relation-name {
  font-size: 32rpx;
  color: #333;
}

.relation-arrow {
  width: 20rpx;
  height: 20rpx;
  border-top: 2rpx solid #999;
  border-right: 2rpx solid #999;
  transform: rotate(45deg);
}

.custom-relation {
  padding: 20rpx 30rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.custom-input-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.custom-label {
  font-size: 30rpx;
  color: #666;
  margin-right: 16rpx;
}

.custom-input {
  flex: 1;
  height: 70rpx;
  border: 1rpx solid #ddd;
  border-radius: 12rpx;
  padding: 0 20rpx;
  font-size: 30rpx;
  box-sizing: border-box;
}

.custom-confirm-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #07c160;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  margin: 0;
  padding: 0;
}

.custom-confirm-btn::after {
  border: none;
}
</style>