<template>
  <div class="chat-container">
    <!-- 聊天消息列表区域 -->
    <div class="message-list" ref="messageListRef">
      <div 
        v-for="(msg, index) in messages" 
        :key="index" 
        class="message-item"
        :class="msg.type"
      >
        <div class="bubble">{{ msg.content }}</div>
      </div>
    </div>

    <!-- 底部输入框区域 -->
    <div class="input-area">
      <input 
        v-model="inputText" 
        @keyup.enter="sendMessage"
        type="text" 
        placeholder="输入消息并回车发送..."
      />
      <button @click="sendMessage">发送</button>
    </div>

    <div class="show-area">
        <button @click="handleShow">Show</button>
        <div v-if="showInput" >
            <input ref="inputRef">
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const showInput = ref(true);
const inputRef = ref(null)

const handleShow = async function() {
    showInput.value = !showInput.value;

    if (showInput.value) {
        await nextTick();
        inputRef.value.focus();
    }
}

// 1. 定义数据
const messages = ref([
  { type: 'system', content: '欢迎来到聊天室！' },
  { type: 'other', content: '你好，请问有人在吗？' }
])
const inputText = ref('')
const messageListRef = ref(null) // 获取 DOM 元素的引用

// 2. 发送消息的方法
const sendMessage = async () => {
  if (!inputText.value.trim()) return

  // 步骤 A: 修改数据 (此时 DOM 还没更新)
  messages.value.push({
    type: 'self',
    content: inputText.value
  })
  
  // 清空输入框
  inputText.value = ''

  // 步骤 B: 等待 DOM 更新完成
  // 必须用 await 或 .then()，否则下面的滚动逻辑会失效
  await nextTick()

  // 步骤 C: 操作 DOM，滚动到底部
  // scrollHeight 是内容的总高度，scrollTop 是滚动条的位置
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}
</script>

<style scoped>
/* 简单的样式，让效果更直观 */
.chat-container {
  width: 300px;
  height: 400px;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
}

.message-list {
  flex: 1;
  overflow-y: auto; /* 内容多了自动滚动 */
  padding: 10px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
}

/* 不同角色的样式 */
.self {
  align-self: flex-end;
  background-color: #95ec69;
}

.other {
  align-self: flex-start;
  background-color: #fff;
}

.system {
  align-self: center;
  background-color: #e0e0e0;
  font-size: 12px;
  color: #666;
}

.input-area {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.input-area button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>