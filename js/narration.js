// Sets up the narration bar on the left

narrationWidth = $(window).width() * 0.20;
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
		.style("fill", "white")
		.style("stroke", "black")
		.style("stroke-width", $(window).width() * 0.005);

	gn.append("rect")
		.attr("id", "narrationEventPreviewNextYearBackground")
		.attr("class", "timelineJumperNext")
		.attr("width", narrationWidth * 0.988)
		.attr("height", height * 0.08)
		.attr("rx", narrationWidth * 0.01)
		.attr("ry",  narrationWidth * 0.01)
		.style("fill", "#aaa")

	gn.append("rect")
		.attr("id", "narrationEventPreviewPreviousYearBackground")
		.attr("class", "timelineJumperPrev")
		.attr("width", narrationWidth * 0.988)
		.attr("height", height * 0.08)
		.attr("y", height * 0.92)
		.attr("rx", narrationWidth * 0.01)
		.attr("ry",  narrationWidth * 0.01)
		.style("fill", "#aaa")

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
			  .attr("x", narrationWidth * 0.02)
			  .attr("y", height * 0.05)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "white")
		      .text(function(d) { return "\uFFEA";});

		gn.append("text")
		  	.attr("class", "narrationEventPreviewNextYearText timelineJumperNext")
			  .attr("x", narrationWidth * 0.9)
			  .attr("y", height * 0.05)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "white")
		      .text(function(d) { return "\uFFEA";});

		gn.append("text")
		  .attr("class", "narrationEventPreviewNextYearText timelineJumperNext")
		  .attr("x", narrationWidth/2)
		  .attr("y", height * 0.05)
          .style("font-size", narrationWidth/20)
	      .style("text-anchor", "middle")
	      .style("fill", "white")
	      .text(function(d) { return "Next Event " + relativeInfo.nextEventYr});
	} else {
		currentNextEventYear = 0;
	}

	// update the previous event year preview if one exists
	if (relativeInfo.prevEventYr !== undefined) {
		currentPreviousEventYear = parseInt(relativeInfo.prevEventYr);
		gn.append("text")
		  	  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
			  .attr("x", narrationWidth * 0.02)
			  .attr("y", height * 0.975)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "white")
		      .text(function(d) { return "\uFFEC";});

		gn.append("text")
		  	  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
			  .attr("x", narrationWidth * 0.9)
			  .attr("y", height * 0.975)
	          .style("font-size", narrationWidth * 0.2)
		      .style("fill", "white")
		      .text(function(d) { return "\uFFEC";});

		gn.append("text")
		  .attr("class", "narrationEventPreviewPreviousYearText timelineJumperPrev")
		  .attr("x", narrationWidth/2)
		  .attr("y", height * 0.97)
    	  .style("font-size", narrationWidth/20)
	      .style("text-anchor", "middle")
	      .style("fill", "white")
	      .text(function(d) { return "Previous Event " + relativeInfo.prevEventYr;});

	} else {
		currentPreviousEventYear = 0;
	}

	// update the main narration for current year
	gn.append("text")
		.attr("id", "narrationYearText")
	    .attr("x", narrationWidth/9)
	    .attr("y", height * 0.2)
	    .style("font-size", narrationWidth/10)
	    .style("text-anchor", "start")
	   	.style("fill", "white")
		.style("stroke", "black")
	    .text(function(d) { return currentYear; });

	// only add event descriptions if they exist
	var eventsForYear = timelineEventDescriptions.get("" + currentYear);
	if (eventsForYear != undefined) {
		var currX = narrationWidth/9;
		var currY = height * 0.21;
		var size = narrationWidth/25;
		var eventNo = 0;

		// display each event description for the given year
		eventsForYear.forEach(function(eventDesc) {
			gn.append("text")
		  		.attr("class", "narrationEventText")
		  		.attr("id", "narrationEvent" + eventNo)
				.attr("x", currX)
		        .attr("y", currY)
		        .style("font-size", size)
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
				moveThroughTimeSliding(currentNextEventYear);
			}
		});

	d3.selectAll(".timelineJumperPrev")
		.on("click", function() {
			if (currentPreviousEventYear !== 0) {
				moveThroughTimeSliding(currentPreviousEventYear);
			}
		});
}
