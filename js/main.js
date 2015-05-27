$(document).ready(init);

//d3.select(window).on("resize", throttle);

const birthYear = 1967;
const presentYear = 2015;
var prevYear = birthYear;
var currentYear = birthYear;

var zoom = d3.behavior.zoom()
  .scaleExtent([1,(presentYear - birthYear) / 5.0 + 1])
  .on("zoom", moveThroughTime);

var width, height, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEvents, slider;
var svg, svgNarration, g, gn, regionsGroup, washington, midWest, northEast, southCalifornia, northCalifornia, south;

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
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "map")
    .call(zoom);

  g = svg.append("g");

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "rgba(0,0,0,0)");

  regionsGroup = svg.append("g").attr("id", "regions");

  g.attr("transform", "translate(120,0)");
  regionsGroup.attr("transform", "translate(120,0)");
  // setup narrator box and get timeline events ready
  narrationSetup();
}

// sets up and draws the region circles
function drawRegions() {
  washington = drawRegion(122.3331, 47.609, "#3AA827");
  northEast = drawRegion(74.0059, 40.7127, "steelblue");
  northCalifornia = drawRegion(121.4689, 38.5556, "#BF9900");
  southCalifornia = drawRegion(117, 35, "#E39612");
  south = drawRegion(85, 32, "#BF113A");
  midWest = drawRegion(87.6847, 40, "#A314A8");
}

// helper function to draw a single region
function drawRegion(lon, lat, color) {
  var region;
  var regionX = projection([-1*parseFloat(lon), parseFloat(lat)])[0];
  var regionY = projection([-1*parseFloat(lon), parseFloat(lat)])[1];
  region = regionsGroup.append("svg:circle")
                     .attr("cx", regionX)
                     .attr("cy", regionY)
                     .attr("r", 0)
                     .attr("numArtists", 1)
                     .style("fill", color);
  return region;
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
     // .on("click", clicked);

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
    regionsGroup = svg.append("g").attr("id", "regions");
    drawRappers();
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
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
