xStart = $(window).width() * 0.30;
yStart = $(window).height() * 0.10 
introHeight= $(window).height() * 0.550;
introWidth = $(window).width() * 0.50;
image1X = xStart * .3;
image2X = xStart * 1.3;
imageY = yStart * .4
imageWidth = headWidth * 0.20
setup = false;

function introSetup() {
    svgHead = d3.select("#intro")
		.style("left", xStart + "px")
		.style("top", yStart + "px")
		.style("position", "absolute")
		.append("svg")
		.attr("width", introWidth)
		.attr("height", introHeight)
		.attr("id", "headSVG")

	gh = svgHead.append("g");

	rect = gh.append("rect")
		.attr("id", "introRect")
		.attr("width", introWidth)
		.attr("height", introHeight)
		.style("fill", "white")
		.style("stroke", "black")
		.style("stroke-width", $(window).width() * 0.005)
        .style("opacity", 0.9);

    var titleDiv = $("<div id='titleDiv'>")
        .css("left", 0) 
        .css("top", yStart) 
        .css("width", introWidth)
        .css("position", "absolute")
        .css("text-align", "center")
        .css("height", introHeight - yStart)
        .css("padding-bottom", "2px");   

    var title = $("<h1 id='title'>");
    title.text("'Feat.'")
        .css("font-size", "125px")
        .css("text-align", "center");
    var subtitle = $("<h3 id='subtitle'>")
        .css("font-size", "35px")
        .css("text-align", "center");

    var gotIt = $("<button id='goingIn' class='btn'>")
            .text("I'm Goin' In")
            .css("font-size", "40px")
            .css("margin-top", "30px")
            .css("margin-bottom", "10px")

    var helpIntro = $("<button class='btn help'>")
            .text(" ? ")
            .css("font-size", "30px")
            .css("margin-top", "30px")
            .css("margin-right", "10px")
            .css("margin-bottom", "10px")
            .css("position", "absolute")
            .css("bottom", "0")
            .css("right", "0px")
            .css("padding-left", "15px")
            .css("padding-right", "15px")
            .css("line-height", "30px")
            .css("background", "#788187");

    
    var helpStandard = $("<button class='btn help'>")
            .text(" ? ")
            .css("font-size", "30px")
            .css("margin-top", "30px")
            .css("margin-right", "10px")
            .css("margin-bottom", "10px")
            .css("position", "absolute")
            .css("bottom", "0")
            .css("right", $(window).width() * .2)
            .css("padding-left", "15px")
            .css("padding-right", "15px")
            .css("line-height", "30px")
            .css("background", "#788187");

            //.css("float", "right");

    subtitle.text("A Brief History of Hip Hop Collaborations in the United States");
    titleDiv.append(title);
    titleDiv.append(subtitle);
    titleDiv.append(gotIt);
    titleDiv.append(helpIntro);
    $("#mapContainer").append(helpStandard);

    $("#intro").append(titleDiv);
    $("#goingIn").click(function() {
        tearDownIntros();
    });

     $(".help").click(function() {
        helpBoxUp();
     });

    blurBackground();

}

function helpBoxUp() {
    if (setup) {
        $("#helpBox").show();
    } else {
        setup = true;
        text = $("<h1 id='sliderIntroTitle'>")
            .text("< Move the slider or use the scroll wheel \n to select the year in history")

            sliderDiv = $('#sliderIntro')
            .css("left", $(window).width() * 0.20 + 90) 
            .css("top", yStart * 8.5) 
            .css("width", introWidth * 1.2)
            .css("position", "absolute");
        //.append(text);
        //
        helpDiv = $("<div id='helpDiv'>")
            .css("left", "0px")// xStart * .8 + "px") 
            .css("top", "0px")//yStart * 7 + "px") 
            .css("width", introWidth * 1.2)
            .css("position", "absolute")
            .css("height", introHeight / 2)
            .css("padding-left", "15px");

        svgHelp = d3.select("#helpBox")
            .style("left", xStart * .8 + "px")
            .style("top", yStart * 7 + "px")
            .style("position", "absolute")
            .append("svg")
            .attr("width", introWidth * 1.2)
            .attr("height", introHeight)
            .attr("id", "headSVG");

        gh = svgHelp.append("g");

        rect = gh.append("rect")
            .attr("id", "introRect")
            .attr("width", introWidth * 1.2)
            .attr("height", introHeight / 2)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", $(window).width() * 0.005)
            .style("opacity", 0.9);

        helpIntro = $("<h3>").text("Navigate through the Hip-Hop collaboration history by scrolling or dragging the slider on the left");

        helpDiv.append(helpIntro);
        $("#helpBox").append(helpDiv);

        
    }
    $(".help").click(function() {
        helpBoxDown();
    });
    //$("#helpBox").append(legend);
}

function helpBoxDown() {
    $("#helpBox").hide();
    $(".help").click(function() {
        helpBoxUp();
     });
}

function tearDownIntros() {
    $("#intro").hide();
    var content = $('#slider').removeClass("blur");
    var content = $('#searchArea').removeClass("blur");
    var content = $('#narration').removeClass("blur");
    var content = $('#mapContainer').removeClass("blur");
}

function blurBackground() {
    var content = $('#slider').addClass("background");
    var content = $('#searchArea').addClass("background");
    var content = $('#narration').addClass("background");
    var content = $('#mapContainer').addClass("background");
/*
    var content = $('#slider').css("-webkit-filter", "blur(15px) grayscale(.5) opacity(0.5) contrast(70%) ")
        .css("-webkit-transition", "all 1s ease-out")
        .css("-moz-transition", "all 1s ease-out")
        .css("-ms-transition", "all 1s ease-out")
        .css("-o-transition", "all 1s ease-out")
        .css("transition", "all 1s ease-out");

    var content = $('#searchArea').css("-webkit-filter", "blur(15px) grayscale(.5) opacity(0.5) contrast(70%) ")
        .css("-webkit-transition", "all 1s ease-out")
        .css("-moz-transition", "all 1s ease-out")
        .css("-ms-transition", "all 1s ease-out")
        .css("-o-transition", "all 1s ease-out")
        .css("transition", "all 1s ease-out");

    var content = $('#narration').css("-webkit-filter", "blur(15px) grayscale(.5) opacity(0.5) contrast(70%) ")
        .css("-webkit-transition", "all 1s ease-out")
        .css("-moz-transition", "all 1s ease-out")
        .css("-ms-transition", "all 1s ease-out")
        .css("-o-transition", "all 1s ease-out")
        .css("transition", "all 1s ease-out");

    var content = $('#mapContainer').css("-webkit-filter", "blur(15px) grayscale(.5) opacity(0.5) contrast(70%) ")
        .css("-webkit-transition", "all 1s ease-out")
        .css("-moz-transition", "all 1s ease-out")
        .css("-ms-transition", "all 1s ease-out")
        .css("-o-transition", "all 1s ease-out")
        .css("transition", "all 1s ease-out");
*/

}


