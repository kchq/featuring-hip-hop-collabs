xStart = $(window).width() * 0.30;
yStart = $(window).height() * 0.10 
headHeight= $(window).height() * .80;
headWidth = $(window).width() * 0.60;
image1X = xStart * 1.3
image2X = xStart * .3 
imageY = yStart * .4
imageWidth = headWidth * 0.20

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
      .attr("id", getArtistImageName(node1.name))
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
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node1.name) + ")"; });
        
    gh.append("circle")
        .attr("id", "50_centring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image1X + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", imageWidth / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    svgHead.append('clipPath')
      .attr("id", getArtistImageName(node2.name))
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
        .attr("clip-path", function(d) { return "url(#" + getArtistImageName(node2.name) + ")"; });
        
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
        .attr("cx", image2X * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2)      
        .attr("r", (imageWidth * 3/2) / 2)
        .attr("clipPathUnits", "userSpaceOnUse");

    gh.append("image")
        .attr("xlink:href", artistImage)
        .attr("x", image2X * .5)
        .attr("y", imageY)
        .attr("width", imageWidth * 3/2)
        .attr("height", imageWidth * 3/2)
        // preserve size of circle across different regions, because each region has a different scale
        .attr("clip-path", function(d) { return "url(#" + artistFormatted + "Large" + ")"; });

    gh.append("circle")
        .attr("id", "50_centring") //function(d) { return getArtistImageName(d.name) + "ring"; })
        .attr("cx", image2X * .5 + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[0]; })
        .attr("cy", imageY + imageWidth * (3/2) / 2) //function(d) { xy = getXY(d); if (xy == null) return; return xy[1]; })
        .attr("r", (imageWidth * 3/2) / 2)
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", "2px");

    var artistBio = $("<div id='artistBio'>");
    artistBio.css("height", "330px")
             .css("width", "280px")
             .css("left", "5px")
             .css("top", headHeight - 330 - 4 + "px")
             .css("position", "absolute")
             .css("font-size", headWidth * 0.4 * 0.04);
    var artistName = $("<p id='artistNameHead'>");
    artistName.text(artist.name);
    artistName.css("font-size", headWidth * 0.4 * 0.07);

    var artistOrigin = $("<p>");
    artistOrigin.text("Artist Origin is " + artist.city + ", " + artist.state);

    var artistYear = $("<p>");
    artistYear.text("Artist Career began " + artist.start_year);

    artistBio.append(artistName);
    artistBio.append(artistOrigin);
    artistBio.append(artistYear);
    $("#head").append(artistBio);

    var spotifyFrame = $("<iframe>");
    var collabsWidth = headWidth * .55;
    var collabsHeight = headHeight * .4;
    var frameWidth = Math.max(headWidth * 0.4, 250);
    var frameHeight = Math.max(headHeight * 0.4, frameWidth + 80);

    var collabsList = $("<div id='collabsList'>");
    collabsList.css("left", headWidth - collabsWidth + "px")
        .css("top", headHeight - collabsHeight * 2.35 +/* headHeight * 0.02 + */"px")
        .css("width", collabsWidth + "px")
        .css("height", headHeight - 330 - 5 - (headHeight - collabsHeight * 2.35) + "px")
        .css("position", "absolute");

    var ul = $("<ul class='list-group collab'>");
    ul.css("height", collabsHeight + "px")
        .css("max-height", headHeight - 330 - 5 - (headHeight - collabsHeight * 2.35) + "px")
        .css("border", "2px")
        .css("width", collabsWidth + "px")
        .css("border-style", "solid")
        .css("border-width", "3px");

    
    //FOR EACH LINK ADD ONE OF THESE, OK? COOl
    //
    var li = ul.append("<li class='list-group-item'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");
    li = ul.append("<li class='list-group-item collabs'> <b>Track name</b>, Album Name<br/> -Artist Name, featuring A, B C");

    collabsList.append(ul);

    $("#head").append(collabsList);
    
    var spotifyFrame = $("<iframe>");
    spotifyFrame.attr("src", "https://embed.spotify.com/?uri=spotify:trackset:Kanye West playlist:2WBjsxTE3hBInd21yUY65h,2RAj4LEmos3pkc396FE5Mg,1w2lHasjKWxkmZxeLAzObf,2bCLwbMQHgvcDC6zGUzQZP,1iQ5E4z6CJ38dIzvMI9Wdo,1Kjnf4Nr6SmVIRLSh6XZCF,0jWF4qSFNhDjoMmitBaBjh,0ME2IxF0Mbopx1hNXGDE3N,3Z2SFbiNPxR7KAMntC4baK,0HXtsURsJGmhmdOFUqSAmk,7AV8RY7S7SzbtxL8ohDt4N,444P4wvSDa0SD5HE4YGx9B,")
                .attr("frameborder", "0")
                .attr("id", "spotifyFrame")
                .attr("allowTransparency", "true")
                .css("left", headWidth - 250 - 2 + "px")
                .css("top", headHeight - 330 - 2 + "px")
                .css("width", "250px")
                .css("height", "330px")
                .css("position", "absolute");
    $("#head").append(spotifyFrame);
    $("#head").on("click", function() {

    });

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

function headViewMultipleArtist() {

   headStart();

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

  var links = artistLinksInformation[4].linksPerYear;
  var spotifyURIs = new Set();
  var linksForSingleYear;
  for (var year in links) {
      linksForSingleYear = links[year];
      for (var i = 0; i < linksForSingleYear.length; i++) {
        if (linksForSingleYear[i].spotifyURI !== undefined) {
          spotifyURIs.add(linksForSingleYear[i].spotifyURI);
        }
      }
  }

  var uriList = "";
  addImages(artistNodes[linksForSingleYear[0].source], artistNodes[linksForSingleYear[0].target]);
  spotifyURIs.forEach(function(uri) {
    var uriArray = uri.split(":");
    uriList += uriArray[2] + ",";
  });
  console.log(uriList);
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

function headViewRegionLink(artists) {

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

    var artistCollabHeight = headHeight * 0.8;
    var artistCollabWidth = headWidth * 0.8;
    var artistCollabsList = $("<div id='artistCollabsList'>");
    artistCollabsList.css("left", headWidth * 0.1 + "px")
        .css("top", headHeight * 0.15 + "px")
        .css("width", artistCollabWidth + "px")
        .css("height", artistCollabHeight + "px")
        .css("position", "absolute")
        .css("max-height", headHeight); 

    var ul = $("<ul class='list-group collab'>");
    ul.css("height", artistCollabHeight + "px")
        .css("max-height", headHeight)
        .css("border", "2px")
        .css("width", artistCollabWidth + "px")
        .css("border-style", "solid")
        .css("border-width", "3px")
        .css("overflow", "auto");

    artistCollabsList.append(ul);
    $("#head").append(artistCollabsList);

    // add li for each distinct artist-artist collaboration
    for (var source in artists) {
        var li = d3.select("ul").selectAll(".dummy") // this doesn't exist so it won't override anything, this is a concern cause we're in a for loop
            .data(artists[source])
            .enter()
            .append("li")
            .attr("class", "list-group-item artistCollabs")
            .html(function(d) { return "<div class='artistPair'><div class='sourceArtist'>" + artistNodes[source].name + "</div><div class='targetArtist'>" + artistNodes[d.target].name + "</div></div>"; });
        li.on("click", function(d) { console.log(d) });
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
  $(document).off("mouseup", clickedOutside);
  zoom.on("zoom", function() {
    if (isZoomed) {
      moveThroughTimeRegionalScrolling();
    } else {
      moveThroughTimeScrolling();
    }
  });
  narrationEventPreviewListenSetup();

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

