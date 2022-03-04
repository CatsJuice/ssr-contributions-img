function getVirtulData() {
  var today = echarts.number.parseDate(new Date());
  var dayTime = 3600 * 24 * 1000;
  var thatday = today - dayTime * 16 * 7;

  var data = [];
  for (var time = thatday; time < today; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      Math.floor(Math.random() * 10000),
    ]);
  }
  return {
    data,
    today: echarts.format.formatTime('yyyy-MM-dd', today),
    thatday: echarts.format.formatTime('yyyy-MM-dd', thatday),
  };
}

option = {
  calendar: [
    {
      left: 'center',
      top: 'middle',
      cellSize: [20, 20],
      splitLine: {
        show: false,
      },
      itemStyle: {
        borderColor: 'transparent',
      },
      yearLabel: { show: false },
      dayLabel: {
        show: false,
      },
      monthLabel: {
        show: false,
      },
      range: [getVirtulData()['thatday'], getVirtulData()['today']],
    },
  ],
  visualMap: {
    min: 0,
    max: 10000,
    inRange: {
      color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
    },
    show: false,
  },
  series: [
    {
      type: 'custom',
      coordinateSystem: 'calendar',
      renderItem: function (params, api) {
        const cellPoint = api.coord(api.value(0));
        const cellWidth = params.coordSys.cellWidth;
        const cellHeight = params.coordSys.cellHeight;
        const value = api.value(1);
        console.log(value);
        if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
          return;
        }
        return {
          z2: 100,
          type: 'rect',
          shape: {
            x: -cellWidth / 2 + 2,
            y: -cellHeight / 2 + 2,
            width: cellWidth - 4,
            height: cellHeight - 4,
            r: 4,
          },
          position: cellPoint,
          style: api.style({
            fill: api.visual('color'),
          }),
        };
      },
      dimensions: [undefined, { type: 'ordinal' }],
      data: getVirtulData()['data'],
    },
  ],
};
