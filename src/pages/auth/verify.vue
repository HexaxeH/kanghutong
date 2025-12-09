<template>
  <view class="verify">
    <view class="hero">
      <text class="title">欢迎开启守护</text>
    </view>

    <view class="card">
      <view class="input-line">
        <input
          class="input"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          :value="code"
          @input="onCodeInput"
        />
      </view>
      <view class="btn" :class="{ disabled: !validCode }" @click="validCode && login()">登录</view>
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
const code = ref('')
const validCode = computed(() => /^\d{4,6}$/.test(code.value))

function onCodeInput(e) {
  code.value = e?.detail?.value ?? ''
}

function login() {
  uni.reLaunch({ url: '/pages/index/index' })
}

onLoad((query) => {
  role.value = query?.role || 'user'
  mobile.value = query?.mobile || ''
})
</script>

<style>
.verify { padding: 0; background-color: #ffffff; }
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
  border-radius: 24rpx;
  box-shadow: 0 16rpx 36rpx rgba(0,0,0,0.08);
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
