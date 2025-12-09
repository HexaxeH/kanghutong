<template>
  <view class="phone">
    <view class="hero">
      <text class="title">欢迎开启守护</text>
    </view>

    <view class="card">
      <view class="input-line">
        <input
          class="input"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          :value="mobile"
          @input="onMobileInput"
        />
      </view>
      <view class="btn" :class="{ disabled: !validMobile }" @click="validMobile && sendCode()">获取验证码</view>
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
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const role = ref('user')
const mobile = ref('')
const validMobile = computed(() => /^1[3-9]\d{9}$/.test(mobile.value))

function onMobileInput(e) {
  mobile.value = e?.detail?.value ?? ''
}

function sendCode() {
  uni.navigateTo({ url: `/pages/auth/verify?mobile=${mobile.value}&role=${role.value}` })
}

onLoad((query) => {
  role.value = query?.role || 'user'
})
</script>

<style>
.phone { padding: 0; background-color: #ffffff; }
.hero {
  height: 340rpx;
  background:
    radial-gradient(120rpx 120rpx at 85% 10%, rgba(255,255,255,0.25), transparent 60%),
    radial-gradient(140rpx 140rpx at 65% 30%, rgba(255,255,255,0.18), transparent 60%),
    linear-gradient(180deg, #6CB5A3 0%, #6CB5A3 60%, #ffffff 60%);
  padding: 90rpx 40rpx;
  box-sizing: border-box;
  color: #ffffff;
}
.title { font-size: 44rpx; font-weight: 700; }
.card {
  width: 86%;
  margin: -60rpx auto 0;
  background: #ffffff;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}
.input-line { border-bottom: 2rpx solid #e5e5e5; padding-bottom: 12rpx; }
.input { font-size: 32rpx; padding: 16rpx 0; }
.btn {
  border-radius: 56rpx;
  background-color: #6CB5A3;
  color: #ffffff;
  padding: 28rpx 0;
  font-size: 32rpx;
  text-align: center;
  box-shadow: 0 12rpx 28rpx rgba(108,181,163,0.35);
}
.btn.disabled { opacity: 0.5; }
.agreements {
  margin-top: 180rpx;
  text-align: center;
  color: #7aa09b;
  font-size: 24rpx;
  line-height: 1.8;
}
.link { color: #6CB5A3; }
</style>
