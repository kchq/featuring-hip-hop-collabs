$(document).ready(init);

d3.select(window).on("resize", throttle);

var width, height, centered, time_slider, currentYear;
var svg, g, gc, washington, midWest, northEast, southCalifornia, northCaliforniaX, south, time_slider;

width = document.getElementById('container').scrollWidth;
height = width * 25.0 / 48.0;  // dimensions taken from http://bl.ocks.org/mbostock/2206340

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

function init() {
  setup();
  drawMap();
  drawRegions();
  drawSlider();
  drawRappers();
}

// creates the svg
function setup() {
  svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  g = svg.append("g");

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);
    //.on("click", clicked);

  gc = svg.append("g").attr("id", "rappers");
}

function drawSlider() {
  var slider = d3.slider().axis(true).min(1950).max(2015).step(5);
  slider.on("slide", function(evt, value) {
    currentYear = parseInt(value);
    d3.select("#rappers").html("");
    drawRegions();
    drawRappers();
  });

  // Render the slider in the div
  d3.select('#slider').call(slider);
  currentYear = 1950;
}

function drawRegions() {
  var washingtonX = projection([-1*parseFloat(122.3331), parseFloat(47.609)])[0];
  var washingtonY = projection([-1*parseFloat(122.3331), parseFloat(47.609)])[1];
  washington = gc.append("svg:circle")
                     .attr("cx", washingtonX)
                     .attr("cy", washingtonY)
                     .attr("r", 0)
                     .attr("numArtists", 0);

  var northEastX = projection([-1*parseFloat(74.0059), parseFloat(40.7127)])[0];
  var northEastY = projection([-1*parseFloat(74.0059), parseFloat(40.7127)])[1];
  northEast = gc.append("svg:circle")
                     .attr("cx", northEastX)
                     .attr("cy", northEastY)
                     .attr("r", 0)
                     .attr("numArtists", 0);

  var southCaliforniaX = projection([-1*parseFloat(117), parseFloat(35)])[0];
  var southCaliforniaY = projection([-1*parseFloat(117), parseFloat(35)])[1];
  southCalifornia = gc.append("svg:circle")
                     .attr("cx", southCaliforniaX)
                     .attr("cy", southCaliforniaY)
                     .attr("r", 0)
                     .attr("numArtists", 0);

  var northCaliforniaX = projection([-1*parseFloat(121.4689), parseFloat(38.5556)])[0];
  var northCaliforniaY = projection([-1*parseFloat(121.4689), parseFloat(38.5556)])[1];
  northCalifornia = gc.append("svg:circle")
                     .attr("cx", northCaliforniaX)
                     .attr("cy", northCaliforniaY)
                     .attr("r", 0)
                     .attr("numArtists", 0);

  var southX = projection([-1*parseFloat(85), parseFloat(32)])[0];
  var southY = projection([-1*parseFloat(85), parseFloat(32)])[1];
  south = gc.append("svg:circle")
                     .attr("cx", southX)
                     .attr("cy", southY)
                     .attr("r", 0)
                     .attr("numArtists", 0);

  var midWestX = projection([-1*parseFloat(87.6847), parseFloat(40)])[0];
  var midWestY = projection([-1*parseFloat(87.6847), parseFloat(40)])[1];
  midWest = gc.append("svg:circle")
                     .attr("cx", midWestX)
                     .attr("cy", midWestY)
                     .attr("r", 0)
                     .attr("numArtists", 0);
}

function drawRappers() {
  d3.csv("data/artists.csv", function(err, artists) {
    artists.forEach(function(artist) {
      // need to invert longitude because I got values in terms of hemispheres
      // western hemisphere is negative https://github.com/mbostock/d3/issues/1287
      addRapper(artist.region, artist.name, artist.start_year);
    });
  });
}

// draws the map in the group 'g' (this must be initialized before calling this function)
function drawMap() {
  d3.json("data/us.json", function(error, us) {
    g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);
     // .on("click", clicked);

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);
  });

}

// redraws everything
function redraw() {
  width = document.getElementById('container').scrollWidth;
  height = width * 25.0 / 48.0;
  d3.select('svg').remove();
  setup();
  drawMap();
  drawRegions();
  drawSlider();
  drawRappers();
}

/*function addRapper(lat,lon,rapper) {
  // if not on map, return
  if (!projection([lon,lat])) {
    return;
  }
  var x = projection([lon,lat])[0];
  var y = projection([lon,lat])[1];

  var circle = gc.append("svg:circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5);
}*/

function addRapper(region, rapper, startYear) {

  console.log(parseInt(startYear) + " " + currentYear);
  //if (startYear !== "" && parseInt(startYear) <= currentYear) {
     var regionNode;
    if (region === "W") {
      regionNode = washington;
    } else if (region === "SC") {
      regionNode = southCalifornia;
    } else if (region === "NC") {
      regionNode = northCalifornia;
    } else if (region ==="S") {
      regionNode = south;
    } else if (region === "NE") {
      regionNode = northEast;
    } else if (region == "MW") {
      regionNode = midWest;
    }

    if (regionNode != undefined) {
      regionNode.attr("numArtists", parseInt(regionNode.attr("numArtists")) + 1);
      regionNode.attr("r", 10 * Math.log(regionNode.attr("numArtists")));
    }
  //}
}

function clicked(d) {
  console.log(d);
  var x, y, k;

  if (d && centered !== d && onAValidNode(d)) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
    d3.select("#rappers").remove();
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
    gc = svg.append("g").attr("id", "rappers");
    drawRappers();
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}
