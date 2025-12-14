<template>
  <view class="login-page">
    <!-- 入口态 -->
    <view v-if="stage === 'entry'" class="entry-container">
      <image class="entry-logo" src="/static/kht.png" mode="aspectFit"></image>
      <button class="primary-btn" @click="goToPhone('guardian')">登录</button>
      <button class="outline-btn" @click="goToPhone('relative')">亲属登录</button>
      <button class="text-btn" @click="goToPhone('guardian')">未注册号码自动登录</button>
      <view class="agreement">
        注册登录即代表同意
        <text class="link">手机号认证服务条款</text>
        以及
        <br />
        <text class="link">服务使用协议</text>
        和
        <text class="link">隐私政策</text>
      </view>
    </view>

    <!-- 表单态 -->
    <view v-else class="form-screen">
      <view class="hero-banner">
        <text class="hero-title">欢迎开启守护</text>
      </view>

      <view class="form-card">
        <view class="input-wrapper">
          <input v-if="stage === 'phone'" class="form-input" placeholder="请输入手机号" type="number" maxlength="11"
            v-model="phone" />
          <input v-else class="form-input" placeholder="请输入验证码" type="number" maxlength="6" v-model="code" />
        </view>
        <button class="primary-btn" :class="{ disabled: isButtonDisabled }" :disabled="isButtonDisabled"
          @click="stage === 'phone' ? handleGetCode() : handleLogin()">
          {{ actionText }}
        </button>
        <view class="agreement form-agreement">
          注册登录即代表同意
          <text class="link">手机号认证服务条款</text>
          以及
          <br />
          <text class="link">服务使用协议</text>
          和
          <text class="link">隐私政策</text>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stage: 'entry', // entry | phone | code
      loginType: 'guardian',
      phone: '',
      code: '',
      countdown: 0,
      timer: null
    };
  },
  computed: {
    isButtonDisabled() {
      if (this.stage === 'phone') {
        return !this.phone || this.countdown > 0;
      }
      return !this.code;
    },
    actionText() {
      if (this.stage === 'phone') {
        return this.countdown > 0 ? `重新获取(${this.countdown}s)` : '获取验证码';
      }
      return '登录';
    }
  },
  methods: {
    goToPhone(type) {
      this.loginType = type;
      this.stage = 'phone';
    },
    handleGetCode() {
      if (!this.validatePhone()) {
        return;
      }
      this.stage = 'code';
      this.countdown = 60;
      this.startCountdown();
      uni.showToast({
        title: '验证码已发送',
        icon: 'none'
      });
    },
    handleLogin() {
      if (!this.code) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      this.clearTimer();
      uni.showToast({
        title: `${this.loginType === 'relative' ? '亲属' : '用户'}登录成功`,
        icon: 'none'
      });
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/guard/Guard'
        });
      }, 500);
    },
    validatePhone() {
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return false;
      }
      if (this.phone.length !== 11) {
        uni.showToast({
          title: '手机号格式有误',
          icon: 'none'
        });
        return false;
      }
      return true;
    },
    startCountdown() {
      this.clearTimer();
      this.timer = setInterval(() => {
        if (this.countdown <= 1) {
          this.clearTimer();
          this.countdown = 0;
          return;
        }
        this.countdown -= 1;
      }, 1000);
    },
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  onUnload() {
    this.clearTimer();
  }
};
</script>

<style scoped>
:deep(uni-page-head) {
  display: none;
}

.login-page {
  min-height: 100vh;
  padding: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.entry-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  padding: 0 60rpx;
}

.entry-logo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 32rpx;
  margin-bottom: 60rpx;
}

.primary-btn,
.outline-btn {
  width: 100%;
  max-width: 520rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 999rpx;
  text-align: center;
  font-size: 32rpx;
  border: none;
  margin: 0;
}

.primary-btn {
  background-color: #3fb59f;
  color: #fff;
  font-weight: bolder;
  box-shadow: 0 8rpx 20rpx rgba(63, 181, 159, 0.3);
}

.primary-btn::after,
.outline-btn::after,
.text-btn::after {
  border: none;
}

.outline-btn {
  border: 2rpx solid #3fb59f;
  color: #3fb59f;
  background-color: transparent;
}

.primary-btn.disabled {
  background-color: #A3D1C7;
  color: #fff;
  font-weight: bolder;
  opacity: 0.6;
}

.text-btn {
  width: 100%;
  max-width: 520rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 999rpx;
  text-align: right;
  font-size: 28rpx;
  color: #3fb59f;
  border: none;
  background-color: transparent;
  padding: 0;
  margin: 0;
}

.agreement {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  line-height: 1.8;
  margin-top: 60rpx;
  width: 100%;
  padding: 0 20rpx;
  box-sizing: border-box;
  white-space: pre-line;
}

.link {
  color: #3fb59f;
}

.form-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.hero-banner {
    height: 370rpx;
    background-image: url('/static/login_background.png');
    background-size: cover;
    background-position: 50% 30%;
    position: relative;
    padding: 4.5rem 2.875rem;
    color: #fff;
    font-size: 48rpx;
    font-weight: 600;
    box-sizing: border-box;
    overflow: hidden;
  }

.hero-title {
  position: relative;
  z-index: 2;
}

.form-card {
  z-index: 1;
  margin-top: -50rpx;
  background-color: #fff;
  border-radius: 60rpx 60rpx 0 0;
  padding: 110rpx 100rpx 100rpx;
  /* box-shadow: 0 20rpx 60rpx rgba(63, 181, 159, 0.15); */
  display: flex;
  flex-direction: column;
  gap: 80rpx;
  flex: 1;
}

.input-wrapper {
  border-bottom: 2rpx solid #3fb59f;
  padding-bottom: 20rpx;
  margin-right: 60rpx;
}

.form-input {
  font-size: 32rpx;
  font-weight: bolder;
  color: #333;
  padding: 10rpx 0;
}

.form-input::placeholder {
  color: #c1c1c1;
}

.form-agreement {
  margin-top: auto;
}
</style>
