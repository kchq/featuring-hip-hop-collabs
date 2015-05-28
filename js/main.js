$(document).ready(init);

//d3.select(window).on("resize", throttle);

const regions = { 
  "W": { "lon": 122.3331, "lat": 47.609, "color": "#3AA827", "scale": 10},
  "NE": { "lon": 74.0059, "lat": 40.7127, "color": "steelblue", "scale": 4},
  "NC": { "lon": 121.4689, "lat": 38.5556, "color": "#BF9900", "scale": 4},
  "SC": { "lon": 117, "lat": 35, "color": "#E39612", "scale": 4},
  "S": { "lon": 85, "lat": 32, "color": "#BF113A", "scale": 4},
  "MW": { "lon": 87.6847, "lat": 40, "color": "#A314A8", "scale": 3},
}

const birthYear = 1967;
const presentYear = 2015;
var prevYear = birthYear;
var currentYear = birthYear;

var zoom = d3.behavior.zoom()
  .scaleExtent([1,(presentYear - birthYear) / 5.0 + 1])
  .on("zoom", moveThroughTime);

var width, height, mapTranslateLeft, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEvents, slider;
var svg, svgNarration, g, gn, regionsGroup, washington, midWest, northEast, southCalifornia, northCalifornia, south;

var force;
var artistNodes = [ {"name": "50_cent", "longitude": 72.8403, "latitude": 41.7278, "region": "NE"},
                    {"name": "action_bronson", "longitude": 73.8667, "latitude": 40.75, "region": "NE"},
                    {"name": "aesop_rock", "longitude": 73.5008, "latitude": 40.8128, "region": "NE"},
                    {"name": "asap_rocky", "longitude": 73.9484, "latitude": 40.809, "region": "NE"},
                  ];

var isZoomed = false;

width = $(window).width();
height = $(window).height();

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

function init() {
  setup();
  drawMap();
  drawRegions();
  drawRappers();
}

// creates the svg
function setup() {
  svg = d3.select("#mapContainer")
    .style("width", width + "px")
    .style("left", $(window).width() * 0.2 + "px")
    .style("position", "absolute")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("left", $(window).width() * 0.2 + "px")
    .attr("id", "map")
    .call(zoom);

  g = svg.append("g");

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "rgba(0,0,0,0)");

  mapTranslateLeft = $(window).width() * 0.1;
  regionsGroup = svg.append("g").attr("id", "regions");
  g.attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)");
  regionsGroup.attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)");

  // setup narrator box and get timeline events ready
  narrationSetup();
}

// sets up and draws the region circles
function drawRegions() {
  washington = drawRegion("W");
  northEast = drawRegion("NE");
  northCalifornia = drawRegion("NC");
  southCalifornia = drawRegion("SC");
  south = drawRegion("S");
  midWest = drawRegion("MW");
}

// helper function to draw a single region
function drawRegion(regionName) {
  var lon = regions[regionName]["lon"];
  var lat = regions[regionName]["lat"];
  var color = regions[regionName]["color"];
  var regionX = projection([-1*lon, lat])[0];
  var regionY = projection([-1*lon, lat])[1];
  return regionsGroup.append("svg:circle")
                     .attr("cx", regionX)
                     .attr("cy", regionY)
                     .attr("r", 0)
                     .attr("numArtists", 1)
                     .attr("id", regionName)
                     .style("fill", color)
                     .on("click", function() { zoomToRegion(this); });
}

function drawRappers() {
  d3.csv("data/artists.csv", function(err, artists) {
    artists.forEach(function(artist) {
      // need to invert longitude because I got values in terms of hemispheres
      // western hemisphere is negative https://github.com/mbostock/d3/issues/1287
      addRapper(artist.region, artist.name, artist.start_year);
    });
    washington.transition().duration(100).attr("r", 10 * Math.log(washington.attr("numArtists")));
    northEast.transition().duration(100).attr("r", 10 * Math.log(northEast.attr("numArtists")));
    northCalifornia.transition().duration(100).attr("r", 10 * Math.log(northCalifornia.attr("numArtists")));
    southCalifornia.transition().duration(100).attr("r", 10 * Math.log(southCalifornia.attr("numArtists")));
    south.transition().duration(100).attr("r", 10 * Math.log(south.attr("numArtists")));
    midWest.transition().duration(100).attr("r", 10 * Math.log(midWest.attr("numArtists")));
    prevYear = currentYear;
  });
}

// draws the map in the group 'g' (this must be initialized before calling this function)
function drawMap() {
  d3.json("data/us.json", function(error, us) {
    // remove alaska and hawaii
    us.objects.states.geometries = us.objects.states.geometries.filter(
      function(state) { 
        return state.id != 2 && state.id != 15; 
      }
    );
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

// redraws everything
function redraw() {
  width = $(window).width();
  height = $(window).height();
  d3.select('svg').remove();
  setup();
  drawMap();
  drawRegions();
  drawRappers();
}

function addRapper(region, rapper, startYear) {
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

  if (regionNode != undefined && startYear !== "") {
    if (parseInt(startYear) <= currentYear && parseInt(startYear) > prevYear) {

      regionNode.attr("numArtists", parseInt(regionNode.attr("numArtists")) + 1);

    } else if (parseInt(startYear) > currentYear && parseInt(startYear) <= prevYear) {
      regionNode.attr("numArtists", parseInt(regionNode.attr("numArtists")) - 1);
    }
  }
}

function zoomToRegion(region) {
  var x, y, k;
  console.log(region.id);
  var lon = regions[region.id]["lon"];
  var lat = regions[region.id]["lat"];
  x = projection([-1*lon, lat])[0];
  y = projection([-1*lon, lat])[1];
  k = regions[region.id]["scale"];
  d3.select("#regions").style("display", "none");
  zoom.on("zoom", null);
  g.on("dblclick", zoomOut);
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() {
      drawRegionalArtists(region.id, x, y, k);
    });
}

function zoomOut() {
  x = width / 2;
  y = height / 2;
  k = 1;
  d3.select("#regions").style("display", "block");
  svg.selectAll(".node").remove();
  svg.selectAll(".clippath").remove();
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width / 2 - mapTranslateLeft) + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() { 
      zoom.on("zoom", moveThroughTime); 
      drawRappers();
    });
}

function drawRegionalArtists(region, x, y, k) {
  var artistSize = 8;

  var artistNodesTemp = artistNodes.filter( function(a) {
    return a.region === region;
    // TODO: add time
  });

  force = d3.layout.force()
      .nodes(artistNodesTemp)
      //.links(links)
      .size([width, height])
      .linkDistance(function(d) {
        d.target.fixed = true;
        d.source.fixed = true;
        return 10 * lineLength(d.source.x, d.source.y, d.target.x, d.target.y);
      })
      .charge(-30)
      .gravity(0)
      .start();

  var node = svg.selectAll(".node")
      .data(force.nodes())
      .enter().append("g")
      .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .attr("class", "node")
     // .on("click", click)
     // .on("dblclick", dblclick)
      .call(force.drag);
  
  node.each(function(d, i) {
    svg.append('clipPath')
      .attr("id", d.name)
      .attr("class", "clippath")
      .append("circle")
      .attr("cx", getXY(d)[0])
      .attr("cy", getXY(d)[1])
      .attr("r", artistSize / 2)
      .attr("clipPathUnits", "userSpaceOnUse");
    });

  var images = node.append("image")
      .attr("xlink:href", function(d) { return "imgs/" + d.name + ".png"; })
      .attr("x", function(d) { return getXY(d)[0] - artistSize / 2; })
      .attr("y", function(d) { return getXY(d)[1] - artistSize / 2; })
      .attr("width", artistSize)
      .attr("height", artistSize)
      .attr("clip-path", function(d) { return "url(#" + d.name + ")"; });

  var rings = node.append("circle")
    .attr("id", function(d) { return d.name + "ring"; })
    .attr("cx", function(d) { return getXY(d)[0]; })
    .attr("cy", function(d) { return getXY(d)[1]; })
    .attr("r", artistSize / 2)
    .style("fill", "none")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

  // draw a ring on hover
  node.on("mouseenter", function(d) { $("#"+d.name+"ring").css("stroke", "#FF5655"); });//drawRing(d, x, y, k, artistSize); });
  node.on("mouseleave", function(d) { $("#"+d.name+"ring").css("stroke", "#000"); });
}

function drawRing(d, x, y, k, artistSize) {
  svg.append("circle")
    .attr("id", d.name+"ring")
    .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .attr("cx", getXY(d)[0])
    .attr("cy", getXY(d)[1])
    .attr("r", artistSize / 2)
    .style("fill", "none")
    .style("stroke", "#FF5655")
    .style("stroke-width", "0.5px");
}

function getXY(artistNode) {
  var lon = -1 * artistNode.longitude;
  var lat = artistNode.latitude;
  if (!projection([lon,lat])) {
    return null;
  }
  return [projection([lon,lat])[0], projection([lon,lat])[1]];
}

// called when the user scrolls to zoom, moves through years from 1967 to 2015
function moveThroughTime() {
  currentYear = Math.round((d3.event.scale - 1) * 5 + birthYear);
  drawRappers();
  updateNarration();
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}
