xStart = $(window).width() * 0.25;
yStart = $(window).height() * 0.05 
headHeight= $(window).height() * 0.90;
headWidth = $(window).width() * 0.70;
image1X = xStart * .3;
image2X = xStart * 1.8;
imageY = yStart * .4;
imageWidth = headWidth * 0.20;
imageWidthDual = headWidth * 0.25;

image1A = $(window).width() * 0.25;

prevArtists = null;

function headSetup(artistNode1, artistNode2) {
//    var artistImage1 = "imgs/" + getArtistImageName(artistNode1.name) + ".png";
  //  var artistImage2 = "imgs/" + getArtistImageName(artistNode2.name) + ".png";
  //
    var gh = addImages(artistNode1, artistNode2);
    addData(gh, artistNode1, artistNode2);
}

// 'gh' coming from addImages. it represents the internal contents 
// of the head Rectangle that represents the head to head container
function addData(gh, node1, node2){
    dataArtist1 = gh.append("text")
        .attr("class", "head headname")
		.attr("x", image1X + imageWidthDual / 2)
		.attr("y", imageY + imageWidthDual * 1.2)
	    .style("font-size", narrationWidth * 0.1)
        .style("text-anchor", "middle")
		.style("fill", "black")
        // TODO update .text with the name of the artist
		.text(function(d) { return "50 Cent(1)";});
    
    /*gh.append("svg:a")
        .attr("xlink:href","https://www.facebook.com/EarlSweatshirtMusic?fref=ts")
        .attr("class", "head headname")
		.append("text")
            .text("-Earl Sweatshirt Facebook").attr("x", image1X)
		    .attr("y", imageY + imageWidth * 1.3);*/


    dataArtist2 = gh.append("text")
        .attr("class", "head headname")
		.attr("x", image2X + imageWidthDual / 2)
		.attr("y", imageY + imageWidthDual * 1.2)
	    .style("font-size", narrationWidth * 0.1)
		.style("fill", "black")
        .style("text-anchor", "middle") 
        // TODO update .text with the name of the artist
		.text(function(d) { return "Earl Sweatshirt(2)";});
}

function addImages(node1, node2) {

    var artistImage1 = "imgs/" + getArtistImageName(node1.name) + ".png";
    var artistImage2 = "imgs/" + getArtistImageName(node2.name) + ".png";;


   svgHead.append('clipPath')
      .attr("id", getArtistImageName(node1.name) + "2")
      .attr("class", "clippath")
      .append("circle")
      .attr("cx",  image1X + imageWidthDual / 2)
      .attr("cy", imageY + imageWidthDual / 2)
      .attr("r", imageWidthDual / 2)
      .attr("clipPathUnits", "userSpaceOnUse");

    gh.append("image")
        .attr("xlink:href", artistImage1)
        .attr("x", image1X)
        .attr("y", imageY)
        .attr("width", imageWidthDual)
        .attr("height", imageWidthDual)
        // preserve size of circle across different regions, because each region has a different scale
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node1.name) + "2)"; })
        .style("cursor", "pointer")
        .on("mouseenter", function() {
          d3.select("#" + getArtistImageName(node1.name) + "ring").style("stroke", "#9F97A2").style("stroke-width", "4px");
          d3.select(this).style("opacity", 0.7);
        })
        .on("mouseleave", function() {
          d3.select("#" + getArtistImageName(node1.name) + "ring").style("stroke", "#000").style("stroke-width", "2px");
          d3.select(this).style("opacity", 1.0);
        })
        .on("click", function() { 
          closeHead(false);
          headViewSingleArtist(node1, false);
        });
        
    gh.append("circle")
        .attr("id", getArtistImageName(node1.name) + "ring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image1X + imageWidthDual / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidthDual / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", imageWidthDual / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    svgHead.append('clipPath')
      .attr("id", getArtistImageName(node2.name) + "2")
      .attr("class", "clippath")
      .append("circle")
      .attr("cx",  image2X + imageWidthDual / 2)
      .attr("cy", imageY + imageWidthDual / 2)
      .attr("r", imageWidthDual / 2)
      .attr("clipPathUnits", "userSpaceOnUse"); 

    gh.append("image")
        .attr("xlink:href", artistImage2)
        .attr("x", image2X)
        .attr("y", imageY)
        .attr("width", imageWidthDual) 
        .attr("height", imageWidthDual)
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node2.name) + "2)"; })
        .style("cursor", "pointer")
        .on("mouseenter", function() {
          d3.select("#" + getArtistImageName(node2.name) + "ring").style("stroke", "#9F97A2").style("stroke-width", "4px");
          d3.select(this).style("opacity", 0.7);
        })
        .on("mouseleave", function() {
          d3.select("#" + getArtistImageName(node2.name) + "ring").style("stroke", "#000").style("stroke-width", "2px");
          d3.select(this).style("opacity", 1.0);
        })
        .on("click", function() {
          closeHead(false);
          headViewSingleArtist(node2, false);
        });
        
    gh.append("circle")
        .attr("id", getArtistImageName(node2.name) + "ring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image2X + imageWidthDual / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidthDual / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", imageWidthDual / 2)
        // preserve size of circle across different regions, because each region has a different scale
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    return gh;
}

// Shows artist detailed view in head to head fashion only displaying a single artist
function headViewSingleArtist(artist, fromOther) {

    headStart();
    if (!fromOther) {
        blurBackground();
    }
    var artistFormatted = getArtistImageName(artist.name);
    var artistImage = "imgs/" + artistFormatted + ".png";
    var imgWidth = imageWidth * 1.5

    svgHead = d3.select("#head")
		.style("left", xStart + "px")
		.style("top", yStart + "px")
		.style("position", "absolute")
		.append("svg")
		.attr("width", headWidth)
		.attr("height", headHeight)
		.attr("id", "headSVG")

  gh = svgHead.append("g");

	gh.append("rect")
		.attr("id", "headRect")
		.attr("width", headWidth)
		.attr("height", headHeight)
		.style("fill", "white")
        .style("background", "#333")
		.style("stroke", "black")
		.style("stroke-width", $(window).width() * 0.005)
        .style("opacity", 0.8);






var regionAbbrs = ["NE", "S", "SC", "NC", "MW", "W"];
  var regionFullNames = ["North East", "South", "South California", "North California", "MidWest", "Washington"]
  var collabsWithOtherRegion = new Map();
  for (var i = 0; i < regionAbbrs.length; i++) {
    collabsWithOtherRegion.set(regionAbbrs[i], 0);
  }
  var totalCollaborationsWithOtherRegion = 0;

  var spotifyFrame = $("<iframe>");
  var collabsWidth = headWidth * .47;
  var collabsHeight = headHeight * .4;
  var frameWidth = Math.max(headWidth * 0.4, 250);
  var frameHeight = Math.max(headHeight * 0.4, frameWidth + 80);

  var collabsList = $("<div id='collabsList'>");
    collabsList.css("left", headWidth - collabsWidth + "px")
        .css("top", /* headHeight * 0.02 + */"0px")
        .css("width", collabsWidth + "px")
        .css("height", headHeight - 330 + "px")
        .css("position", "absolute");

  // var ul = $("<ul class='list-group collab'>");
  //   ul.css("max-height", headHeight - 330 - 10 + "px")
  //       .css("border", "2px")
  //       .css("width", collabsWidth + "px")
  //       .css("border-style", "solid")
  //       .css("border-width", "3px");

    var uriList = "";
    var numListItems = 0;
    var numSpotifyItems = 0;
    var collabData = [];

    for (var i = 0; i < singleHeadCollabMap[artist.name].length; i++) { //var track in singleHeadCollabMap[artist.name]) {
        var trk = singleHeadCollabMap[artist.name][i];
        
        if (trk.release_year !== undefined && parseInt(trk.release_year) <= currentYear) {
          var singleTuple = {};
          singleTuple["track"] = trk.title;
          singleTuple["release_title"] = trk.release_title;
          singleTuple["year"] = trk.release_year;
          collabData.push(singleTuple);

          numListItems++;

          // update collaborations with other regions
          var targetRegion = artistNodes[trk.target].region;
          var regionCollabCount = collabsWithOtherRegion.get(targetRegion);
          regionCollabCount++;
          totalCollaborationsWithOtherRegion++;
          collabsWithOtherRegion.set(targetRegion, regionCollabCount);
          
          if (trk.spotifyURI !== undefined && numSpotifyItems < 80) {
            var uriArray = trk.spotifyURI.split(":");
            uriList += uriArray[2] + ",";
            numSpotifyItems++;
          }
        }

    }

if (numListItems > 0) {
   // column definitions
    var columns = [
        { head: 'Track Title', cl: 'track', html: ƒ('track') },
        { head: 'Album Title', cl: 'release_title', html: ƒ('release_title') },
        { head: 'Year', cl: 'year', html: ƒ('year') },
    ];


      var tableDiv = d3.select("#head").append('div')
                        .style("left", headWidth - collabsWidth + "px")
                        .style("top", /* headHeight * 0.02 + */"0px")
                        .style("width", collabsWidth + "px")
                        .style("height", headHeight - 330 + "px")
                        .style("position", "absolute")
                        .style("overflow-y", "scroll")
                        .style("overflow-x", "hidden");

     var table = tableDiv.append('table')
                        .style("width", collabsWidth + "px")
                        .style("height", headHeight - 330 + "px")
                        .style("border-collapse", "separate")
                        .style("border-spacing", "2px");

    // create table header
    table.append('thead').append('tr')
      .selectAll('th')
      .data(columns).enter()
      .append('th')
      .attr('class', ƒ('cl'))
      .attr('class', 'tableHead')
      .text(ƒ('head'));

    // create table body
    table.append('tbody')
      .selectAll('tr')
      .data(collabData).enter()
      .append('tr')
      .attr('class', 'tableCell')
      .selectAll('td')
      .data(function(row, i) {
          return columns.map(function(c) {
              // compute cell values for this specific row
              var cell = {};
              d3.keys(c).forEach(function(k) {
                  cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
              });
              return cell;
          });
      }).enter()
      .append('td')
      .html(ƒ('html'))
      .attr('class', ƒ('cl'));
    }


  var collabDivWidth = headWidth;
    if (uriList !== "") {
      var spotifyFrame = $("<iframe>");
      spotifyFrame.attr("src", "https://embed.spotify.com/?uri=spotify:trackset:Collaboration Song Demos:" + uriList)
                  .attr("frameborder", "0")
                  .attr("id", "spotifyFrame")
                  .attr("allowTransparency", "true")
                  .css("left", headWidth - 250 - 2 + "px")
                  .css("top", headHeight - 330 - 2 + "px")
                  .css("width", "250px")
                  .css("height", "330px")
                  .css("position", "absolute");
      $("#head").append(spotifyFrame);
    }

    if (numListItems != 0) {
      collabDivWidth = headWidth - 250;

    }





    var imagePositionX = image1A - imageWidth / 2;
    if (collabDivWidth === headWidth) {
      imagePositionX = $(window).width() * 0.47;
    }

   svgHead.append('clipPath')
        .attr("id", artistFormatted + "Large")
        .attr("class", "clippath")
        .append("circle")
        .attr("cx", imagePositionX * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2)      
        .attr("r", (imageWidth * 3/2) / 2)
        .attr("clipPathUnits", "userSpaceOnUse");

    gh.append("image")
        .attr("xlink:href", artistImage)
        .attr("x", imagePositionX * .5)
        .attr("y", imageY)
        .attr("width", imageWidth * 3/2)
        .attr("height", imageWidth * 3/2)
        // preserve size of circle across different regions, because each region has a different scale
        .attr("clip-path", function(d) { return "url(#" + artistFormatted + "Large" + ")"; });

    gh.append("circle")
        .attr("id", "50_centring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", imagePositionX * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", (imageWidth * 3/2) / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

//    collabsList.append(rapperTitle);

   //FOR EACH LINK ADD ONE OF THESE, OK? COOl

   var artistCityLeft = imagePositionX * .5 - 40;
   var artistYearLeft = imagePositionX * .5 + imageWidth * 0.9

    size = Math.min(5, artist.name.length)
    if (collabDivWidth === headWidth) {
     artistCityLeft = headWidth * 0.1;
     artistYearLeft = headWidth * 0.7;
     size = 10;
     if (artist.name.length > 10) {
      size = 6;
     }
    }
  
    
  

    var artistName = $("<p id='artistNameHead'>");
    artistName.css("font-size", size + "vmin")
        //.css('color', 'black');
        .css("text-align", "center")
        .css("left", imagePositionX * .5 - 50 + "px") 
        .css("top", imageY + imageWidth * 3/2 + "px")
        .css("width", imageWidth * 3/2 + 100 + "px")
        .css("max-height", headHeight * 0.6 - imageY + imageWidth * 3/2 + "px")
        .css("position", "absolute");
    artistName.text(artist.name);

    size = Math.min(5, artist.name.length)
    var artistCity = $("<p id='rapperCity'>");
    artistCity.css("font-size", size/1.7 + "vmin")
      .css("text-align", "center")
      .css("left", artistCityLeft + "px") 
      .css("top", imageY + imageWidth * 3/2 + imageWidth * 0.25 + "px")
      .css("max-width", (imageWidth * 3/2 + 100)/2 + "px")
      .css("position", "absolute");

    if (String(artist.city).length > 11) { 
      artistCity.text(String(artist.city).substring(0, 11));
    } else {
      artistCity.text(artist.city);
    }

    size = Math.min(size, 5);
    var artistYear1 = $("<p id='rapperYear'>");
    artistYear1.css("font-size", size/1.7+ "vmin")
      .css("text-align", "center")
      .css("left", artistYearLeft + "px") 
      .css("top", imageY + imageWidth * 3/2 + imageWidth * 0.25 + "px")
      .css("max-width", headWidth * 0.3 + "px")
      .css("max-height", height * 0.15 + "px")
      .css("position", "absolute");
    artistYear1.text("Active Since " + artist.start_year);

    var artistBio = $("<div id='artistBio'>");
    artistBio.css("height", headHeight * 0.4 + "px")
             .css("width", collabDivWidth + "px")
             .css("left", "0px")
             .css("top", headHeight - headHeight * .40 + "px")
             .css("position", "absolute")
             .css("font-size", headWidth * 0.02)
             .css("border", "3px solid black")
             .css("background-color", "white")
             .css("padding-left", headWidth * 0.02 + "px");

    var artistExternalLinks = $("<p>")
                                .css("font-family", "paintbrush")
                                .css("float", "left");
    artistExternalLinks.html(artist.external_links);


    var artistCollabDiv = $("<div>")
                            .css("padding", "0px")
                            .css("height", artistBio.height() * 0.9 + "px")
                            .css("max-height", artistBio.height() * 0.9 + "px")
                            .css("min-height", artistBio.height() * 0.9 + "px")
                            .css("font-size", artistBio.width() * 0.03 + "px")
                            .css("text-anchor", "center")
                            .append("Artist Collaborations By Region");

    var artistCollabInfo = artistCollabDiv.append("<canvas id='collabChart'>")
                            .css("float", "left")
                            .css("height", artistBio.height() * 0.9 + "px")
                            .css("max-height", artistBio.height() * 0.9 + "px")
                            .css("min-height", artistBio.height() * 0.9 + "px")
                            .css("width", artistBio.width() * 0.55 + "px")
                            .css("padding-bottom", headHeight * 0.3 + "px")
                            .css("margin-left", artistBio.width() * 0.05 + "px")
                            .css("margin-top", artistBio.height() * 0.1 + "px");

    artistBio.append(artistExternalLinks);
    artistBio.append(artistCollabDiv);

    $("#head").append(artistBio);
    $("#head").append(artistName);
    $("#head").append(artistCity);
    $("#head").append(artistYear1);
    $(".external_links").css("height", artistBio.height() * 0.7 + "px")
                        .css("width", artistBio.width() * 0.3 + "px")
                        .css("list-style", "none")
                        .css("padding-left", "0px")
                        .css("margin-top", artistBio.height() * 0.1 + "px");

  // $("#collabChart").css("padding-bottom", headHeight * 0.025 + "px");

  // if (collabDivWidth === headWidth) {
  //   artistCollabInfo.css("width", artistBio.width() * 0.25 + "px");
  //   $(".external_links").css("min-width", artistBio.width() * 0.4 + "px");
  //   artistCollabDiv.css("font-size", artistBio.width() * 0.01 + "px");
  // } else {
  //   $("#collabChart").css("width", artistBio.width() * 0.65 + "px")
  //   $("#collabChart").css("height", artistBio.height() * 0.8 + "px")
  //   $(".external_links").css("width", artistBio.width() * 0.3 + "px");
  // }

if (collabDivWidth === headWidth) {
  $("#collabChart").css("width", artistBio.width() * 0.65 + "px");
   $("#collabChart").css("height", artistBio.height() * 0.7 + "px");
  artistCollabDiv.css("font-size", artistBio.width() * 0.02 + "px");
  artistCollabInfo.css("margin-left", artistBio.width() * 0.02 + "px")


}
   $("#collabChart").css("width", artistBio.width() * 0.65 + "px");
   $("#collabChart").css("height", artistBio.height() * 0.8 + "px");
   $(".external_links").css("width", artistBio.width() * 0.3 + "px");
  artistCollabInfo = document.getElementById("collabChart").getContext("2d");

    var barData = {
      labels : regionFullNames,
      datasets : [
        {
          label: "Collaborations by Region",
          fillColor : "#aaa",
          strokeColor : "black",
          data : [collabsWithOtherRegion.get(regionAbbrs[0]),
                  collabsWithOtherRegion.get(regionAbbrs[1]),
                  collabsWithOtherRegion.get(regionAbbrs[2]),
                  collabsWithOtherRegion.get(regionAbbrs[3]),
                  collabsWithOtherRegion.get(regionAbbrs[4]),
                  collabsWithOtherRegion.get(regionAbbrs[5])]
        }
      ]
    }

    var options = { scaleFontFamily : "'paintBrush'" }

    var chart = new Chart(artistCollabInfo).Bar(barData, options);
    chart.datasets[0].bars[0].fillColor = "rgb(96,99,106)";
    chart.datasets[0].bars[1].fillColor = "rgb(165,172,175)";
    chart.datasets[0].bars[2].fillColor = "rgb(65,68,81)";
    chart.datasets[0].bars[3].fillColor = "rgb(148,145,123)";
    chart.datasets[0].bars[4].fillColor = "rgb(143,135,130)";
    chart.datasets[0].bars[5].fillColor = "rgb(207,207,207)";
    chart.update();
    
    var rapperTitle = $("<h1 id='rapperName'>");
    rapperTitle.text(artist.name);

    gh.append("text")
      .attr("x", headWidth * 0.02)
      .attr("y", headHeight * 0.09)
      .attr("id", "closeMenuText")
      .style("font-size", headWidth * 0.07)
      .style("text-anchor", "start")
      .text(function(d) { return "\u2718";})
      .on("click", closeHead);

    $(document).mouseup(clickedOutside);
}


function headViewMultipleArtist(linksPerYear, fromRegionLinkView, artistNodeIndex1, artistNodeIndex2) {
   var spotifyFrame = $("<iframe>");
   var collabsWidth = headWidth - 250;
   var collabsHeight = headHeight * .4;
   var frameWidth = Math.max(headWidth * 0.4, 250);
   var frameHeight = Math.max(headHeight * 0.4, frameWidth + 80);

   headStart();
   blurBackground();
    
   var source;
   var dest;

   if (artistNodeIndex1 !== undefined && artistNodeIndex2 !== undefined) {
      source = artistNodes[artistNodeIndex1];
      dest = artistNodes[artistNodeIndex2];
      delete linksPerYear["sourceId"];
      delete linksPerYear["targetId"];
      
   } else {

     //Find source and dest artist, yeah its ugly. I know it, babe.
     for (var links in linksPerYear) {
         linksYear = linksPerYear[links];
         for (var i = 0; i < linksYear.length; i++) {
             source = artistNodes[linksYear[i].source];
             dest = artistNodes[linksYear[i].target];
             break;
         }
         break;
      }
    }
    
   svgHead = d3.select("#head")
    .style("left", xStart + "px")
    .style("top", yStart + "px")
    .style("position", "absolute")
    .append("svg")
      .attr("width", headWidth)
      .attr("height", headHeight)
      .attr("id", "headSVG");

  gh = svgHead.append("g");

  gh.append("rect")
    .attr("id", "headRect")
    .attr("width", headWidth)
    .attr("height", headHeight)
    .style("fill", "white")
    .style("stroke", "black")
    .style("stroke-width", $(window).width() * 0.005)
        .style("opacity", 0.8);

  var uriList = "";
  var numListItems = 0;
  var numSpotifyItems = 0;
  var links;
  if (linksPerYear) {
    links = linksPerYear;
  } 

  var spotifyURIs = new Set();
  var linksForSingleYear;
  for (var year in links) {
    if (parseInt(year) <= currentYear) {
      linksForSingleYear = links[year];
      for (var i = 0; i < linksForSingleYear.length; i++) {
        numListItems++;
        if (linksForSingleYear[i].spotifyURI !== undefined) {
          numSpotifyItems++;
          spotifyURIs.add(linksForSingleYear[i].spotifyURI);
          if (spotifyURIs.size >= 80) {
            break;
          }
        }
      }
      if (spotifyURIs.size >= 80) {
        break;
      }
    }
  }

  addImages(source, dest);
  if (numSpotifyItems > 0) {
    var uriList = "";
    spotifyURIs.forEach(function(uri) {
      var uriArray = uri.split(":");
      uriList += uriArray[2] + ",";
    });

    if (uriList !== "") {
      var spotifyFrame = $("<iframe>");
      spotifyFrame.attr("src", "https://embed.spotify.com/?uri=spotify:trackset:Some Demo Collaborations:" + uriList)
                    .attr("frameborder", "0")
                    .attr("id", "spotifyFrame")
                    .attr("allowTransparency", "true")
                    .css("left", headWidth - 250 - 2 + "px")
                    .css("top", headHeight - 330 - 2 + "px")
                    .css("width", "250px")
                    .css("height", "330px")
                    .css("position", "absolute");
      $("#head").append(spotifyFrame);
    }
  } else {
    collabsWidth = headWidth;
  }


  // var collabsList = $("<div id='collabsList'>");
  //   collabsList.css("left", "0px")
  //       .css("top", headHeight - 330 - 2 + "px")
  //       .css("width", collabsWidth + "px")
  //       .css("height", "330px")
  //       .css("position", "absolute")
  //       .css("background-color", "white");

  // $("#head").append(collabsList);

  // var ul = $("<ul class='list-group collab'>");
  //   ul.css("border", "2px")
  //       .css("width", collabsWidth + "px")
  //       .css("height", "330px")
  //       .css("border-style", "solid")
  //       .css("border-width", "3px");

  


  // column definitions
  var columns = [
      { head: 'Track Title', cl: 'track', html: ƒ('track') },
      { head: 'Album Title', cl: 'release_title', html: ƒ('release_title') },
      { head: 'Year', cl: 'year', html: ƒ('year') },
  ];

  var collabData = [];
  for (var year in links) {
      if (parseInt(year) <= currentYear) {
        for (var i = 0; i < links[year].length; i++) {
            var singleTuple = {};
            trk = links[year][i];
            singleTuple["track"] = trk.title;
            singleTuple["release_title"] = trk.release_title;
            singleTuple["year"] = year;
            collabData.push(singleTuple);
            //var str = "<li class='artistCollabs'> + <b>" + trk.title + "</b>, " + trk.release_title + "<br/> -";
            // str += trk.artist_credit.join(", ");
            // var li = ul.append(str);
        }
      }
  }

    var tableDiv = d3.select("#head").append('div')
                      .style("top", headHeight - 330 - 2 + "px")
                      .style("width", collabsWidth + "px")
                      .style("height", "330px")
                      .style("position", "absolute")
                      .style("overflow-y", "scroll")
                      .style("overflow-x", "hidden");

   var table = tableDiv.append('table')
                      .style("width", collabsWidth + "px")
                      .style("height", "330px")
                      .style("border-collapse", "separate")
                      .style("border-spacing", "2px");

  // create table header
  table.append('thead').append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr('class', ƒ('cl'))
    .attr('class', 'tableHead')
    .text(ƒ('head'));

  // create table body
  table.append('tbody')
    .selectAll('tr')
    .data(collabData).enter()
    .append('tr')
    .attr('class', 'tableCell')
    .selectAll('td')
    .data(function(row, i) {
        return columns.map(function(c) {
            // compute cell values for this specific row
            var cell = {};
            d3.keys(c).forEach(function(k) {
                cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
            });
            return cell;
        });
    }).enter()
    .append('td')
    .html(ƒ('html'))
    .attr('class', ƒ('cl'));

  // collabsList.append(ul); 
  // $("#head").append(collabsList);
    
  //  console.log(collabData);


  var artistName1 = $("<p class='artistNameHead'>");
  var size = 7;
  artistName1.css("font-size", size + "vmin")
      //.css('color', 'black');
      .css("text-align", "center")
      .css("left", image1X - imageWidthDual/2 + "px") 
      .css("top", imageY + imageWidthDual + "px")
      .css("width", imageWidthDual * 3/2 + 100 + "px")
      .css("height", headHeight * 0.2 + "px")
      .css("position", "absolute");
  artistName1.text(source.name);

  var artistName2 = $("<p class='artistNameHead'>");
  size = 7;
  artistName2.css("font-size", size + "vmin")
      //.css('color', 'black');
      .css("text-align", "center")
      .css("left", image2X - imageWidthDual/2 + "px") 
      .css("top", imageY + imageWidthDual + "px")
      .css("width", imageWidthDual * 3/2 + 100 + "px")
      .css("height", headHeight * 0.2 + "px")
      .css("position", "absolute");
  artistName2.text(dest.name);
  //console.log(artistName1.text() + " " + artistName2.text());

  $("#head").append(artistName1);
  $("#head").append(artistName2);

  gh.append("text")
    .attr("x", headWidth * 0.02)
    .attr("y", headHeight * 0.09)
    .attr("id", "closeMenuText")
    .style("font-size", headWidth * 0.07)
    .style("text-anchor", "start")
    .text(function(d) { return "\u2718";})
    .on("click", function() {
        currentLink = null;
        closeHead();
        if (fromRegionLinkView) {
          headViewRegionLink(prevArtists);  
        }
    });

  $(document).mouseup(clickedOutside);
}

//Pairwise comparison in outer view
function headViewRegionLink(artists) {
    var sortedArtists = {};

    var source;
    var target;
    for (var pair in artists) {
      var source = artistNodes[pair.split("_")[0]].region;
      var target = artistNodes[pair.split("_")[1]].region;
      break;
    }

    if (source.region === undefined || target.region === undefined) {
      // we have an artist to NY link
      for (var pair in artists) {
        var key;
        if (artistNodes[pair.split("_")[0]].state !== "NY") {
          key = pair.split("_")[0] + "_" + pair.split("_")[1];
        } else {
          key = pair.split("_")[1] + "_" + pair.split("_")[0];
        }
        sortedArtists[key] = artists[pair];
      }
    } else {
      for (var pair in artists) {
        var key;
        if (artistNodes[pair.split("_")[0]].region === source) {
          key = pair.split("_")[0] + "_" + pair.split("_")[1];
        } else {
          key = pair.split("_")[1] + "_" + pair.split("_")[0];
        }
        sortedArtists[key] = artists[pair];
      }
    }

    artists = sortedArtists;
    var sourceText = "New York"; // will stay like this if region is undefined
    var targetText = "New York";

    for (region in regionNodes) {
      if (regionNodes[region].id === source) {
        sourceText = regionNodes[region].name;
      } else if (regionNodes[region].id === target) {
        targetText = regionNodes[region].name;
      }
    } 

    headStart();

    svgHead = d3.select("#head")
        .style("left", xStart + "px")
        .style("top", yStart + "px")
        .style("position", "absolute")
        .append("svg")
        .attr("width", headWidth)
        .attr("height", headHeight)
        .attr("id", "headSVG")

    gh = svgHead.append("g");

    gh.append("rect")
        .attr("id", "headRect")
        .attr("width", headWidth)
        .attr("height", headHeight)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", $(window).width() * 0.005)
        .style("opacity", 0.8);
    
    var artistCollabHeight = headHeight * 0.7;
    var artistCollabWidth = headWidth * 0.8;

    var regionNames = $("<div id='regionNames'>");
    var sourceName = $("<div id='sourceRegion'>");
    var targetName = $("<div id='targetRegion'>");

    size = Math.max(7, headHeight * 0.1)
    regionNames.css("width", artistCollabWidth + "px")
        .css("height", headHeight * 0.2 + "px")
        .css("left", headWidth * 0.1 + "px") 
        .css("top", "0px")
        .css("position", "absolute");

    sourceName
      .css("max-height", headHeight * 0.1 + "px")
      .css("line-height", headHeight * 0.2 + "px")
      .css("font-size", headWidth * 0.04 + "px")
      .text(sourceText);
    targetName
      .css("max-height", headHeight * 0.1 + "px")
      .css("line-height", headHeight * 0.2 + "px")
      .css("font-size", headWidth * 0.04 + "px")
      .text(targetText);
    regionNames.append(sourceName).append(targetName);
    $("#head").append(regionNames);

    var artistCollabsList = $("<div id='artistCollabsList'>");
    artistCollabsList.css("left", headWidth * 0.1 + "px")
        .css("top", headHeight * 0.2 + "px")
        .css("width", artistCollabWidth + "px")
        .css("height", artistCollabHeight + "px")
        .css("position", "absolute")
        .css("max-height", headHeight); 

    var ul = $("<ul id='artistCollabsListUL' class='list-group regionLinkUL'>");
    ul.css("height", artistCollabHeight + "px")
        .css("max-height", headHeight)
        .css("width", artistCollabWidth + "px")
        .css("border-radius", "0px")
        .css("box-shadow", "none")
        .css("overflow", "auto");

    artistCollabsList.append(ul);
    $("#head").append(artistCollabsList);

    // add li for each distinct artist-artist collaboration
    var sorted_keys = Object.keys(artists).sort(function(a, b) {
      if (artistNodes[a.split("_")[0]].name < artistNodes[b.split("_")[0]].name) {
        return -1;
      } else if (artistNodes[a.split("_")[0]].name > artistNodes[b.split("_")[0]].name) {
        return 1;
      } else {
        return 0;
      }
    });
    for (var i in sorted_keys) {
        var pair = sorted_keys[i];
        var p = [artists[pair]];

        var sourceId = pair.split("_")[0];
        var targetId = pair.split("_")[1];
        if (artistNodes[sourceId].region != source) {
          sourceId = pair.split("_")[1];
          targetId = pair.split("_")[0];
        }
        sourceArtist = artistNodes[sourceId];
        targetArtist = artistNodes[targetId];
        p[0].sourceId = sourceId;
        p[0].targetId = targetId;

        var li = d3.select("#artistCollabsListUL").selectAll(".dummy") // this doesn't exist so it won't override anything, this is a concern cause we're in a for loop
            .data(p)
            .enter()
            .append("li")
            .attr("class", "artistCollabs")
            .html(function(d) {
              return "<div class='artistPair'><div class='sourceArtist'>" + sourceArtist.name + "</div><div class='targetArtist'>" + targetArtist.name + "</div></div>"; });
        li.on("click", function(d) { prevArtists = artists; closeHead(); headViewMultipleArtist(d, true, d.sourceId, d.targetId); });
    } 

    gh.append("text")
      .attr("x", headWidth * 0.02)
      .attr("y", headHeight * 0.09)
      .attr("id", "closeMenuText")
      .style("font-size", headWidth * 0.07)
      .style("text-anchor", "start")
      .text(function(d) { return "\u2718";})
      .on("click", closeHead);
  
  $(document).mouseup(clickedOutside);

}


//@param exit: boolean to determine whether or not closeHead is 
//taking you back to main view (as opposed to other view) 
function closeHead(noExit) {
  if (!noExit) {
    unblurBackground();
  }
  $("#head").html("");

  if (!isZoomed) {
    updateRegionLinks();
  }
  $(document).off("mouseup", clickedOutside);
  zoom.on("zoom", function() {
    if (isZoomed) {
      moveThroughTimeRegionalScrolling();
    } else {
      moveThroughTimeScrolling();
    }
  });
}

function headStart() {
  zoom.on("zoom", null);
}

function clickedOutside(e) {
    var container = $("#head");

    if (!$("#head").is(e.target) // if the target of the click isn't the container...
        && $("#head").has(e.target).length === 0) // ... nor a descendant of the container
    {
        closeHead();
    }
}

