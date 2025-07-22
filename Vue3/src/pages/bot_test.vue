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
export default {
  data() {
    return {
      userInput: "",
      messages: [],
      showThink: false,
    };
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

      // 添加加载状态的消息
      this.messages.push({
        type: "bot",
        displayText: "正在思考...",
        think: "正在思考...",
      });

      // 滚动到底部
      this.scrollToBottom();

      try {
        // 调用Ollama接口
        const botResponse = await this.getBotResponse(inputText);

        // 替换加载状态的消息为实际回复
        const lastMessageIndex = this.messages.length - 1;
        this.messages[lastMessageIndex] = {
          type: "bot",
          displayText: botResponse.text,
          think: botResponse.think,
        };

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
        const response = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "my_ds_for_test/deepseek-r1", // 确保模型名称正确
            prompt: prompt,
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error("网络请求失败");
        }

        const data = await response.json();
        const botResponse = data.response;

        // 解析 <think> 标签内容
        const { thinkContent, finalText } = this.extractThinkContent(botResponse);

        return {
          text: finalText,
          think: thinkContent,
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