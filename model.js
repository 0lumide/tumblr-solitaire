var openStacks = {};//new Object();//Object.create(null);  //each child of closedStack is a stack
var closedStacks = {};//new Object();//Object.create(null);//each child of closedStack is a simple array
var cards = [];
var cardIndex;
var foundationStacks = {};//new Object();//Object.create(null);
var trashpile;
var gameScore;


/*
 * +Blender
 * @http://stackoverflow.com/a/6274398/2057884
 */
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}
//internal function
function createStack(stack, cardOb, isStack) {
    if (!stack.hasOwnProperty("cardOb")){
		if (isStack){
			stack.cardOb = cardOb.cardOb;
			stack.nextStack = cardOb.nextStack;
		}
		else {
			stack.cardOb = cardOb;
			stack.nextStack = {};
		}
	}
	else if (!isStack &&!stack.nextStack.hasOwnProperty("cardOb")){
		createStack(stack.nextStack, cardOb, isStack);
	}
	else{
		createStack(stack.nextStack, cardOb, isStack);
	}
}
//internal function
function throwErr(mess){
	console.log(mess);
}

function newGame() {
	cardIndex = 0;
	gameScore = 0;
	for (var i=1; i<=7; i++){
        openStacks["stack"+i] = {};
	}
	for (var i=1; i<=7; i++){
        closedStacks["stack"+i] = [];
	}
	for (var i=1; i<=4; i++){
        foundationStacks["stack"+i] = [];
	}
	for (var i=1; i<=52; i++){
		var j = i%13;
		var color;
		if (j === 0)
			j = 13;
		if(i>39){
			suit = "diamond";
			color = "red";
		}
		else if(i>26){
			suit = "club";
			color = "black";
		}
		else if(i>13){
			suit = "hearts";
			color = "red";
		}
        else if(i>0){
			suit = "spades";
			color = "black";
		}
		var card = {cardId: i, suit : suit, color: color, number : j};
		cards.push(card);
	}
	
	cards = shuffle(shuffle(cards));
	for (var i = 1; i<=7; i++){
		for(var j = 0; j < i; j++){
            var q = cards.splice(0,1)[0];
			closedStacks["stack"+i].push(q);
		}
	}
}

function getScore(){
	return gameScore;
}
function deckFinish(){
	if (gameScore > 100){
		gameScore -= 100;
		updateScore();
	}
	else
		gameScore = 0;
	updateScore();
}
function nextCard(){
	if(cardIndex >= cards.length){
		cardIndex = 0;
	}
	return cards[cardIndex++];
}

//internal function
function useCard() {
	if (cardIndex === 0)
		return -3;
	return cards.splice(--cardIndex, 1)[0];
}
//internal function
function getWasteTop() {
	if (cardIndex === 0)
		return -3;
	return cards[cardIndex -1];
}
//internal function
function getTableStack(stackNum, cardNum){
    return getTable(stackNum, cardNum, true);
}
function getTableCard(stackNum, cardNum){
    var val = getTable(stackNum, cardNum, false);
    if ((val === undefined) || (val.suit === undefined))
        return "empty";
    else
        return val;
}
function getTable(stackNum, cardNum, isStack){
	 
    if ((stackNum < 1)||(stackNum > 7)){
        throwErr("Invalid Stack number");
    }
    else if(!((cardNum == "last")||(cardNum >= 1))){
		throwErr("Invalid card number: Number too small");
		return -1;
	}
	else{
		var dontstop = true;
		var count = 1;
		var stack = openStacks["stack"+stackNum];
		while(dontstop){
    		if(count == cardNum){
				dontstop = false;
				if (isStack)
					return stack;
                else
                    return stack.cardOb;
			}
            else if (!(stack.hasOwnProperty("cardOb") && stack.nextStack.hasOwnProperty("cardOb"))){//(stack.nextStack == null){
				if(cardNum == "last"){
					dontstop = false;
                    if (isStack)
                        return stack;
                    else
                        return stack.cardOb;
				}
				else if(count != cardNum){
					dontstop = false;
					throwErr("Invalid card number: Number too large");
					return -1;
				}
			}
			else{ 
				count++;
				stack = stack.nextStack;
			}
		}
				
	}
}
function removeTable(stackNum, cardNum, isStack){
	 
    if ((stackNum < 1)||(stackNum > 7)){
        throwErr("Invalid Stack number");
    }
    else if(!((cardNum == "last")||(cardNum >= 1))){
		throwErr("Invalid card number: Number too small");
		return -1;
	}
	else{
		var dontstop = true;
		var count = 1;
		var stack = openStacks["stack"+stackNum];
		var stack1;
		while(dontstop){
    		if(count == cardNum){
				dontstop = false;
				if (cardNum == 1)
					openStacks["stack"+stackNum] = {};
				else
					stack1.nextStack = {};
            }
            else if((cardNum == "last")&&(!stack.nextStack.hasOwnProperty("cardOb"))){
				dontstop = false;
				if (count == 1)
					openStacks["stack"+stackNum] = {};
				else
					stack1.nextStack = {};
            }
            else if (!stack.hasOwnProperty("cardOb")){
    			if(count < cardNum){
					dontstop = false;
					throwErr("Invalid card number: Number too large");
					return -1;
				}
            }
			else{ 
				count++;
				stack1 = stack;
				stack = stack.nextStack;
			}
		}
				
	}
}
//This function returns the card object of the card on top of the closed deck and adds it to the open stack
function openStack(deckNum){
	var d = closedStacks["stack"+deckNum];
    addToTable(deckNum, d[d.length-1]);
    gameScore += 5;
    updateScore();
	return d.splice(d.length-1,1)[0];
}
//internal function
function getFoundationTop(foundNum){
	var arr = foundationStacks["stack"+foundNum];
	if (arr.length === 0)
		return 0;
	return(arr[arr.length - 1]);
}
function wasteToFoundation(foundNum){
	var card;
	var foundTop = getFoundationTop(foundNum);
	var wasteTop = getWasteTop();
	if (((foundTop === 0)&&(wasteTop.number == 1))||((foundTop.suit == wasteTop.suit)&&(foundTop.number == (wasteTop.number - 1)))){
			gameScore+=10;
			updateScore();
			card = useCard();//here
			addToFoundation(foundNum, card);
	}else
		return(-2);
}
function wasteToTable(tableNum){
    if(tableNum === undefined)
        return -3;
	var card;
	var tableTop = getTableCard(tableNum, "last");
	var wasteTop = getWasteTop();
    if(wasteTop == -3){
    }
	else if(((tableTop == "empty")&&(wasteTop.number == 13))||(((wasteTop.number + 1) == tableTop.number)&&(wasteTop.color != tableTop.color))){
		gameScore+=5;
		updateScore();
		card = useCard();
		addToTable(tableNum, card);
	}else
		return -2;
}
/*
 * -3 = something is wrong with your logic
 * -2 = invalid play
 */
function foundationToTable(foundNum, tableNum){
	var tableTop = getTableCard(tableNum, "last");
	var foundTop = getFoundationTop(foundNum);
	if(foundTop === 0){
		return(-3); //this should never get called
	}
	else if((tableTop -1) == foundTop){
		if (gameScore >= 15)
			gameScore-=15;
		else
			gameScore = 0;
		updateScore();
		foundTop = foundationStacks["stack"+foundNum].pop();
		addToTable(tableNum, foundTop);
	}
	else
		return -2;
}
function tableToFoundation(tableNum, foundNum) {
	var tableTop = getTableCard(tableNum, "last");
	var foundTop = getFoundationTop(foundNum);
	if (tableTop == -1){
		return -3;
	}
	else if(((foundTop === 0)&&(tableTop.number == 1))||(((foundTop.number + 1) == tableTop.number)&&(tableTop.suit == foundTop.suit))){
		gameScore+=10;
		updateScore();
		addToFoundation(foundNum, tableTop);
		removeTable(tableNum, "last", false);
	}
	else
		return -2;
}
function addToFoundation(foundNum, card){
	foundationStacks["stack"+foundNum].push(card);
	if(foundationStacks["stack"+foundNum].length == 13)
		if((foundationStacks["stack1"].length == 13)&&(foundationStacks["stack2"].length == 13)&&(foundationStacks["stack3"].length == 13)&&(foundationStacks["stack4"].length == 13))
			gameEnded();
}
function addToTable(tableNum, card){
	createStack(openStacks["stack"+tableNum],card, false);
}
function addStackToTable(tableNum, stack){
	createStack(openStacks["stack"+tableNum],stack, true);
}
function tableToTable(tableNum1, tableNum2, cardNum){
    var cardHead = getTableCard(tableNum1, cardNum); 
    var tableTop = getTableCard(tableNum2, "last");
    if(((tableTop == "empty")&&(cardHead.number == 13))||((cardHead.color != tableTop.color)&&((cardHead.number+1)== tableTop.number))){
        if(cardNum == "last"){
            addToTable(tableNum2, getTableStack(tableNum1, cardNum));
            removeTable(tableNum1, cardNum, false);
        }
        else{
            addStackToTable(tableNum2, getTableStack(tableNum1, cardNum));
            removeTable(tableNum1, cardNum, true);
        }
    }
    else
        return -2;
}