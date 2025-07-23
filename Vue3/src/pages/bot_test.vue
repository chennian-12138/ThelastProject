<template>
  <div class="chat-container">

    <div class="chat-box">
      <ul class="message-list" ref="messageList">
        <li
          class="message-item"
          v-for="(message, index) in messages"
          :key="index"
          :class="message.type === 'user' ? 'text-right' : 'text-left'"
        >

          <div class="message-content">
            <!-- 思考内容 -->
            <div
              v-if="message.type === 'bot' && message.think && showThink"
              class="think"
            >
              {{ message.think }}
            </div>

            <!-- 打字机效果的动态文本 -->
            <div class="dynamic-text">
              <span v-html="message.displayText"></span>
            </div>
          </div>

        </li>
      </ul>
    </div>

    <div class="chat-input">
      <input
        type="text"
        id="chat-input"
        placeholder="输入消息并按Enter键发送"
        v-model="userInput"
        @keydown.enter="sendMessage"
      />
      <button @click="sendMessage">发送</button>
    </div>
    <!-- 切换思考内容显示的按钮 -->
    <button
      class="toggle-think-button"
      @click="toggleThinkContent"
    >
      {{ showThink ? "隐藏思考内容" : "显示思考内容" }}
    </button>

  </div>
</template>

<script>
import { useHistoryStore } from '@/store/history';
export default {
  data() {
    return {
      userInput: "",
      messages: [],
      showThink: false,
    };
  },
  setup() {
    const history = useHistoryStore();
    // 注意：这里不自动加载历史记录，避免401错误
    // 历史记录会在用户登录后通过其他方式加载
    return { history };
  },
  methods: {
    async sendMessage() {
      const inputText = this.userInput.trim();
      if (!inputText) {
        alert("请输入内容！");
        return;
      }

      // 添加用户消息
      this.messages.push({
        type: "user",
        displayText: inputText,
      });
      this.userInput = "";

      // 保存用户消息到历史记录
      this.history.add('chat', { 
        role: 'user', 
        text: inputText, 
        timestamp: Date.now() 
      });

      // 添加加载状态的消息
      this.messages.push({
        type: "bot",
        displayText: "正在思考...",
        think: "正在思考...",
      });

      // 滚动到底部
      this.scrollToBottom();

      try {
        // 调用后端API接口
        const botResponse = await this.getBotResponse(inputText);

        // 替换加载状态的消息为实际回复
        const lastMessageIndex = this.messages.length - 1;
        this.messages[lastMessageIndex] = {
          type: "bot",
          displayText: botResponse.text,
          think: botResponse.think,
        };

        // 保存bot回复到历史记录
        this.history.add('chat', { 
          role: 'bot', 
          text: botResponse.text, 
          timestamp: Date.now() 
        });

        // 模拟打字机效果
        this.typeWriterEffect(
          lastMessageIndex,
          botResponse.text,
          "displayText",
          botResponse.think
        );
      } catch (error) {
        console.error("获取回答时出错:", error);
        const lastMessageIndex = this.messages.length - 1;
        this.messages[lastMessageIndex] = {
          type: "bot",
          displayText: "抱歉，我无法回答你的问题。",
        };
      }

      // 滚动到底部
      this.scrollToBottom();
    },
    async getBotResponse(prompt) {
      try {
        const response = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("认证失败，请重新登录");
          }
          throw new Error("网络请求失败");
        }

        const data = await response.json();
        
        return {
          text: data.text,
          think: data.think || "",
        };
      } catch (error) {
        throw error;
      }
    },
    extractThinkContent(response) {
      const thinkRegex = /<think>(.*?)<\/think>/s;
      const match = response.match(thinkRegex);

      if (match) {
        const thinkContent = match[1].trim();
        const finalText = response.replace(thinkRegex, "").trim();
        return { thinkContent, finalText };
      } else {
        return { thinkContent: "", finalText: response };
      }
    },
    typeWriterEffect(index, text, field, thinkText) {
  let dynamicText = "";
  const speed = 5; // 打字速度（毫秒）

  const intervalId = setInterval(() => {
    if (dynamicText.length < text.length) {
      dynamicText += text.charAt(dynamicText.length);
      this.messages[index][field] = dynamicText; // 直接赋值即可
      if (thinkText && this.showThink) {
        this.messages[index].think = dynamicText;
      }
    } else {
      clearInterval(intervalId);
    }
    this.scrollToBottom();
  }, speed);
},
    scrollToBottom() {
      const messageList = this.$refs.messageList;
      messageList.scrollTop = messageList.scrollHeight;
    },
    toggleThinkContent() {
      this.showThink = !this.showThink;
    },
  },
  mounted() {
    this.scrollToBottom();
  },
};
</script>

<style scoped>
  @import url("../assets/styles/bot_test.css");
</style>
