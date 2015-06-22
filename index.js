var dayHourHeatmap = require('./day-hour-heatmap');
var d3 = require('d3');
var MG = require('metrics-graphics');
var d3Cloud = require('./d3-cloud');

d3.json('../me_eri.json', function(err, data) {
  var c = 'Carlos';
  var e = 'Erica';
  var DAYS_IN_WEEK = 7;
  var HOURS_IN_DAY = 24;
  var TIMEZONE = '-0700';

  var entries = [];
  var result = [];
  for (var i = 0; i < DAYS_IN_WEEK; i++) {
    var forThisDay = [];
    entries.push(forThisDay);
    for (var j = 0; j < HOURS_IN_DAY; j++) {
      var entry = {
        day: i,
        hour: j,
        title: '',
        value: 0
      };
      forThisDay.push(entry);
      result.push(entry);
    }
  }

  function truncate(string, length) {
    if (string.length <= length) {
      return string;
    } else {
      return string.substr(0, length) + '...';
    }
  }

  function renderMessage(item) {
    return item.from + ': ' + truncate(item.text, 20);
  }

  data = data.filter(function(item) {
    return (item.from === c && item.to === e) ||
      (item.from === e && item.to === c);
  });

  data.forEach(function(item) {
    var date = new Date(item.date + TIMEZONE);
    entries[date.getDay()][date.getHours()].value++;
    entries[date.getDay()][date.getHours()].title += renderMessage(item) + '\n';
  });

  dayHourHeatmap(d3.select('#foo'), result);

  metricsGraphics(data);

  wordCloud(c, data, d3.select('#c-cloud'));
  wordCloud(e, data, d3.select('#e-cloud'));
});

function wordCloud(from, data, d3root) {
  var everything = data.filter(function(item) {
    return item.from === from;
  }).map(function(item) {
    return item.text;
  }).join(' ');

  d3Cloud(d3root, everything);
}

function metricsGraphics(data) {
  // kind of cheating with the double %L %L
  var originalFormat = d3.time.format('%Y-%m-%dT%H:%M:%S.%L%L');
  var dayFormat = d3.time.format('%Y-%m-%d');
  data = d3.nest()
    .key(function(item) { return dayFormat(originalFormat.parse(item.date)); })
    .rollup(function(items) { return items.length; })
    .entries(data);
  console.log(data)

  data = MG.convert.date(data, 'key');
  MG.data_graphic({
      //title: "Line Chart",
      //description: "",
      interpolate: 'basic',
      missing_is_zero: true,
      data: data,
      width: 600,
      height: 200,
      right: 40,
      target: document.getElementById('foo2'),
      x_accessor: 'key',
      y_accessor: 'values'
  });
}
