<template>
  <view class="container">
    <!-- 地图组件 -->
    <map 
      id="myMap" 
      class="map" 
      :latitude="latitude" 
      :longitude="longitude" 
      :markers="markers"
      show-location
      enable-traffic
      @markertap="onMarkerTap"
    ></map>

    <!-- 底部控制面板 -->
    <view class="panel">
      <view class="search-box">
        <input 
          class="search-input" 
          placeholder="搜索附近的医院/药店/公园" 
          v-model="keyword"
          confirm-type="search"
          @confirm="doSearch"
        />
        <view class="search-btn" @click="doSearch">搜索</view>
      </view>

      <!-- 分类快捷入口 -->
      <view class="category-list">
        <view 
          class="category-item" 
          v-for="(item, index) in categories" 
          :key="index"
          @click="searchCategory(item)"
          :class="{ active: currentCategory === item }"
        >
          <text>{{ item }}</text>
        </view>
      </view>

      <!-- 结果列表 -->
      <scroll-view scroll-y class="result-list">
        <view 
          class="result-item" 
          v-for="(item, index) in poiList" 
          :key="index"
          @click="goToLocation(item)"
        >
          <view class="poi-info">
            <text class="poi-name">{{ item.name }}</text>
            <text class="poi-address">{{ item.address }}</text>
          </view>
          <view class="poi-distance" v-if="item.distance">
            <text>{{ item.distance }}m</text>
          </view>
        </view>
        <view v-if="poiList.length === 0" class="empty-tip">
          <text>点击分类或搜索查看附近场所</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AMapLite } from '@/libs/amap-lite.js'

// 状态变量
const latitude = ref(39.909)
const longitude = ref(116.39742)
const markers = ref([])
const keyword = ref('')
const currentCategory = ref('')
const poiList = ref([])

const categories = ['医院', '药店', '公园', '超市', '公厕']
const myAmapFun = new AMapLite({ key: '4d4e76a5e1b19a9bae4cbc37d3204dc2' });

// 初始化
onMounted(() => {
  // 获取当前位置
  uni.getLocation({
    type: 'gcj02',
    success: function (res) {
      latitude.value = res.latitude
      longitude.value = res.longitude
      // 默认搜索医院
      searchCategory('医院')
    },
    fail: function (err) {
      console.error('定位失败', err)
      uni.showToast({
        title: '获取位置失败，请检查权限',
        icon: 'none'
      })
      // 定位失败也尝试搜索（使用默认坐标或上次坐标）
      searchCategory('医院')
    }
  })
})

// 搜索分类
function searchCategory(category) {
  currentCategory.value = category
  keyword.value = category
  doSearch()
}

// 执行搜索
function doSearch() {
  if (!keyword.value) return

  uni.showLoading({ title: '搜索中...' })
  
  myAmapFun.getPoiAround({
    query_keywords: keyword.value,
    location: `${longitude.value},${latitude.value}`,
    success: function(data){
      // 处理返回的数据
      if (data && data.length > 0) {
        const list = data.map((item, index) => {
          // 处理 location 字符串 "116.123,39.456"
          const locationArr = item.location ? item.location.split(',') : [longitude.value, latitude.value];
          return {
            id: item.id || index,
            name: item.name,
            address: item.address || item.type, // 有些POI可能没有详细地址
            latitude: parseFloat(locationArr[1]),
            longitude: parseFloat(locationArr[0]),
            distance: item.distance || 0,
            tel: item.tel
          }
        });
        poiList.value = list
        updateMarkers(list)
      } else {
        poiList.value = []
        markers.value = []
        uni.showToast({ title: '附近没有找到相关场所', icon: 'none' })
      }
      uni.hideLoading()
    },
    fail: function(info){
      console.error(info)
      uni.hideLoading()
      uni.showToast({ title: '搜索失败', icon: 'none' })
    }
  })
}

// 更新地图标记
function updateMarkers(list) {
  markers.value = list.map((item, index) => ({
    id: index, // 使用索引作为markerId，方便点击事件获取
    latitude: item.latitude,
    longitude: item.longitude,
    title: item.name,
    iconPath: '/static/location.png', // 确保有这个图标，或者使用默认的
    width: 30,
    height: 30,
    callout: {
      content: item.name,
      display: 'ALWAYS',
      padding: 10,
      borderRadius: 5,
      bgColor: '#ffffff',
      color: '#333333'
    }
  }))
}

// 点击标记
function onMarkerTap(e) {
  const markerId = e.markerId
  const item = poiList.value[markerId]
  if (item) {
    goToLocation(item)
  }
}

// 导航去这里
function goToLocation(item) {
  uni.openLocation({
    latitude: item.latitude,
    longitude: item.longitude,
    name: item.name,
    address: item.address
  })
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.map {
  width: 100%;
  height: 50vh;
}

.panel {
  flex: 1;
  background-color: #fff;
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  margin-top: -30rpx; /* 覆盖一点地图 */
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
}

.search-box {
  display: flex;
  margin-bottom: 20rpx;
}

.search-input {
  flex: 1;
  background-color: #f5f5f5;
  height: 80rpx;
  border-radius: 40rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
}

.search-btn {
  width: 120rpx;
  height: 80rpx;
  background-color: #6CB5A3;
  color: #fff;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  font-size: 30rpx;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.category-item {
  padding: 10rpx 30rpx;
  background-color: #f0f0f0;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #666;
}

.category-item.active {
  background-color: #e0f2ef;
  color: #6CB5A3;
  font-weight: bold;
}

.result-list {
  flex: 1;
  overflow-y: auto;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;
}

.poi-info {
  display: flex;
  flex-direction: column;
}

.poi-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.poi-address {
  font-size: 26rpx;
  color: #999;
}

.poi-distance {
  font-size: 26rpx;
  color: #6CB5A3;
}

.empty-tip {
  text-align: center;
  color: #999;
  margin-top: 50rpx;
}
</style>
