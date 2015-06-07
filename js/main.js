//d3.select(window).on("resize", throttle);

// lat and lon are the coordinates of where the region circle are drawn, zlat and zlon are the center of zoom when 
// the region is zoomed in on
var regionNodes = [
  {"id":"W", "name": "Washington", "lon": 122.3331, "lat": 47.609, "zlon": 122.3331, "zlat": 47.609, "color": "#3AA827", "ringColor": "#1A9817", "scale": 32, "numArtists":0, "artistsPerYear":{},
   "points": [ { "lat": 49,  "lon": 122},  { "lat": 47.5,  "lon": 120}, { "lat": 45.5,  "lon": 122}, { "lat": 47.5,  "lon": 125} ] },
  {"id":"NE", "name": "North East", "lon": 74.0059, "lat": 40.7127, "zlon": 76, "zlat": 40.5, "color": "#4682B4", "ringColor": "#265294", "scale": 7, "numArtists":0, "artistsPerYear":{},
   "points": [ { "lat": 41,  "lon": 83}, { "lat": 43,  "lon": 72}, { "lat": 41,  "lon": 73}, {"lat": 39, "lon": 74}, { "lat": 38,  "lon": 77} ] },
  {"id":"NC", "name": "North California", "lon": 122, "lat": 37.8, "zlon": 121.8, "zlat": 38.1, "color": "#FFE303", "ringColor": "#EEC900", "scale": 24, "numArtists":0, "artistsPerYear":{},
  "points": [ { "lat": 40,  "lon": 123.5}, { "lat": 39,  "lon": 120}, { "lat": 37,  "lon": 121}, { "lat": 36.5,  "lon": 122}, { "lat": 37.5,  "lon": 124} ] },
  {"id":"SC", "name": "South California", "lon": 118.5, "lat": 34.2, "zlon": 118.6, "zlat": 34, "color": "#E39612", "ringColor": "#C37602", "scale": 36, "numArtists":0, "artistsPerYear":{},
   "points": [ { "lat": 37.5,  "lon": 120}, { "lat": 34,  "lon": 115}, { "lat": 31.5,  "lon": 116.5}, { "lat": 34,  "lon": 122} ] },
  {"id":"S", "name": "South", "lon": 85, "lat": 32, "zlon": 86, "zlat": 32, "color": "#BF113A", "ringColor": "#9F011A", "scale": 2.3, "numArtists":0, "artistsPerYear":{},
   "points": [ { "lat": 36,  "lon": 90}, { "lat": 39.5,  "lon": 70}, { "lat": 24,  "lon": 79}, { "lat": 24,  "lon": 81}, { "lat": 27,  "lon": 90}, { "lat": 29.5,  "lon": 102.5} ] },
  {"id":"MW", "name": "Mid West", "lon": 87.6847, "lat": 39, "zlon": 87.2, "zlat": 41.5, "color": "#A314A8", "ringColor": "#830488", "scale": 4, "numArtists":0, "artistsPerYear":{},
   "points": [ { "lat": 40,  "lon": 96}, { "lat": 38.5,  "lon": 95}, { "lat": 38,  "lon": 87}, { "lat": 37,  "lon": 84}, { "lat": 41,  "lon": 80}, { "lat": 43,  "lon": 83}, { "lat": 46,  "lon": 93}, { "lat": 45,  "lon": 94} ]}
]

var nyNode = {"id":"NY", "name": "New York", "lon": 74.0059, "lat": 40.7127, "zlon": 73.7, "zlat": 40.65, "color": "#1662A4", "ringColor": "#024274", "scale": 54 };
const regionIndexMap = ["W", "NE", "NC", "SC", "S", "MW"];

const startYear = 1965;
const birthYear = 1967;
const presentYear = 2015;

const scrollSensitivity = 2; // higher equals more sensitive
const artistCircleSize = 7;

var prevYear = startYear;
var currentYear = startYear;
var scaleExtentGeometric = Math.round(((presentYear - startYear) / scrollSensitivity) + 1);
var scaleExtentLinear = Math.round(Math.log(scaleExtentGeometric) + 1);
var searchedArtist = "";

var mouseX;
var mouseY;
$(document).mousemove( function(e) {
   mouseX = e.pageX; 
   mouseY = e.pageY;
}); 

var zoom = d3.behavior.zoom()
  //.scaleExtent([1, scaleExtentGeometric])
  .on("zoom", function() {
    // console.log(zoom.scale() + " " + zoomMapping(zoom.scale()));
    // console.log(scaleExtentGeometric + " " + scaleExtentLinear);
    moveThroughTimeScrolling();
  });

var artistTip = d3.tip()
  .attr('class', 'd3-region-tip')
  .html(function(d) {
    return "<div>" + d.name + "</div>"
  });

var artistLinkTip = d3.tip()
  .attr('class', 'd3-region-tip')
  .direction('c')
  .html(function(d) {
    var linksPerYear = d.linksPerYear;
    var artist1;
    var artist2;
    for (var links in linksPerYear) {
         linksYear = linksPerYear[links];
         for (var i = 0; i < linksYear.length; i++) {
             artist1 = artistNodes[linksYear[i].source];
             artist2 = artistNodes[linksYear[i].target];
             break;
         }
         break;
    }

    if (artist1 !== undefined && artist2 !== undefined) {
      console.log(artist1.name + " " + artist2.name);
      return "<div>" + artist1.name + " and " + artist2.name + "</div>";
    } else {
      return "yay";
    }
  });

var regionTip = d3.tip()
  .attr('class', 'd3-region-tip')
  .html(function(d) {
    return "<div>" + d.name + "</div>";
  });

var regionLinkTip = d3.tip()
  .attr('class', 'd3-region-tip d3-region-link-tip')
  .direction('c')
  .html(function(d) {
    var hidden = '';
    if (d.numLinks === 0) {
      d3.selectAll(".d3-region-link-tip").attr("class", "d3-region-tip d3-region-link-tip hidden");
      hidden = ' hidden';
    } else {
      d3.selectAll(".d3-region-link-tip").attr("class", "d3-region-tip d3-region-link-tip");
    }
    var tracks = "track";
    if (d.numLinks > 1) {
      tracks += "s";
    }
    return "<div class='" + hidden + "'>" + d.numLinks + " " + tracks + "</div>";
  });


var width, height, mapTranslateLeft, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEventDescriptions, timelineEvents, slider;
var svg, svgNarration, g, gn, gt;
var artistNodes, artistMap, artistLink, artistLinksInformation;
var regionNode, regionLink, regionLinks;

var isZoomed = false;

width = $(window).width();
height = $(window).height();

var force = d3.layout.force()
    .size([width, height])
    .on("tick", tick);

var artistForce = d3.layout.force()
    .size([width, height]);

var projection = d3.geo.albersUsa()
  .scale(width)  // determines initial map size
  .translate([width / 2, height / 2]);

var path = d3.geo.path()
  .projection(projection);


var singleHeadCollabMap = {};

parseData();

// this function requires waiting for all of the data to load
// error will be defined if there is an issue with parsing the data
function init(error) {
  setupMap();
  drawMap();
  drawSlider();
  svg.append("defs");
  createRegions();
  setUpRegions();
  setUpSearch();
  //introSetup();
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

function tick() {
  regionNode.attr("cx", function(d) { return d.x - mapTranslateLeft; })
      .attr("cy", function(d) { return d.y; });

  regionLink.attr('x1', function(d) { return d.source.x - mapTranslateLeft; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x - mapTranslateLeft; })
    .attr('y2', function(d) { return d.target.y; });
  
  d3.selectAll(".regionLinkInteractionArea")
    .attr('x1', function(d) { return d.source.x - mapTranslateLeft; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x - mapTranslateLeft; })
    .attr('y2', function(d) { return d.target.y; });
}


function setUpSearch() {
  $("#searchError").css("color", "red");
  $("#searchError").css("font-weight", "bold");
  $("#searchError").css("padding-left", "10px");
  $("#searchError").css("left", ($(window).width() * 0.72) + "px");
  $("#searchError").css("top", ($(window).height() * 0.03) + "px");
  $("#searchError").css("position", "absolute");

  $("#searchArea").css("padding-left", "10px");
  $("#searchArea").css("left", ($(window).width() * 0.72) + "px");
  $("#searchArea").css("top", ($(window).height() * 0.01) + "px");
  $("#searchArea").css("position", "absolute");

   $("#searchbutton").on("click", searchArtist);
   $("#searchArea").on("keypress", function(e) {
      if (e.keyCode == 13) {
        searchArtist();
      }
   });

   $("#search").autocomplete ({
      source: Object.keys(artistMap)
    });

   $(".ui-autocomplete").css("max-height", height * 0.5 + "px")
                        .css("overflow-y", "auto")
                        .css("overflow-x", "hidden");
}

function searchArtist() {
    $("#searchError").text("");
    var selectedVal = document.getElementById('search').value;

    var artistNode = artistNodes[artistMap[selectedVal]];
    var startYear = parseInt(artistNode.start_year);
    var endYear = artistNode.end_year;
    if (endYear == "present") {
      endYear = presentYear;
    } else {
      endYear = parseInt(endYear);
    }
    regionNodes.forEach(function(node) {
      if (node.id === artistNode.region) {
        if (isZoomed) {
          zoomOut();
        }

        if (currentYear < startYear || currentYear > endYear) {
          moveThroughTimeSliding(startYear);
        }

        zoomToRegion(node);
        

        if (node.id === "NE" && artistNode.state === "NY") {
          setTimeout(function() {
            $("#nyCircle").d3Click();
            searchedArtist = artistNode.name;
          }, 1500);
        } else {
          searchedArtist = artistNode.name;
        } 
      } 

    });
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
  regionNodes.forEach(function(node) {
    var lon = node.lon;
    var lat = node.lat;
    var regionX = projection([-1*lon, lat])[0];
    var regionY = projection([-1*lon, lat])[1];
    node["x"] = regionX;
    node["y"] = regionY;
    node["fixed"] = true;
  });
}

function setUpRegions() {
  force.nodes(regionNodes);

  // path first for correct z-index ordering
  setUpRegionLinks();
  var lineFunction = d3.svg.line()
      .x(function(d) { return projection([-1*d.lon,d.lat])[0]; })
      .y(function(d) { return projection([-1*d.lon,d.lat])[1]; })
      .interpolate("basis-closed");

  var regionNodeMasks = svg.selectAll(".regionMaskBLeh")
    .data(regionNodes)
    .enter().append("g")
    .append("path")
      .attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)")
      .attr("d", function(d) { return lineFunction(d.points); })
      .attr("fill", "black");

  // the mask shows anything that is white and hides parts that are black.
  var mask = d3.select("defs").append("svg:mask")
                 .attr("id", "regionMask");
  mask.append("rect").attr("width", "100%").attr("height", "100%").attr("fill", "white");
  for (var i = 0; i < regionNodes.length; i++) {
    mask.node().appendChild(regionNodeMasks[0][i]);
  }

  regionNode = svg.selectAll(".regionNode")
    .data(regionNodes)
    .enter().append("g")
    .append("path")
      .attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)")
      .attr("d", function(d) { return lineFunction(d.points); })
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("class", "regionNode")
      .attr("fill", function(d) { return d.color; })
      .style("opacity", 0.3)
      .on("click", function(d) {
        zoomToRegion(d); 
      });

  addRegionTooltips(regionNode);
  
  for (var artist in artistNodes) {
    var node = artistNodes[artist];
    if (node.start_year <= currentYear && (node.end_year === 'present'||
             node.end_year >= currentYear)) {
      svg.append("circle")
        .attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)")
        .attr("class", "tinyArtistDot")
        .attr("cx", function() { xy = getXY(node); if (xy == null) return; return xy[0] })
        .attr("cy", function() { xy = getXY(node); if (xy == null) return; return xy[1] })
        .attr("r", 3)
        .attr("fill", "#000");
    }
  }
}

function updateRegions() {
  d3.selectAll(".tinyArtistDot").remove();
  for (var artist in artistNodes) {
    var node = artistNodes[artist];
    if (node.start_year <= currentYear && (node.end_year === 'present'||
             node.end_year >= currentYear)) {
      svg.append("circle")
        .attr("transform", "translate(" + (-1 * mapTranslateLeft) + ",0)")
        .attr("class", "tinyArtistDot")
        .attr("cx", function() { xy = getXY(node); if (xy == null) return; return xy[0] })
        .attr("cy", function() { xy = getXY(node); if (xy == null) return; return xy[1] })
        .attr("r", 3)
        .attr("fill", "#000");
    }
  }
  updateRegionLinks();
}

function addRegionTooltips(regionNode) {
  regionNode.call(regionTip);
  regionNode.on("mouseover", function(d) {
    d3.select(this).style("opacity", 0.5);
    d3.select(this).style("stroke-width", "3px").style("stroke", d.ringColor);
    regionTip.show(d);
  });
  regionNode.on("mouseout", function(d) {
    d3.select(this).style("opacity", 0.3);
    d3.select(this).style("stroke-width", "2px").style("stroke", d.ringColor);;
    regionTip.hide(d);
  });
}

function hideRegions() {
  d3.selectAll("circle").attr("r", 0);
  regionLink.style("stroke-width", "0px");
  d3.selectAll(".regionLinkInteractionArea").style("stroke-width", "0px");
  d3.selectAll(".d3-region-tip").remove();
  d3.selectAll(".regionNode").style("visibility", "hidden");
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

// ======= Functions to create and modify the region links ======= 

function setUpRegionLinks() {
  computeRegionLinks();
  force.links(regionLinks);

  regionLink = svg.selectAll('.regionLink')
        .data(regionLinks)
        .enter();
  regionLinkInteraction = regionLink.append('line')
        .attr('class', 'regionLinkInteractionArea')
        .attr('x1', function(d) { return regionNodes[d.source].x  - mapTranslateLeft; })
        .attr('y1', function(d) { return regionNodes[d.source].y; })
        .attr('x2', function(d) { return regionNodes[d.target].x  - mapTranslateLeft; })
        .attr('y2', function(d) { return regionNodes[d.target].y; })
        .attr("mask", "url(#regionMask)")
        .style("stroke-width", "0px")
        .on("mouseenter", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#ddd");
        })
        .on("mouseleave", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#777");
        })
        .on("click", function(d) {
          regionLinkClickHandler(d);
        });
  regionLink = regionLink.append('line')
        .attr('class', 'regionLink')
        .attr('id', function(d) { return regionNodes[d.source].id + "-" + regionNodes[d.target].id })
        .attr('x1', function(d) { return regionNodes[d.source].x; })
        .attr('y1', function(d) { return regionNodes[d.source].y; })
        .attr('x2', function(d) { return regionNodes[d.target].x; })
        .attr('y2', function(d) { return regionNodes[d.target].y; })
        .attr("mask", "url(#regionMask)")
        .style("stroke-width", "0px")
        .on("click", function(d) {
          regionLinkClickHandler(d);
        });

  addRegionLinkTooltips(regionLinkInteraction);
  addRegionLinkTooltips(regionLink);

  force.start();
}

function computeRegionLinks(){
  regionLinks = [];
  artistLinks.forEach(function(link) {
    var sourceRegion = artistNodes[link.source].region;
    var sourceIndex = regionIndexMap.indexOf(sourceRegion);
    var targetRegion = artistNodes[link.target].region;
    var targetIndex = regionIndexMap.indexOf(targetRegion);
    var regionLink = getLink(regionLinks, sourceIndex, targetIndex);
    if (regionLink.linksPerYear[link.release_year] == undefined) {
      regionLink.linksPerYear[link.release_year] = [link];
    } else {
      regionLink.linksPerYear[link.release_year].push(link);
    }
  });
  return regionLinks;
}

function getLink(links, sourceIndex, targetIndex) {
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.source === sourceIndex && link.target === targetIndex) {
      // found the link
      return link;
    } else if (link.target === sourceIndex && link.source === targetIndex) {
      // found the link in the other direction but that's fine
      return link;
    }
  }
  var newLink = {source: sourceIndex, target: targetIndex, numLinks: 0, linksPerYear:{}};
  links.push(newLink);
  return newLink;
}

function updateRegionLinks() {
  regionLinks.forEach(function(d) {
    calculateLinks(d);
  });

  d3.selectAll(".regionLink")
    .style("stroke-width", function(d) { 
      if (d.source != d.target) {
        return Math.max(0, 1.25 * Math.log(4 * d.numLinks)) + "px"; 
      }
    });

  d3.selectAll(".regionLinkInteractionArea").style("stroke-width", function(d) {
    if (d.numLinks === 0) {
      return "0px";
    }
    return Math.max(0, 1 + Math.log(d.numLinks)) + 15 + "px";
  });

  var regionLinkTemp = regionLink.filter(function(d, i) { return d.numLinks !== 0 });
  if (regionLinkTemp) {
    regionLinkTemp.call(regionLinkTip);
  }
}

function calculateLinks(link) {
  link.numLinks = 0;
  for (var year in link.linksPerYear) {
    if (parseInt(year) <= currentYear) {
      link.numLinks += parseInt(link.linksPerYear[year].length);
    }
  }
}

function regionLinkClickHandler(regionLink) {
  d3.selectAll(".d3-region-tip").remove();
  var artists = {};
  for (var year in regionLink.linksPerYear) {
    if (year > currentYear) {
      continue;
    }
    var linksInYear = regionLink.linksPerYear[year];
    for (var index in linksInYear) {
      var track = linksInYear[index];
      // if the source artist isn't in the dict, add them
      if (!(track.source in artists)) {
        artists[track.source] = [];
      }
      var targetExists = false;
      for (var targetIndex in artists[track.source]) {
        if (track.target === artists[track.source][targetIndex].target) {
          targetExists = true;
          if (year in artists[track.source][targetIndex].linksPerYear) {
            artists[track.source][targetIndex].linksPerYear[year].push(track); 
          } else {
            artists[track.source][targetIndex].linksPerYear[year] = [track];
          }
          break;
        }
      }
      // if the target artist does not already exist, add them to the source
      if (!targetExists) {
        var yearTrack = {};
        yearTrack[year] = [track];
        artists[track.source].push({ "target": track.target, "linksPerYear": yearTrack });
      }
    }
  }
  headViewRegionLink(artists, regionLink.source.name, regionLink.target.name);
}

function addRegionLinkTooltips(regionLink) {
  var regionLinkTemp = regionLink.filter(function(d, i) { return d.numLinks !== 0 });
  if (regionLinkTemp) {
    regionLinkTemp.call(regionLinkTip);
  }
  regionLink.on("mouseover", function(d) {
    d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#ddd");
    regionLinkTip.show(d);
  });
  regionLink.on("mouseout", function(d) {
    d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#777");
    regionLinkTip.hide(d);
  });
}

// ======= Functions to create and modify the slider ======= 

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

  $(".d3-slider-handle").on("mousedown", function() {
    closeHead();
  });
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
  zoom.on("zoom", null);
  var x, y, k;
  var lon = region.zlon;
  var lat = region.zlat;
  x = projection([-1*lon, lat])[0];
  y = projection([-1*lon, lat])[1];
  k = region.scale;
  
  // hide stuff already on screen
  hideRegions();

  g.on("dblclick", zoomOut);
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() {

      createRegionalArtists(region.id, x, y, k);

      zoom.on("zoom", function() {
        moveThroughTimeRegionalScrolling();
      });
      slider.on("slide", function(evt, value) {
        moveThroughTimeRegionalSliding(value);
      });

    });
  isZoomed = true;
}

function zoomOut() {
  zoom.on("zoom", null);
  // hide stuff already on screen
  svg.selectAll(".currentArtistNode").remove();
  svg.selectAll(".artistLink").remove();
  svg.selectAll(".clippath").remove();
  svg.selectAll("#nyCircle").remove();
  svg.selectAll("#nyBlob").remove();
  if (inNY) {
    inNY = false;
    zoomToRegion(regionNodes[1]);
  } else {
    if (currentRegion === 'NE') {
      artistNodes.splice(artistNodes.length - 1, 1);
    }

    x = width / 2;
    y = height / 2;
    k = 1;

    var regionNode = svg.selectAll('.regionNode');
    addRegionTooltips(regionNode);

    var regionLink = svg.selectAll('.regionLink');
    addRegionLinkTooltips(regionLink);

    artistLink.style("stroke-width", "0px");
    d3.selectAll(".artistLinkInteractionArea").style("stroke-width", "0px");

    g.transition()
      .duration(750)
      .attr("transform", "translate(" + (width / 2 - mapTranslateLeft) + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px")
      .each("end", function() { 
        zoom.on("zoom", function() {
          moveThroughTimeScrolling();
        });
        slider.on("slide", function(evt, value) {
          moveThroughTimeSliding(value);
        });
        d3.selectAll(".regionNode").style("visibility", "visible");
        updateRegions();
      });
    isZoomed = false;
  }
}

// ======= Functions to handle drawing artists in a region ======= 

var currentRegion, currentX, currentY, currentK, currentArtistLinks;
var inNY = false;

function shouldShowArtist(region, node) {
  var t = (node.start_year <= currentYear) && (node.end_year === 'present'||
             node.end_year >= currentYear);
  if (region == 'NE') {
    if (node.state != 'NY' && !inNY) {
      return t;
    } else if (inNY) {
      return t;
    } else {
      return false;
    }
  } else {
    var r = node.region === region;
    return r && t;
  }
}

function countNY() {
  var count = 0;
  for (var i = 0; i < artistNodes.length; i++) {
    var node = artistNodes[i];
    if (node.state != undefined && node.state === 'NY') {
      count++;
    }
  }
  return count;
}

function createRegionalArtists(region, x, y, k) {
  currentRegion = region;
  currentX = x;
  currentY = y;
  currentK = k;

  var nyCount = countNY();
  if (region == 'NE') {
    // lon/lat of new york
    var lon = nyNode.lon;
    var lat = nyNode.lat;
    var zlon = nyNode.zlon;
    var zlat = nyNode.zlat;
    var nyX = projection([-1*zlon, zlat])[0];
    var nyY = projection([-1*zlon, zlat])[1];
    var nyK = nyNode.scale;
    nyNode['nyX'] = nyX;
    nyNode['nyY'] = nyY;
    if (!inNY) {
      artistNodes.push(nyNode);
    }
  }


  var artistLinksTemp = createArtistLinks(region, k, x, y);
  currentArtistLinks = artistLinksTemp;
  artistLinksInformation = artistLinksTemp;

  artistForce.nodes(artistNodes);


  if (region === 'NE' && !inNY) {
    svg.append('circle')
      .attr("id", "nyCircle")
      .attr("fill", nyNode.color)
      .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .attr("cx", projection([-1*lon, lat])[0])
      .attr("cy", projection([-1*lon, lat])[1])
      .attr("r", function(d) { 
        return Math.max(0, 10 * Math.log(nyCount) + 4) / k; 
      })
      .on("click", function() {
        svg.selectAll(".currentArtistNode").remove();
        svg.selectAll(".artistLink").remove();
        svg.selectAll(".clippath").remove();
        svg.selectAll("#nyCircle").remove();
        svg.selectAll("#nyBlob").remove();
        currentK = nyK;
        d3.selectAll(".d3-region-tip").remove();
        g.transition()
          .duration(750)
          .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + nyK + ")translate(" + -nyX + "," + -nyY + ")")
          .style("stroke-width", 1.5 / nyK + "px")
          .each("end", function() {
            inNY = true;
            var artistLinksTemp = createArtistLinks(region, nyK, nyX, nyY);
            currentArtistLinks = artistLinksTemp;
            setUpCurrentArtistNodes(region, nyX, nyY, nyK);
          });
      });

    nyCircle = d3.select("#nyCircle");

    nyCircle.call(regionTip);
    nyCircle.on("mouseover", function() {
        d3.select(this).style("stroke-width", 0.5 + "px").style("stroke", nyNode.ringColor);
          regionTip.show(nyNode);
        });
    nyCircle.on("mouseout", function() {
        d3.select(this).style("stroke-width", "0px");
          regionTip.hide(nyNode);
        });

    var nyBlob = { "points": [ { "lat": 40.93, "lon": 73.83},  { "lat": 40.845, "lon": 73.3},
                                { "lat": 40.7297, "lon": 73}, { "lat": 40.4, "lon": 73.89 },
                                { "lat": 40.545, "lon": 74.16 }, { "lat": 40.76, "lon": 74.03 } ],
                            "color": "blue" };
    var nyBlobOhYeah = svg.append("g")
                          .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    var lineFunction = d3.svg.line()
      .x(function(d) { return projection([-1*d.lon,d.lat])[0]; })
      .y(function(d) { return projection([-1*d.lon,d.lat])[1]; })
      .interpolate("basis-closed");
    nyBlobOhYeah.append("path")
        .attr("d", lineFunction(nyBlob.points))
        .attr("stroke", "black")
        .attr("stroke-width", 0.5)
        .attr("id", "nyBlob")
        .attr("fill", nyBlob.color)
        .style("opacity", 0.2)
        .on("mouseenter", function() {
          d3.select(this).style("opacity", 0.5);
        })
        .on("mouseout", function() {
          d3.select(this).style("opacity", 0.2);
        });
  }

  setUpCurrentArtistNodes(region, x, y, k);
}

function setUpCurrentArtistNodes(region, x, y, k) {
  var artistNode = svg.selectAll(".currentArtistNode")
      .data(artistNodes)
      .enter().append("g")
      .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .attr("class", function(d) {
        if (d.region === region && !(d.state === 'NY' && !inNY)) {
          return "currentArtistNode artistNode";
        } else {
          return "artistNode";
        }
      })
      .attr("name", function(d) {
        return d.name;
      })
      .call(artistForce.drag);

  artistForce.start();
  
  var currentArtistNode = d3.selectAll(".currentArtistNode");

  // set up clip paths to mask artist images to circles
  currentArtistNode.each(function(d, i) {
    xy = getXY(d);
    if (xy == null) {
      return;
    }
    d3.select("defs").append('clipPath')
      .attr("id", getArtistImageName(d.name))
      .attr("class", "clippath")
      .append("circle")
      .attr("id", getArtistImageName(d.name) + "_mask")
      .attr("cx", xy[0])
      .attr("cy", xy[1])
      .attr("r", artistCircleSize / 2)
      .attr("clipPathUnits", "userSpaceOnUse");
  });

  // add artist images to each node
  var images = currentArtistNode.append("image")
    .attr("id", function(d) { if (d == nyNode) { return; } return getArtistImageName(d.name) + "_image" })
    .attr("xlink:href", function(d) { if (d == nyNode) { return; } return "imgs/" + getArtistImageName(d.name) + ".png"; })
    .attr("x", function(d) { if (d == nyNode) { return; } xy = getXY(d); if (xy == null) return; return xy[0] - artistCircleSize / 2; })
    .attr("y", function(d) { if (d == nyNode) { return; } xy = getXY(d); if (xy == null) return; return xy[1] - artistCircleSize / 2; })
    .attr("width", artistCircleSize)
    .attr("height", artistCircleSize)
    // preserve size of circle across different regions, because each region has a different scale
    .attr("transform", function(d) { 
      if (d == nyNode) { return; }
      xy = getXY(d); 
      if (xy == null) return; 
      var xx = xy[0];
      var yy = xy[1];
      return "translate(" + xx + "," + yy + ")scale(" + artistCircleSize / 2 / k + ")translate(" + -xx + "," + -yy + ")"; })
    .attr("clip-path", function(d) { return "url(#" + getArtistImageName(d.name) + ")"; });

  // add border to each artist
  var rings = currentArtistNode.append("circle")
    .attr("id", function(d) { if (d == nyNode) { return; } return getArtistImageName(d.name) + "_ring"; })
    .attr("cx", function(d) { if (d == nyNode) { return; } xy = getXY(d); if (xy == null) return; return xy[0]; })
    .attr("cy", function(d) { if (d == nyNode) { return; } xy = getXY(d); if (xy == null) return; return xy[1]; })
    .attr("r", artistCircleSize / 2)
    // preserve size of circle across different regions, because each region has a different scale
    .attr("transform", function(d) { 
      if (d == nyNode) { return; }
      xy = getXY(d); 
      if (xy == null) return; 
      var xx = xy[0];
      var yy = xy[1];
      return "translate(" + xx + "," + yy + ")scale(" + artistCircleSize / 2 / k + ")translate(" + -xx + "," + -yy + ")"; })
    .style("fill", "none")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

  // draw a ring on hover
  currentArtistNode.call(artistTip);
  currentArtistNode.on("mouseenter", function(d) { 
    if (d == nyNode) { return; }
    artistMouseEnter(d);
    artistTip.show(d);
  });
  currentArtistNode.on("mouseleave", function(d) { 
    if (d == nyNode) { return; }
    artistMouseLeave(d);
    artistTip.hide(d);
  });
  currentArtistNode.on("click", function(d) {
    if (d == nyNode) { return; }
    headViewSingleArtist(d);
  });

  updateRegionalArtists(region, x, y, k);
}

function getXY(artistNode) {
  if (artistNode === nyNode) {
    return [nyNode.nyX, nyNode.nyY];
  }
  var lon = -1 * artistNode.map_longitude;
  var lat = artistNode.map_latitude;
  if (!projection([lon,lat])) {
    return null;
  }
  return [projection([lon,lat])[0], projection([lon,lat])[1]];
}

// converts name of artist in artists.csv to name on image file
// spaces -> '_', quotes are removed, and everything becomes lowercase
function getArtistImageName(name) {
  return name.split(' ').join('_').split('\'').join('').split('.').join('').toLowerCase();
}

function updateRegionalArtists(region, x, y, k) {
  var currentArtistNode = svg.selectAll(".currentArtistNode")
    .style("display", function(d) {
      if (!shouldShowArtist(region, d)) {
        return "none";
      }
    });

    currentArtistNode.each(function(d) {
      if (d.name === searchedArtist) {
        
        setTimeout(function() {
          artistMouseEnter(d, 3);
        }, 200);
        searchedArtist = "";

        setTimeout(function() {
          artistMouseLeave(d);
        }, 2000);
      }
    });

    updateArtistLinks(k);
}


// ======= Functions to handle drawing links in a region ======= 

function createArtistLinks(region, k, x, y) {
  var artistLinksTemp = computeArtistLinks(region);

  artistForce.links(artistLinksTemp);

  filterArtistLinks(artistLinksTemp);

  artistLink = svg.selectAll('.artistLink')
      .data(artistLinksTemp)
      .enter();

  artistLinkInteraction = artistLink.append('line')
      .attr('class', 'artistLinkInteractionArea')
      .attr('x1', function(d) { return d.sourceX; })
      .attr('y1', function(d) { return d.sourceY; })
      .attr('x2', function(d) { return d.targetX; })
      .attr('y2', function(d) { return d.targetY; })
      .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", "0px")
      .call(artistLinkTip)
      .on("mouseenter", function(d) {
        d3.selectAll("#index" + artistMap[d.source.name] + "-index" + artistMap[d.target.name])
          .style("stroke", "#ddd");
        artistLinkTip.show(d);
      })
      .on("mouseleave", function(d) {
        d3.selectAll("#index" + artistMap[d.source.name] + "-index" + artistMap[d.target.name])
          .style("stroke", "#777");
        artistLinkTip.hide(d);

      })
      .on("click", function(d) {
        headViewMultipleArtist(d.linksPerYear, false);
      });

  artistLink = artistLink.append('line')
    .attr('class', 'artistLink')
    .attr('id', function(d) {
      return "index" + d.source + "-index" + d.target;
    })
    .attr('x1', function(d) { return d.sourceX; })
    .attr('y1', function(d) { return d.sourceY; })
    .attr('x2', function(d) { return d.targetX; })
    .attr('y2', function(d) { return d.targetY; })
    .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", "0px")
    .on("mouseenter", function(d) {
      d3.selectAll("#index" + artistMap[d.source.name] + "-index" + artistMap[d.target.name])
        .style("stroke", "#ddd");
    })
    .on("mouseleave", function(d) {
      d3.selectAll("#index" + artistMap[d.source.name] + "-index" + artistMap[d.target.name])
        .style("stroke", "#777");
    })
    .on("click", function(d) {
      headViewMultipleArtist(d.linksPerYear, false);
    });
    

  //addRegionLinkTooltips(regionLinkInteraction);

  return artistLinksTemp;
}

function filterArtistLinks(artistLinksTemp) {
  for (var i = 0; i < artistLinksTemp.length; i++) {
    var link = artistLinksTemp[i];
    var linkSource = artistNodes[link.source];
    var sourceXY = getXY(linkSource);
    if (sourceXY != null) {
      link.sourceX = sourceXY[0];
      link.sourceY = sourceXY[1]
    } else {
      artistLinksTemp.splice(i, 1);
      i--;
      continue;
    }

    var linkTarget = artistNodes[link.target];
    var targetXY = getXY(linkTarget);
    if (targetXY != null) {
      link.targetX = targetXY[0];
      link.targetY = targetXY[1]
    } else {
      artistLinksTemp.splice(i, 1);
      i--;
    }
  }
}

function computeArtistLinks(region) {
  for (var i = 0; i < regionLinks.length; i++) {
    var link = regionLinks[i];
    if (link.source.id === region && link.target.id === region) {
      // now we have the link for this region, which has the collection of links
      // that we care about, stored in an associative array indexed by year
      return artistLinksForRegion(link.linksPerYear);
    } else if (link.source.id === region || link.target.id === region) {
      // add some color for an outgoing edge to other region?
    }
  };
}

function artistLinksForRegion(allLinks) {
  var artistLinksTemp = [];
  for (var year in allLinks) {
    // add all links in this array
    for (var i = 0; i < allLinks[year].length; i++) {
      var link = allLinks[year][i];
      var sourceArtistIndex = link.source;
      if (!inNY && artistNodes[link.source].state === 'NY') {
        sourceArtistIndex = artistNodes.length - 1;
      } else if (inNY && artistNodes[link.source].state !== 'NY') {
        sourceArtistIndex = -1;
      }
      var targetArtistIndex = link.target;
      if (!inNY && artistNodes[link.target].state === 'NY') {
        targetArtistIndex = artistNodes.length - 1;
      } else if (inNY && artistNodes[link.target].state !== 'NY') {
        targetArtistIndex = -1;
      }
      if (sourceArtistIndex != -1 && targetArtistIndex != -1) {
        // this link is valid and the two artists are currently there
        var artistLink = getLink(artistLinksTemp, sourceArtistIndex, targetArtistIndex);
        if (artistLink.linksPerYear[link.release_year] == undefined) {
          artistLink.linksPerYear[link.release_year] = [link];
        } else {
          artistLink.linksPerYear[link.release_year].push(link);
        }
      }
    }
  }
  return artistLinksTemp;
}


function updateArtistLinks(scale) {
  currentArtistLinks.forEach(function(d) {
    calculateLinks(d);
  });

  artistLink.style("stroke-width", function(d) {
      if (d.source != d.target &&
          shouldShowArtist(currentRegion, d.source) &&
          shouldShowArtist(currentRegion, d.target)) {
        return Math.max(0, (3.0 / scale) * Math.log(2 * d.numLinks)) + "px"; 
      } else {
        return "0px";
      }
    });

  d3.selectAll(".artistLinkInteractionArea").style("stroke-width", function(d) {
      if (d.source != d.target &&
          shouldShowArtist(currentRegion, d.source) &&
          shouldShowArtist(currentRegion, d.target)) {
        var width = Math.max(0, (3.0 / scale) * Math.log(2 * d.numLinks)) + 2;
        if (width < 5) {
          width += 5;
        }
        return width + "px"; 
      } else {
        return "0px";
      }
    });
}

function artistMouseEnter(d, scale) {
  var circleSize = artistCircleSize;
  if (scale) {
    circleSize = artistCircleSize * scale;
  }
  $("#" + getArtistImageName(d.name) + "_mask")
    .attr("r", circleSize);
  $("#" + getArtistImageName(d.name) + "_image")
    .attr("x", function() { xy = getXY(d); if (xy == null) return; return xy[0] - circleSize; })
    .attr("y", function() { xy = getXY(d); if (xy == null) return; return xy[1] - circleSize; })
    .attr("width", circleSize * 2)
    .attr("height", circleSize * 2);
  $("#" + getArtistImageName(d.name) + "_ring")
    .css("stroke", "#FF5655")
    .attr("r", circleSize);
}

function artistMouseLeave(d) {
  $("#" + getArtistImageName(d.name) + "_mask")
    .attr("r", artistCircleSize / 2);
  $("#" + getArtistImageName(d.name) + "_image")
    .attr("x", function() { xy = getXY(d); if (xy == null) return; return xy[0] - artistCircleSize / 2; })
    .attr("y", function() { xy = getXY(d); if (xy == null) return; return xy[1] - artistCircleSize / 2; })
    .attr("width", artistCircleSize)
    .attr("height", artistCircleSize);
  $("#" + getArtistImageName(d.name) + "_ring")
    .css("stroke", "#000")
    .attr("r", artistCircleSize / 2);
}

// ======= Functions for handling scrolling ======= 

function moveThroughTimeScrolling() {
  var firefox = false;
  if (d3.event.sourceEvent.type=='wheel'){
      var deltaY = d3.event.sourceEvent.wheelDeltaY;
      if (!deltaY) {
        // firefox
        deltaY = -1 * d3.event.sourceEvent.deltaY;
        firefox = true;
      } 
      if (deltaY){
        if (deltaY > 0){
          currentYear = Math.min(presentYear, Math.round(currentYear + deltaY/30 + 1));
        } else if (deltaY < 0) {
          currentYear = Math.max(startYear, Math.round(currentYear + deltaY/30 - 1));
        }
      } 

    slider.value(currentYear);
    updateRegions();
    updateNarration();

    if (!firefox) {
      zoom.on("zoom", null);
      setTimeout(function(){
        zoom.on("zoom", moveThroughTimeScrolling);
      }, 150);
    }
  }

}

// called when the user slides to zoom, moves through years from 1967 to 2015
function moveThroughTimeSliding(newYear) {
  currentYear = newYear;
  zoom.scale(((currentYear - startYear)/scrollSensitivity) + 1);
  slider.value(currentYear);
  updateRegions();
  updateNarration();
}

function moveThroughTimeRegionalScrolling() {
  var firefox = false;
  if (d3.event.sourceEvent.type=='wheel'){
      var deltaY = d3.event.sourceEvent.wheelDeltaY;
      if (!deltaY) {
        // firefox
        deltaY = -1 * d3.event.sourceEvent.deltaY;
        firefox = true;
      } 
      if (deltaY){
        if (deltaY > 0){
          currentYear = Math.min(presentYear, Math.round(currentYear + deltaY/30 + 1));
        } else if (deltaY < 0) {
          currentYear = Math.max(startYear, Math.round(currentYear + deltaY/30 - 1));
        }
      } 

    slider.value(currentYear);
    updateRegionalArtists(currentRegion, currentX, currentY, currentK);
    updateNarration();

    if (!firefox) {
      zoom.on("zoom", null);
      setTimeout(function(){
        zoom.on("zoom", moveThroughTimeRegionalScrolling);
      }, 150);
    }
  }
}

function moveThroughTimeRegionalSliding(newYear) {
  currentYear = newYear;
  zoom.scale(((currentYear - startYear)/scrollSensitivity) + 1);
  slider.value(currentYear);
  updateRegionalArtists(currentRegion, currentX, currentY, currentK);
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
    d3.json("data/collabs_pruned_with_spotify.json", function(err, collabs) {
      // load up all the collaborations
      artistLinks = [];
      for (var artist in collabs) {
        if (singleHeadCollabMap[artist] == undefined) {
            singleHeadCollabMap[artist] = [];
        }
          
        var sourceIndex = artistMap[artist];
        if (sourceIndex >= 0) {
          var targetArtists = collabs[artist];

          //Iterate through each collabing artist
          for (var targetArtist in targetArtists) {
            var targetIndex = artistMap[targetArtist];
            var tracks = targetArtists[targetArtist]

            //Iterate through each artists songs
            for (var i = 0; i < tracks.length; i++) {
                singleHeadCollabMap[artist].push(tracks[i]);
                if (singleHeadCollabMap[targetArtist] == undefined) {
                   singleHeadCollabMap[targetArtist] = [];
                }
                singleHeadCollabMap[targetArtist].push(tracks[i]);
                /*   
                //Iterate through artist credit to give credit bi-directionally.
                for (var j = 0; j < tracks[i].artist_credit.length; j++) {
                    var otherArtist = tracks[i].artist_credit[j];
                    if (otherArtist !== artist) {
                       if (singleHeadCollabMap[artist] == undefined) {
                          singleHeadCollabMap[artist] = [];
                       }
                       singleHeadCollabMap[otherArtist].push(tracks[i]);
                    }
                }
                */
            }
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

jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = document.createEvent("MouseEvents");
    evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    e.dispatchEvent(evt);
  });
};
