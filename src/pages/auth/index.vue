<template>
  <view class="entry">
    <image class="logo" src="/static/logo.png" />
    <view class="btns">
      <view class="primary" @click="goPhone('user')">登录</view>
      <view class="outline" @click="goPhone('relative')">亲属登录</view>
      <text class="hint">未注册号码自动登录</text>
    </view>
    <view class="agreements">
      <text>注册登录即代表同意</text>
      <text class="link">手机号码认证服务条款</text>
      <text>以及</text>
      <text class="link">服务使用协议</text>
      <text>和</text>
      <text class="link">隐私政策</text>
    </view>
  </view>
</template>

<script setup>
function goPhone(role) {
  uni.navigateTo({ url: `/pages/auth/phone?role=${role}` })
}
</script>

<style>
.entry {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 48rpx 60rpx;
  box-sizing: border-box;
  background-color: #ffffff;
}
.logo {
  width: 180rpx;
  height: 180rpx;
  margin-top: 80rpx;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.06);
}
.btns {
  width: 86%;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  align-items: center;
}
.primary {
  width: 100%;
  border-radius: 56rpx;
  background-color: #6CB5A3;
  color: #ffffff;
  padding: 28rpx 0;
  font-size: 32rpx;
  box-shadow: 0 12rpx 28rpx rgba(108,181,163,0.35);
  text-align: center;
}
.outline {
  width: 100%;
  border: 2rpx solid #6CB5A3;
  color: #6CB5A3;
  background-color: #ffffff;
  border-radius: 56rpx;
  padding: 28rpx 0;
  font-size: 32rpx;
  text-align: center;
}
.hint {
  color: #6CB5A3;
  font-size: 24rpx;
}
.agreements {
  width: 100%;
  text-align: center;
  color: #7aa09b;
  font-size: 24rpx;
  line-height: 1.8;
}
.link { color: #6CB5A3; }
</style>
