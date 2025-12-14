<template>
  <view class="detail-page">
    <view class="hero-card">
      <view class="hero-content">
        <view class="hero-info">
          <image class="elder-avatar" :src="defaultAvatar" mode="aspectFill"></image>
          <view class="info-text">
            <text class="elder-name">{{ elderInfo.name }}</text>
            <text class="elder-phone">{{ elderInfo.phone }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 老人信息展示卡片 -->
    <view v-if="savedElderInfo.name" class="info-card">
      <view class="card-header">
        <text class="card-title">老人信息</text>
      </view>
      <view class="info-content">
        <!-- 基本信息展示 -->
        <view class="info-section">
          <text class="section-label">基本信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">姓名</text>
              <text class="info-value">{{ savedElderInfo.name }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">性别</text>
              <text class="info-value">{{ savedElderInfo.gender }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">年龄</text>
              <text class="info-value">{{ savedElderInfo.age }}岁</text>
            </view>
            <view class="info-item">
              <text class="info-label">电话</text>
              <text class="info-value">{{ savedElderInfo.phone }}</text>
            </view>
            <view class="info-item full-width">
              <text class="info-label">亲属关系</text>
              <text class="info-value">{{ relations[savedElderInfo.relationIndex]?.label || '未设置' }}</text>
            </view>
          </view>
        </view>
        
        <!-- 健康信息展示 -->
        <view v-if="savedElderHealthInfo.birthDate" class="info-section">
          <text class="section-label">健康信息</text>
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">出生日期</text>
              <text class="info-value">{{ savedElderHealthInfo.birthDate }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">身高</text>
              <text class="info-value">{{ savedElderHealthInfo.height }}cm</text>
            </view>
            <view class="info-item">
              <text class="info-label">体重</text>
              <text class="info-value">{{ savedElderHealthInfo.weight }}kg</text>
            </view>
            <view class="info-item full-width">
              <text class="info-label">过敏史</text>
              <text class="info-value multi-line">{{ savedElderHealthInfo.allergies || '无' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="action-card" @click="enterElderInfo">
      <view class="action-text-wrapper">
        <text class="action-text">{{ savedElderInfo.name ? '修改老人基本信息' : '录入老人基本信息' }}</text>
        <text v-if="!savedElderInfo.name" class="action-subtext">请先录入基本信息</text>
      </view>
      <view class="arrow"></view>
    </view>
    
    <view class="action-card" @click="enterElderHealthInfo">
      <view class="action-text-wrapper">
        <text class="action-text">{{ savedElderHealthInfo.birthDate ? '修改老人健康信息' : '录入老人健康信息' }}</text>
        <text v-if="!savedElderHealthInfo.birthDate && savedElderInfo.name" class="action-subtext">已录入基本信息，请录入健康信息</text>
        <text v-if="!savedElderInfo.name" class="action-subtext">请先录入基本信息</text>
      </view>
      <view class="arrow"></view>
    </view>

    <view class="family-card">
      <text class="section-title">{{ elderInfo.relation || '爷爷' }}的家人</text>
      <view
        v-for="(member, index) in elderFamilyMembers"
        :key="index"
        class="member-row"
      >
        <view class="member-left">
          <view class="member-avatar"></view>
          <view class="member-detail">
            <view class="role-container">
              <text class="member-role" :data-role="member.relation">{{ member.relation }}</text>
              <text v-if="member.isMe" class="me-tag">我</text>
            </view>
            <text class="member-name">{{ member.name }}</text>
            <text class="member-phone">{{ member.phone }}</text>
          </view>
        </view>
      </view>
    </view>

    <button class="unbind-btn" @click="confirmUnbind">解除绑定</button>
  </view>

  <!-- 基本信息录入/修改模态框 -->
  <uni-popup ref="basicInfoPopup" type="bottom" :mask-click="false">
    <view class="popup-container">
      <view class="popup-header">
        <text class="popup-title">{{ savedElderInfo.name ? '修改老人基本信息' : '录入老人基本信息' }}</text>
        <view class="close-btn" @click="closeBasicInfoPopup">✕</view>
      </view>
      <view class="popup-content">
        <view class="form-item">
          <text class="form-label">姓名</text>
          <input class="form-input" v-model="elderBasicInfo.name" placeholder="请输入老人姓名" />
        </view>
        <view class="form-item">
          <text class="form-label">性别</text>
          <radio-group class="radio-group" v-model="elderBasicInfo.gender" @change="onGenderChange">
            <label class="radio-item">
              <radio value="男" />
              <text>男</text>
            </label>
            <label class="radio-item">
              <radio value="女" />
              <text>女</text>
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="form-label">年龄</text>
          <input class="form-input" v-model.number="elderBasicInfo.age" type="number" placeholder="请输入老人年龄" />
        </view>
        <view class="form-item">
          <text class="form-label">电话</text>
          <input class="form-input" v-model="elderBasicInfo.phone" type="number" placeholder="请输入老人电话" />
        </view>
        <view class="form-item">
          <text class="form-label">亲属关系</text>
          <picker class="form-picker" :range="relations.map(item => item.label)" v-model="elderBasicInfo.relationIndex" mode="selector" @change="onRelationChange">
            <view class="picker-display">{{ relations[elderBasicInfo.relationIndex]?.label || '请选择关系' }}</view>
          </picker>
        </view>
      </view>
      <view class="popup-footer">
        <button class="cancel-btn" @click="closeBasicInfoPopup">取消</button>
        <button class="save-btn" @click="saveBasicInfo">保存</button>
      </view>
    </view>
  </uni-popup>
  
  <!-- 健康信息录入/修改模态框 -->
  <uni-popup ref="healthInfoPopup" type="bottom" :mask-click="false">
    <view class="popup-container">
      <view class="popup-header">
        <text class="popup-title">{{ savedElderHealthInfo.birthDate ? '修改老人健康信息' : '录入老人健康信息' }}</text>
        <view class="close-btn" @click="closeHealthInfoPopup">✕</view>
      </view>
      <view class="popup-content">
        <view class="form-item">
          <text class="form-label">出生日期</text>
          <picker class="form-picker" mode="date" :value="elderHealthInfo.birthDate" start="1900-01-01" end="2024-12-31" @change="onDateChange">
            <view class="picker-display">{{ elderHealthInfo.birthDate || '请选择出生日期' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="form-label">身高 (cm)</text>
          <input class="form-input" v-model.number="elderHealthInfo.height" type="digit" placeholder="请输入老人身高" />
        </view>
        <view class="form-item">
          <text class="form-label">体重 (kg)</text>
          <input class="form-input" v-model.number="elderHealthInfo.weight" type="digit" placeholder="请输入老人体重" />
        </view>
        <view class="form-item">
          <text class="form-label">过敏史</text>
          <textarea class="form-textarea" v-model="elderHealthInfo.allergies" placeholder="请输入老人过敏史，如有多种请用分号分隔" rows="3" />
        </view>
      </view>
      <view class="popup-footer">
        <button class="cancel-btn" @click="closeHealthInfoPopup">取消</button>
        <button class="save-btn" @click="saveHealthInfo">保存</button>
      </view>
    </view>
  </uni-popup>
</template>

<script>
import { oldBasicMessage } from '../../api/information';
export default {
  data() {
    return {
      defaultAvatar: '/static/logo.png',
      elderInfo: {
        name: '张三',
        phone: '159****8564',
        relation: '爷爷'
      },
      // 专门存储老人信息的变量，与账号信息分开
      savedElderInfo: {
        name: '',
        gender: '男',
        age: '',
        phone: '',
        relationIndex: 0
      },
      savedElderHealthInfo: {
        birthDate: '',
        height: '',
        weight: '',
        allergies: ''
      },
      elderFamilyMembers: [
        {
          name: '张三',
          relation: '孙子',
          phone: '199****1234',
          isMe: true
        },
        {
          name: '张九',
          relation: '女儿',
          phone: '199****1234',
          isMe: false
        }
      ],
      // 基本信息表单数据
      elderBasicInfo: {
        name: '',
        gender: '男',
        age: '',
        phone: '',
        relationIndex: 0
      },
      relations: [
        { label: '爷爷', value: 'grandfather' },
        { label: '奶奶', value: 'grandmother' },
        { label: '爸爸', value: 'father' },
        { label: '妈妈', value: 'mother' },
        { label: '叔叔', value: 'uncle' },
        { label: '阿姨', value: 'aunt' },
        { label: '其他', value: 'other' }
      ],
      // 健康信息表单数据
    elderHealthInfo: {
      birthDate: '',
      height: '',
      weight: '',
      allergies: ''
    },
    loading: false
    };
  },
  onLoad(options) {
    // 从路由参数中获取老人信息
    if (options) {
      this.elderInfo.name = decodeURIComponent(options.name || '爷爷');
      this.elderInfo.phone = decodeURIComponent(options.phone || '137****1234');
      this.elderInfo.relation = decodeURIComponent(options.relation || '爷爷');
    }
  },
  methods: {
    goBack() {
      uni.redirectTo({ url: '/pages/login/login' });
    },
    enterElderInfo() {
        // 如果已有保存的老人基本信息，则加载到表单中
        if (this.savedElderInfo.name) {
          this.elderBasicInfo = { ...this.savedElderInfo };
        }
        // 打开基本信息录入模态框
        this.$refs.basicInfoPopup.open();
      },
    closeBasicInfoPopup() {
      // 关闭基本信息录入模态框
      this.$refs.basicInfoPopup.close();
    },
    onGenderChange(e) {
      // 确保性别值正确更新
      this.elderBasicInfo.gender = e.detail.value;
    },
    saveBasicInfo() {
        // 验证表单
        if (!this.elderBasicInfo.name) {
          uni.showToast({
            title: '请输入老人姓名',
            icon: 'none'
          });
          return;
        }
        if (!this.elderBasicInfo.age) {
          uni.showToast({
            title: '请输入老人年龄',
            icon: 'none'
          });
          return;
        }
        if (!this.elderBasicInfo.phone || !/^1\d{10}$/.test(this.elderBasicInfo.phone)) {
          uni.showToast({
            title: '请输入正确的手机号码',
            icon: 'none'
          });
          return;
        }
        
        this.loading = true;
        
        // 准备API请求数据
        const apiData = {
          oldId: 0, // 这里可能需要从其他地方获取，暂时用0
          oldName: this.elderBasicInfo.name,
          gender: this.elderBasicInfo.gender === '男' ? 1 : 0, // 转换为数字格式
          oldTelephone: this.elderBasicInfo.phone,
          relation: this.relations[this.elderBasicInfo.relationIndex].label
        };
        
        // 调用API保存数据
        oldBasicMessage(apiData)
          .then(res => {
            // 保存老人信息到专门的变量中
            this.savedElderInfo = { ...this.elderBasicInfo };
            
            // 更新老人关系显示，但不修改账号姓名
            this.elderInfo.relation = this.relations[this.elderBasicInfo.relationIndex].label;
            
            // 保存成功提示
            uni.showToast({
              title: '基本信息保存成功',
              icon: 'success'
            });
            
            // 关闭模态框
            setTimeout(() => {
              this.$refs.basicInfoPopup.close();
            }, 1500);
          })
          .catch(err => {
            console.error('保存老人信息失败:', err);
            uni.showToast({
              title: '保存失败，请稍后重试',
              icon: 'none'
            });
          })
          .finally(() => {
            this.loading = false;
          });
      },
      onRelationChange(e) {
        // 更新选择的关系索引
        this.elderBasicInfo.relationIndex = e.detail.value;
      },
      enterElderHealthInfo() {
        // 如果已有保存的老人健康信息，则加载到表单中
        if (this.savedElderHealthInfo.birthDate) {
          this.elderHealthInfo = { ...this.savedElderHealthInfo };
        }
        // 打开健康信息录入模态框
        this.$refs.healthInfoPopup.open();
      },
      closeHealthInfoPopup() {
        // 关闭健康信息录入模态框
        this.$refs.healthInfoPopup.close();
      },
      onDateChange(e) {
        // 处理日期选择变化
        this.elderHealthInfo.birthDate = e.detail.value;
      },
      saveHealthInfo() {
        // 验证表单
        if (!this.elderHealthInfo.birthDate) {
          uni.showToast({
            title: '请选择出生日期',
            icon: 'none'
          });
          return;
        }
        if (!this.elderHealthInfo.height) {
          uni.showToast({
            title: '请输入老人身高',
            icon: 'none'
          });
          return;
        }
        if (!this.elderHealthInfo.weight) {
          uni.showToast({
            title: '请输入老人体重',
            icon: 'none'
          });
          return;
        }
        
        // 保存健康信息到专门的变量中
        this.savedElderHealthInfo = { ...this.elderHealthInfo };
        
        // 保存成功提示
        uni.showToast({
          title: '健康信息保存成功',
          icon: 'success'
        });
        
        // 关闭模态框
        setTimeout(() => {
          this.$refs.healthInfoPopup.close();
        }, 1500);
      },
    confirmUnbind() {
      uni.showModal({
        title: '确认解除绑定',
        content: '确定要解除与这位老人的绑定关系吗？',
        success: (res) => {
          if (res.confirm) {
            // 解除绑定逻辑
            uni.showToast({
              title: '解除绑定成功',
              icon: 'success'
            });
            // 返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.detail-page {
    padding: 40rpx 30rpx 80rpx;
    background-color: rgba(245, 245, 245, 1);
    min-height: 100vh;
    box-sizing: border-box;
  }

.hero-card {
  position: relative;
  overflow: hidden;
  padding: 6rpx;
  margin-bottom: 30rpx;
}

.kuang {
  position: absolute;
  width: 106%;
  height: 60%;
  z-index: 0;
  display: block;
  left: -3%;
}



.hero-content {
  position: relative;
  z-index: 1;
  background: url('/static/familydetail.png') no-repeat, linear-gradient(135deg, #6cc6b1, #4aa38b);
  background-size: cover;
  padding: 2.25rem 0.9375rem;
  color: #fff;
  border-radius: 1rem 1rem 1rem 1rem;
}

.back-btn {
  width: 24rpx;
  height: 24rpx;
  border-left: 4rpx solid #fff;
  border-bottom: 4rpx solid #fff;
  transform: rotate(45deg);
  margin-bottom: 40rpx;
}

.hero-info {
  display: flex;
  align-items: center;
}

.elder-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
}

.info-text {
  margin-left: 24rpx;
}

.elder-name {
  font-size: 40rpx;
  font-weight: 600;
  display: block;
}

.elder-phone {
  font-size: 28rpx;
  margin-top: 20rpx;
  opacity: 0.85;
  display: block;
}

.action-card {
    background-color: #fff;
    border-radius: 24rpx;
    padding: 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
    box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .action-card.has-info {
    border-left: 6rpx solid #4aa38b;
    background-color: rgba(74, 163, 139, 0.05);
  }

  .action-text-wrapper {
    flex: 1;
    margin-right: 20rpx;
  }

  .action-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
    display: block;
  }

  .action-subtext {
    font-size: 26rpx;
    color: #999;
    margin-top: 8rpx;
    display: block;
    line-height: 1.4;
  }

.arrow {
  width: 20rpx;
  height: 20rpx;
  border-top: 4rpx solid #4aa38b;
  border-right: 4rpx solid #4aa38b;
  transform: rotate(45deg);
}

.family-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 20rpx 0 10rpx;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  padding: 0 30rpx 20rpx;
}

.member-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 30rpx;
}

.member-row + .member-row {
  border-top: 1rpx solid #f0f0f0;
}

.member-left {
  display: flex;
  align-items: center;
}

.member-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #dcdcdc;
}

.member-detail {
  margin-left: 20rpx;
}

.role-container {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}

.member-role {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  display: inline-block;
}

/* 为孙子关系添加字体加粗 */
.member-role[data-role="孙子"] {
  font-weight: 600;
}

.member-name {
  font-size: 28rpx;
  color: #555;
  margin-top: 6rpx;
  display: block;
}

.member-phone {
  font-size: 26rpx;
  color: #999;
  margin-top: 4rpx;
  display: block;
}

.me-tag {
  font-size: 26rpx;
  color: #fff;
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
  background-color: rgba(237, 114, 48, 1);
  margin-left: 8px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.unbind-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  margin-top: 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  color: #f24949;
  border: none;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: none;
}

/* 保留按钮原有的边框样式 */
  
  /* 信息展示卡片样式 */
.info-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 20rpx;
  border-bottom: 2rpx solid #f0f0f0;
  padding-bottom: 20rpx;
}

.card-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.info-section {
  margin-bottom: 24rpx;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-label {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  color: #666;
  margin-bottom: 16rpx;
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10rpx;
}

.info-item {
  width: 50%;
  padding: 0 10rpx 16rpx;
  box-sizing: border-box;
}

.info-item.full-width {
  width: 100%;
}

.info-label {
  display: block;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 6rpx;
}

.info-value {
  display: block;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.info-value.multi-line {
  line-height: 1.5;
  word-break: break-all;
}

/* 模态框样式 */
  .popup-container {
    background-color: #fff;
    border-radius: 30rpx 30rpx 0 0;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .popup-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333;
  }
  
  .close-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #999;
  }
  
  .popup-content {
    padding: 30rpx;
  }
  
  .form-item {
    margin-bottom: 30rpx;
  }
  
  .form-label {
    display: block;
    font-size: 32rpx;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .form-input {
    width: 100%;
    height: 88rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 30rpx;
    box-sizing: border-box;
  }
  
  .radio-group {
    display: flex;
    gap: 40rpx;
  }
  
  .radio-item {
    display: flex;
    align-items: center;
    gap: 10rpx;
    font-size: 30rpx;
  }
  
  .form-picker {
    width: 100%;
    height: 88rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .picker-display {
    font-size: 30rpx;
    color: #666;
  }
  
  .popup-footer {
    padding: 30rpx;
    display: flex;
    gap: 20rpx;
  }
  
  .cancel-btn,
  .save-btn {
    flex: 1;
    height: 96rpx;
    line-height: 96rpx;
    font-size: 32rpx;
    border-radius: 48rpx;
  }
  
  .cancel-btn {
    background-color: #f5f5f5;
    color: #666;
    border: none;
  }
  
  .save-btn {
    background-color: #4aa38b;
    color: #fff;
    border: none;
  }
  
  .cancel-btn::after,
  .save-btn::after {
    border: none;
  }
  
  /* 多行文本输入框样式 */
  .form-textarea {
    width: 100%;
    height: 180rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    padding: 20rpx 24rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    resize: none;
  }
</style>