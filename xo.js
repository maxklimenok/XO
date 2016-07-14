
//main game function
function initgame(){
"use strict";
var cell = [];
resetgame();
var side = choseside();
var opside;
if (side === "x"){opside = "o";} else {opside ="x";}

for (var i=1;i<=9;i++){
	cell[i] = document.getElementById("f"+i);	
	cell[i].setAttribute("onclick","makemove("+i+",'"+side+"','"+opside+"')");
	cell[i].setAttribute("style","");
	}

if (side === 'o'){makeopmove(side,opside);}

}

//support functions

function resetgame(){
	"use strict";
	for (var i=1;i<=9;i++){
	document.getElementById("f"+i).innerHTML = "";	
	document.getElementById("f"+i).style = "";
	}
}

function choseside(){
	"use strict";
	var side = confirm('Хотите ходить первым?');
	if (side === true){
		return "x";
	} 
	else {
		return "o";
	}
}

function makemove(cell,side,opside){
	"use strict";	
	var c = document.getElementById("f"+cell);
	if (c.innerHTML !== ""){
		return; //If accidentally non empty cell was clicked - exit
	}
	c.innerHTML = side; //making move;

	if(checkwincondition(side,opside)===side){
		alert('Ты победил!');
		initgame();
		return;
	}
	else if(checkwincondition(side,opside)==="tie"){
		alert('Ничья');
		initgame();
		return;
	}

	makeopmove(side,opside);
	
	
}

function makeopmove(side,opside){ //function for AI move
	"use strict";
	var empty = []; //array for storing empty cells;
	var ei = 1; //empty index
	for (var i = 1; i<=9 ; i++) {
		if (document.getElementById("f"+i).innerHTML === ""){	
		empty[ei] = i;
		ei++;		
		}
	}
	empty[0] = ei-1;
	
	if (empty[0] === 9) { //making first move alvays in center if it is very first turn
	document.getElementById("f5").innerHTML = opside;
	return;
	}
	
	if (empty[0] === 8 && document.getElementById("f5").innerHTML === "") { //making second move in center if it is empty
		document.getElementById("f5").innerHTML = opside;
		}
	else{
		
		// here in this place AI logic should be started
		
		
		//First of all we should check if there is a dangerous situation of loosing on next turn
		//i.e. Two cells with the same symbol are already inline 
		var danger = isdangerous(side);
		var winop = iswinopportunity(opside);
		var rnd;
		var opmove;
		
		if (winop !== 0){
			opmove = winop;
			}		
		else if(danger === 0){
			rnd = Math.round(Math.random()*empty[0]);
			if (rnd === 0){rnd++;} 
			opmove = empty[rnd];
		}
		else{
			opmove = danger;
			}
		
		
		// Below is a check to verify if intended cell for AI move is not already taken 
		// TO BE DELITED IN PRODUCTION VERSION
		if (document.getElementById("f"+opmove).innerHTML !== ""){
			alert("rnd:"+rnd+" empty[rnd]:"+empty[rnd]+" empty[0]:"+empty[0]+ " danger:"+danger);
			return; // if there is something in it -> alert debug info and exit;
		}
		
		//Phisically making move in desired cell
		document.getElementById("f"+opmove).innerHTML = opside;

	}
	
	if(checkwincondition(side,opside)===opside){
		alert('Комп победил!');
		initgame();	
	}
	else if(checkwincondition(side,opside)==='tie'){
		alert('Ничья.');
		initgame();	
	}

}

function checkwincondition(side,opside){	
	"use strict";
	var wincond = getwincondition();
	var board = getboard();
		

	for (var i = 1; i <= wincond.length-1; i++){
		var c1 = board[wincond[i][0]];
		var c2 = board[wincond[i][1]];
		var c3 = board[wincond[i][2]];
	
		if(c1===c2 && c2 === c3 && c3===side){
			document.getElementById("f"+wincond[i][0]).style = "background-color:green";
			document.getElementById("f"+wincond[i][1]).style = "background-color:green";
			document.getElementById("f"+wincond[i][2]).style = "background-color:green";
			return side;
		}
		else if(c1===c2 && c2 === c3 && c3===opside){
			document.getElementById("f"+wincond[i][0]).style = "background-color:red";
			document.getElementById("f"+wincond[i][1]).style = "background-color:red";
			document.getElementById("f"+wincond[i][2]).style = "background-color:red";
			return opside;
		}	
	}
	
	var empty=0;
	for (i=1; i <= board.length-1; i++){
		if (board[i]===""){empty++;}
	}
	
	if(empty ===0){return "tie";}
}

function isdangerous(side){ //Function to check the board for dangerous situations
	"use strict";//Returns cell number desired to counter danger situation
	var wincond = getwincondition();
	var board = getboard();
	var problemcells = []; //array for storing cellsnumbers taken by player
	
	problemcells[0] = 0;
	
	for (var i = 1; i<=board.length-1; i++){
		if (board[i] === side){
			problemcells[problemcells [0]+1]=	i;
			problemcells[0]++;
		}
	}
	
	
	if (problemcells[0] < 2){
		return 0; // if count of "dangercells" is too low - abort function and return safestate value
	}
	
	for (i = 1; i <= wincond.length-1; i++){
		var hit = [];
			hit[0] = 0;		
			
		for (var a = 1; a <= problemcells[0]; a++){
			if(wincond[i][0] === problemcells[a]){hit[1] = problemcells[a];hit[0]++;}
			if(wincond[i][1] === problemcells[a]){hit[2] = problemcells[a];hit[0]++;}
			if(wincond[i][2] === problemcells[a]){hit[3] = problemcells[a];hit[0]++;}
		}
		
		if(hit[0] === 2){
			var safe;
			for(var b = 0; b<=2; b++){
				if(board[wincond[i][b]] ===""){
					safe = wincond[i][b];
					return safe;
				}
			}		
		}
	}
	
	return 0;  //nothing dangerous found - return safestate value;

}

function iswinopportunity(opside){ //Function to check the board for winning opportunities
	"use strict";//Returns cell number for making move for winning on this current turn
	var wincond = getwincondition();
	var board = getboard();
	var aicells = []; //array for storing cellsnumbers taken by AI
	
	aicells[0] = 0;
	
	for (var i = 1; i<=board.length-1; i++){
		if (board[i] === opside){
			aicells[aicells[0]+1]=	i;
			aicells[0]++;
		}
	}
	
	
	if (aicells[0] < 2){
		return 0; // if count of "aicells" is too low - abort function and return default value
	}
	
	for (i = 1; i <= wincond.length-1; i++){
		var hit = [];
			hit[0] = 0;		
			
		for (var a = 1; a <= aicells[0]; a++){
			if(wincond[i][0] === aicells[a]){hit[1] = aicells[a];hit[0]++;}
			if(wincond[i][1] === aicells[a]){hit[2] = aicells[a];hit[0]++;}
			if(wincond[i][2] === aicells[a]){hit[3] = aicells[a];hit[0]++;}
		}
		
		if(hit[0] === 2){
			var winop;
			for(var b = 0; b<=2; b++){
				if(board[wincond[i][b]] ===""){
					winop = wincond[i][b];
					return winop;
				}
			}		
		}
	}
	
	return 0;  //nothing dangerous found - return safestate value;

}

function getwincondition(){ //Function is used to build an array of all winning combinations
	"use strict";
	var wincond = //Listing all winning combinations
	[
		[8,"",""],
		[1,2,3],
		[4,5,6],
		[7,8,9],
		[1,4,7],
		[2,5,8],
		[3,6,9],
		[1,5,9],
		[3,5,7]
	];
	
	return wincond;
}

function getboard(){ //Function to get the current board state and retun it in array;
	"use strict";
	var board = []; //array for holding current board state
	var nonempty = 0; //variable to count nonempty cells

	for (var I = 1; I <=9; I++) {
		board[I] = document.getElementById("f"+I).innerHTML;
		if(board[I] !== ""){
			nonempty++;
		}
	}
	
	board[0] = nonempty;
	return board;
}

