import React from 'react';
import { Chart } from '@antv/g2';

export default class LineChart extends React.Component<{
  data: any[];
  className?: string;
  style?: any;
}> {
  private container: HTMLDivElement | null = null;
  componentDidMount() {
    const { data } = this.props;
    console.time('createLineChart');
    createLineChart(data, this.container);
    console.timeEnd('createLineChart');
  }
  render() {
    const { className, style } = this.props;
    return (
      <div ref={this.setContainerRef} className={className} style={style} />
    );
  }

  private setContainerRef = (ref: any) => {
    this.container = ref;
  };
}

function createLineChart(data: any[], container: any) {
  const chart = new Chart({
    container,
    // autoFit: true,
    width: 800,
    height: 400,
    // renderer: 'svg',
    limitInPlot: true,
  });

  chart.animate(false);
  chart.data(data);
  // chart.scale({
  //   year: {
  //     range: [0, 1],
  //   },
  //   y: {
  //     min: 0,
  //     nice: true,
  //   },
  // });

  chart.tooltip(false);
  // chart.tooltip({
  //   showCrosshairs: true, // 展示 Tooltip 辅助线
  //   shared: true,
  // });

  chart.line().position('x*y');
  // chart.point().position('year*value');

  chart.interaction('view-zoom');

  chart.render();
}
