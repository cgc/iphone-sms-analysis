var dayHourHeatmap = require('./day-hour-heatmap');
var d3 = require('d3');

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

  data.filter(function(item) {
    return (item.from === c && item.to === e) ||
      (item.from === e && item.to === c);
  }).forEach(function(item) {
    var date = new Date(item.date + TIMEZONE);
    entries[date.getDay()][date.getHours()].value++;
    entries[date.getDay()][date.getHours()].title += renderMessage(item) + '\n';
  });

  dayHourHeatmap(d3.select('#foo'), result);
});
