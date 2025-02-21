<template>
    <div id="chat-box">
      <div class="chat-container">
        <div class="chat-messages" ref="chatMessages">
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="message.type === 'user' ? 'user-message' : 'bot-message'"
          >
            <div v-if="message.type === 'bot' && message.think" class="think">
              {{ message.think }}
            </div>
            {{ message.text }}
          </div>
        </div>
        <div class="input-box">
          <input
            type="text"
            id="chat-input"
            placeholder="输入消息并按Enter键发送"
            v-model="userInput"
            @keypress.enter="sendMessage"
          />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted} from "vue";
  
  // 定义消息类型
  interface Message {
    type: "user" | "bot";
    text: string;
    think?: string; // 可选字段，仅用于 bot 消息
  }
  
  // 初始化消息列表
  const messages = ref<Message[]>([]);
  
  const userInput = ref("");
  
  async function sendMessage() {
    const inputText = userInput.value.trim();
    if (!inputText) {
      alert("请输入内容！");
      return;
    }
  
    // 添加用户消息到消息列表
    messages.value.push({ type: "user", text: inputText });
    userInput.value = "";
  
    // 添加加载状态的消息
    messages.value.push({ type: "bot", text: "正在思考...", think: "正在思考..." });
  
    // 滚动到消息底部
    scrollToBottom();
  
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1",
          prompt: inputText,
          stream: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error("网络请求失败");
      }
  
      const data = await response.json();
      const botResponse = data.response;
  
      // 替换加载状态的消息为实际回复
      const lastMessageIndex = messages.value.length - 1;
      messages.value.splice(lastMessageIndex, 1, {
        type: "bot",
        text: botResponse,
      });
    } catch (error) {
      console.error("获取回答时出错:", error);
      const lastMessageIndex = messages.value.length - 1;
      messages.value.splice(lastMessageIndex, 1, {
        type: "bot",
        text: "抱歉，我无法回答你的问题。",
      });
    }
  
    // 滚动到消息底部
    scrollToBottom();
  }
  
  function scrollToBottom() {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
  
  onMounted(() => {
    scrollToBottom();
  });
  </script>
  
  <style scoped>
  /* 聊天框样式 */
  #chat-box {
    height: 100%;
    max-width: 780px;
    width: 100%;
    margin-left: 20px;
    border-radius: 25px;
    background-color: transparent;
    z-index: 10;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  
  .user-message {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 14px;
    max-width: 50%;
    word-wrap: break-word;
    text-align: right;
    background-color: #e1ffc9;
    align-self: flex-end;
    margin-left: auto;
  }
  
  .bot-message {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: 14px;
    max-width: 50%;
    word-wrap: break-word;
    text-align: left;
    background-color: #e1f0ff;
    align-self: flex-start;
    margin-right: auto;
  }
  
  .think {
    color: gray;
    font-size: 12px;
  }
  
  .input-box {
    display: flex;
    justify-content: space-between;
  }
  
  .input-box input {
    width: 80%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .input-box button {
    width: 15%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .input-box button:hover {
    background-color: #0056b3;
  }
  
  /* 夜间模式 */
  .dark-theme .chat-container {
    background-color: #555555;
  }
  
  .dark-theme .user-message {
    background-color: #444444;
  }
  
  .dark-theme .bot-message {
    background-color: #333333;
  }
  
  .dark-theme .think {
    color: #888888;
  }
  
  .dark-theme .input-box input {
    background-color: #333333;
    border: 1px solid #555555;
    color: #ffffff;
  }
  
  .dark-theme .input-box button {
    background-color: #0056b3;
  }
  
  .dark-theme .input-box button:hover {
    background-color: #003f7f;
  }
  </style>