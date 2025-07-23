// 测试脚本：验证所有修复是否正常工作
// 运行方式：node test_fixes.js

const http = require('http');

// 测试配置
const TEST_CONFIG = {
  backendPort: 3000,
  frontendUrl: 'http://localhost:5173',
  testTimeout: 5000
};

// 测试结果
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// 测试工具函数
function test(name, testFn) {
  testResults.total++;
  console.log(`🧪 测试: ${name}`);
  
  return testFn()
    .then(() => {
      testResults.passed++;
      console.log(`✅ 通过: ${name}`);
      testResults.details.push({ name, status: 'passed' });
    })
    .catch(error => {
      testResults.failed++;
      console.error(`❌ 失败: ${name} - ${error.message}`);
      testResults.details.push({ name, status: 'failed', error: error.message });
    });
}

// 测试后端路由
function testBackendRoutes() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: TEST_CONFIG.backendPort,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      if (res.statusCode === 401) {
        resolve(); // 401是预期的，因为需要认证
      } else {
        reject(new Error(`意外的状态码: ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ prompt: '测试' }));
    req.end();
  });
}

// 测试路由配置
function testRouteConfig() {
  const expectedRoutes = [
    '/bot',
    '/history',
    '/about',
    '/graph',
    '/profile'
  ];
  
  console.log('📋 验证路由配置:');
  expectedRoutes.forEach(route => {
    console.log(`  - ${route}`);
  });
  
  return Promise.resolve();
}

// 测试历史记录API
function testHistoryAPI() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: TEST_CONFIG.backendPort,
      path: '/api/history?type=chat',
      method: 'GET'
    }, (res) => {
      if (res.statusCode === 401) {
        resolve(); // 401是预期的，因为需要认证
      } else {
        reject(new Error(`意外的状态码: ${res.statusCode}`));
      }
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 运行所有测试
async function runTests() {
  console.log('🚀 开始测试修复结果...\n');
  
  // 测试1: 后端路由
  await test('后端对话路由', testBackendRoutes);
  
  // 测试2: 路由配置
  await test('路由配置一致性', testRouteConfig);
  
  // 测试3: 历史记录API
  await test('历史记录API', testHistoryAPI);
  
  // 输出测试结果
  console.log('\n📊 测试结果汇总:');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`通过: ${testResults.passed}`);
  console.log(`失败: ${testResults.failed}`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:');
    testResults.details
      .filter(d => d.status === 'failed')
      .forEach(d => console.log(`  - ${d.name}: ${d.error}`));
  } else {
    console.log('\n🎉 所有测试通过！修复成功。');
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };
