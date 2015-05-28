$(document).ready(init);

//d3.select(window).on("resize", throttle);

var regionNodes = [
  {"code":"W", "lon": 122.3331, "lat": 47.609, "color": "#3AA827", "scale": 10, "numArtists":0},
  {"code":"NE", "lon": 74.0059, "lat": 40.7127, "color": "steelblue", "scale": 4, "numArtists":0},
  {"code":"NC", "lon": 121.4689, "lat": 38.5556, "color": "#BF9900", "scale": 4, "numArtists":0},
  {"code":"SC", "lon": 117, "lat": 35, "color": "#E39612", "scale": 4, "numArtists":0},
  {"code":"S", "lon": 85, "lat": 32, "color": "#BF113A", "scale": 4, "numArtists":0},
  {"code":"MW", "lon": 87.6847, "lat": 40, "color": "#A314A8", "scale": 3, "numArtists":0}
]

const regionIndexMap = ["W", "NE", "NC", "SC", "S", "MW"];

const birthYear = 1967;
const presentYear = 2015;
var prevYear = birthYear;
var currentYear = birthYear;

var zoom = d3.behavior.zoom()
  .scaleExtent([1,(presentYear - birthYear) / 5.0 + 1])
  .on("zoom", moveThroughTime);

var width, height, mapTranslateLeft, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEvents, slider;
var svg, svgNarration, g, gn, regionsGroup, washington, midWest, northEast, southCalifornia, northCalifornia, south;
var artistNodes, artistLinks;

var isZoomed = false;

width = $(window).width();
height = $(window).height();

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

parseData();
setupMap();

function init() {
  setupNodes();
  drawMap();
  drawRegions();
  drawRappers();
}

// creates the svg
function setupMap() {
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

function parseData() {
  var q = queue();
  q.defer(function(callback) {
    d3.csv("data/artists.csv", function(err, artists) {
      artistNodes = [];
      artists.forEach(function(artist) {
        // add to correct region node  
        artistNodes.push(artist);
        debugger;
        // regionNodes[regionIndexMap.indexOf(artist.region)].numArtists++;
      });
    });
    callback(null, artistNodes);
  });

  q.await(function(error, file1, file2) { console.log(file1, file2); });
  
 
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
  var regionIndex = regionIndexMap.indexOf(regionName);
  var lon = regionNodes[regionIndex].lon;
  var lat = regionNodes[regionIndex].lat;
  var color = regionNodes[regionIndex].color;
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
    .style("stroke-width", 1.5 / k + "px");
}

function zoomOut() {
  x = width / 2;
  y = height / 2;
  k = 1;
  d3.select("#regions").style("display", "block");
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width / 2 - mapTranslateLeft) + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() { 
      zoom.on("zoom", moveThroughTime); 
      drawRappers();
    });
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
