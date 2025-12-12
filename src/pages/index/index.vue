<template>
  <view class="container">
    <view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <picker mode="region" @change="onCityChange">
          <view class="location-row">
            <text class="city-text">{{ city }}</text>
            <text class="arrow-icon">∨</text>
          </view>
        </picker>
        <view class="app-title-box">
          <text class="app-title">康护通</text>
          <!-- 背景装饰 -->
          <view class="bg-circle">
            <image
              src="../../static/logow.png"
              mode="scaleToFill"
            />
          </view>
        </view>
      </view>
    </view>

    <!-- 核心功能入口 (悬浮卡片) -->
    <view class="quick-actions-card">
      <view class="action-item" @click="handleAction('nearby')">
        <view class="icon-circle">
          <image
            src="../../static/1.png"
            mode="scaleToFill"
          />
        </view>
        <text class="action-text">附近场所</text>
      </view>
      <view class="action-item" @click="handleAction('location')">
        <view class="icon-circle">
          <image
            src="../../static/2.png"
            mode="scaleToFill"
          />
        </view>
        <text class="action-text">开启定位</text>
      </view>
      <view class="action-item" @click="handleAction('device')">
        <view class="icon-circle">
          <image
            src="../../static/3.png"
            mode="scaleToFill"
          />
        </view>
        <text class="action-text">连接设备</text>
      </view>
    </view>

    <!-- 医院推荐 -->
    <view class="section-card">
      <view class="section-header">
        <text class="section-title">医院推荐</text>
        <text class="more-link" @click="handleAction('hospital-list')">更多</text>
      </view>
      <view class="hospital-content" @click="handleAction('hospital-detail')" v-if="recommendedHospital">
        <!-- 模拟医院图片 -->
        <view class="hospital-img-placeholder">
          <text class="img-text">医院\n门诊部</text>
        </view>
        <view class="hospital-info">
          <text class="hospital-name">{{ recommendedHospital.name }}</text>
          <view class="info-row">
            <text class="hospital-level">{{ recommendedHospital.type || '综合医院' }}</text>
            <text class="hospital-distance">{{ recommendedHospital.distance }}m</text>
          </view>
          <view class="hospital-tag">
            <text class="tag-text">地址: {{ recommendedHospital.address }}</text>
          </view>
        </view>
      </view>
      <view class="hospital-content" v-else @click="handleAction('hospital-detail')">
        <view class="hospital-img-placeholder">
          <text class="img-text">加载中...</text>
        </view>
        <view class="hospital-info">
          <text class="hospital-name">正在查找附近医院...</text>
        </view>
      </view>
    </view>

    <!-- 健身操推荐 -->
    <view class="section-card no-padding-bottom">
      <view class="section-header">
        <text class="section-title">健身操推荐</text>
      </view>
      <view class="exercise-list">
      <view class="exercise-item" v-for="(item, index) in exercises" :key="index" @click="handleAction('video-play', item.title)">
        <text class="exercise-title">{{ item.title }}</text>
      </view>
    </view>
    </view>

    <!-- 底部占位，防止Tabbar遮挡 -->
    <view class="bottom-spacer"></view>

    <!-- 自定义TabBar -->
    <CustomTabBar :selected="0" />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CustomTabBar from '@/components/CustomTabBar/CustomTabBar.vue'
import { AMapLite } from '@/libs/amap-lite.js'

onShow(() => {
  uni.hideTabBar()
  updateLocation() // 每次显示页面尝试更新定位
})

const statusBarHeight = ref(20)
const city = ref('定位中...')
const recommendedHospital = ref(null)
const myAmapFun = new AMapLite({ key: '4d4e76a5e1b19a9bae4cbc37d3204dc2' });

// 获取状态栏高度
try {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
} catch (e) {
  console.error(e)
}

const exercises = ref([
  { title: '那些运动可以增强下肢力量（防跌倒关键）呢？' },
  { title: '那些运动可以增强下肢力量（防跌倒关键）呢？' }
])

function onCityChange(e) {
  // e.detail.value 是一个数组，例如 ["广东省", "广州市", "海珠区"]
  // 我们取第二个值作为城市名
  const selectedCity = e.detail.value[1]
  if (selectedCity) {
    city.value = selectedCity.replace(/市$/, '')
    uni.showToast({
      title: `已切换到 ${city.value}`,
      icon: 'none'
    })
  }
}

function updateLocation() {
  uni.getSetting({
    success(res) {
      if (!res.authSetting['scope.userLocation']) {
        city.value = '未授权'
        return
      }
      
      myAmapFun.getRegeo({
        success: function(data) {
          if (data && data.length > 0 && data[0].regeocodeData && data[0].regeocodeData.addressComponent) {
            // 优先显示城市，如果是直辖市显示省份（通常也是市名）
            const addressComponent = data[0].regeocodeData.addressComponent
            let cityName = addressComponent.city
            if (!cityName || typeof cityName !== 'string' || cityName.length === 0) {
                cityName = addressComponent.province
            }
            // 去掉"市"字，显得更简洁（可选）
            city.value = cityName.replace(/市$/, '')
          } else {
            city.value = '未知'
          }
          
          // 获取城市成功后，查找附近医院
          fetchNearbyHospital()
        },
        fail: function(info) {
          console.error(info)
          city.value = '定位失败'
        }
      })
    }
  })
}

function fetchNearbyHospital() {
  myAmapFun.getPoiAround({
    query_keywords: '医院',
    success: function(data){
      if (data && data.length > 0) {
        // 取第一条数据作为推荐
        const hospital = data[0]
        // 简单处理类型字符串，太长就截取
        let typeStr = hospital.type || ''
        if (typeStr.includes(';')) {
          typeStr = typeStr.split(';')[0]
        }
        if (typeStr.includes('医疗')) {
            typeStr = typeStr.replace('医疗保健服务', '').replace('综合医院', '')
        }
        if(!typeStr) typeStr = '综合医院'

        recommendedHospital.value = {
          name: hospital.name,
          address: hospital.address,
          distance: hospital.distance,
          type: typeStr
        }
      }
    },
    fail: function(info){
      console.error('查找医院失败', info)
    }
  })
}

function handleAction(type, param) {
  console.log('handleAction triggered:', type, param)
  
  if (type === 'video-play') {
    uni.showLoading({ title: '正在跳转...' })
    const url = `/pages/assistant/index?query=${encodeURIComponent(param || '')}`
    console.log('Navigating to:', url)
    
    uni.navigateTo({
      url: url,
      success: () => {
        uni.hideLoading()
        console.log('Navigation success')
      },
      fail: (err) => {
        uni.hideLoading()
        console.error('Navigation failed:', err)
        uni.showModal({
          title: '跳转失败',
          content: err.errMsg,
          showCancel: false
        })
      }
    })
  } else if (type === 'nearby') {
    uni.navigateTo({
      url: '/pages/nearby/index'
    })
  } else if (type === 'location') {
    uni.authorize({
      scope: 'scope.userLocation',
      success() {
        updateLocation()
        uni.showToast({
          title: '定位已更新',
          icon: 'success'
        })
      },
      fail(err) {
        console.error('Authorize failed:', err)
        uni.showModal({
          title: '定位授权失败',
          content: '请在设置中开启位置权限，或检查手机定位开关是否打开。\n错误信息：' + (err.errMsg || '未知错误'),
          confirmText: '去设置',
          success: function (res) {
            if (res.confirm) {
              uni.openSetting({
                success(settingRes) {
                  if (settingRes.authSetting['scope.userLocation']) {
                    updateLocation()
                  }
                }
              })
            }
          }
        })
      }
    })
  } else if (type === 'device') {
      uni.showToast({
        title: '设备连接功能开发中',
        icon: 'none'
      })
  } else if (type === 'hospital-list') {
      // 更多医院
      uni.showToast({
        title: '更多医院功能开发中',
        icon: 'none'
      })
  } else if (type === 'hospital-detail') {
      // 医院详情
      uni.showToast({
        title: '医院详情功能开发中',
        icon: 'none'
      })
  } else {
    // 调试信息：显示接收到的 type 和长度，排查是否有隐藏字符
    uni.showToast({
      title: `未知操作: [${type}](${type.length})`,
      icon: 'none'
    })
  }
}
</script>

<style>
.container {
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* Custom Header */
.custom-header {
  background-color: #60B09E;
  padding-bottom: 100rpx; /* 留出空间给悬浮卡片 */
  position: relative;
  overflow: hidden;
}

.header-content {
  padding: 20rpx 30rpx;
}

.location-row {
  display: flex;
  align-items: center;
  color: #333; /* 图片看起来是深色文字 */
  margin-bottom: 20rpx;
}

.city-text {
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 10rpx;
  color: #333;
}

.arrow-icon {
  font-size: 28rpx;
  color: #333;
}

.app-title-box {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 80rpx;
}

.app-title {
  font-size: 56rpx;
  font-weight: bold;
  color: #fff;
  z-index: 2;
  letter-spacing: 4rpx;
}

/* 简单的背景装饰模拟 */
.bg-circle {
  position: absolute;
  width: 400rpx;
  height: 400rpx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.15;
  z-index: 1;
  pointer-events: none;
}

.bg-circle image {
  width: 100%;
  height: 100%;
}

/* Quick Actions Card */
.quick-actions-card {
  margin: -60rpx 30rpx 30rpx 30rpx;
  background-color: #fff;
  border-radius: 30rpx;
  padding: 40rpx 20rpx;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  position: relative;
  z-index: 10;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-circle {
  width: 100rpx;
  height: 100rpx;
  background-color: #6CB5A3;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-circle image {
  width: 56rpx;
  height: 56rpx;
}

.action-text {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

/* Section Common */
.section-card {
  margin: 0 30rpx 30rpx 30rpx;
  /* background-color: transparent;  图片里下半部分背景好像是灰色的，卡片是白色的，但这里整体背景是灰的 */
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #333;
  border-left: none; /* 去掉之前的左边框 */
  padding-left: 0;
}

.more-link {
  font-size: 28rpx;
  color: #999;
}

/* Hospital Card Style */
.hospital-content {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  display: flex;
  align-items: flex-start;
}

.hospital-img-placeholder {
  width: 200rpx;
  height: 150rpx;
  background-color: #8C9EFF; /* 模拟图片颜色 */
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.img-text {
  color: #fff;
  font-size: 24rpx;
  text-align: center;
}

.hospital-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hospital-name {
  font-size: 34rpx;
  font-weight: bold;
  color: #000;
  margin-bottom: 10rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.hospital-level {
  color: #FF5252; /* 红色 */
  font-size: 28rpx;
  font-weight: bold;
  margin-right: 20rpx;
}

.hospital-distance {
  color: #999;
  font-size: 26rpx;
}

.hospital-tag {
  background-color: #6CB5A3;
  border-radius: 8rpx;
  padding: 4rpx 12rpx;
  align-self: flex-start;
}

.tag-text {
  color: #fff;
  font-size: 24rpx;
}

/* Exercise List */
.exercise-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.exercise-item {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 24rpx;
}

.exercise-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
}

.bottom-spacer {
  height: 200rpx;
}
</style>
