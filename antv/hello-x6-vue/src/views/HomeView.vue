<script setup lang="ts">
import { Graph, Shape } from '@antv/x6';
import { onMounted } from 'vue';
import { register, getTeleport } from '@antv/x6-vue-shape';
import data1 from '@/graph-data/data1';
import CustomVueNode from '@/graph-nodes/custom-vue-node';
import htmlNode from '@/graph-nodes/html-node';
import data2 from '@/graph-data/data2';
import { DagreLayout } from '@antv/layout';

register({
  shape: 'custom-vue-node',
  width: 100,
  height: 100,
  component: CustomVueNode,
  // inherit: 'rect',
});

Shape.HTML.register({
  shape: 'custom-html-node',
  width: 100,
  height: 100,
  ...htmlNode,
});

const TeleportContainer = getTeleport();
const container = document.createElement('div');
const graph = new Graph({
  container,
  // autoResize: true,
  width: 800,
  height: 600,
  background: {
    color: '#F2F7FA',
  },
  grid: {
    visible: true,
    type: 'doubleMesh',
    args: [
      {
        color: '#eee', // 主网格线颜色
        thickness: 1, // 主网格线宽度
      },
      {
        color: '#ddd', // 次网格线颜色
        thickness: 1, // 次网格线宽度
        factor: 4, // 主次网格线间隔
      },
    ],
  },
  panning: true,
  mousewheel: true,
  connecting: {
    // router: 'orth',
    connector: 'smooth',
  },
});
graph.fromJSON(data2);

onMounted(() => {
  document.getElementById('container')!.append(container);
  container.style.width = '100%';
  container.style.height = '100%';
  graph.resize();
  // graph.fromJSON(data2);
  graph.centerContent(); // 居中显示
});

function fromJSON() {
  graph.fromJSON(data1); // 渲染元素
}

function fromJSON2() {
  graph.fromJSON(data2); // 渲染元素
}

function toJSON() {
  console.log(graph.toJSON());
}

function clearCells() {
  graph.clearCells();
}

function updateCustomNodeData() {
  console.log(graph.getNodes());
  const vueNode = graph.getCellById('node1');
  vueNode.setData({
    label: `aaa ${Date.now()}`,
  });

  const htmlNode = graph.getCellById('custom-html-node1');
  htmlNode.setData({
    label: `bbb ${Date.now()}`,
  });
}

function layout() {
  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'TB',
    // align: 'UR',
    ranksep: 48,
    nodesep: 64,
    begin: [0, 0],
  });
  const data = dagreLayout.layout({ data2 });
  console.log(data2 === data);
  console.log(data);
  graph.fromJSON(data);
}

function layoutCurrent() {
  const dagreLayout = new DagreLayout({
    type: 'dagre',
    rankdir: 'TB',
    // align: 'UR',
    ranksep: 48,
    nodesep: 64,
  });
  const data = dagreLayout.layout(graph.toJSON());
  graph.fromJSON(data);
}

function centerContent() {
  // graph.fitToContent()
  // graph.centerContent({
  //   padding: 100,
  //   // animation: {

  //   // },
  //   useCellGeometry: true,
  // });
  graph.zoomToFit({
    padding: 100,
    useCellGeometry: true,
  });
}

function toggleNodeVisible() {
  const node = graph.getCellById('node1')!;
  node.setVisible(!node.visible);
}
</script>

<template>
  <div>
    <div>
      <button @click="fromJSON">fromJSON</button>
      <button @click="fromJSON2">fromJSON2</button>
      <button @click="toJSON">toJSON</button>
      <button @click="clearCells">clearCells</button>
      <button @click="updateCustomNodeData">update custom node data</button>
      <button @click="layout">layout</button>
      <button @click="layoutCurrent">layout current</button>
      <button @click="centerContent">centerContent</button>
      <button @click="toggleNodeVisible">toggleNodeVisible</button>
    </div>
    <main class="wrap">
      <div id="container"></div>
      <TeleportContainer />
    </main>
  </div>
</template>

<style>
.wrap {
  width: 60vw;
  min-width: 800px;
  height: 800px;
}

#container {
  width: 100%;
  height: 100%;
}
</style>
