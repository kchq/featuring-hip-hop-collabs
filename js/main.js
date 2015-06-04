//d3.select(window).on("resize", throttle);

// lat and lon are the coordinates of where the region circle are drawn, zlat and zlon are the center of zoom when 
// the region is zoomed in on
var regionNodes = [
  {"id":"W", "lon": 122.3331, "lat": 47.609, "zlon": 122.3331, "zlat": 47.609, "color": "#3AA827", "scale": 32, "numArtists":0, "artistsPerYear":{}},
  {"id":"NE", "lon": 74.0059, "lat": 40.7127, "zlon": 76, "zlat": 40.5, "color": "steelblue", "scale": 7, "numArtists":0, "artistsPerYear":{}},
  {"id":"NC", "lon": 122, "lat": 37.8, "zlon": 121.8, "zlat": 38.1, "color": "#BF9900", "scale": 24, "numArtists":0, "artistsPerYear":{}},
  {"id":"SC", "lon": 118.5, "lat": 34.2, "zlon": 118.6, "zlat": 34, "color": "#E39612", "scale": 36, "numArtists":0, "artistsPerYear":{}},
  {"id":"S", "lon": 85, "lat": 32, "zlon": 86, "zlat": 32, "color": "#BF113A", "scale": 2.3, "numArtists":0, "artistsPerYear":{}},
  {"id":"MW", "lon": 87.6847, "lat": 40, "zlon": 87.2, "zlat": 41.5, "color": "#A314A8", "scale": 4, "numArtists":0, "artistsPerYear":{}}
]

var nyNode = {"id":"NY", "lon": 74.0059, "lat": 40.7127, "zlon": 73.7, "zlat": 40.65, "color": "red", "scale": 54 };
const regionIndexMap = ["W", "NE", "NC", "SC", "S", "MW"];

const startYear = 1965;
const birthYear = 1967;
const presentYear = 2015;

const scrollSensitivity = 2.0; // higher equals more sensitive
const artistCircleSize = 7;

var prevYear = startYear;
var currentYear = startYear;

var zoom = d3.behavior.zoom()
  .scaleExtent([1,((presentYear - startYear) / scrollSensitivity) + 1])
  .on("zoom", function() {
    moveThroughTimeScrolling();
  });

var width, height, mapTranslateLeft, mainVisTop, mainVisLeft, narrationLeft, narrationTop, narrationWidth, centered, timelineEventDescriptions, timelineEvents, slider;
var svg, svgNarration, g, gn, gt;
var artistNodes, artistMap, regionLinks;
var regionNode, regionLink, artistLink;

var isZoomed = false;

width = $(window).width();
height = $(window).height();

var force = d3.layout.force()
    .size([width, height])
    .on("tick", function() {
      tick(regionLink);
    });

var artistForce = d3.layout.force()
    .size([width, height])
    .on("tick", function() {
      tick(undefined);
    });

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
  //headSetup();
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

function tick(link) {
  regionNode.attr("cx", function(d) { return d.x - mapTranslateLeft; })
      .attr("cy", function(d) { return d.y; });

  if (link) {
    link.attr('x1', function(d) { return d.source.x - mapTranslateLeft; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x - mapTranslateLeft; })
      .attr('y2', function(d) { return d.target.y; });
  }
  d3.selectAll(".regionLinkInteractionArea")
    .attr('x1', function(d) { return d.source.x - mapTranslateLeft; })
    .attr('y1', function(d) { return d.source.y; })
    .attr('x2', function(d) { return d.target.x - mapTranslateLeft; })
    .attr('y2', function(d) { return d.target.y; });
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

  regionNode = svg.selectAll(".regionNode")
    .data(regionNodes)
    .enter().append("g")
    .attr("class", "regionNode")
    .call(force.drag)
    .append("svg:circle")
      .style("fill", function(d) {
        return d.color;
      })
      .on("click", function(d) {
        zoomToRegion(d); 
      });
}

function updateRegions() {
  regionNodes.forEach(function(d) {
    calculateArtists(d);
  });

  d3.selectAll("circle").transition().duration(100).attr("r", function(d) { 
    return Math.max(0, 10 * Math.log(d.numArtists) + 4); 
  });

  updateRegionLinks();
}

function hideRegions() {
  d3.selectAll("circle").attr("r", 0);
  regionLink.style("stroke-width", "0px");
  d3.selectAll(".regionLinkInteractionArea").style("stroke-width", "0px");
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
  regionLink.append('line')
        .attr('class', 'regionLinkInteractionArea')
        .attr('x1', function(d) { return regionNodes[d.source].x  - mapTranslateLeft; })
        .attr('y1', function(d) { return regionNodes[d.source].y; })
        .attr('x2', function(d) { return regionNodes[d.target].x  - mapTranslateLeft; })
        .attr('y2', function(d) { return regionNodes[d.target].y; })
        .style("stroke-width", "0px")
        .on("mouseenter", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#ddd");
        })
        .on("mouseleave", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#777");
        });
  regionLink = regionLink.append('line')
        .attr('class', 'regionLink')
        .attr('id', function(d) { return regionNodes[d.source].id + "-" + regionNodes[d.target].id })
        .attr('x1', function(d) { return regionNodes[d.source].x; })
        .attr('y1', function(d) { return regionNodes[d.source].y; })
        .attr('x2', function(d) { return regionNodes[d.target].x; })
        .attr('y2', function(d) { return regionNodes[d.target].y; })
        .style("stroke-width", "0px")
        .on("mouseenter", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#ddd");
        })
        .on("mouseout", function(d) {
          d3.selectAll("#" + d.source.id + "-" + d.target.id).style("stroke", "#777");
        })
        .on("click", function(d) {
          // TODO: Sonja
          console.log(d);
        });

  force.start();
}

function computeRegionLinks(){
  regionLinks = [];
  artistLinks.forEach(function(link) {
    var sourceRegion = artistNodes[link.source].region;
    var sourceIndex = regionIndexMap.indexOf(sourceRegion);
    var targetRegion = artistNodes[link.target].region;
    var targetIndex = regionIndexMap.indexOf(targetRegion);
    if (sourceIndex != targetIndex) {
      // we don't show self loops to a region.
      var regionLink = getLink(regionLinks, sourceIndex, targetIndex);
      if (regionLink.linksPerYear[link.release_year] == undefined) {
        regionLink.linksPerYear[link.release_year] = 1;
      } else {
        regionLink.linksPerYear[link.release_year]++;
      }
    }
  });
  return regionLinks;
}

function getLink(regionLinks, sourceIndex, targetIndex) {
  for (var i = 0; i < regionLinks.length; i++) {
    var link = regionLinks[i];
    if (link.source == sourceIndex && link.target == targetIndex) {
      // found the link
      return link;
    }
  }
  var newLink = {source: sourceIndex, target: targetIndex, numLinks: 0, linksPerYear:{}};
  regionLinks.push(newLink);
  return newLink;
}

function updateRegionLinks() {
  regionLinks.forEach(function(d) {
    calculateLinks(d);
  });

  d3.selectAll(".regionLink").style("stroke-width", function(d) { 
    return Math.max(0, 1 + Math.log(d.numLinks)) + "px"; 
  });

  d3.selectAll(".regionLinkInteractionArea").style("stroke-width", function(d) {
    return Math.max(0, 1 + Math.log(d.numLinks)) + 15 + "px";
  });
}

function calculateLinks(link) {
  link.numLinks = 0;
  for (var year in link.linksPerYear) {
    if (parseInt(year) <= currentYear) {
      link.numLinks += parseInt(link.linksPerYear[year]);
    }
  }
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
  var lon = region.zlon;
  var lat = region.zlat;
  x = projection([-1*lon, lat])[0];
  y = projection([-1*lon, lat])[1];
  k = region.scale;
  hideRegions();
  zoom.on("zoom", function() {
    moveThroughTimeRegionalScrolling();
  });
  slider.on("slide", function(evt, value) {
    moveThroughTimeRegionalSliding(value);
  });
  g.on("dblclick", zoomOut);
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px")
    .each("end", function() {
      drawRegionalArtists(region.id, x, y, k);
    });
  isZoomed = true;
}

function zoomOut() {
  if (inNY) {
    inNY = false;
    svg.selectAll(".artistNode").remove();
    svg.selectAll(".clippath").remove();
    svg.selectAll("#nyCircle").remove();
    zoomToRegion(regionNodes[1]);
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;

    svg.selectAll(".artistNode").remove();
    svg.selectAll(".clippath").remove();
    svg.selectAll("#nyCircle").remove();
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
        updateRegions();
      });
    isZoomed = false;
  }
}

// ======= Functions to handle drawing artists in a region ======= 

var currentRegion, currentX, currentY, currentK;
var inNY = false;
function drawRegionalArtists(region, x, y, k) {
  currentRegion = region;
  currentX = x;
  currentY = y;
  currentK = k;
  
  // filter out artists who are not in the selected region or not active in the current year
  var artistNodesTemp = artistNodes.filter( function(a) {
    var r = a.region === region;
    var t = (a.start_year <= currentYear) && (a.end_year === 'present'|| a.end_year >= currentYear);
    return r && t;
  });

  var nyCount = 0;
  if (region == 'NE') {
    // lon/lat of new york
    var lon = nyNode.lon;
    var lat = nyNode.lat;
    var zlon = nyNode.zlon;
    var zlat = nyNode.zlat;
    var nyX = projection([-1*zlon, zlat])[0];
    var nyY = projection([-1*zlon, zlat])[1];
    var nyK = nyNode.scale;
    if (!inNY) {
      artistNodesTemp = artistNodesTemp.filter( function(a){
        if (a.state != 'NY') {
          return true;
        } else {
          nyCount++;
          return false;
        }
      });
      svg.append('circle')
        .attr("id", "nyCircle")
        .attr("fill", "red")
        .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .attr("cx", projection([-1*lon, lat])[0])
        .attr("cy", projection([-1*lon, lat])[1])
        .attr("r", function(d) { 
          return Math.max(0, 10 * Math.log(nyCount) + 4) / k; 
        })
        .on("click", function() {
          svg.selectAll(".artistNode").remove();
          svg.selectAll(".clippath").remove();
          svg.selectAll("#nyCircle").remove();
          g.transition()
            .duration(750)
            .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + nyK + ")translate(" + -nyX + "," + -nyY + ")")
            .style("stroke-width", 1.5 / nyK + "px")
            .each("end", function() {
              inNY = true;
              drawRegionalArtists(region, nyX, nyY, nyK);
            });
        });
    } else {
      artistNodesTemp = artistNodesTemp.filter( function(a) {
        return a.state == 'NY';
      });
    }
  }

  artistForce.nodes(artistNodesTemp);

  var artistNode = svg.selectAll(".artistNode")
      .data(artistNodesTemp)
      .enter().append("g")
      .attr("transform", "translate(" + (width - mapTranslateLeft) / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .attr("class", "artistNode")
     // .on("click", click)
     // .on("dblclick", dblclick)
      .call(artistForce.drag);

  artistForce.start();
  
  // set up clip paths to mask artist images to circles
  artistNode.each(function(d, i) {
    xy = getXY(d);
    if (xy == null) {
      return;
    }
    svg.append('clipPath')
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
  var images = artistNode.append("image")
    .attr("id", function(d) { return getArtistImageName(d.name) + "_image" })
    .attr("xlink:href", function(d) { return "imgs/" + getArtistImageName(d.name) + ".png"; })
    .attr("x", function(d) { xy = getXY(d); if (xy == null) return; return xy[0] - artistCircleSize / 2; })
    .attr("y", function(d) { xy = getXY(d); if (xy == null) return; return xy[1] - artistCircleSize / 2; })
    .attr("width", artistCircleSize)
    .attr("height", artistCircleSize)
    // preserve size of circle across different regions, because each region has a different scale
    .attr("transform", function(d) { 
      xy = getXY(d); 
      if (xy == null) return; 
      var xx = xy[0];
      var yy = xy[1];
      return "translate(" + xx + "," + yy + ")scale(" + artistCircleSize / 2 / k + ")translate(" + -xx + "," + -yy + ")"; })
    .attr("clip-path", function(d) { return "url(#" + getArtistImageName(d.name) + ")"; });

  // add border to each artist
  var rings = artistNode.append("circle")
    .attr("id", function(d) { return getArtistImageName(d.name) + "_ring"; })
    .attr("cx", function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
    .attr("cy", function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
    .attr("r", artistCircleSize / 2)
    // preserve size of circle across different regions, because each region has a different scale
    .attr("transform", function(d) { 
      xy = getXY(d); 
      if (xy == null) return; 
      var xx = xy[0];
      var yy = xy[1];
      return "translate(" + xx + "," + yy + ")scale(" + artistCircleSize / 2 / k + ")translate(" + -xx + "," + -yy + ")"; })
    .style("fill", "none")
    .style("stroke", "#000")
    .style("stroke-width", "0.5px");

  // draw a ring on hover
  artistNode.on("mouseenter", function(d) { 
    artistMouseEnter(d);
  });
  artistNode.on("mouseleave", function(d) { 
    artistMouseLeave(d);
  });
  artistNode.on("click", function(d) {
    headViewSingleArtist(d);
  });
}

function getXY(artistNode) {
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
  svg.selectAll(".artistNode").remove();
  svg.selectAll(".clippath").remove();
  svg.selectAll("#nyCircle").remove();
  drawRegionalArtists(region, x, y, k);
}

function artistMouseEnter(d) {
  $("#" + getArtistImageName(d.name) + "_mask")
    .attr("r", artistCircleSize);
  $("#" + getArtistImageName(d.name) + "_image")
    .attr("x", function() { xy = getXY(d); if (xy == null) return; return xy[0] - artistCircleSize; })
    .attr("y", function() { xy = getXY(d); if (xy == null) return; return xy[1] - artistCircleSize; })
    .attr("width", artistCircleSize * 2)
    .attr("height", artistCircleSize * 2);
  $("#" + getArtistImageName(d.name) + "_ring")
    .css("stroke", "#FF5655")
    .attr("r", artistCircleSize);
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
  currentYear = Math.round((d3.event.scale - 1) * scrollSensitivity + startYear);
  slider.value(currentYear);
  updateRegions();
  updateNarration();
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
  currentYear = Math.round((d3.event.scale - 1) * scrollSensitivity + startYear);
  slider.value(currentYear);
  updateRegionalArtists(currentRegion, currentX, currentY, currentK);
  updateNarration();
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

