import { defineStore } from 'pinia';
import request from '../utils/request';

interface ChatTurn {
  role: 'user' | 'bot';
  text: string;
  timestamp: number;
}

interface LiteratureQuery {
  keyword: string;
  nodesCount: number;
  edgesCount: number;
  timestamp: number;
}

export const useHistoryStore = defineStore('history', {
  state: () => ({ chatHistory: [], literatureQueries: [] }),
  actions: {
    async add(type: 'chat' | 'literature', data: any) {
      await request.post('/history', { type, data });
    },
    async load(type: 'chat' | 'literature') {
      const { data } = await request.get('/history', { params: { type } });
      if (type === 'chat') this.chatHistory = data;
      else this.literatureQueries = data;
    },
    async clear(type: 'chat' | 'literature') {
      await request.delete('/history', { params: { type } });
      type === 'chat' ? this.chatHistory = [] : this.literatureQueries = [];
    },
  },
});
