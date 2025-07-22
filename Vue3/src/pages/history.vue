<template>
  <div class="history-page">
    <h2>对话历史</h2>
    <ul>
      <li v-for="(t, i) in history.chatHistory" :key="i">
        <strong>{{ t.role }}:</strong> {{ t.text }}
      </li>
    </ul>

    <h2>文献检索历史</h2>
    <ul>
      <li v-for="(q, i) in history.literatureQueries" :key="i">
        <RouterLink :to="{ path: '/graph', query: { q: q.keyword } }">
          {{ q.keyword }} ({{ q.nodesCount }} 节点 / {{ q.edgesCount }} 边)
        </RouterLink>
      </li>
    </ul>

    <button @click="history.clear('chat')">清空对话</button>
    <button @click="history.clear('literature')">清空检索</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHistoryStore } from '@/store/history';

const history = useHistoryStore();
onMounted(() => history.load());
</script>

<style scoped>
.history-page { padding: 2rem; }
li { margin: 0.5rem 0; }
</style>