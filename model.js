var openStacks = new Object();//Object.create(null);  //each child of closedStack is a stack
var closedStacks = new Object();//Object.create(null);//each child of closedStack is a simple array
var cards = [];
var cardIndex;
var foundationStacks = new Object();//Object.create(null);
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
		//stack["cardOb"] = null;
		//stack["nextStack"] = null;
		if (isStack){
			stack.cardOb = cardOb.cardOb;
			stack.nextStack = cardOb.nextStack;
		}
		else {
			stack.cardOb = cardOb;
			stack.nextStack = new Object();
			return stack;
		}
	}
	else if (!isStack &&!stack.nextStack.hasOwnProperty("cardOb")){
		stack.nextStack = createStack(nextStack, cardOb, isStack);
	}
	else
		createStack(nextStack, cardOb, isStack);
}
//internal function
function throwErr(mess){
	console.log("mess");
}

function newGame() {
	cardIndex = 0;
	gameScore = 0;
	for (var i=1; i<=7; i++){
        openStacks["stack"+i] = new Object();
		//Object.defineProperty(openStacks, "stack"+i);
	}
	for (var i=2; i<=7; i++){
        closedStacks["stack"+i] = [];
		//Object.defineProperty(closedStacks, "stack"+i);
	}
	for (var i=1; i<=4; i++){
        foundationStacks["stack"+i] = [];
		//Object.defineProperty(foundationStacks, "stack"+i);
	}
	for (var i=1; i<=52; i++){
		var j = i%13;
		var color;
		if (j == 0)
			j = 13;
		if(i>0){
			suit = "spades";
			color = "black";
		}
		else if(i>13){
			suit = "hearts";
			color = "red";
		}
		else if(i>26){
			suit = "club";
			color = "black";
		}
		else if(i>39){
			suit = "diamond";
			color = "red";
		}
		var card = {cardId: i, suit : suit, color: color, number : j};
		cards.push(card);
        //cards[cards.length] = card;
	}
	
	shuffle(cards);
	for (var i = 1; i<=7; i++){
		for(var j = 1; j < i; j++)
			closedStacks["stack"+i].push(cards.splice(0,1));
	}
	for (var i = 1; i<=7; i++){
		createStack(openStacks["stack"+i], cards.splice(0,1), false);
	}
}

function getScore(){
	return gameScore;
}
function nextCard(){
	if(cardIndex >= cards.length){
		cardIndex = 0;
		if (gameScore > 100)
			gameScore -= 100;
		else
			gameScore = 0;
	}
	return cards[cardIndex++];
}

//internal function
function useCard() {
	if (cardIndex == 0)
		return -3;
	return cards.splice(--cardIndex, 1);
}
//internal function
function getWasteTop() {
	if (cardIndex == 0)
		return -3;
	return cards[cardIndex -1];
}
//internal function
function getTableStack(stackNum, cardNum){
    return getTable(stackNum, cardNum, true);
}
function getTableCard(stackNum, cardNum){
    return getTable(stackNum, cardNum, false);
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
            if (!stack.nextStack.hasOwnProperty("cardOb")){//(stack.nextStack == null){
				if(cardNum = "last"){
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
			else if(count == cardNum){
				dontstop = false;
				if (isStack)
					return stack;
                else
                    return stack.cardOb;
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
		while(dontstop){
            if (!stack.nextStack.hasOwnProperty("cardOb")){//(stack.nextStack == null){
				if(cardNum = "last"){
					dontstop = false;
					    stack.cardOb = new Object();
                    	stack.nextStack = new Object();
                }
				else if(count != cardNum){
					dontstop = false;
					throwErr("Invalid card number: Number too large");
					return -1;
				}
			}
			else if(count == cardNum){
				dontstop = false;
				stack.cardOb = new Object();
            	stack.nextStack = new Object();
			}
			else{ 
				count++;
				stack = stack.nextStack;
			}
		}
				
	}
}
//This function returns the card object of the card on top of the closed deck and adds it to the open stack
function openStack(deckNum){
	var d = closedStacks["stack"+deckNum];
	addToTable(deckNum, d[d.length-1]);
	return d.splice(d.length-1,1);
}
//internal function
function getFoundationTop(foundNum){
	var arr = foundationStacks["stack"+foundNum];
	if (arr.length == 0)
		return 0;
	return(arr[arr.length - 1]);
}
function wasteToFoundation(foundNum){
	var card;
	var arr = foundationStacks["stack"+foundNum];
	var foundTop = arr[arr.length -1];
	var wasteTop = getWasteTop();
	if ((foundTop.suit == wasteTop.suit)&&(foundTop.number == (wasteTop.number - 1))){
			gameScore+=10;
			card = useCard();//here
			addToFoundation(foundNum, card);
	}else
		return(-2);
}
function wasteToTable(tableNum){
    if(tableNum == undefined)
        return -3;
	var card;
	var tableTop = getTableCard(tableNum, "last");
    //console.log(tableTop.number);
	var wasteTop = getWasteTop();
    console.log(wasteTop.number);
    if(wasteTop == -3){
    }
	else if(((wasteTop.number + 1) == tableTop.number)&&(wasteTop.color != tableTop.color)){
		gameScore+=5;
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
	if(foundTop == 0){
		return(-3); //this should never get called
	}
	else if((tableTop -1) == foundTop){
		gameScore-=15;
		foundTop = foundationStacks["stack"+foundNum].pop();
		addToTable(tableNum, foundTop);
	}
	else
		return -2;
}
function tableToFoundation(tableNum, foundNum) {
	var tableTop = getTableCard(tableNum, "last");
	var foundTop = getFoundationTop(foundNum);
	if (tableTop == 1){
		return -3;
	}
	else if(((foundTop == 0)&&(tableTop.number == 1))||(((foundTop.number + 1) == tableTop.number)&&(tableTop.shape == foundTop.shape))){
		score+=10;
		addToFoundation(foundNum, tableTop);
		removeTable(tableNum, "last", false);
	}
	else
		return -2;
}
function addToFoundation(foundNum, card){
	foundationStacks["stack"+foundNum].push(card);
}
function addToTable(tableNum, card){
	createStack(openStacks["stack"+tableNum],card, false);
}
function addStackToTable(tableNum, stack){
	createStack(openStacks["stack"+tableNum],stack, true);
}
function tableToTable(tableNum1, tableNum2, cardNum){
    var cardHead = getTableCard(tableNum, cardNum); 
    var tableTop = getTableCard(tableNum, "last");
    if((cardHead.color != tableTop.color)&&((cardHead.number+1)== tableTop.number)){
    	removeTable(tableNum1, cardNum, true);
        addStackToTable(tableNum2, getTableStack(tableNum1, cardNum));
    }
    else
        return -2;
}    

/*
newGame();
nextCard();
console.log(getScore());
wasteToTable(1);
*/
