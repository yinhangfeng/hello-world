const data = {
  nodes: [
    {
      shape: 'rect',
      id: 'node1',
      position: {
        x: 300,
        y: 100,
      },
      size: {
        width: 250,
        height: 40,
      },
      label: 'hello 1',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      shape: 'rect',
      id: 'node2',
      x: 100,
      y: 200,
      width: 100,
      height: 40,
      label: 'hello 2',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      shape: 'rect',
      id: 'node3',
      x: 300,
      y: 200,
      width: 100,
      height: 40,
      label: 'hello 3',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },

    {
      shape: 'rect',
      id: 'node4',
      x: 300,
      y: 300,
      width: 100,
      height: 40,
      label: 'hello 4',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      shape: 'rect',
      id: 'node5',
      x: 400,
      y: 300,
      width: 100,
      height: 40,
      label: 'hello 5',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      shape: 'rect',
      id: 'node-end',
      x: 400,
      y: 500,
      width: 100,
      height: 40,
      label: 'end',
      visible: true,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      shape: 'custom-vue-node',
      id: 'custom-vue-node1',
      label: 'custom-vue-node',
      x: 500,
      y: 400,
      width: 200,
      height: 80,
      data: {
        label: 1,
      },
    },
    {
      shape: 'custom-html-node',
      id: 'custom-html-node1',
      x: 300,
      y: 400,
      width: 200,
      height: 80,
      data: {
        label: 1,
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    },
    {
      shape: 'edge',
      source: 'node1',
      target: 'node3',
      connector: 'smooth',
      labels: ['node1-3'],
      // router: {
      //   // name: 'manhattan',
      //   // args: {
      //   //   startDirections: ['top'],
      //   //   endDirections: ['bottom']
      //   // }
      // }
    },
    {
      shape: 'edge',
      source: 'node3',
      target: 'node4',
    },
    {
      shape: 'edge',
      source: 'node3',
      target: 'node5',
    },
    {
      shape: 'edge',
      source: 'node2',
      target: 'node-end',
    },
    {
      shape: 'edge',
      source: 'node4',
      target: 'node-end',
    },
    {
      shape: 'edge',
      source: { cell: 'node5' },
      target: { cell: 'node-end' },
    },
    // {
    //   shape: 'edge',
    //   source: 'node1',
    //   target: 'nodey',
    // },
  ],
};

export default data;
