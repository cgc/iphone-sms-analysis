var d3 = require('d3');
var WordTokenizer = require('natural/lib/natural/tokenizers/aggressive_tokenizer');
var tokenizer = new WordTokenizer();
var d3LayoutCloud = require('d3.layout.cloud/d3.layout.cloud');
var stopwords = require('natural/lib/natural/util/stopwords').words;


module.exports = function(root, text) {
  // adapted from https://github.com/jasondavies/d3-cloud/blob/a81e46/examples/simple.html
  var words = tokenizer.tokenize(text);

  words = words.filter(function(word) {
    return stopwords.indexOf(word) === -1;
  });

  var data = d3.nest()
    .key(function(item) { return item; })
    .rollup(function(items) { return items.length; })
    .entries(words).map(function(item) {
      return {
        text: item.key,
        size: item.values
      };
    });

  var fill = d3.scale.category20();
  d3LayoutCloud().size([300, 300])
      .words(data)
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  function draw(words) {
    root.append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  }
};
