function getVirtulData() {
  var today = echarts.number.parseDate(new Date());
  var dayTime = 3600 * 24 * 1000;
  var thatday = today - dayTime * 365;

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
  visualMap: {
    min: 0,
    max: 10000,
    inRange: {
      color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
    },
    show: false,
  },
  calendar: {
    cellSize: [20, 20],
    range: [getVirtulData()['thatday'], getVirtulData()['today']],
    itemStyle: {
      borderColor: 'transparent',
      borderWidth: 4,
      borderCap: 'round',
      borderJoin: 'round',
    },
    splitLine: {
      show: false,
    },
    yearLabel: { show: false },
    monthLabel: { show: false },
    dayLabel: { show: false },
  },
  series: {
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: getVirtulData()['data'],
  },
};
