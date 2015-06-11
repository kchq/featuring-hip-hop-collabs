xStart = $(window).width() * 0.10;
yStart = $(window).height() * 0.10 
headHeight= $(window).height() * .80;
headWidth = $(window).width() * 0.60;
image1X = xStart * .3;
image2X = xStart * 1.3;
imageY = yStart * .4
imageWidth = headWidth * 0.20

function headViewSingleArtist() {
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


