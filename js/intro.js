xStartIntro = $(window).width() * 0.30;
yStartIntro = $(window).height() * 0.10 
introHeight = $(window).height() * 0.550;
introWidth = $(window).width() * 0.50;
imageWidth = headWidth * 0.20;
setup = false;

function introSetup() {
    svgHead = d3.select("#intro")
		.style("left", xStartIntro + "px")
		.style("top", yStartIntro + "px")
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
        .css("top", yStartIntro) 
        .css("width", introWidth)
        .css("position", "absolute")
        .css("text-align", "center")
        .css("height", introHeight - yStartIntro)
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
            .css("top", yStartIntro * 8.5) 
            .css("width", introWidth * 1.2)
            .css("position", "absolute");
        //.append(text);
        //
        helpDiv = $("<div id='helpDiv'>")
            .css("left", "0px")// xStartIntro * .8 + "px") 
            .css("top", "0px")//yStartIntro * 7 + "px") 
            .css("width", introWidth * 1.24)
            .css("position", "absolute")
            .css("height", introHeight / 2)
            .css("padding-left", "15px")
            .css("text-align", "left");

        svgHelp = d3.select("#helpBox")
            .style("left", xStartIntro * .80 + "px")
            .style("top", yStartIntro * 7 + "px")
            .style("position", "absolute")
            .append("svg")
            .attr("width", introWidth * 1.24)
            .attr("height", introHeight)
            .attr("id", "headSVG");

        gh = svgHelp.append("g");

        rect = gh.append("rect")
            .attr("id", "introRect")
            .attr("width", introWidth * 1.24)
            .attr("height", introHeight / 2)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", $(window).width() * 0.005)
            .style("opacity", 0.9);

        /*d3.select("#helpBox")
            .append("text")
            .style("left", 0 + "px")
            .style("top", 0 + "px")
            .attr("id", "closeMenuText2")
            .style("font-size", headWidth * 0.07)
            .style("text-anchor", "start")
            .text(function(d) { return "\u2718";})
            .on("click", helpBoxDown);*/
        
        exitHelp = $("<p id='closeMenuText2'>")
            .text("\u2718")
            .on("click", helpBoxDown)
            .css('cursor', 'pointer')
            .css("padding-top", "5px")
            .css("font-size", "30px");
        
        helpIntro = $("<h4>").text("-Navigate through history by scrolling or dragging the slider on the left");
        helpIntro2 = $("<h4>").text("-Select a link between artists to see a list of their collaborations");
        helpIntro3 = $("<h4>").text("-Click on a region to explore the collaboration developement over time");

        helpDiv.append(exitHelp);
        helpDiv.append(helpIntro);
        helpDiv.append(helpIntro2);
        helpDiv.append(helpIntro3);
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


