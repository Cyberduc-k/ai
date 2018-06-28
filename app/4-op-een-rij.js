const grid = document.querySelector("#vier-op-een-rij #table");
const message = document.querySelector("#message");
const message_wrapper = document.querySelector("#message-wrapper");

for (let i = 0; i < 8; i++) {
    const row = document.createElement("div");
    row.id = "row";

    for (let j = 0; j < 8; j++) {
        const cel = document.createElement("div");
        cel.id = "cell";
        cel.setAttribute("pos", `${i}.${j}`);
        row.appendChild(cel);
    }

    grid.appendChild(row);
}

const table = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
];

let current_player = 1;

grid.addEventListener("click", click);

function reset () {
    table.forEach((row, rowIndex) => row.forEach((cel, celIndex) => {
        table[rowIndex][celIndex] = 0;
        grid.querySelector(`[pos="${rowIndex}.${celIndex}"]`).innerHTML = "";
    }));

    setTimeout(() => {
        message.innerHTML = "";
        message_wrapper.classList.remove("active");
    }, 10000);
}

function click (e) {
    let cell = e.target;
    while (cell.id != "cell") cell = cell.parentElement;
    const pos = cell.getAttribute("pos");
    let [below, col] = pos.split('.');
    below = parseInt(below);
    col = parseInt(col);
    
    let row = below;
    while (row >= 0 && table[row][col] != 0) row--;
    if (row >= 0) {
        while (table[row + 1] && table[row + 1][col] == 0) row++;

        table[row][col] = current_player;
        if (current_player == 1) current_player = 2;
        else if (current_player == 2) current_player = 1;

        const newCell = grid.querySelector(`[pos="${row}.${col}"]`);
        newCell.innerHTML = current_player == 2 ?
            '<div class="center-vertical x">X</div>' :
            '<div class="center-vertical o">O</div>';
        requestAnimationFrame(() => requestAnimationFrame(() => check()));
    }
}

function check () {
    let count1 = 0;
    let count2 = 0;

    // horizontal
    outer: for (let ri in table) {
        const row = table[ri];

        for (let ci in row) {
            const col = row[ci];

            if (col == 1) count1++;
            else count1 = 0;

            if (col == 2) count2++;
            else count2 = 0;

            if (count1 == 4 || count2 == 4) break outer;
        }

        count1 = 0;
        count2 = 0;
    }

    if (count1 != 4 && count2 != 4) {

        // vertical
        outer: for (let i = 0; i < 8; i++) {
            for (let ri in table) {
                const row = table[ri];
        
                if (row[i] == 1) count1++;
                else count1 = 0;
        
                if (row[i] == 2) count2++;
                else count2 = 0;
        
                if (count1 == 4 || count2 == 4) break outer;
            }

            count1 = 0;
            count2 = 0;
        }

        if (count1 != 4 && count2 != 4) {

            function check_diagonal (line, col) {
               for (let i = 0; i < 8 - line; i++) {
                   const cel = table[line + i][col + i];

                   if (cel == 1) count1++;
                   else count1 = 0;

                   if (cel == 2) count2++;
                   else count2 = 0;

                   if (count1 == 4 || count2 == 4) return true;
               }

               return false;
            }

            if (!check_diagonal(4, 0)) {
            if (!check_diagonal(3, 0)) {
            if (!check_diagonal(2, 0)) {
            if (!check_diagonal(1, 0)) {
            if (!check_diagonal(0, 0)) {
            if (!check_diagonal(0, 1)) {
            if (!check_diagonal(0, 2)) {
            if (!check_diagonal(0, 3)) {
                 check_diagonal(0, 4);
            }}}}}}}}

            if (count1 != 4 && count2 != 4) {

                function check_diagonal2 (line, col) {
                    let i = line; j = 0;
                    for (; i >= 0 && j < 8; i--, j++) {
                        const cel = table[i][col + j];

                        if (cel == 1) count1++;
                        else count1 = 0;

                        if (cel == 2) count2++;
                        else count2 = 0;

                        if (count1 == 4 || count2 == 4) return true;
                    }
     
                    return false;
                }

                if (!check_diagonal2(3, 0)) {
                if (!check_diagonal2(4, 0)) {
                if (!check_diagonal2(5, 0)) {
                if (!check_diagonal2(6, 0)) {
                if (!check_diagonal2(7, 0)) {
                if (!check_diagonal2(7, 1)) {
                if (!check_diagonal2(7, 2)) {
                if (!check_diagonal2(7, 3)) {
                     check_diagonal2(7, 4);
                }}}}}}}}

            }

        }

    }

    if (count1 == 4) {
        message.innerHTML = "Player X wins!";
        message_wrapper.classList.add("active");
        reset();
    }
    else if (count2 == 4) {
        message.innerHTML = "Player O wins!";
        message_wrapper.classList.add("active");
        reset();
    }
}