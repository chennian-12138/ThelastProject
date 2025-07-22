<template>
  <div class="literature-graph">
    <input
      v-model="keyword"
      @keyup.enter="doSearch"
      placeholder="输入关键词并回车"
      style="width:200px;padding:4px;margin:8px"
    />
    <svg ref="svgRef" width="100%" height="600"></svg>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';        // ← 新增

const svgRef  = ref<SVGSVGElement | null>(null);
const tooltip = ref<HTMLDivElement>();

/* ---------- 关键词搜索 ---------- */
const keyword = ref('');
const doSearch = async () => {
  if (!keyword.value.trim()) return;
  const { data } = await axios.get(
    `http://localhost:3001/api/search?q=${encodeURIComponent(keyword.value)}`
  );
   console.log('nodes.length =', data.nodes?.length, 'edges =', data.edges);
  /* 归一化坐标（复用原逻辑） */
  interface Paper { x: number; y: number; title: string; year: number; [key: string]: any }
  const xRaw = data.nodes.map((d: Paper) => d.x);
  const yRaw = data.nodes.map((d: Paper) => d.y);
  const xMin = Math.min(...xRaw), xMax = Math.max(...xRaw);
  const yMin = Math.min(...yRaw), yMax = Math.max(...yRaw);
  data.nodes.forEach((d: Paper) => {
    d.x = ((d.x - xMin) / (xMax - xMin) - 0.5) * 700;
    d.y = ((d.y - yMin) / (yMax - yMin) - 0.5) * 500;
  });

  /* 替换并重绘 */
  const nodes = (data.nodes || []).map((d, idx) => ({ ...d, _index: idx }));
  const validEdges = (data.edges || [])
    .filter((e: any) => e.source < nodes.length && e.target < nodes.length);  
    
  const width = 1200, height = 1000;

  d3.select(svgRef.value).selectAll('*').remove();
  const svg = d3.select(svgRef.value).attr('viewBox', `0 0 ${width} ${height}`);
  const g   = svg.append('g');

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(validEdges).distance(50))
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = g.append('g')
    .selectAll('line')
    .data(validEdges)
    .enter().append('line')
    .attr('stroke', '#999');

  const node = g.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('r', 5)
    .attr('fill', (d: any) => d3.schemeCategory10[d.year % 10])
    .call(
      d3.drag<SVGCircleElement, any>()
        .on('start', (e, d) => { simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => { simulation.alphaTarget(0); d.fx = null; d.fy = null; })
    )
    .on('mouseover', (e, d: any) => {
      d3.select(tooltip.value!)
        .style('opacity', 1)
        .html(`<strong>${d.title}</strong><br>${d.authors?.join?.(', ')}<br>${d.year}`)
        .style('left', `${e.pageX + 10}px`)
        .style('top', `${e.pageY - 20}px`);
    })
    .on('mouseout', () => d3.select(tooltip.value!).style('opacity', 0));

if (!nodes.length) return;   // 没节点直接 return，避免后续报错

  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);
    node
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);
  });
};

/* ---------- 初始加载 ---------- */
onMounted(async () => {
  const { data } = await axios.get(
  `http://localhost:3001/api/search?q=${encodeURIComponent(keyword.value)}`
);
  /* 归一化 & 渲染 */
  interface Paper { x: number; y: number; title: string; year: number; [key: string]: any }
  const xRaw = (data.nodes || []).map((d: any) => d.x);
  const yRaw = (data.nodes || []).map((d: any) => d.y);
  const xMin = Math.min(...xRaw), xMax = Math.max(...xRaw);
  const yMin = Math.min(...yRaw), yMax = Math.max(...yRaw);
  (data.nodes || []).forEach((d: Paper) => {
    d.x = ((d.x - xMin) / (xMax - xMin) - 0.5) * 700;
    d.y = ((d.y - yMin) / (yMax - yMin) - 0.5) * 500;
  });
  doSearch();   // 首次渲染用 /api/graph
});
</script>

