const board = document.getElementById("board");
const statusText = document.getElementById("status");

let boardState = ["","","","","","","","",""];
let cells = [];

let currentPlayer = "X";
let gameOver = false;
let vsAI = false;

let scores = {
    X:0,
    O:0,
    Draw:0
};

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function createBoard(){

    board.innerHTML="";
    cells=[];
    boardState=["","","","","","","","",""];
    gameOver=false;
    currentPlayer="X";

    statusText.textContent="Player X Turn";

    for(let i=0;i<9;i++){

        let cell=document.createElement("div");
        cell.className="cell";
        cell.dataset.index=i;

        cell.addEventListener("click",playerMove);

        board.appendChild(cell);

        cells.push(cell);

    }

}

function playerMove(){

    const index=this.dataset.index;

    if(boardState[index]!="" || gameOver) return;

    makeMove(index,currentPlayer);

    if(checkWinner(currentPlayer)) return;

    if(drawGame()){

        statusText.textContent="Draw!";
        scores.Draw++;
        updateScore();
        gameOver=true;
        return;

    }

    currentPlayer=currentPlayer==="X"?"O":"X";

    statusText.textContent="Player "+currentPlayer+" Turn";

    if(vsAI && currentPlayer==="O"){

        setTimeout(aiMove,300);

    }

}

function makeMove(index,player){

    boardState[index]=player;

    cells[index].textContent=player;

    cells[index].classList.add(player.toLowerCase());

}

function checkWinner(player){

    for(let combo of wins){

        let[a,b,c]=combo;

        if(
            boardState[a]===player &&
            boardState[b]===player &&
            boardState[c]===player
        ){

            cells[a].classList.add("win");
            cells[b].classList.add("win");
            cells[c].classList.add("win");

            statusText.textContent=player+" Wins!";

            scores[player]++;

            updateScore();

            gameOver=true;

            return true;

        }

    }

    return false;

}

function drawGame(){

    return boardState.every(cell=>cell!="");

}

function updateScore(){

    document.getElementById("xScore").textContent=scores.X;
    document.getElementById("oScore").textContent=scores.O;
    document.getElementById("drawScore").textContent=scores.Draw;

}

function aiMove(){

    let bestScore=-Infinity;
    let move;

    for(let i=0;i<9;i++){

        if(boardState[i]==""){

            boardState[i]="O";

            let score=minimax(boardState,false);

            boardState[i]="";

            if(score>bestScore){

                bestScore=score;
                move=i;

            }

        }

    }

    makeMove(move,"O");

    if(checkWinner("O")) return;

    if(drawGame()){

        statusText.textContent="Draw!";
        scores.Draw++;
        updateScore();
        gameOver=true;
        return;

    }

    currentPlayer="X";

    statusText.textContent="Player X Turn";

}

function minimax(board,isMax){

    let result=evaluate();

    if(result!==null) return result;

    if(isMax){

        let best=-Infinity;

        for(let i=0;i<9;i++){

            if(board[i]==""){

                board[i]="O";

                best=Math.max(best,minimax(board,false));

                board[i]="";

            }

        }

        return best;

    }else{

        let best=Infinity;

        for(let i=0;i<9;i++){

            if(board[i]==""){

                board[i]="X";

                best=Math.min(best,minimax(board,true));

                board[i]="";

            }

        }

        return best;

    }

}

function evaluate(){

    for(let combo of wins){

        let[a,b,c]=combo;

        if(
            boardState[a] &&
            boardState[a]==boardState[b] &&
            boardState[a]==boardState[c]
        ){

            return boardState[a]=="O"?1:-1;

        }

    }

    if(boardState.every(cell=>cell!=""))
        return 0;

    return null;

}

document.getElementById("restart").addEventListener("click",createBoard);

document.getElementById("pvp").onclick=function(){

    vsAI=false;

    this.classList.add("active");

    document.getElementById("ai").classList.remove("active");

    createBoard();

};

document.getElementById("ai").onclick=function(){

    vsAI=true;

    this.classList.add("active");

    document.getElementById("pvp").classList.remove("active");

    createBoard();

};

createBoard();