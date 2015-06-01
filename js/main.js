//d3.select(window).on("resize", throttle);

var regionNodes = [
  {"id":"W", "lon": 122.3331, "lat": 47.609, "color": "#3AA827", "scale": 10, "numArtists":0, "artistsPerYear":{}},
  {"id":"NE", "lon": 74.0059, "lat": 40.7127, "color": "steelblue", "scale": 4, "numArtists":0, "artistsPerYear":{}},
  {"id":"NC", "lon": 121.4689, "lat": 38.5556, "color": "#BF9900", "scale": 4, "numArtists":0, "artistsPerYear":{}},
  {"id":"SC", "lon": 117, "lat": 35, "color": "#E39612", "scale": 4, "numArtists":0, "artistsPerYear":{}},
  {"id":"S", "lon": 85, "lat": 32, "color": "#BF113A", "scale": 4, "numArtists":0, "artistsPerYear":{}},
  {"id":"MW", "lon": 87.6847, "lat": 40, "color": "#A314A8", "scale": 3, "numArtists":0, "artistsPerYear":{}}
]
const regionIndexMap = ["W", "NE", "NC", "SC", "S", "MW"];

const startYear = 1965;
const birthYear = 1967;
const presentYear = 2015;
const scrollSensitivity = 2.0; // higher equals more sensitive
var prevYear = startYear;
var currentYear = startYear;

var zoom = d3.behavior.zoom()
  .scaleExtent([1,((presentYear - startYear) / scrollSensitivity) + 1])
  .on("zoom", function() {
    moveThroughTimeScrolling();
  });

var width, height, mapTranslateLeft, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEventDescriptions, timelineEvents, slider;
var svg, svgNarration, g, gn, gt;
var artistNodes, artistLinks, artistMap;

var isZoomed = false;

width = $(window).width();
height = $(window).height();

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick);
var node, link;

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);

parseData();

// this function requires waiting for all of the data to load
// error will be defined if there is an issue with parsing the data
function init(error) {
  setupMap();
  drawMap();
  drawSlider();
  createRegions();
  setUpRegions();
}

// redraws everything
function redraw() {
  width = $(window).width();
  height = $(window).height();
  d3.select('svg').remove();
  setup();
  drawMap();
  updateRegions();
}

// ======= Functions to create the Map ======= 

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
    .call(zoom)
    .on("mousedown.zoom", null)
    .on("dblclick.zoom", null);

  g = svg.append("g");

  g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "rgba(0,0,0,0)");

  mapTranslateLeft = $(window).width() * 0.07;

  g.attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)");

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

function drawSlider() {
  slider = d3.slider().axis(d3.svg.axis().orient("right").tickFormat(d3.format("d")).tickValues([1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015]))
                      .value(1965).min(1965).max(2015).orientation("vertical").step(1);
  slider.on("slide", function(evt, value) {
    moveThroughTimeSliding(value);
  });
  d3.select("#slider").style("left", narrationWidth + "px")
                      .style("top", $(window).height() * 0.09 + "px")
                      .style("height", height-$(window).height() * 0.2 + "px").call(slider)
                      .style("border", "0px")
                      .style("width", "0px")
                      .call(zoom)
                      .on("mousedown.zoom", null)
                      .on("dblclick.zoom", null);
}

>>>>>>> fixed small slider issues and added preview shortcuts to skip to events during narration
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

// ======= Functions to create and modify the region nodes ======= 

// sets up and draws the region circles
function createRegions() {
  regionNodes.forEach(function(regionNode) {
    var lon = regionNode.lon;
    var lat = regionNode.lat;
    var regionX = projection([-1*lon, lat])[0];
    var regionY = projection([-1*lon, lat])[1];
    regionNode["x"] = regionX;
    regionNode["y"] = regionY;
    regionNode["fixed"] = true;
  });
}

function setUpRegions() {
  force.nodes(regionNodes);

  node = svg.selectAll(".node")
    .data(regionNodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag)
    .append("svg:circle")
      .style("fill", function(d) {
        return d.color;
      })
      .on("click", function(d) {
        zoomToRegion(d); 
      });

  force.start();

}

function updateRegions() {
  regionNodes.forEach(function(d){
    calculateArtists(d);
  });

  d3.selectAll("circle").attr("r", function(d) { 
    return Math.max(0, 10 * Math.log(d.numArtists)); 
  });
}

function hideRegions() {
  d3.selectAll("circle").attr("r", 0);
}

function tick() {
  node.attr("cx", function(d) { return d.x - mapTranslateLeft; })
      .attr("cy", function(d) { return d.y; });
}

function calculateArtists(node) {
  node.numArtists = 0;
  // total up the numArtists up to the current year and set numArtists attribute accordingly
  for (var year in node.artistsPerYear) {
    if (parseInt(year) <= currentYear) {
      node.numArtists += parseInt(node.artistsPerYear[year]);
    }
  }
}


// ======= Functions to create and modify the slider ======= 

function drawSlider() {
  slider = d3.slider().axis(d3.svg.axis().orient("left").tickFormat(d3.format("d")).tickValues([1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015]))
                      .value(1967).min(1967).max(2015).orientation("vertical").step(1);
  slider.on("slide", function(evt, value) {
    moveThroughTime(value);
  });
  d3.select("#slider").style("left", narrationWidth + "px")
                      .style("top", $(window).height() * 0.05 + "px")
                      .style("height", height-$(window).height() * 0.15 + "px").call(slider)
                      .style("border", "0px");
}

// called when the user scrolls to zoom, moves through years from 1967 to 2015
function moveThroughTime(newYear) {
  if (newYear === undefined) {
    currentYear = Math.round((d3.event.scale - 1) * scrollSensitivity + birthYear);
    slider.value(currentYear);
  } else {
    currentYear = newYear;
  }
  updateRegions();
  updateNarration();
}

var throttleTimer;
function throttle() {
  window.clearTimeout(throttleTimer);
    throttleTimer = window.setTimeout(function() {
      redraw();
    }, 200);
}

// ======= Functions to handle zooming in and out of regions ======= 

function zoomToRegion(region) {
  var x, y, k;
  var lon = region.lon;
  var lat = region.lat;
  x = projection([-1*lon, lat])[0];
  y = projection([-1*lon, lat])[1];
  k = region.scale;
  hideRegions();
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
  setUpRegions();
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width / 2 - mapTranslateLeft) + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() { 
      zoom.on("zoom", function() {
        moveThroughTimeScrolling();
      }); 
      updateRegions();
    });
}

// called when the user scrolls to zoom, moves through years from 1967 to 2015
function moveThroughTimeScrolling() {
  currentYear = Math.round((d3.event.scale - 1) * scrollSensitivity + startYear);
  slider.value(currentYear);
  drawRappers();
  updateNarration();
}

// called when the user slides to zoom, moves through years from 1967 to 2015
function moveThroughTimeSliding(newYear) {
  currentYear = newYear;
  zoom.scale(((currentYear - startYear)/scrollSensitivity) + 1);
  slider.value(currentYear);
  drawRappers();
  updateNarration();
}

// ======= Functions for managing the data ======= 

function parseData() {
  var q = queue();

  // load the artists csv
  q.defer(function(callback) {
    d3.csv("data/artists.csv", function(err, artists) {
      artistNodes = [];
      artistMap = {};
      var i = 0;
      artists.forEach(function(artist) {
        // add to correct region node if we have the data for this artist  
        if (artist.region) {
          artistNodes.push(artist);
          artistMap[artist.name] = i;
          if (regionNodes[regionIndexMap.indexOf(artist.region)].artistsPerYear[artist.start_year] == undefined) {
            regionNodes[regionIndexMap.indexOf(artist.region)].artistsPerYear[artist.start_year] = 1;
          } else {
            regionNodes[regionIndexMap.indexOf(artist.region)].artistsPerYear[artist.start_year]++;
          }
          i++;
        } else {
          console.log("problem adding " + artist.name + " to artist list");
        }
      });
      callback(err);
    });
  });

  // load the collaboration json
  q.defer(function(callback) {
    d3.json("data/collabs_pruned.json", function(err, collabs) {
      // load up all the collaborations
      artistLinks = [];
      for (var artist in collabs) {
        var sourceIndex = artistMap[artist];
        if (sourceIndex >= 0) {
          var targetArtists = collabs[artist];
          for (var targetArtist in targetArtists) {
            var targetIndex = artistMap[targetArtist];
            if (targetIndex >= 0) {
              // we have both a source and a target, so let's add all the songs as links
              var links = targetArtists[targetArtist];
              for (var i = 0; i < links.length; i++) {
                var link = links[i];
                link["source"] = sourceIndex;
                link["target"] = targetIndex;
                artistLinks.push(link);
              }
            } else {
              console.log("problem with: " + targetArtist + "'s name as target of link");
            }
          }
        } else {
          console.log("problem with: " + artist + "'s name as source of link");
        }
      }
      callback(err);
    });
  });

  // call init function after all callbacks have been reached
  q.awaitAll(init);
}

