xStart = $(window).width() * 0.25;
yStart = $(window).height() * 0.05 
headHeight= $(window).height() * 0.90;
headWidth = $(window).width() * 0.70;
image1X = xStart * .3;
image2X = xStart * 1.9;
imageY = yStart * .4
imageWidth = headWidth * 0.20

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
		.attr("x", image1X + imageWidth / 2)
		.attr("y", imageY + imageWidth * 1.2)
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
		.attr("x", image2X + imageWidth / 2)
		.attr("y", imageY + imageWidth * 1.2)
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
      .attr("cx",  image1X + imageWidth / 2)
      .attr("cy", imageY + imageWidth / 2)
      .attr("r", imageWidth / 2)
      .attr("clipPathUnits", "userSpaceOnUse");

    gh.append("image")
        .attr("xlink:href", artistImage1)
        .attr("x", image1X)
        .attr("y", imageY)
        .attr("width", imageWidth)
        .attr("height", imageWidth)
        // preserve size of circle across different regions, because each region has a different scale
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node1.name) + "2)"; })
        .style("cursor", "pointer")
        .on("click", function() { 
          closeHead();
          headViewSingleArtist(node1);
        });
        
    gh.append("circle")
        .attr("id", "50_centring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image1X + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", imageWidth / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    svgHead.append('clipPath')
      .attr("id", getArtistImageName(node2.name) + "2")
      .attr("class", "clippath")
      .append("circle")
      .attr("cx",  image2X + imageWidth / 2)
      .attr("cy", imageY + imageWidth / 2)
      .attr("r", imageWidth / 2)
      .attr("clipPathUnits", "userSpaceOnUse"); 

    gh.append("image")
        .attr("xlink:href", artistImage2)
        .attr("x", image2X)
        .attr("y", imageY)
        .attr("width", imageWidth) 
        .attr("height", imageWidth)
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node2.name) + "2)"; })
        .style("cursor", "pointer")
        .on("click", function() {
          closeHead();
          headViewSingleArtist(node2);
        });
        
    gh.append("circle")
        .attr("id", "earl_sweatshirtring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image2X + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", imageWidth / 2)
        // preserve size of circle across different regions, because each region has a different scale
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    return gh;
}

// Shows artist detailed view in head to head fashion only displaying a single artist
function headViewSingleArtist(artist) {

    headStart();

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
		.style("stroke", "black")
		.style("stroke-width", $(window).width() * 0.005)
        .style("opacity", 0.8);

   svgHead.append('clipPath')
        .attr("id", artistFormatted + "Large")
        .attr("class", "clippath")
        .append("circle")
        .attr("cx", image1X * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2)      
        .attr("r", (imageWidth * 3/2) / 2)
        .attr("clipPathUnits", "userSpaceOnUse");

    gh.append("image")
        .attr("xlink:href", artistImage)
        .attr("x", image1X * .5)
        .attr("y", imageY)
        .attr("width", imageWidth * 3/2)
        .attr("height", imageWidth * 3/2)
        // preserve size of circle across different regions, because each region has a different scale
        .attr("clip-path", function(d) { return "url(#" + artistFormatted + "Large" + ")"; });

    gh.append("circle")
        .attr("id", "50_centring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image1X * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", (imageWidth * 3/2) / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

//    collabsList.append(rapperTitle);

   //FOR EACH LINK ADD ONE OF THESE, OK? COOl

  var regionAbbrs = ["NE", "S", "SC", "NC", "MW", "W"];
  var collabsWithOtherRegion = new Map();
  for (var i = 0; i < regionAbbrs.length; i++) {
    collabsWithOtherRegion.set(regionAbbrs[i], 0);
  }
  var totalCollaborationsWithOtherRegion = 0;

  var spotifyFrame = $("<iframe>");
  var collabsWidth = headWidth * .55;
  var collabsHeight = headHeight * .4;
  var frameWidth = Math.max(headWidth * 0.4, 250);
  var frameHeight = Math.max(headHeight * 0.4, frameWidth + 80);

  var collabsList = $("<div id='collabsList'>");
    collabsList.css("left", headWidth - collabsWidth + "px")
        .css("top", /* headHeight * 0.02 + */"0px")
        .css("width", collabsWidth + "px")
        .css("height", headHeight - 330 - 10 + "px")
        .css("position", "absolute");

  var ul = $("<ul class='list-group collab'>");
    ul.css("max-height", headHeight - 330 - 10 + "px")
        .css("border", "2px")
        .css("width", collabsWidth + "px")
        .css("border-style", "solid")
        .css("border-width", "3px");

    var uriList = "";
    var numListItems = 0;

    for (var i = 0; i < singleHeadCollabMap[artist.name].length; i++) { //var track in singleHeadCollabMap[artist.name]) {
        var trk = singleHeadCollabMap[artist.name][i];
        
        if (trk.release_year !== undefined && parseInt(trk.release_year) <= currentYear) {
          var str = "<li class='list-group-item'> + <b>" + trk.title + "</b>, " + trk.release_title + "<br/> -";
          str += trk.artist_credit.join(", ");
          var li = ul.append(str);
          numListItems++;

          // update collaborations with other regions
          var targetRegion = artistNodes[trk.target].region;
          var regionCollabCount = collabsWithOtherRegion.get(targetRegion);
          regionCollabCount++;
          totalCollaborationsWithOtherRegion++;
          collabsWithOtherRegion.set(targetRegion, regionCollabCount);
          
          if (trk.spotifyURI !== undefined) {
            var uriArray = trk.spotifyURI.split(":");
            uriList += uriArray[2] + ",";
          }
        }

    }
    collabsList.append(ul); 

    $("#head").append(collabsList);
    
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

  var artistName = $("<p id='artistNameHead'>");
    size = Math.min(6, artist.name.length)
    artistName.css("font-size", size + "vmin")
        //.css('color', 'black');
        .css("text-align", "center")
        .css("left", image1X * .5 - 50 + "px") 
        .css("top", imageY + imageWidth * 3/2 + "px")
        .css("width", imageWidth * 3/2 + 100 + "px")
        .css("height", headHeight * 0.2 + "px")
        .css("position", "absolute");
    artistName.text(artist.name);

    var artistBio = $("<div id='artistBio'>");
    artistBio.css("height", headHeight * 0.4 + "px")
             .css("width", headWidth - 250 - 10 + "px")
             .css("left", "0px")
             .css("top", headHeight - headHeight * .40 + "px")
             .css("position", "absolute")
             .css("font-size", headWidth * 0.02)
             .css("border", "3px solid black")
             .css("background-color", "white")
             .css("padding-left", headWidth * 0.02 + "px");

    var artistOrigin = $("<p>");
    artistOrigin.text("Artist Origin is " + artist.city + ", " + artist.state);

    var artistYear = $("<p>");
    artistYear.text("Artist Career began " + artist.start_year);

    var artistExternalLinks = $("<p>")
                                .css("float", "left");
    artistExternalLinks.html(artist.external_links);


    var artistCollabDiv = $("<div>")
                            .css("padding", "0px")
                            .css("height", artistBio.height() * 0.7 + "px")
                            .append("Artist Collaborations By Region")
                            .css("font-size", headHeight * 0.03 + "px")
                            .css("text-anchor", "center");

    var artistCollabInfo = artistCollabDiv.append("<canvas id='collabChart'>")
                            .css("float", "right")
                            .css("height", artistBio.height() * 0.5 + "px")
                            .css("max-height", artistBio.height() * 0.5 + "px")
                            .css("width", artistBio.width() * 0.55 + "px")
                            .css("padding-bottom", headHeight * 0.3 + "px");
    //artistBio.append(artistName);
    artistBio.append(artistOrigin);
    artistBio.append(artistYear);
    artistBio.append(artistExternalLinks);
    artistBio.append(artistCollabDiv);

    $("#head").append(artistBio);
    $("#head").append(artistName);
    $(".external_links").css("height", artistBio.height() * 0.7 + "px")
                        .css("width", artistBio.width() * 0.4 + "px")
                        .css("list-style", "none")
                        .css("padding-left", "0px");

  // $("#collabChart").css("padding-bottom", headHeight * 0.025 + "px");
  $("#collabChart").css("width", artistBio.width() * 0.55 + "px")
  $("#collabChart").css("height", artistBio.height() * 0.5 + "px")
    artistCollabInfo = document.getElementById("collabChart").getContext("2d");

    var barData = {
      labels : regionAbbrs,
      datasets : [
        {
          label: "Collaborations by Region",
          fillColor : "#48A497",
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

//  var regionAbbrs = ["NE", "S", "NC", "SC", "MW", "W"];
    var chart = new Chart(artistCollabInfo).Bar(barData);
    chart.datasets[0].bars[0].fillColor = "#4682B4";
    chart.datasets[0].bars[1].fillColor = "#BF113A";
    chart.datasets[0].bars[2].fillColor = "#FFE303";
    chart.datasets[0].bars[3].fillColor = "#E39612";
    chart.datasets[0].bars[4].fillColor = "#A314A8";
    chart.datasets[0].bars[5].fillColor = "#3AA827";
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


function headViewMultipleArtist(linksPerYear, fromRegionLinkView) {

   var spotifyFrame = $("<iframe>");
   var collabsWidth = headWidth * .55;
   var collabsHeight = headHeight * .4;
   var frameWidth = Math.max(headWidth * 0.4, 250);
   var frameHeight = Math.max(headHeight * 0.4, frameWidth + 80);

   headStart();
    
   var source;
   var dest;

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

  var collabsList = $("<div id='collabsList'>");
    collabsList.css("left", "0px")
        .css("top", headHeight - 330 - 2 + "px")
        .css("width", collabsWidth + "px")
        .css("height", "330px")
        .css("position", "absolute")
        .css("background-color", "white");

  var ul = $("<ul class='list-group collab'>");
    ul.css("border", "2px")
        .css("width", collabsWidth + "px")
        .css("height", "330px")
        .css("border-style", "solid")
        .css("border-width", "3px");

    
  for (var links in linksPerYear) {
      linksYear = linksPerYear[links];
      for (var i = 0; i < linksYear.length; i++) {
          trk = linksYear[i];
          var str = "<li class='list-group-item'> + <b>" + trk.title + "</b>, " + trk.release_title + "<br/> -";
          str += trk.artist_credit.join(", ");
          var li = ul.append(str);
      }
  }
  
  collabsList.append(ul); 
  $("#head").append(collabsList);
    
  var uriList = "";
  var numListItems = 0;
  var links;
  if (linksPerYear) {
    links = linksPerYear;
  } else {
    links = artistLinksInformation[4].linksPerYear;
  }
  var spotifyURIs = new Set();
  var linksForSingleYear;
  for (var year in links) {
    if (parseInt(year) <= currentYear) {
      linksForSingleYear = links[year];
      for (var i = 0; i < linksForSingleYear.length; i++) {
        if (linksForSingleYear[i].spotifyURI !== undefined) {
          spotifyURIs.add(linksForSingleYear[i].spotifyURI);
        }
      }
    }
  }

  var uriList = "";
  addImages(artistNodes[linksForSingleYear[0].source], artistNodes[linksForSingleYear[0].target]);
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

    var artistName1 = $("<p class='artistNameHead'>");
    var size = Math.min(6, source.name.length)
    artistName1.css("font-size", size + "vmin")
        //.css('color', 'black');
        .css("text-align", "center")
        .css("left", image1X - imageWidth/2 + "px") 
        .css("top", imageY + imageWidth + "px")
        .css("width", imageWidth * 3/2 + 100 + "px")
        .css("height", headHeight * 0.2 + "px")
        .css("position", "absolute");
    artistName1.text(source.name);

    var artistName2 = $("<p class='artistNameHead'>");
    size = Math.min(6, dest.name.length)
    artistName2.css("font-size", size + "vmin")
        //.css('color', 'black');
        .css("text-align", "center")
        .css("left", image2X - imageWidth/2 + "px") 
        .css("top", imageY + imageWidth + "px")
        .css("width", imageWidth * 3/2 + 100 + "px")
        .css("height", headHeight * 0.2 + "px")
        .css("position", "absolute");
    artistName2.text(dest.name);

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
    for (var pair in artists) {
      var key;
      if (artistNodes[pair.split("_")[0]].region === source) {
        key = pair.split("_")[0] + "_" + pair.split("_")[1];
      } else {
        key = pair.split("_")[1] + "_" + pair.split("_")[0];
      }
      sortedArtists[key] = artists[pair];
    }


    artists = sortedArtists;
    var sourceText;
    var targetText;

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

    var ul = $("<ul class='list-group regionLinkUL'>");
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
        var li = d3.select("ul").selectAll(".dummy") // this doesn't exist so it won't override anything, this is a concern cause we're in a for loop
            .data(p)
            .enter()
            .append("li")
            .attr("class", "artistCollabs")
            .html(function(d) { 
              var sourceId = pair.split("_")[0];
              var targetId = pair.split("_")[1];
              if (artistNodes[sourceId].region != source) {
                sourceId = pair.split("_")[1];
                targetId = pair.split("_")[0];
              }
              var sourceArtist = artistNodes[sourceId];
              var targetArtist = artistNodes[targetId];
              return "<div class='artistPair'><div class='sourceArtist'>" + sourceArtist.name + "</div><div class='targetArtist'>" + targetArtist.name + "</div></div>"; });
        li.on("click", function(d) { prevArtists = artists; closeHead(); headViewMultipleArtist(d, true, sourceId, targetId); });
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

function closeHead() {
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

function regionLinkSingleArtistInfo(regionLink) {
  for (var year in regionLink.linksPerYear) {
    console.log(year);
  }

}

