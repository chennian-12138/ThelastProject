<template>
  <div class="literature-graph">
    <!-- 加载动画 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-text">{{ loadingText }}</div>
        <div class="container">
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
          <div class="slice"></div>
        </div>
        <div class="loading-subtext">{{ loadingText.includes('...') ? '请稍候...' : '' }}</div>
      </div>
    </div>

    <!-- 主内容 -->
    <svg ref="svgRef" width="100%" height="100%"></svg>
    <div class="search-input">
      <input v-model="keyword" @keyup.enter="doSearch" placeholder="输入关键词搜索文献" />
      <button @click="doSearch" :disabled="loading">{{ loading ? '搜索中...' : '搜索' }}</button>
    </div>
  </div>

  <!-- 放在 <template> 末尾 -->
<div
  v-if="detailPaper"
  class="paper-card"
  :style="{ top: cardY + 'px', left: cardX + 'px' }"
>
  <button class="close-btn" @click="closeCard">×</button>
  <h4>{{ detailPaper.title }}</h4>
  <p><strong>作者：</strong>{{ detailPaper.authors?.join(', ') }}</p>
  <p><strong>年份：</strong>{{ detailPaper.year }}</p>
  <p>{{ detailPaper.abstract }}</p>
  <a :href="paperUrl(detailPaper.id)" target="_blank">查看原文</a>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';
import { useHistoryStore } from '@/store/history';

const svgRef = ref<SVGSVGElement | null>(null);
const history = useHistoryStore();
const keyword = ref('');
const loading = ref(false);
const loadingText = ref('');
const sessionTag = ref('');
const padding1 = 50; // 用于坐标归一化的边距

/* ---------- 搜索 ---------- */
const doSearch = async () => {
  if (!keyword.value.trim()) return;
  loading.value = true;
  loadingText.value = `正在搜索 ${keyword.value} ...`;
  try {
    const { data } = await axios.get(
      `http://localhost:3001/api/fetch?q=${encodeURIComponent(keyword.value)}`
    );
    if (data.status !== 'success') {
      loadingText.value = data.status === 'no_new_papers' ? '未找到文献' : '搜索失败';
      setTimeout(() => (loading.value = false), 2000);
      return;
    }
    sessionTag.value = data.session_tag;
    await loadGraph();

    const token = localStorage.getItem('token');
    if (token) {
      await axios.post('http://localhost:3000/api/history', {
        type: 'literature',
        data: {
          action: 'view_graph',
          query: keyword.value,
          nodesCount: data.count,
          timestamp: Date.now()
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    history.add('literature', {
      keyword: keyword.value,
      nodesCount: data.count,
      edgesCount: 0,
      timestamp: Date.now(),
    });
  } catch (e) {
    loadingText.value = '网络错误';
    setTimeout(() => (loading.value = false), 2000);
  }
};

/* ---------- 加载图谱 ---------- */
const loadGraph = async () => {
  const { data } = await axios.get(
    `http://localhost:3001/api/temp_graph?session=${sessionTag.value}`
  );
  renderGraph(data.nodes, data.edges);
  loading.value = false;
  console.log("✅ 当前 sessionTag:", sessionTag.value);
};

/* ---------- 渲染 ---------- */
const renderGraph = (nodes: any[], edges: any[]) => {
  const w = 1200, h = 1000;
  d3.select(svgRef.value).selectAll('*').remove();
  const svg = d3.select(svgRef.value).attr('viewBox', `0 0 ${w} ${h}`);
  const g = svg.append('g');

  const tooltip = d3.select('body')
    .selectAll('.tooltip').data([null])
    .enter().append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,.8)')
    .style('color', 'white')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  // 坐标归一化
  const padding = 50;
  const xValues = nodes.map((d: any) => d.x).filter((x: any) => x !== undefined);
  const yValues = nodes.map((d: any) => d.y).filter((y: any) => y !== undefined);

  // 节点大小 = 被引次数（没有就随机 6）
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(nodes, d => d.citationCount || 0)])
    .range([4, 20]);

  // 节点颜色 = 发表年份
  const colorScale = d3.scaleSequential(d3.interpolateViridis)
    .domain([d3.max(nodes, d => d.year), d3.min(nodes, d => d.year)]);

  if (xValues.length === 0 || yValues.length === 0) {
    // 如果没有坐标，生成随机布局
    nodes.forEach((d: any, i: number) => {
      d.x = (Math.random() - 0.5) * 800;
      d.y = (Math.random() - 0.5) * 600;
    });
  } else {
    // 使用现有坐标并缩放
    const xMin = Math.min(...xValues), xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues), yMax = Math.max(...yValues);
    
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([padding, w - padding]);
      
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([padding, h - padding]);

    nodes.forEach((d: any) => {
      d.x = xScale(d.x);
      d.y = yScale(d.y);
    });
  }

  // 准备数据并过滤有效边
  const validEdges = (edges || [])
    .filter((e: any) => e.source < nodes.length && e.target < nodes.length);

  // 创建力导向图（使用text.txt的配置）
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(validEdges).distance(80))
    .force('charge', d3.forceManyBody().strength(-10))
    .force('center', d3.forceCenter(w / 2, h / 2));

  const link = g.append('g').selectAll('line')
    .data(validEdges).enter().append('line')
    .attr('stroke', '#999').attr('stroke-width', 1);

  const node = g.append('g').selectAll('circle')
    .data(nodes).enter().append('circle')
    .attr('r', d => sizeScale(d.citationCount || 0))
    .attr('fill', (d: any) => colorScale(d.year))
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .call(d3.drag<SVGCircleElement, any>()
      .on('start', (e, d) => { simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { simulation.alphaTarget(0); d.fx = null; d.fy = null; }))
    .on('mouseover', (e, d: any) => {
      tooltip.html(`<strong>${d.title}</strong><br/>${d.authors?.join?.(', ') || ''}<br/>${d.year || ''}`)
        .style('left', `${e.pageX + 8}px`).style('top', `${e.pageY - 8}px`).style('opacity', 1);
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
    node.on('click', (e, d: any) => {showCard(d, e);
});

  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);
    node
      .attr('cx', (d: any) => d.x = Math.max(10, Math.min(w - 10, d.x)))
      .attr('cy', (d: any) => d.y = Math.max(10, Math.min(h - 10, d.y)));
  });
};

const detailPaper = ref<any>(null)
const cardX = ref(0)
const cardY = ref(0)

function showCard(paper: any, e: MouseEvent) {
  detailPaper.value = paper
  // 鼠标右侧 20px，防止出屏
  cardX.value = e.pageX + 20
  cardY.value = e.pageY + 20
}
function closeCard() {
  detailPaper.value = null
}
function paperUrl(id: string) {
  return `https://www.semanticscholar.org/paper/${id}`
}
/* ---------- 空图提示 ---------- */
onMounted(async () => {
  // 不主动加载全库，让用户先搜索
});
console.log('搜索返回 sessionTag:', sessionTag.value);
</script>

<style scoped>
.literature-graph {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

svg {
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: auto;
}

.search-input {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  height: 80px;
  flex-shrink: 0;
}

.search-input input {
  flex: 1;
  max-width: 600px;
  height: 40px;
  padding: 0 15px;
  border: 1px solid #dddddd;
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
}

.search-input button {
  background-color: #4f6f57;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.search-input button:hover {
  background-color: #3d5a44;
}

.search-input input:focus {
  outline: none;
  border-color: #4f6f57;
}

/* 加载动画样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-container {
  text-align: center;
}

.loading-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
}

.loading-subtext {
  font-size: 14px;
  color: #666;
  margin-top: 15px;
}


.paper-card {
  position: absolute;
  width: 320px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.2);
  z-index: 999;
  transition: all .2s ease;
}
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

</style>
