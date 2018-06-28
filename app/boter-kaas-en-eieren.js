const grid = document.querySelector("#boter-kaas-en-eieren #table");
const message = document.querySelector("#message");
const message_wrapper = document.querySelector("#message-wrapper");

let table = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.id = "row";

    for (let j = 0; j < 3; j++) {
        const col = document.createElement("div");
        col.id = "cell";
        col.setAttribute("pos", `${i}.${j}`);

        row.appendChild(col);
    }

    grid.appendChild(row);
}

function reset () {
    table = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    Array.from(grid.children).forEach(row => {
        Array.from(row.children).forEach(col => col.innerHTML = "");
    });

    setTimeout(() => {
        message.innerHTML = "";
        message_wrapper.classList.remove("active");
    }, 5000);
}

grid.addEventListener("click", main);

let current_player = 0;
let turn = 1;

function main (e) {
    let cell = e.target;

    if (cell.id == "cell") {
        cell.innerHTML = current_player == 0 ?
            '<div class="center-vertical x">X</div>' :
            '<div class="center-vertical o">O</div>';
        const pos = cell.getAttribute("pos");
        const [row, col] = pos.split(".");

        table[row][col] = current_player + 1;

        const won = check();

        if (!won) {
            if (current_player == 0) current_player = 1;
            else if (current_player == 1) current_player = 0;
            turn++;

            // ai logic
            if (turn % 2 == 0) {
                const ai_move = computeAiMove();

                table[ai_move[0]][ai_move[1]] = current_player + 1;
                grid.children[ai_move[0]].children[ai_move[1]].innerHTML = current_player == 0 ?
                    '<div class="center-vertical x">X</div>' :
                    '<div class="center-vertical o">O</div>';

                if (current_player == 0) current_player = 1;
                else if (current_player == 1) current_player = 0;
                turn++;
            }
        }
    }
}

function check () {
    let count1 = 0;
    let count2 = 0;

    // horizontal
    outer: for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = table[i][j];

            if (cell == 1) count1++;
            else count1 = 0;

            if (cell == 2) count2++;
            else count2 = 0;

            if (count1 == 3 || count2 == 3) break outer;
        }

        count1 = 0;
        count2 = 0;
    }

    if (count1 != 3 && count2 != 3) {

        // vertical
        outer: for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = table[j][i];
    
                if (cell == 1) count1++;
                else count1 = 0;
    
                if (cell == 2) count2++;
                else count2 = 0;

                if (count1 == 3 || count2 == 3) break outer;
            }

            count1 = 0;
            count2 = 0;
        }

        if (count1 != 3 && count2 != 3) {

            // diagonal 1
            if ((table[0][0] == 1) && (table[1][1] == 1) && (table[2][2] == 1)) count1 = 3;
            else count1 = 0;

            if ((table[0][0] == 2) && (table[1][1] == 2) && (table[2][2] == 2)) count2 = 3;
            else count2 = 0;

            if (count1 != 3 && count2 != 3) {

                //diagonal 2
                if ((table[2][0] == 1) && (table[1][1] == 1) && (table[0][2] == 1)) count1 = 3;
                else count1 = 0;

                if ((table[2][0] == 2) && (table[1][1] == 2) && (table[0][2] == 2)) count2 = 3;
                else count2 = 0;
            }
        }
    }

    if (count1 == 3) {
        message_wrapper.classList.add("active");
        message.innerHTML = `Player X wins!`;
        reset();
        return true;
    }
    else if (count2 == 3) {
        message_wrapper.classList.add("active");
        message.innerHTML = `Player O wins!`;
        reset();
        return true;
    }

    return false;
}

function computeAiMove () {
    let gameState = getGameState();
    let move = computeMove(gameState).state;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] != move[i]) {
            return [Math.floor(i / 3), i % 3];
        }
    }
}

// remember good moves
let ai_memory = {};

// ai move
function computeMove (gameState) {
    if (ai_memory[gameState.toString()]) return ai_memory[gameState.toString()];

    let winner = determineWinner(gameState);

    if (winner == 1 || winner == 2) {
        return { winner, depth: 0, state: gameState };
    }
    else {
        let possiblemoves = computePossibleMoves(gameState);
        let best;

        if (possiblemoves.length == 0) {
            best = { winner: 0, depth: 0, state: gameState };
        }
        else {
            best = possiblemoves.map(evaluateGameState).reduce(getBestMove);    
        }

        ai_memory[gameState.toString()] = best;

        return best;
    }
}

function evaluateGameState(gameState) {
    let evaluatedPosition = computeMove(gameState);

    return { winner: evaluatedPosition.winner, depth: evaluatedPosition.depth + 1, state: gameState };
}

function computePossibleMoves (gameState) {
    let indexValues = Array.from(Array(gameState.length).keys());
    let emptyLocations = indexValues.filter(x => gameState[x] === 0);
    return emptyLocations.map(x => copyAssignReturn(gameState, x, current_player + 1));
}

function getBestMove(bestMoveFound, possibleMove) {
    return numericValue(possibleMove) > numericValue(bestMoveFound)
        ? possibleMove : bestMoveFound;
}
  
function numericValue (state) {
    let otherPlayer = current_player;
    let player = current_player === 0 ? 1 : 0;
    if (state.winner - 1 == otherPlayer) {
        return 20 - state.depth;
    } else if (state.winner == player) {
        return -10 + state.depth;
    } else {
        return state.depth;
    }
}

function getGameState () {
    let output = [];

    table.forEach(row => {
        row.forEach(col => output.push(col));
    });

    return output;
}

function copyAssignReturn(inputArray, location, value) {
    let returnArray = inputArray.slice();
    returnArray[location] = value;
    return returnArray;
}

function determineWinner(gameState) {
    // Check vertical wins
    for (let i = 0; i < 3; i++) {
        if (gameState[i] === gameState[i + 3]
            && gameState[i + 3] === gameState[i + 6]
            && gameState[i + 6] !== 0) {
            return gameState[i];
        }
    }
  
    // Check horizontal wins
    for (let i = 0; i < 9; i += 3) {
        if (gameState[i] === gameState[i + 1]
            && gameState[i + 1] === gameState[i + 2]
            && gameState[i + 2] !== 0) {
            return gameState[i];
        }
    }
  
    // Check cross wins
    if (gameState[0] === gameState[4]
        && gameState[4] === gameState[8]
        && gameState[8] !== 0) {
        return gameState[0];
    }
    if (gameState[2] === gameState[4]
        && gameState[4] === gameState[6]
        && gameState[6] !== 0) {
        return gameState[2];
    }
}