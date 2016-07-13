
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
	
	if (empty[0] === 9) { //making first move
	document.getElementById("f5").innerHTML = opside;
	return;
	}
	
	if (empty[0] === 8 && document.getElementById("f5").innerHTML === "") { //making first move
		document.getElementById("f5").innerHTML = opside;
		}
	else{
		var rnd = Math.round(Math.random()*empty[0]);		
		if (rnd === 0){rnd++;}
		
		if (document.getElementById("f"+empty[rnd]).innerHTML !==""){
			alert("rnd:"+rnd+" empty[rnd]:"+empty[rnd]+" empty[0]:"+empty[0]);
			return;
		}
		
		document.getElementById("f"+empty[rnd]).innerHTML = opside;
	}
	
	if(checkwincondition(side,opside)===opside){
			alert('Комп победил!');
			initgame();
	}

}

function checkwincondition(side,opside){	
	"use strict";
	var wincond = //Listing all winning combinations
	[
		[8,side,opside],
		[1,2,3],
		[4,5,6],
		[7,8,9],
		[1,4,7],
		[2,5,8],
		[3,6,9],
		[1,5,9],
		[3,5,7]
	];

	var board = []; //array for holding current board state

	for (var I = 1; I <=9; I++) {
		board[I] = document.getElementById("f"+I).innerHTML;
	}
	

	for (var i = 1; i <= 8; i++){
		var c1 = board[wincond[i][0]];
		var c2 = board[wincond[i][1]];
		var c3 = board[wincond[i][2]];
	
		if(c1===c2 && c2 === c3 && c3===wincond[0][1]){
			document.getElementById("f"+wincond[i][0]).style = "background-color:green";
			document.getElementById("f"+wincond[i][1]).style = "background-color:green";
			document.getElementById("f"+wincond[i][2]).style = "background-color:green";
			return side;
		}
		else if(c1===c2 && c2 === c3 && c3===wincond[0][2]){
			document.getElementById("f"+wincond[i][0]).style = "background-color:red";
			document.getElementById("f"+wincond[i][1]).style = "background-color:red";
			document.getElementById("f"+wincond[i][2]).style = "background-color:red";
			return opside;
		}
		
	}
	
	
}