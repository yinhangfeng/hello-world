import React from 'react';
import { Chart, View } from '@antv/g2';
import { generateTestLineData1 } from '@/utils/testData';
import moment from 'moment';

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
    autoFit: true,
    // width: 800,
    height: 600,
    // renderer: 'svg',
    // limitInPlot: true,
    syncViewPadding: true,
  });
  chart.animate(false);
  chart.tooltip({
    showCrosshairs: true,
    crosshairs: {
      type: 'xy',
      follow: true,
    },
    shared: true,
  });

  const view = chart.createView({
    region: {
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    // padding: [50, 50],
    // syncViewPadding: true,
  });
  // const view = chart;

  chart.scale({
    x: {
      type: 'time',
      sync: 'xx',
      formatter: (value) => {
        return moment(value).format('YY-MM-DD HH:mm:ss');
      },
    },
    x1: {
      type: 'time',
      sync: 'xx',
      formatter: (value) => {
        return moment(value).format('YY-MM-DD HH:mm:ss');
      },
    },
  });

  // view.axis('x', {});

  // view.axis('y', {});

  view.data(data);
  // view.tooltip(false);

  const line1 = view.line();
  line1.position('x*y');

  // view.interaction('view-zoom');

  const data1 = generateTestLineData1(undefined, {
    offset: 50,
    amplitude: 10000,
    x: 'x1',
    y: 'y1',
  });
  const view2 = chart.createView({
    // region: {
    //   start: { x: 0, y: 0 },
    //   end: { x: 1, y: 1 },
    // },
    // padding: [0, 0],
    // syncViewPadding: (...args) => {
    //   console.log('view2 syncViewPadding', args)
    // },
    // syncViewPadding: true,
  });

  view2.axis('y1', {
    position: 'right',
    grid: null,
  });
  // view2.axis('x1', false);

  view2.data(data1);
  view2.line().position('x1*y1').color('#5AD8A6');

  chart.render();

  setTimeout(() => {
    // 强行改变 view region
    // 可能会导致 BUG?
    view2.region = {
      start: { x: 0, y: 0.5 },
      end: { x: 1, y: 1 },
    };
    view2.calculateViewBBox();
    chart.render();
  }, 3000);
}

function configureView(view: View) {}
