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
var error = true;
var push = 0;
var pushRatio = 0.10;//0.064
var listener = new window.keypress.Listener();
var continueThis = false;
msieversion();
// If you want to register a sequence combo
listener.sequence_combo("up up down down left right left right b a enter", function() {
        okayOrNot();
}, true);


    function calculateCardWidth() {
        var playArea = $(window).width() - (leftMar + rightMar);
        width = (playArea - (space * 6))/7;
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
        numP = 15;
        $(".post").not(".back").not( function(index){return(index > 14);} ).hide("slow", function() {
        $(this).remove();
        reduceNumP();
        if(getNumP() == 0){
            setNumP($(".back").find(".post_no_info_bar").length);
            resizeCards1();            
        }
    });
}
function resizeCards1() {
    $(".back").find(".post_no_info_bar").each( function(){
        $(this).height((height-ex));
        $(this).one(transitionstuff, function(){ 
            reduceNumP();
            if(getNumP() == 0) {
                setNumP($(".back").length);
                resizeCards2();
            }
        });
    });
}
function resizeCards2() {
    $(".back").width(width)
    .one(transitionstuff, function(){
        reduceNumP();
        if(getNumP() == 0) {
            var value = ex/2 + "px 0 " + ex/2 + "px 0";
            $(".back").css("padding", value);
            $(".back").css("margin", 0);
            cardination();
        }
    });
}

function calculateOffset() {
    var wid = $(window).width();
    offset = ((wid -1190)/2);
    playArea = (7 * width) + (6 * space);
    var le = ((wid - 50) - playArea)/2;
    zeroLeft = (le - offset);
}

function createSpace() {
    var a = (-1 * offset) - 50;
    a += "px";
    document.getElementById("sidebar").style.right = a;   
}
function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){             
        continueThis = false;
    }
    else
        continueThis = true;
}
function okayOrNot() {
    if(continueThis){
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
                    $card.appendTo(".posts");
                    $(this).appendTo($card);
                }
            }
               
        });
        if(cardCounts < numCard) {
            showProg((100 * cardCounts)/numCard);
        }
        else {
            showProg(100);
            continueThis = false;
            setTimeout(function () {
                if (error) {
                    alert("Some Error occured, please reload");      
                }
            },30000);
            calculateCardWidth();
            calculateOffset();
            deleteStuff();
            resizeCards();    
        }
    }
    else
        alert("Seriously dude?! use another browser");
}
function showProg(prog){
    $green = $(document.createElement("div"));
    $red = $(document.createElement("div"));
    $span = $(document.createElement("span"));
    $text = $(document.createElement("p"));
    if (prog == 100)
        $text.text("100%. Yay! You made it!! Now wait...");
    else
        $text.text("Scroll down some more then repeat...");
    $red.appendTo($green);
    $text.appendTo($green);
    $text.hide();
    $span.appendTo($green);
    $red.attr("id", "red");
    $green.attr("id", "green");
    $green.hide();
    $green.appendTo($(".posts"));
    $green.css("top", ($(window).height() - 50) + "px");
    $green.css("left",($(window).width() - ($green.width()) - 70) + "px");
    $green.fadeIn("slow", function(){
        $red.css("width", 0.01*prog*($green.width()));
        $span.text(Math.round(prog) + "%");
        $text.fadeIn("slow");
    })
    .delay(4000).fadeOut(function(){
        $("#green").remove();
    });
}
function updateScore(){
    $("#scoreText").text(getScore());
}

function createHolder() {
    var q1 = "";
    var q2 = "";
    var q3 = "";
    var w1 = "";
    var w2 = "";
    var w3 = "";
    for (var i = 13; i >= 0; i--) {
        q1 = "";
        q2 = " hold";
        q3 = "";
        if(i == 0)
            q1 = "empty";
        else if(i == 1){
            q1 = "deck";
        }
        else if(i == 2) {
            q1 = "pile";
        }
        else if (i <= 6) {
            q1 = "ace";
        }
        else
            q1 = "table";
        /*if (i>2){
            q3 = " drop";
        }*/
        $("<div/>", {
            id: "w" + i,
            class: q1 + q2 + q3
        }).prependTo(".posts");
        if((i >=3)&&(i<=6)){
            $("#w"+i).droppable( {
                addClasses: false,
                accept: ".card",
                //hoverClass: "hovered",
                drop: handleFoundCardDrop
            } );
        }
        if ((i==0)||(q1 == "ace")){
            $("<div/>", {
                //id: "w" + i,
                class: "ainner"
            }).prependTo("#w"+i);
        }
    }
    $scoreDiv = $(document.createElement("div"));
    $se = $(document.createElement("span"));
    $se.text("Score: ");
    $score = $(document.createElement("span"));
    $scoreDiv.attr("id", "scoreDiv");
    $score.attr("id", "score");
    $score.text(0);
    $score.attr("id", "scoreText");
    $se.appendTo($scoreDiv);
    $score.appendTo($scoreDiv);
    $scoreDiv.appendTo($("body"));
    $scoreDiv.css("top", ($(window).height() - 50) + "px");
    $scoreDiv.css("left", 20 + "px");
    $scoreDiv.css("font-size", "1.45em");
    $scoreDiv.css("position", "absolute");
    
    var css = ".hold{position:absolute; width:"+width+"px;height:"+height+"px;"+"}";
    css += "#w0 .ainner{-o-border-radius:50%;-moz-border-radius:50%;-webkit-border-radius:50%;border-radius:50%; width:"+(0.6*width)+"px; height:"+(0.6*width)+"px; left:"+(0.2*width)+"px; top:"+(0.4*width)+"px;}";
    css += "#w1{z-index:2;}";
    css += "#w1,#w0,#w2,#w3,#w4,#w5,#w6{top:0;}";
    css += "#w1,#w0,#w7{left:"+ zeroLeft + "px;}";
    css += "#w2,#w8{left:"+ (zeroLeft+space+width) +"px;}";
    css += "#w9{left:"+ (zeroLeft+2*(space+width)) +"px;}";
    css += "#w3,#w10{left:"+ (zeroLeft + 3*(space+width)) +"px;}";
    css += "#w4,#w11{left:"+ (zeroLeft+4*(space+width)) +"px;}";
    css += "#w5,#w12{left:"+ (zeroLeft+5*(space+width)) +"px;}";
    css += "#w6,#w13{left:"+ (zeroLeft+6*(space+width)) +"px;}";
    css += "#w7,#w8,#w9,#w10,#w11,#w12,#w13{top:"+ (space+height) +"px;}";
    css += ".ace{}";
    css += ".ainner{height:"+(height - 8)+"px; width:"+(width - 8)+"px;"+"border:solid; border-width:4px; border-radius:5px; border-color:#fff; opacity:0.05;}";    
    css += ".openoverlay {height: "+(1+push)+"px; }";
    //css += ".openoverlay:hover {margin-top: "+(2 * push)+"; }";
    style=document.createElement("style");
    if (style.styleSheet)
        style.styleSheet.cssText=css;
    else 
        style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
    setTimeout(function(){
        distributeCards();
    }, 1000);
    $("#w1").click(function(){
        if(!$(".deckCard").not(".wasteCard").length){
            if($(".wasteCard").length)
                reDeckEm();
        }
        else{
            var cardish = nextCard();
            $cards = $(".posts").children(".card").not(".wasteCard").not(".clone1");
            $card = $($cards[$cards.length - 1]);
            $card.addClass("wasteCard");
            var id = $card.attr("id");//.split("c")[1];
            var x;
            if(cardish.suit == "spades")
                x = "-200%";
            else if(cardish.suit == "diamond")
                x = "-300%";
            else if(cardish.suit == "hearts")
                x = "-100%";
            else if(cardish.suit == "club")
                x = "0%";
            $front = $(document.createElement("div"));
            $front.attr("class","front");
            $front1 = $(document.createElement("div"));
            $front1.css("background-position", ((cardish.number -1) * -100) + "% " + x);
            $front1.appendTo($front);
            $open = $(document.createElement("div"));
            $open.addClass("openoverlay");
            $open.hover(function(){
                $(this).stop();
                $(this).prev(".card").stop();
                $(this).prev(".card").css("top", (2*push) + "px");
                $(this).css("height", (1+2*push)+"px");
            },
            function(){
                $(this).stop();
                $(this).prev(".card").stop();
                $(this).prev(".card").css("top", push + "px");
                $(this).css("height", "");
            });
            $front1.attr("class","front1");
            $front1.droppable( {
                addClasses: false,
                accept: ".card",
                drop: handleTableCardDrop
            } );
            $front1.droppable( "disable" );
            makeDraggable(id);
            $open.appendTo($front1);
            $back = $("#"+id).find(".back");
            $front.insertAfter($back);
            $clone = $card.clone();
            $clone.attr("id",id+"clone");
            $clone.addClass("clone1");
            $clone.css("z-index", numCard - ($clone.attr("id").split("c")[1]).split("clone")[0]);
            $clone.css(Modernizr.prefixed('transition')+"-duration", "0.2s"); 
            var pos1 = $back.position();
            $clone.css("top", pos1.top + "px");
            $clone.css("left", pos1.left + "px");
            $frontClone = $clone.find(".front");
            $backClone = $clone.find(".back");
            $backClone.css("top", "0px");
            $backClone.css("left", "0px");
            $clone.css("top", "0px");
            $clone.css("left", (zeroLeft+space) +"px");
            
            
            $clone.insertAfter($card);
            $card.css(Modernizr.prefixed('transition')+"-duration", "0s");
            $card.hide();
            $card.css("top", "0px");
            $card.css("left", "0px");
            $back.hide();
            $card.appendTo("#w2");
            $back.css("top", "0px");
            $back.css("left", "0px");
            $front.css(Modernizr.prefixed('transform'),"rotateY(0deg)");
            $back.css(Modernizr.prefixed('transform'),"rotateY(180deg)");
            $back.css(Modernizr.prefixed('transition')+"-duration", "0.2s");    
            $clone.css(Modernizr.prefixed('transform'));
            var sdds = $clone.position();
            $clone.css(Modernizr.prefixed('transform'),"rotateY(180deg)")
            .one(transitionstuff, function(){
                $("#"+$(this).attr("id").split("clone")[0]).show();
                $(this).hide();
                //$(this).remove();
                $("#"+$(this).attr("id").split("clone")[0]).css(Modernizr.prefixed('transition')+"-duration", "0.2s");
            });
        }
    });
}
function distributeCards(){
    $.getScript("http://olu.mide.co/Random/tumblr/blog/model.js")
    //$.getScript("https://raw.githubusercontent.com/0lumide/tumblr-solitaire/master/model.js")
    .done(function(){
        newGame();
        var c = numCard;
        var j = 7;
        distributeCards1();
        function distributeCards1(){
            var d = 0;
            var i = j;
            distributeCards2();
            function distributeCards2(){
                setTimeout(function () {
                    var depth = 0;
                    $w = $("#w"+(14 -i));
                    var pos = $w.position();
                    if(j == 7){
                        $w.droppable( {
                            addClasses: false,
                            accept: ".card",
                            drop: handleTableCardDrop,
                            disabled: true
                        } );
                    }
                    $orr = $("#c"+c);
                    $orr1 = $("#c"+c--+" .back");
                    $orr.removeClass("deckCard");
                    $orr.addClass("tableCard");
                    $klone = $orr1.clone().insertAfter($orr);
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
                    $orr1.css(Modernizr.prefixed('transition')+"-duration", "0.2s");
                    if(j == 7){
                        $klone.css("left", pos.left+"px");
                        $klone.css("top", pos.top+"px")
                        .one(transitionstuff, function(){
                            d++;
                        });
                    }
                    else{
                        $appendhere = $("#w"+(14 -i)).find(".post_overlay").last();
                        depth = $("#w"+(14 -i)).find(".post_overlay").length;
                        $klone.css("left", pos.left+"px");
                        $klone.removeClass("card");
                        $klone.css("top", (pos.top +(depth-1)*((ex/2)+1)+"px"))
                        .one(transitionstuff, function(){
                            d++;
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
                        var w = 3;
                        //distributeCards1();                    
                }, 70);
            }
        }
    });
}
function yesFlipMe(id, deckNum){
    var cardish = openStack(deckNum);
    var depth = $("#w"+(deckNum+6)).find(".card").length;
    var x;
    if(cardish.suit == "spades")
        x = "-200%";
    else if(cardish.suit == "diamond")
        x = "-300%";
    else if(cardish.suit == "hearts")
        x = "-100%";
    else if(cardish.suit == "club")
        x = "0%";
    $front = $(document.createElement("div"));
    $open = $(document.createElement("div"));
    $front.attr("class","front");
    $front1 = $(document.createElement("div"));
    $front1.css("background-position", ((cardish.number -1) * -100) + "% " + x);
    $open = $(document.createElement("div"));
    $open.addClass("openoverlay");
    $open.hover(function(){
        $(this).stop();
        $(this).prev(".card").stop();
        $(this).prev(".card").css("top", (2*push) + "px");
        $(this).css("height", (1+2*push)+"px");
    },
    function(){
        $(this).stop();
        $(this).prev(".card").stop();
        $(this).prev(".card").css("top", push + "px");
        $(this).css("height", "");
    });
    $front1.attr("class","front1");
    $front1.droppable( {
        addClasses: false,
        accept: ".card",
        drop: handleTableCardDrop
    } );
    $front1.appendTo($front);
    makeDraggable(id);
    $open.appendTo($front1);
    $back = $("#"+id).find(".back");
    $front.insertAfter($back);
    $back.css(Modernizr.prefixed('transform'));
    $front.css(Modernizr.prefixed('transform'));
    $back.css(Modernizr.prefixed('transform'),"rotateY(180deg)")
    .one(transitionstuff, function(){
        $(this).hide();
        $("#"+id).css(Modernizr.prefixed('transition')+"-duration", "0.2s");
    });
    $front.css(Modernizr.prefixed('transform'),"rotateY(0deg)");
}
function makeDraggable(id){
    $("#"+id).draggable({
        addClasses: false,
        revert: true,
        revertDuration: 100,
        start: function(){
            $(this).addClass("notransition");
            $(this).closest(".hold").addClass("moving");
            var deckNum = $(this).closest(".hold").attr("id").split("w")[1];
            $(this).data("deckNum", 0);
            if (deckNum >= 7)
                $(this).data("deckNum", deckNum - 6);
            else if (deckNum >= 3)
                $(this).data("deckNum", deckNum - 2);
            $(this).data( "w", $(this).closest(".hold").attr("id"));
            $hold = $(this).closest(".front1");
            if(!$(this).parent(".card").hasClass("deckCard")){
                if($hold.length){
                    $hold.addClass("moveholder");
                    $(this).data("notlast", 1);
                }
                else if ((!$(this).closest(".hold").hasClass("pile"))&&($(this).closest(".hold").find(".card").length - $(this).closest(".hold").find(".front").length ) == 0){
                    $(this).closest(".hold").addClass("moveholder");
                    $(this).data("notlast", 0);
                }
            }
        },
        stop : function(){
            $hold = $(this).closest(".front1");
            $hold1 = $(this).closest(".hold");
            if(!$(this).parent(".card").hasClass("deckCard")){
                if($(this).data("notlast")){
                    if(!($hold.hasClass("moveholder"))){
                        $(".moveholder").droppable( "option", "disabled", false );
                    }
                }
                else if($hold.hasClass("moveholder") == 0){
                    if(!($hold1.hasClass("moveholder"))){
                        $(".moveholder").droppable( "option", "disabled", false );
                    }
                }
            }
            $(".moveholder").removeClass("moveholder");
            $(this).removeClass("notransition");
            $("#" + $(this).data("w")).removeClass("moving");
            $(this).draggable( 'option', 'revert', true);
            $(this).draggable( 'option', 'revertDuration', 100);
        }
    });
}
function handleFoundCardDrop(event, ui){
    if(!(ui.draggable.find(".card").length)){
        var tableNum = ui.draggable.data("deckNum");
        var tableNum = ui.draggable.data("deckNum");
        var foundNum = $(this).attr("id").split("w")[1] - 2;
        if(ui.draggable.hasClass("wasteCard")){
            var maybe = wasteToFoundation(foundNum);
        }
        else if(ui.draggable.hasClass("foundCard")){

        }
        else if(ui.draggable.hasClass("tableCard")){
            var cardNum = ui.draggable.closest(".hold").find(".front").length;
            var maybe = tableToFoundation(tableNum, foundNum);
        }
        if(!(maybe < 0)){
            if(ui.draggable.hasClass("wasteCard")){
                $(ui.draggable.attr("id")+"clone").remove();
            }
            ui.draggable.removeClass("deckCard");
            ui.draggable.removeClass("wasteCard");
            ui.draggable.addClass("foundCard");
            ui.draggable.removeClass("tableCard");
            ui.draggable.css("top", "0px");
            ui.draggable.css("left", "0px");
            ui.draggable.appendTo($(this));
            ui.draggable.find(".front1").droppable( "disable" );
            ui.draggable.draggable( 'option', 'revert', false );
        }
    }
}
function handleTableCardDrop(event, ui){
    var tableNum = ui.draggable.data("deckNum");
    if($(this).hasClass("table"))
        var thisTableNum = $(this).attr("id").split("w")[1] - 6;
    else
        var thisTableNum = $(this).closest(".hold").attr("id").split("w")[1] - 6;
    if(ui.draggable.hasClass("wasteCard")){
        var maybe = wasteToTable(thisTableNum);
    }
    else if(ui.draggable.hasClass("foundCard")){
        var maybe = foundationToTable(tableNum, thisTableNum);
    }
    else if(ui.draggable.hasClass("tableCard")){
        var cardNum = ui.draggable.closest(".hold").find(".front").length - ui.draggable.find(".card").length;
        var maybe = tableToTable(tableNum, thisTableNum, cardNum);
    }
    if(!(maybe < 0)){
        if(ui.draggable.hasClass("wasteCard")){
            ui.draggable.find(".front1").droppable( "enable" );
            $(ui.draggable.attr("id")+"clone").remove();
        }
        else if (ui.draggable.hasClass("foundCard")){
            ui.draggable.find(".front1").droppable( "enable" );
        }
        ui.draggable.removeClass("deckCard");
        ui.draggable.removeClass("foundCard");
        ui.draggable.removeClass("wasteCard");
        ui.draggable.addClass("tableCard");
        $(this).droppable( "disable" );
        ui.draggable.find(".front1").last().droppable( "enable" );
        if($(this).children(".openoverlay").length)
            ui.draggable.css("top", push+"px");
        else
            ui.draggable.css("top", "0px");
        ui.draggable.css("left", "0px");
        ui.draggable.prependTo($(this));
        ui.draggable.draggable( 'option', 'revert', false );
    }
}
function flipCard(deckNum){
    var depth = $("#w"+(deckNum+6)).find(".card").length;
    if (depth != 0){
        yesFlipMe(($("#w"+(deckNum+6)).find(".card")[depth - 1]).id, deckNum);
    }
}
function flipCards(){
    var dhd = $(".card").position()[0];
    var i = 1;
    error = false;
    function flipCards1 () {
        setTimeout(function () {
            flipCard(i);
            i++;
            if (i <= 7) {
                flipCards1();
            }
            else {
                $(".table .post_overlay").click(function(event){
                    event.stopPropagation();
                    $w = $(this).closest(".hold");
                    var deckNum = $w.attr("id").split("w")[1] - 6;
                    $temp = $w.find(".card");
                    $temp1 = $($temp[$temp.length - 1]);
                    $temp2 = $temp1.find(".post_overlay");
                    if($(this).is($temp2)){
                        flipCard(deckNum);
                    }
                });
            }
        }, 300);
    }
    setTimeout(function () {
        flipCards1();
    },300);
}
function reDeckEm() {
    $("#w1").hide();
    var top = 0;
    var left = zeroLeft;
    var count = 0;
    $els = $($(".wasteCard").not(".clone1").get().reverse());
    var stop = $els.length;
    reDeckEm1();
    function reDeckEm1(){
        var id = $($els[count]).attr("id").split("c")[1];
        setTimeout(function(){
            $el = $("#c"+id);
            $clone = $("#"+$el.attr("id")+"clone");
            $back = $el.find(".back");
            $front = $el.find(".front");
            $backClone = $clone.find(".back");
            $frontClone = $clone.find(".front");
            $clone.show();
            $clone.css("z-index", id);
            $el.hide();
            $back.show();
            $el.css("top",top+"px");
            $el.css("left",left+"px");
            $el.appendTo(".posts");
            $el.addClass("deckCard");
            $el.removeClass("wasteCard");
            $front.css(Modernizr.prefixed('transform'),"rotateY(180deg)");
            $back.css(Modernizr.prefixed('transform'),"rotateY(0deg)");
            $clone.css(Modernizr.prefixed('transform'),"rotateY(0deg)");
            $clone.css(Modernizr.prefixed('transform'));
            var sdds = $clone.position();
            $clone.css("top",top+"px");
            $clone.css("left",left+"px")
            .one(transitionstuff, function(){
                $("#"+$(this).attr("id").split("clone")[0]).find(".front").remove();
                $("#"+$(this).attr("id").split("clone")[0]).show();
                $(this).remove();
            });
            top+=0.1;
            left+=0.1;
            if (++count < stop)
                reDeckEm1();
            else{
                $("#w1").show();
                deckFinish();
            }
        }, 10);
    }
}
function gameEnded(){
    $bigGuy = $(document.createElement("div"));
    $bigGuy.attr("id","bigGuy");
    $mainGuy = $(document.createElement("div"));
    $span = $(document.createElement("span"));
    $span.text("You Finished. You may celebrate by clicking the heart that appears below.");
    $text = $(document.createElement("p"));
    $text.text("PS: You might want to also follow me");
    $like = $(document.createElement("iframe"));
    $like.attr("src","likebutton");
    $like.attr("id","likebutton");
    $like.attr("frameBorder","0");
    $like.attr("scrolling","no");
    $like.css("width", "100px");
    $like.css("height", "100px");
    $like.css("margin-top", "40px");
    $like.css("margin-bottom", "25px");
    $like.css("visibility", "hidden");
    $like.css("margin-left" , "calc(50% - 50px)");
    $mainGuy.appendTo($bigGuy);
    $span.appendTo($mainGuy);
    $like.appendTo($mainGuy); 
    $text.appendTo($mainGuy);
    $bigGuy.hide();
    $bigGuy.appendTo($("body"));
    setTimeout(function () {
        $bigGuy.fadeIn();
        setTimeout(function () {
            $("#bigGuy").hide("slow");    
        },30000);
        setTimeout(function () {
            $("#bigGuy").find("iframe").css("visibility", "visible");    
        },5000);
    }, 2000);
}
function deckEm() {
    var top = 0;
    var left = zeroLeft;
    var count = 0;
    $(".back").each(function(){
        $(this).css("top",top+"px");
        $(this).css("left",left+"px");
        $(this).parent(".card").addClass("deckCard");
        $(this).one(transitionstuff, function(){
            count++;
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
    $(".back").css("background-color", "#E0E0E0");
    $(".back").find("a").removeAttr("href");
    $("html, body").animate({ scrollTop: 0 }, "slow")
    .promise().done(function(){
        createSpace();
        deckEm();
    });
}
function deleteStuff() {
    $(".back").find(".info_bar").remove();
    $(".back").find(".tag_div").remove();
    $(".back").find(".caption_div").hide("slow", function () {
        $(this).remove();
        });
    var css =".card .post_overlay{z-index: 1;} .card:hover .post_no_info_bar {opacity:1;} body{overflow-x:hidden;} .posts, .card *{-webkit-touch-callout: none; -webkit-user-select: none;   -khtml-user-select: none; -moz-user-select: none; user-select: none;} .ace,.ainner{position:absolute; top:0;}";
    var num = (-1*offset) + 12;
    var sidhov = "#sidebar:hover{right:" + num + "px !important;}";
    css += sidhov;
    
    style=document.createElement("style");
    if (style.styleSheet)
        style.styleSheet.cssText=css;
    else 
        style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
}