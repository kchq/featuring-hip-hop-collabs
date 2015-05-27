

function narrationSetup() {
	var parsedRes = d3.csv.parseRows("data/timelineEvents.csv");
	timelineEvents = new Map();
	d3.csv("data/timelineEvents.csv", function(data) {
		data.map(function(d) { 
			var descriptions = timelineEvents.get(d["year"]);
			if (descriptions == undefined) {
				descriptions = new Set();
			}

			descriptions.add(d["description"]);
			timelineEvents.set(d["year"], descriptions);
		});
		restOfNarrationSetup();
	});
}

function restOfNarrationSetup() {
	narrationWidth = $(window).width() * (1 - width/$(window).width() - 0.075);
	narrationLeft = mainVisLeft - narrationWidth - $(window).width() * 0.02;
	narrationTop = mainVisTop;
	svgNarration = d3.select("#narration").style("left", narrationLeft + "px").style("top", narrationTop + "px").style("position", "absolute")
	.append("svg")
	.attr("width", narrationWidth)
	.attr("height", height)
	.attr("id", "narrationSvg");

	gn = svgNarration.append("g");

	gn.append("rect")
		.attr("id", "narrationBackground")
		.attr("width", narrationWidth)
		.attr("height", height)
		.attr("rx", 50)
		.attr("ry", 50);

	gn.append("text")
		.attr("id", "narrationYearText")
        .attr("x", narrationWidth/2)
        .attr("y", height/5)
        .style("font-size", narrationWidth/10)
        .style("text-anchor", "middle")
        .text(function(d) { return slider.value();});

  	gn.append("text")
  		.attr("class", "narrationEventText")
		.attr("x", narrationWidth/7)
        .attr("y", height/2)
        .style("font-size", narrationWidth/10)
        .style("text-anchor", "middle")
        .text(function(d) { return "";});
}

function updateNarration() {
	$("#narrationYearText").text(parseInt(slider.value()));
	$(".narrationEventText").remove();
	var eventsForYear = timelineEvents.get("" + parseInt(slider.value()));
	if (eventsForYear != undefined) {
		var currX = narrationWidth/7;
		var currY = height/4;
		var size = narrationWidth/25;
		var eventNo = 0;
		eventsForYear.forEach(function(eventDesc) {
			gn.append("text")
		  		.attr("class", "narrationEventText")
		  		.attr("id", "narrationEvent" + eventNo)
				.attr("x", currX)
		        .attr("y", currY)
		        .style("font-size", size)
		        .style("text-anchor", "start")
		        .text(function(d) { return "";});

		     d3plus.textwrap()
		    	  .container(d3.select("#narrationEvent" + eventNo))
		    	  .text(eventDesc)
		    	  .shape("square")
		    	  .width(narrationWidth*0.7)
		    	  .draw();
		    currY += parseInt($("#narrationEvent" + eventNo).css("height") + 5);
		    eventNo++;

		});
	}
}