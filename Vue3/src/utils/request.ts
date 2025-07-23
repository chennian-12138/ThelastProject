import axios from 'axios';

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// 错误消息映射
const errorMessages: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求的资源不存在',
  408: '请求超时',
  429: '请求过于频繁，请稍后再试',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务暂时不可用',
  504: '网关超时',
};

// 显示错误消息
const showErrorMessage = (message: string) => {
  // 使用自定义事件来显示错误消息，让UI组件来处理
  window.dispatchEvent(new CustomEvent('show-error-message', { 
    detail: { message, type: 'error' } 
  }));
  
  // 回退到console
  console.error(message);
};

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      // 根据状态码处理错误
      let errorMessage = errorMessages[status] || '请求失败';
      
      // 如果后端返回了具体的错误消息，使用它
      if (data?.message) {
        errorMessage = data.message;
      }
      
      // 特殊处理401错误
      if (status === 401) {
        localStorage.removeItem('token');
        // 使用事件触发登录弹窗，而不是直接跳转
        window.dispatchEvent(new CustomEvent('auth-required'));
      }
      
      // 显示错误消息
      showErrorMessage(errorMessage);
      
      // 将错误信息添加到error对象中
      error.message = errorMessage;
      
    } else if (error.code === 'ECONNABORTED') {
      // 请求超时
      const timeoutMessage = '请求超时，请检查网络连接';
      showErrorMessage(timeoutMessage);
      error.message = timeoutMessage;
      
    } else if (error.message === 'Network Error') {
      // 网络错误
      const networkMessage = '网络连接错误，请检查网络连接';
      showErrorMessage(networkMessage);
      error.message = networkMessage;
      
    } else {
      // 其他错误
      const defaultMessage = '请求失败，请稍后重试';
      showErrorMessage(defaultMessage);
      error.message = defaultMessage;
    }
    
    return Promise.reject(error);
  }
);

export default request;
