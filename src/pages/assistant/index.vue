<template>
  <view class="container">
    <!-- 聊天内容区域 -->
    <scroll-view class="chat-list" scroll-y :scroll-top="scrollTop" scroll-with-animation>
      <view class="message-item" v-for="(msg, index) in messages" :key="index" :class="msg.type">
        <view class="avatar">
          <image 
            class="avatar-img" 
            :src="msg.type === 'assistant' ? '/static/tab-assistant.png' : '/static/tab-my-active.png'" 
            mode="aspectFit" 
          />
        </view>
        <view class="bubble">
          <text class="message-text">{{ msg.content }}</text>
        </view>
      </view>
      <!-- 占位，防止最后一条消息被输入框遮挡 -->
      <view class="padding-bottom"></view>
    </scroll-view>

    <!-- 底部输入区域 -->
    <view class="input-area">
      <view class="voice-btn" @touchstart="startRecord" @touchend="stopRecord">
        <view class="mic-icon-wrapper">
          <image src="/static/mic-on.png" class="mic-icon" mode="aspectFit" />
        </view>
      </view>
      <view class="input-wrapper">
        <input 
          class="text-input" 
          v-model="inputText" 
          placeholder="请输入想要的锻炼或问题" 
          placeholder-style="color: #999"
          confirm-type="send"
          @confirm="sendMessage"
        />
      </view>
      <view class="send-btn" @click="sendMessage" v-if="inputText.trim()">
        <text>发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 引入微信同声传译插件
let plugin = null
let manager = null

try {
  plugin = requirePlugin('WechatSI')
  manager = plugin.getRecordRecognitionManager()
} catch (e) {
  console.error('WechatSI plugin load failed:', e)
}

const scrollTop = ref(0)
const inputText = ref('')
const isRecording = ref(false)
const messages = ref([
  { 
    type: 'assistant', 
    content: '您好，我是您的健康助手。我可以指导您进行科学锻炼，或者陪您聊天。\n\n💡 为了您的安全，锻炼前请确保身体状况良好。\n\n您可以按住下方话筒说话，或者直接输入文字哦。' 
  }
])

// 页面加载时检查是否有参数
onLoad((options) => {
  console.log('Assistant Page onLoad:', options)
  if (options && options.query) {
    const query = decodeURIComponent(options.query)
    console.log('Decoded query:', query)
    if (query) {
      inputText.value = query
      // 自动发送
      setTimeout(() => {
        console.log('Auto sending message...')
        sendMessage()
      }, 500)
    }
  }
})

// 初始化语音识别
onMounted(() => {
  initRecord()
})

function initRecord() {
  if (!manager) return
  manager.onRecognize = function(res) {
    console.log('current result', res.result)
  }
  manager.onStop = function(res) {
    console.log('record file path', res.tempFilePath)
    console.log('result', res.result)
    if (res.result) {
      inputText.value = res.result
      sendMessage() // 识别完成后自动发送
    } else {
      uni.showToast({ title: '没听清，请再说一遍', icon: 'none' })
    }
    isRecording.value = false
  }
  manager.onError = function(res) {
    console.error('error msg', res.msg)
    isRecording.value = false
    uni.showToast({ title: '语音识别出错', icon: 'none' })
  }
}

// 发送消息
function sendMessage() {
  if (!inputText.value.trim()) return

  const userContent = inputText.value
  // 添加用户消息
  messages.value.push({
    type: 'user',
    content: userContent
  })

  inputText.value = ''
  scrollToBottom()
  
  // 调用 AI 回复
  callAI(userContent)
}

// 调用 DeepSeek API (兼容 OpenAI 格式)
function callAI(content) {
  // 显示加载状态
  messages.value.push({
    type: 'assistant',
    content: '思考中...',
    isTyping: true
  })
  scrollToBottom()

  // 这里的 API Key 需要用户自己申请，这里使用豆包（火山引擎）的配置
  // 实际开发中应该放在后端或加密，前端直接调用会有泄露风险
  // 注意：小程序需要在后台配置 request 合法域名：https://ark.cn-beijing.volces.com
  const API_KEY = '8d956be3-ec92-4251-9ccf-1faf54cc1616' // 请替换为您在火山引擎申请的 API Key
  const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
  const MODEL_ID = 'doubao-seed-1-6-251015' // 请替换为您创建的推理接入点 ID (Endpoint ID)

  uni.request({
    url: API_URL,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    data: {
      model: MODEL_ID,
      messages: [
        { role: "system", content: "你是一个专业的养老健康助手，语气亲切、耐心，特别适合与老年人对话。你的主要任务是指导老年人进行科学锻炼（如太极、散步、简单的伸展运动），回答健康咨询，以及进行情感陪伴。注意：在推荐锻炼时，请务必提醒用户根据自身身体状况量力而行，注意安全。回答要简洁明了，语速适中（通过文字体现），避免过于复杂的专业术语。" },
        ...messages.value.filter(m => !m.isTyping).map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        })).slice(-10) // 只带最近10条历史，节省token
      ],
      stream: false
    },
    success: (res) => {
      // 移除"思考中..."
      messages.value.pop()
      
      if (res.statusCode === 200 && res.data.choices && res.data.choices.length > 0) {
        const reply = res.data.choices[0].message.content
        messages.value.push({
          type: 'assistant',
          content: reply
        })
        // 语音播报回复
        textToSpeech(reply)
      } else {
        if (res.statusCode === 401 || res.statusCode === 403) {
          messages.value.push({
            type: 'assistant',
            content: '鉴权失败：请检查API Key与接入点ID是否有效，并确认账号权限。'
          })
        } else {
          messages.value.push({
            type: 'assistant',
            content: '抱歉，我暂时无法回答您的问题，请稍后再试。'
          })
        }
      }
    },
    fail: (err) => {
      messages.value.pop()
      console.error('Request Error', err)
      let errorMsg = '网络连接失败，请检查您的网络设置。'
      if (err.errMsg && err.errMsg.includes('domain')) {
          errorMsg = '请求失败：域名未配置。\n真机预览请点击胶囊按钮->开发调试->打开调试。'
      } else {
          errorMsg = '网络错误：' + err.errMsg
      }
      messages.value.push({
        type: 'assistant',
        content: errorMsg
      })
    },
    complete: () => {
      scrollToBottom()
    }
  })
}

// 语音播报
function textToSpeech(text) {
  if (!plugin) return
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: text,
    success: function(res) {
      console.log("succ tts", res.filename)
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src = res.filename
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
      })
    },
    fail: function(res) {
      console.log("fail tts", res)
    }
  })
}

function startRecord() {
  if (!manager) {
    uni.showToast({ title: '语音功能不可用', icon: 'none' })
    return
  }
  isRecording.value = true
  manager.start({ duration: 30000, lang: "zh_CN" })
  uni.showToast({ title: '正在听您说...', icon: 'none', duration: 30000 })
}

function stopRecord() {
  if (isRecording.value && manager) {
    manager.stop()
    uni.hideToast()
  }
}

function scrollToBottom() {
  nextTick(() => {
    scrollTop.value = messages.value.length * 500 // 增加估算高度
  })
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 0;
  box-sizing: border-box;
}

/* 聊天列表 */
.chat-list {
  flex: 1;
  padding: 30rpx;
  box-sizing: border-box;
}

.message-item {
  display: flex;
  margin-bottom: 40rpx;
  align-items: flex-start;
}

.message-item.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #fff;
  flex-shrink: 0;
  border: 2rpx solid #6CB5A3; /* 给AI头像加个绿色边框，类似设计图 */
}

.avatar-img {
  width: 80%;
  height: 80%;
}

.message-item.user .avatar {
  border: 2rpx solid #FF9800; /* 用户头像边框保持橙色区分，或者也用绿色? 设计图只有AI */
}

.bubble {
  max-width: 65%;
  padding: 30rpx;
  border-radius: 20rpx;
  margin: 0 20rpx;
  position: relative;
  font-size: 34rpx;
  line-height: 1.5;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); /* 轻微阴影 */
}

.assistant .bubble {
  background-color: #fff;
  color: #333;
  border: 2rpx solid #eee; /* 边框 */
  border-top-left-radius: 4rpx;
}

.user .bubble {
  background-color: #6CB5A3;
  color: #fff;
  border-top-right-radius: 4rpx;
}

.padding-bottom {
  height: 120rpx;
}

/* 底部输入区 */
.input-area {
  background-color: #fff;
  padding: 20rpx;
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.voice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.mic-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid #6CB5A3; /* 绿色圆圈边框 */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.mic-icon {
  width: 60rpx;
  height: 60rpx;
}

.input-wrapper {
  flex: 1;
  background-color: #fff;
  border-radius: 12rpx; /* 方角圆润 */
  padding: 24rpx 30rpx;
  border: 2rpx solid #6CB5A3; /* 绿色边框 */
  height: 100rpx; /* 增加高度 */
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

.text-input {
  font-size: 32rpx;
  width: 100%;
  color: #333;
}

.send-btn {
  background-color: #6CB5A3;
  color: #fff;
  padding: 16rpx 30rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: bold;
}
</style>
