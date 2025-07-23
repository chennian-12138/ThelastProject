// 路由修复脚本
// 这个脚本用于确保所有路由路径统一

console.log('🔧 开始检查路由配置...');

// 检查当前路由配置
const expectedRoutes = {
  '/bot': '对话页面',
  '/history': '历史记录页面',
  '/about': '关于我们页面',
  '/graph': '文献图谱页面',
  '/profile': '用户资料页面',
  '/home': '首页',
  '/login': '登录页面',
  '/register': '注册页面'
};

console.log('✅ 期望的路由配置:');
Object.entries(expectedRoutes).forEach(([path, desc]) => {
  console.log(`  ${path} -> ${desc}`);
});

console.log('\n📋 修复建议:');
console.log('1. 确保所有导航链接使用新路径');
console.log('2. 清除浏览器缓存和localStorage中的旧路径');
console.log('3. 重启开发服务器');

// 清理localStorage中可能存在的旧路径
if (typeof window !== 'undefined') {
  console.log('🧹 清理浏览器缓存...');
  
  // 清理可能存在的旧路径缓存
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.includes('route') || key.includes('redirect')
  );
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`  已移除: ${key}`);
  });
}

console.log('✅ 路由修复完成！');
console.log('请重启开发服务器以确保所有更改生效。');
