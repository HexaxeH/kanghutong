<template>
  <view class="mine-page">
    <!-- 顶部状态栏占位 -->
    <view class="status-bar-space"></view>

    <view class="mine-content">
      <!-- 用户信息 -->
      <view class="user-card" @click="goToUserDetail">
        <image class="avatar" :src="defaultAvatar" mode="aspectFill"></image>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="user-phone">{{ userPhone }}</text>
        </view>
        <view class="arrow"></view>
      </view>

      <!-- 家人列表 -->
      <view class="family-card">
        <text class="section-title">我的家人</text>
        <view
          v-for="(member, index) in familyMembers"
          :key="index"
          class="family-row"
        >
          <view class="avatar-wrapper">
            <image class="family-avatar" src="/static/logo.png" mode="aspectFill"></image>
          </view>
          <view class="family-info">
            <view class="relation-tag">{{ member.relation }}</view>
            <view class="name-phone">
              <text class="name">{{ member.name }}</text>
              <text class="phone">{{ member.phone }}</text>
            </view>
          </view>
          <view class="arrow"></view>
        </view>
      </view>

      <!-- 添加家人 -->
      <view class="add-card" @click="showAddFamilyDialog">
        <text class="add-text">添加家人</text>
        <view class="arrow"></view>
      </view>
    </view>

    <AddFamilyDialog
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @confirm="onAddFamilyConfirm"
    ></AddFamilyDialog>
  </view>
</template>

<script>
import AddFamilyDialog from '../../components/Mine/AddFamilyDialog.vue';

export default {
  components: {
    AddFamilyDialog
  },
  data() {
    return {
      userName: '张三',
      userPhone: '159****85640',
      defaultAvatar: '/static/logo.png',
      showAddDialog: false,
      familyMembers: [
        {
          relation: '亲属',
          name: '张九',
          phone: '199****1234'
        },
        {
          relation: '爷爷',
          name: '张九',
          phone: '199****1234'
        }
      ]
    };
  },
  methods: {
    showAddFamilyDialog() {
      this.showAddDialog = true;
    },
    onAddFamilyConfirm(familyInfo) {
      // 添加新的家人到列表
      this.familyMembers.push({
        relation: familyInfo.relation,
        name: familyInfo.name,
        phone: familyInfo.phone
      });
      this.showAddDialog = false;
    },
    getShortText(member) {
      const text = member.short || member.relation || member.name || '亲';
      return text.slice(0, 1);
    },
    goToUserDetail() {
      // 跳转到用户本人详情页
      uni.navigateTo({
        url: `/pages/mine/FamilyDetail?name=${encodeURIComponent(this.userName)}&phone=${encodeURIComponent(this.userPhone)}&relation=本人`
      });
    }
  }
};
</script>

<style scoped>
/* 顶部状态栏占位 */
    .status-bar-space {
      height: 44px;
      width: 100%;
      background-color: transparent;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }
    
    .mine-page {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background-color: rgba(245, 245, 245, 1);
      background-image: url('/static/home.png');
      background-size: 125% 45vh;
      background-repeat: no-repeat;
      background-position: -60px -20px;
    }

    .mine-content {
      padding: 0 32rpx 40rpx;
      margin-top: 200rpx;
      position: relative;
      z-index: 1;
    }

.user-card {
      background-color: #fff;
      border-radius: 30rpx;
      padding: 40rpx 32rpx;
      display: flex;
      align-items: center;
      border: 1rpx solid #f0f0f0;
      margin-bottom: 30rpx;
    }

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      background-color: #e0e0e0;
    }

    .user-info {
      flex: 1;
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 36rpx;
      color: #333;
      font-weight: 600;
      margin-bottom: 8rpx;
      display: block;
    }

    .user-phone {
      font-size: 28rpx;
      color: #666;
      display: block;
    }

.family-card {
      background-color: #fff;
      border-radius: 30rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;
      border: 1rpx solid #f0f0f0;
    }

    .section-title {
      font-size: 32rpx;
      font-weight: 400;
      color: #333;
      margin-bottom: 20rpx;
    }

    .family-row {
      display: flex;
      align-items: center;
      padding: 32rpx;
      cursor: pointer;
      background-color: rgba(249, 249, 249, 1);
      border-radius: 20rpx;
      margin-bottom: 10rpx;
    }

    /* 移除列表项之间的边框，因为现在每个列表项都有独立的样式 */
    .family-row + .family-row {
      /* 保持原有间距，不再需要边框 */
    }

    .avatar-wrapper {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      background-color: #2ea55f;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .avatar-wrapper image {
      width: 100rpx;
      height: 100rpx;
    }

    .avatar-text {
      color: #fff;
      font-size: 36rpx;
    }

    .family-info {
      flex: 1;
      margin-left: 32rpx;
    }

    .relation-tag {
      display: inline-block;
      padding: 0;
      background-color: transparent;
      color: #333;
      border-radius: 0;
      font-size: 32rpx;
      margin-bottom: 8rpx;
      font-weight: 600;
    }

    .name-phone {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-size: 32rpx;
      color: #333;
      margin-bottom: 4rpx;
    }

    .phone {
      font-size: 28rpx;
      color: #666;
    }

    .family-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

.add-card {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 30rpx 32rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1rpx solid #f0f0f0;
}

.add-text {
  font-size: 32rpx;
  color: #333;
}

.arrow {
      width: 20rpx;
      height: 20rpx;
      border-top: 3rpx solid #ccc;
      border-right: 3rpx solid #ccc;
      transform: rotate(45deg);
    }
</style>