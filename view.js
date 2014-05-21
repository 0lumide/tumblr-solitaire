    var transitionstuff = (Modernizr.prefixed('transition') + "end");
    var cardCounts = 0;
    var width = 0;
    var height = 0;///ratio * width;
    var offset = 0;
    var space = 20;
    var numP = 0;
    var numCard = 52;
    var ratio = 1.36;
    var leftMar = 150;
    var rightMar = 200;
    var zeroLeft = 0;
    var ex = 0;
    var push = 0;
    var pushRatio = 0.10;//0.064
    var listener = new window.keypress.Listener();
    // If you want to register a sequence combo
    listener.sequence_combo("up up down down left right left right b a enter", function() {
        okayOrNot();
        //next stuff
}, true);


    function calculateCardWidth() {
        var playArea = $(window).width() - (leftMar + rightMar);
        width = (playArea - (space * 7))/7;
        ex = 0.04 * width;
        height = (ratio * width) + ex;
        push = pushRatio * height;
        while(!((50+height+space+height+14*push) <= $(window).height())){
            width -= 5;
            ex = 0.04 * width;
            height = (ratio * width) + ex;
            push = pushRatio * height;
        }
    }
    function getNumP(){
        return numP;
    }
    function reduceNumP(){
        --numP;
    }
    function setNumP(a){
        numP = a;
    }
    
    function resizeCards() {
        numP = $(".post").length - $(".back").length;
        console.log(numP);
        $(".post").not(".back").hide("slow", function() {
            $(this).remove();
            console.log(getNumP());
            if($(".post").not(".back").length == 0){
                console.log("did first return");
                setNumP($(".post_no_info_bar").length);
                resizeCards1();            
            }
        });
    }
    function resizeCards1() {
        $(".post_no_info_bar").each( function(){
            $(this).height((height-ex));
            $(this).one(transitionstuff, function(){ 
                reduceNumP();
                console.log(getNumP());
                if(getNumP() == 0) {
                    console.log("did second return");
                    setNumP($(".post").length);
                    resizeCards2();
                }
            });
        });
    }
    function resizeCards2() {
        $(".post").each( function() {
            $(this).width(width);
            $(this).one(transitionstuff, function(){
                reduceNumP();
                console.log(getNumP());
                if(getNumP() == 0) {
                    console.log("finished all this poop");
                    var value = ex/2 + "px 0 " + ex/2 + "px 0";
                    $(".post").css("padding", value);
                    $(".post").css("margin", 0);
                    cardination();
                }
            });
        });
    }
    
    function calculateOffset() {
        var wid = $(window).width();
        offset = ((wid -1190)/2);
        zeroLeft = (leftMar - offset);
    }
    
    function createSpace() {
        var a = (-1 * offset) - 50;
        a += "px";
        document.getElementById("sidebar").style.right = a;   
    }
    function okayOrNot() {
        cardCounts = $(".back").length;
        $(".post").not(".back").filter(".photo0").each(function() {
            $pnib = $(this).children(".post_no_info_bar");
            $pic = $pnib.children(".photo");
            if ($pic.height() >= (ratio * $pic.width())){
                if(cardCounts < numCard) {
                    cardCounts++;
                    $(this).addClass("back");
            
                    var temp = document.createElement('div');
                    temp.setAttribute("class", "card");
                    temp.setAttribute("id", "c"+cardCounts);
                    $card = $(temp);
                    $card.css("position", "absolute"); 
                    //$card.attr("id", );
                    $card.appendTo(".posts");
                    $(this).appendTo($card);
                
                    console.log(cardCounts);
               }
            }
               
        });
        if(cardCounts < numCard) {
            //alert("Scroll more");
            console.log("Scroll more");
        }
        else {
            calculateOffset();
            calculateCardWidth();
            deleteStuff();
            resizeCards();    
        }
        /*var cardCounts = 0;//$(".back").length;
        $(".post_no_info_bar" ).filter(".photo1").each( function() {
           if (((1/0.94) * ($(this).height()) - $(this).children(".caption_div").height()) >= (ratio * (1/0.94) * $(this).width())){
               if(cardCounts < numCard) {
                cardCounts++;
                $(this).closest(".post").attr("id", "c"+cardCounts);
                $(this).closest(".post").addClass("back");
                console.log(cardCounts);
               }
           }
        });
        if(cardCounts < numCard) {
            //alert("Scroll more");
            console.log("Scroll more");
        }
        else {
            setNumP(numCard);
            $(".back").each(function(){
                reduceNumP();
                var temp = document.createElement('div');
                temp.className = "card";
                $card = $(temp);
                $card.css("position", "absolute"); 
                $card.attr("id", $(this).attr("id"));
                $(this).removeAttr("id");
                $card.appendTo(".posts");
                $(this).appendTo($card);
            });
            calculateOffset();
            calculateCardWidth();
            deleteStuff();
            resizeCards();    
        } */   
    }
    
    function createHolder() {
        console.log("I got called");
        var q1 = "";
        var q2 = "";
        var q3 = "";
        var w1 = "";
        var w2 = "";
        var w3 = "";
        for (var i = 13; i >= 1; i--) {
            q1 = "";
            q2 = " hold";
            q3 = "";
            if(i == 1){
                q1 = "deck";
            }
            else if(i == 2) {
                q1 = "pile";
            }
            else if ((i > 2) && (i <= 6) ) {
                q1 = "ace";
            }
            if (i>2){
                q3 = " drop";
            }
            $("<div/>", {
                id: "w" + i,
                class: q1 + q2 + q3
                //style: "position:absolute",
            }).prependTo(".posts");
            if (q1 == "ace"){
                $("<div/>", {
                    //id: "w" + i,
                    class: "ainner"
                    //style: "position:absolute",
                }).prependTo("#w"+i);
            }
        }
        
        var css = ".hold{position:absolute; width:"+width+"px;height:"+height+"px;"+"}";
        css += "#w1,#w2,#w3,#w4,#w5,#w6{top:0;}";
        css += "#w1,#w7{left:"+ zeroLeft +"px;}";
        css += "#w2,#w8{left:"+ (zeroLeft+space+width) +"px;}";
        css += "#w9{left:"+ (zeroLeft+2*(space+width)) +"px;}";
        css += "#w3,#w10{left:"+ (zeroLeft + 3*(space+width)) +"px;}";
        css += "#w4,#w11{left:"+ (zeroLeft+4*(space+width)) +"px;}";
        css += "#w5,#w12{left:"+ (zeroLeft+5*(space+width)) +"px;}";
        css += "#w6,#w13{left:"+ (zeroLeft+6*(space+width)) +"px;}";
        css += "#w7,#w8,#w9,#w10,#w11,#w12,#w13{top:"+ (space+height) +"px;}";
        css += ".ace{}";
        css += ".ainner{height:"+(height - 8)+"px; width:"+(width - 8)+"px;"+"border:solid; border-width:4px; border-radius:2px; border-color:#fff; opacity:0.05;}";    
        css += ".openoverlay {height: "+push+"; }";
        style=document.createElement("style");
        if (style.styleSheet)
            style.styleSheet.cssText=css;
        else 
            style.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(style);
        setTimeout(function(){
            distributeCards();
        }, 1000);
    }
    function distributeCards(){
        ///*$.getScript( "ajax/test.js" )
        //.done(function(){
            //newGame();
        var c = numCard;
        var j = 7;
        distributeCards1();
        function distributeCards1(){
            console.log("distributecard1");
            var d = 0;
            var i = j;
            distributeCards2();
            function distributeCards2(){
                console.log("distributecard2");
                console.log("i: "+i+" j: "+j+" d: "+d+" c: "+c);
                setTimeout(function () {
                    var depth = 0;
                    var pos = $("#w"+(14 -i)).position();
                    $orr = $("#c"+c);
                    $orr1 = $("#c"+c--+" .back");
                    $klone = $orr1.clone().insertAfter($orr);//.attr("id", $orr.attr("id")+"clone").insertAfter($orr);
                    $klone.addClass("clone");
                    $klone.css("z-index",(8-j));
                    $klone.position();
                    $orr.hide();
                    $orr1.css("left","0px");
                    $orr1.css("top","0px");
                    $orr.css("left", 0);
                    $orr.css("top", 0);
                    if(j == 7)
                        $orr.appendTo($("#w"+(14 - i)));
                    else{
                        $appendhere = $("#w"+(14 - i)).find(".post_overlay").last();
                        $orr.appendTo($appendhere);
                    }
                    $orr.css(Modernizr.prefixed('transition')+"-duration", "0.2s");
                    console.log("here");
                    if(j == 7){
                        $klone.css("left", pos.left+"px");
                        $klone.css("top", pos.top+"px")
                        .one(transitionstuff, function(){
                            d++;
                            console.log("attached first");
                        });
                    }
                    else{
                        $appendhere = $("#w"+(14 -i)).find(".post_overlay").last();
                        depth = $("#w"+(14 -i)).find(".post_overlay").length;
                        $klone.css("left", pos.left+"px");
                        $klone.removeClass("card");
                        $klone.css("top", (pos.top +(depth-1)*(ex/2)+/*
                        (depth-1)*pushRatio*height)+*/"px"))
                        .one(transitionstuff, function(){
                            console.log(d++);
                            //console.log("attached");
                            if(j==1){
                                setTimeout(function () {
                                    $(".clone").remove();
                                    $(".card").show();
                                    flipCards();
                                }, 400);
                            }
                        });
                    }
                    if(--i>=1)
                        distributeCards2();
                    else if(--j>=1)
                        distributeCards1();                    
                }, 70);
            }
        }
    }
    function yesFlipMe(id){
        $stuff = $(document.createElement("h2"));
        $stuff.text("A");
        $front = $(document.createElement("div"));
        $stuff.appendTo($front);
        $front.attr("class","front");
        $back = $("#"+id).find(".back");
        $front.insertBefore($back);
        //$back = $("#"+id).find(".back").position();
        $front.css(Modernizr.prefixed('transform'),"rotateY(0deg)");
        $back.css(Modernizr.prefixed('transform'),"rotateY(180deg)");
    }
    function flipCard(deckNum){
        var depth = $("#w"+(deckNum)).find(".post_overlay").length;
        if (depth != 0){
            yesFlipMe($("#w"+(deckNum)).find(".post_overlay")[depth].id);
        }
    }
    function flipCards(){
        for (var q = 7; q <= 13; q++){
            flipCard(q);
        }
    }
    function deckEm() {
        var top = 0;
        var left = zeroLeft;// - 5;
        var count = 0;
        loadMore = false;
        $(".back").each(function(){
            $(this).css("top",top+"px");
            $(this).css("left",left+"px");
            $(this).one(transitionstuff, function(){count++;
            console.log(count);
                if (count == numCard) {
                    $(".card").css(Modernizr.prefixed('transition')+"-duration", "0.5s");
                    $(".posts").css("height",$(window).height());
                    createHolder();
                }
            });
            top+=0.1;
            left+=0.1;
        });
    }
        
    function cardination() {
        $(".card").css("width",width);
        $(".card").css("height",height);
        $(".post").css("background-color", "#E0E0E0");
        $(".post").find("a").removeAttr("href");
        $("html, body").animate({ scrollTop: 0 }, "slow")
        .promise().done(function(){
            createSpace();
            //$(".posts").appendTo("body.0lumide");
            deckEm();
        });
    }
    function deleteStuff() {
        $(".info_bar").remove();
        $(".caption_div").hide("slow", function () {
            $(".caption_div").remove();
            });
        var css =".post_overlay{z-index: 30;} .post:hover .post_no_info_bar {opacity:1;} body{overflow-x:hidden;}*{-webkit-touch-callout: none; -webkit-user-select: none;   -khtml-user-select: none; -moz-user-select: none; user-select: none;} .ace,.ainner{position:absolute; top:0;}";
        var num = (-1*offset) + 12;
        var sidhov = "#sidebar:hover{right:" + num + "px !important;}";
        css += sidhov;
        
        $(".video").hide("slow", function () {
            $(".video").remove();
            return ($(".photoset"));
            })
            .hide("slow", function () {
                $(this).remove();
            });
        style=document.createElement("style");
        if (style.styleSheet)
            style.styleSheet.cssText=css;
        else 
            style.appendChild(document.createTextNode(css));
        document.getElementsByTagName("head")[0].appendChild(style);
    }
    
