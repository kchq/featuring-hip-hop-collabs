// Sets up the narration bar on the left

narrationWidth = $(window).width() * 0.15;
narrationLeft = 0;
narrationTop = 0;
currentNextEventYear = 0;
currentPreviousEventYear = 0;

function narrationSetup() {
	// read in the timelineEvents and create data structures to help
	// keep track of the next and previous events for each year
	var parsedRes = d3.csv.parseRows("data/timelineEvents.csv");
	var prevEventYr = startYear;
	var nextEventYr = birthYear;
	timelineEventDescriptions = new Map(); // descriptions for each timeline event
	timelineEvents = new Map();            // year -> (previousEventYear, nextEventYear)
	for (var i = startYear; i <= presentYear; i++) {
		timelineEvents.set(i, {});
	}
	d3.csv("data/timelineEvents.csv", function(data) {
		data.map(function(d) { 
			var descriptions = timelineEventDescriptions.get(d["year"]);
			if (descriptions === undefined) {
				descriptions = new Set();
			}
			descriptions.add(d["description"]);
			timelineEventDescriptions.set(d["year"], descriptions);

			// update the previous and next event times for all appropriate years
			timelineEvents.get(prevEventYr).nextEventYr = parseInt(d["year"]);
			for (var yr = prevEventYr+1; yr <= parseInt(d["year"]); yr++) {
				var relativeInfo = timelineEvents.get(yr);
				relativeInfo.nextEventYr = parseInt(d["year"]);
				relativeInfo.prevEventYr = prevEventYr;
			}
			timelineEvents.get(parseInt(d["year"])).nextEventYr = undefined;
			prevEventYr = parseInt(d["year"]);
		});

		// fencepost, update the previous and next event years for starting and ending years
		for (var yr = startYear; yr <= birthYear; yr++) {
			timelineEvents.get(yr).prevEventYr = undefined;
		}
		for (var yr = prevEventYr+1; yr <= presentYear; yr++) {
			timelineEvents.get(yr).prevEventYr = prevEventYr;
			timelineEvents.get(yr).nextEventYr = undefined;
		}

		restOfNarrationSetup();
	});
}

// set up the basic structions for the narration bar
function restOfNarrationSetup() {
	currentNextEventYear = birthYear;
	currentPreviousEventYear = 0;

	svgNarration = d3.select("#narration")
		.style("left", narrationLeft + "px")
		.style("top", narrationTop + "px")
		.style("position", "absolute")
		.style("background-image", "url('imgs/concrete_seamless.png')")
		.style("background-repeat", "repeat")
		.append("svg")
		.attr("width", narrationWidth)
		.attr("height", height)
		.attr("id", "narrationSvg")
		.call(zoom)
		.on("mousedown.zoom", null)
    	.on("dblclick.zoom", null);

	gn = svgNarration.append("g");

	gn.append("rect")
		.attr("id", "narrationBackground")
		.attr("width", narrationWidth)
		.attr("height", height)
		.style("fill", "rgba(0,0,0,0.1)");

	gn.append("rect")
		.attr("id", "narrationEventPreviewNextYearBackground")
		.attr("class", "timelineJumperNext")
		.attr("width", narrationWidth)
		.attr("height", height * 0.08)
		.style("fill", "#123")
		.style("fill-opacity", 0.8);

	gn.append("rect")
		.attr("id", "narrationEventPreviewPreviousYearBackground")
		.attr("class", "timelineJumperPrev")
		.attr("width", narrationWidth)
		.attr("height", height * 0.08)
		.attr("y", height * 0.92)
		.style("fill", "#123")
		.style("fill-opacity", 0.8);

	gn.append("line")
	  .attr("x1", narrationWidth)
	  .attr("y1", narrationTop)
	  .attr("x2", narrationWidth)
	  .attr("y2", height)
	  .style("stroke-width", narrationWidth * 0.05)
	  .style("stroke", "#000");

    updateNarration();
}

// updates the narration upon scrolling or slider change
function updateNarration() {
	$("#narrationYearText").remove();
	$(".narrationEventText").remove();
	$(".narrationEventPreviewNextYearText").remove();
	$(".narrationEventPreviewPreviousYearText").remove();

	var relativeInfo = timelineEvents.get(currentYear);

	// update the next event year preview if one exists
	if (relativeInfo.nextEventYr !== undefined) {
		currentNextEventYear = parseInt(relativeInfo.nextEventYr);
		gn.append("text")
		  	  .attr("class", "narrationEventPreviewNextYearText timelineJumperNext")
			  .attr("x", narrationWidth * 0.05)
			  .attr("y", height * 0.05)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "#aaa")
		      .text(function(d) { return "\uFFEA";});

		gn.append("text")
		  	.attr("class", "narrationEventPreviewNextYearText timelineJumperNext")
			  .attr("x", narrationWidth * 0.85)
			  .attr("y", height * 0.05)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "#aaa")
		      .text(function(d) { return "\uFFEA";});

		gn.append("text")
		  .attr("class", "narrationEventPreviewNextYearText timelineJumperNext")
		  .attr("x", narrationWidth/2)
		  .attr("y", height * 0.05)
          .style("font-size", narrationWidth/14)
	      .style("text-anchor", "middle")
	      .style("fill", "#aaa")
	      .text(function(d) { return "Next Event " + relativeInfo.nextEventYr});
	} else {
		currentNextEventYear = 0;
	}

	// update the previous event year preview if one exists
	if (relativeInfo.prevEventYr !== undefined) {
		currentPreviousEventYear = parseInt(relativeInfo.prevEventYr);
		gn.append("text")
		  	  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
			  .attr("x", narrationWidth * 0.05)
			  .attr("y", height * 0.975)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "#aaa")
		      .text(function(d) { return "\uFFEC";});

		gn.append("text")
		  	  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
			  .attr("x", narrationWidth * 0.85)
			  .attr("y", height * 0.975)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "#aaa")
		      .text(function(d) { return "\uFFEC";});

		gn.append("text")
		  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
		  .attr("x", narrationWidth/2)
		  .attr("y", height * 0.97)
    	  .style("font-size", narrationWidth/14)
	      .style("text-anchor", "middle")
	      .style("fill", "#aaa")
	      .text(function(d) { return "Previous Event " + relativeInfo.prevEventYr;});

	} else {
		currentPreviousEventYear = 0;
	}

	// update the main narration for current year
	gn.append("text")
		.attr("id", "narrationYearText")
	    .attr("x", narrationWidth/9)
	    .attr("y", height * 0.14)
	    .style("font-size", narrationWidth/4)
	    .style("text-anchor", "start")
	   	.style("fill", "black")
	    .text(function(d) { return currentYear; });

	// only add event descriptions if they exist
	var eventsForYear = timelineEventDescriptions.get("" + currentYear);
	if (eventsForYear != undefined) {
		var currX = narrationWidth/9;
		var currY = height * 0.15;
		var size = narrationWidth/25;
		var eventNo = 0;

		// display each event description for the given year
		eventsForYear.forEach(function(eventDesc) {
			gn.append("text")
		  		.attr("class", "narrationEventText")
		  		.attr("id", "narrationEvent" + eventNo)
					.attr("x", currX)
	        .attr("y", currY + 20)
	        .style("font-size", size * 1.5)
	        .style("text-anchor", "start")
	        .text(function(d) { return "";});

		     // used to make sure the texts wrap around the svg correctly
		     // when they overflow
		     d3plus.textwrap()
		    	  .container(d3.select("#narrationEvent" + eventNo))
		    	  .text(eventDesc)
		    	  .shape("square")
		    	  .width(narrationWidth*0.8)
		    	  .height(height * 0.8)
		    	  .draw();
		    currY += parseInt($("#narrationEvent" + eventNo).css("height") + 5);
		    eventNo++;

		});
	}

	// set the events to for next/previous ent previews
	d3.selectAll(".timelineJumperNext")
		.on("click", function() {
			if (currentNextEventYear !== 0) {
				if (isZoomed) {
					moveThroughTimeRegionalSliding(currentNextEventYear);
				} else {
					moveThroughTimeSliding(currentNextEventYear);
				}
			}
		});

	d3.selectAll(".timelineJumperPrev")
		.on("click", function() {
			if (currentPreviousEventYear !== 0) {
				if (isZoomed) {
					moveThroughTimeRegionalSliding(currentPreviousEventYear);
				} else {
					moveThroughTimeSliding(currentPreviousEventYear);
				}
			}
		});
}
