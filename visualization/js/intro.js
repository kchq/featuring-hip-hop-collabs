xStartIntro = $(window).width() * 0.30;
yStartIntro = $(window).height() * 0.10 
introHeight = $(window).height() * 0.550;
introWidth = $(window).width() * 0.50;
imageWidth = headWidth * 0.20;
setup = false;

function introSetup() {
    $('.d3-region-tip').remove();

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

    var title2 = $("<h1 id='title'>");
    title2.text("'Feat.'")
        .css("font-size", "125px")
        .css("text-align", "center")
        .css("position", "absolute")
        .css("bottom", "0")
        .css("right", $(window).width() * .75);


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
            .css("right", $(window).width() * .146)
            .css("padding-left", "15px")
            .css("padding-right", "15px")
            .css("line-height", "30px")
            .css("background", "#788187");

            //.css("float", "right");

    subtitle.text("A History of Hip Hop Collaborations in the United States");
    titleDiv.append(title);
    titleDiv.append(subtitle);
    titleDiv.append(gotIt);
    titleDiv.append(helpIntro);
    $("#mapContainer").append(helpStandard);
    $("#mapContainer").append(title2);


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
            .attr("height", Math.min(introHeight / 2, 270))
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", $(window).width() * 0.005)
            .style("opacity", 0.9);
        
        exitHelp = $("<p id='closeMenuText2'>")
            .text("\u2718")
            .on("click", helpBoxDown)
            .css('cursor', 'pointer')
            .css("padding-top", "10px")
            .css("padding-right", "5px")
            .css("font-size", "30px")
            .css("display", "inline");
            //.text("Speech is my hammer, bang the world into shape. Now let it fall. -Mos Def")

        helpTitle = $("<h3>")
            .text("Visualize and Interact with the Evolution of Hip-Hop Collaborations in the United States")
            .css("display", "inline")
            .css("text-align", "center")
            .css("font-weight", "bold");
        
        helpIntro = $("<h4>").text("-Navigate through history by scrolling or dragging the slider on the left");
        helpIntro2 = $("<h4>").text("-Select a link between artists to see a list of their collaborations");
        helpIntro3 = $("<h4>").text("-Click on a region to explore the intra-region collaborations");
        helpIntro4 = $("<h4>").text("-DblClick on map to explore the inter-region collaborations");
        helpIntro5 = $("<h6>").text("Please contact quinnkcq@gmail.com to report incorrect data or offer suggestions. Thanks for checking out our project! -Feat. Kevin, Sonja, Riley, Vinod").css("font-family", "unicode");

        helpDiv.append(exitHelp);
        helpDiv.append(helpTitle);
        helpDiv.append(helpIntro);
        helpDiv.append(helpIntro2);
        helpDiv.append(helpIntro3);
        helpDiv.append(helpIntro4);
        helpDiv.append(helpIntro5);
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

    var regionNode = svg.selectAll('.regionNode');
    addRegionTooltips(regionNode);
}

function unblurBackground() {
    var content = $('#slider').removeClass("blur");
    var content = $('#searchArea').removeClass("blur");
    var content = $('#narration').removeClass("blur");
    var content = $('#mapContainer').removeClass("blur");
    var content = $('#artistLegendList').removeClass("blur");
}

function blurBackground() {
    var content = $('#slider').addClass("blur");
    var content = $('#searchArea').addClass("blur");
    var content = $('#narration').addClass("blur");
    var content = $('#mapContainer').addClass("blur");
    var content = $('#artistLegendList').addClass("blur");
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


