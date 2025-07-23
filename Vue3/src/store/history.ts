import { defineStore } from 'pinia';
import request from '@/utils/request';
import { useAuthStore } from './auth';

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
  state: () => ({ 
    chatHistory: [] as ChatTurn[], 
    literatureQueries: [] as LiteratureQuery[],
    isLoading: false
  }),
  
  actions: {
    async add(type: 'chat' | 'literature', data: any) {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        console.warn('用户未登录，无法保存历史记录');
        return;
      }

      try {
        // 对于对话历史，直接通过对话API保存
        if (type === 'chat') {
          // 对话历史现在通过 /api/chat 接口自动保存
          return;
        }
        
        // 对于文献查询历史，使用原来的接口
        await request.post('/history', { type, data });
        // 添加成功后立即刷新本地数据
        await this.load(type);
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
    },
    
    async load(type: 'chat' | 'literature') {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        // 未登录时清空本地数据
        if (type === 'chat') this.chatHistory = [];
        else this.literatureQueries = [];
        return;
      }

      this.isLoading = true;
      try {
        let response;
        
        if (type === 'chat') {
          // 使用新的对话历史接口
          response = await request.get('/chat/history', { 
            timeout: 10000
          });
          this.chatHistory = response.data.history || [];
        } else {
          // 使用原来的历史记录接口
          response = await request.get('/history', { 
            params: { type },
            timeout: 10000
          });
          this.literatureQueries = response.data || [];
        }
      } catch (error) {
        console.error('加载历史记录失败:', error);
        // 发生错误时清空本地数据
        if (type === 'chat') this.chatHistory = [];
        else this.literatureQueries = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async clear(type: 'chat' | 'literature') {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        console.warn('用户未登录，无法清空历史记录');
        return;
      }

      try {
        await request.delete('/history', { params: { type } });
        if (type === 'chat') this.chatHistory = [];
        else this.literatureQueries = [];
      } catch (error) {
        console.error('清空历史记录失败:', error);
        throw error;
      }
    },

    // 初始化加载所有历史记录
    async init() {
      if (useAuthStore().isAuthenticated) {
        await Promise.all([
          this.load('chat'),
          this.load('literature')
        ]);
      }
    }
  },
});
