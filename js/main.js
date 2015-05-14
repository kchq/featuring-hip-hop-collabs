var width, height;
var svg, g;

width = document.getElementById('container').offsetWidth;
height = width * 25.0 / 48.0;  // dimensions taken from http://bl.ocks.org/mbostock/2206340

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

var zoom = d3.behavior.zoom()
  .translate(projection.translate())
  .scale(projection.scale())
  .scaleExtent([height, 25 * height])
  .on("zoom", zoomed);

init();

function init() {
  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  g = svg.append("g")
    .call(zoom);

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

  drawMap();
}

function drawMap() {
  d3.json("data/us.json", function(error, us) {
    g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
  });
}

function zoomed() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  g.selectAll("path").attr("d", path);
}