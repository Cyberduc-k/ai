const grid = document.querySelector("#snake #table");
const button = document.querySelector("#snake button");
const message = document.querySelector("#message");
const message_wrapper = document.querySelector("#message-wrapper");

const table = [];

for (let i = 0; i < 50; i++) {
    const row = [];

    const row_ = document.createElement("div");
    row_.id = "row";

    for (let j = 0; j < 50; j++) {
        row.push({ body: false });
        const cel = document.createElement("div");
        cel.id = "cel";
        row_.appendChild(cel);
    }

    table.push(row);
    grid.appendChild(row_);
}

let alive = true;
let generating_addition = false;
let length = 3;
let head = [25, 25];
let tail = [27, 25];
let direction = 1;

table[25][25] = { body: true, direction };
table[26][25] = { body: true, direction };
table[27][25] = { body: true, direction };

function reset () {
    for (let i = 0; i < 50; i++) {
        const row = table[i];
    
        for (let j = 0; j < 50; j++) {
            row[j] = { body: false };
        }
    }

    Array.from(grid.children).forEach(row => {
        Array.from(row.children).forEach(cell => {
            cell.classList.remove("body");
            cell.classList.remove("addition");
        });
    });
    
    direction = 1;
    generating_addition = false;
    length = 3;
    head = [25, 25];
    tail = [27, 25];

    table[25][25] = { body: true, direction };
    table[26][25] = { body: true, direction };
    table[27][25] = { body: true, direction };

    setTimeout(() => {
        message.innerHTML = "";
        message_wrapper.classList.remove("active");
        alive = true;
    }, 5000);
}

document.addEventListener("keydown", e => {
    if (e.keyCode == 37 && direction != 0) direction = 2;
    else if (e.keyCode == 39 && direction != 2) direction = 0;
    else if (e.keyCode == 38 && direction != 3) direction = 1;
    else if (e.keyCode == 40 && direction != 1) direction = 3;
});

button.addEventListener("click", () => run());

function run () {
    check();

    if (alive) {
        move();
        draw();
        setTimeout(run, 100);

        if (!generating_addition) {
            generating_addition = true;
            setTimeout(() => addition(), 5000);
        }
    }
}

function move () {
    table[head[0]][head[1]].direction = direction;
    let addition_ = false;

    if (direction == 0) {
        if (table[head[0]][head[1] + 1].addition == true) addition_ = true;
        table[head[0]][head[1] + 1] = { body: true, direction };
        head[1]++;
    }
    else if (direction == 1) {
        if (table[head[0] - 1][head[1]].addition == true) addition_ = true;
        table[head[0] - 1][head[1]] = { body: true, direction };
        head[0]--;
    }
    else if (direction == 2) {
        if (table[head[0]][head[1] - 1].addition == true) addition_ = true;
        table[head[0]][head[1] - 1] = { body: true, direction };
        head[1]--;
    }
    else {
        if (table[head[0] + 1][head[1]].addition == true) addition_ = true;
        table[head[0] + 1][head[1]] = { body: true, direction };
        head[0]++;
    }

    if (!addition_) {
        const t = table[tail[0]][tail[1]].direction;
        table[tail[0]][tail[1]] = { body: false };
            
        if (t == 0) {
            tail[1]++;
        }
        else if (t == 1) {
            tail[0]--;
        }
        else if (t == 2) {
            tail[1]--;
        }
        else {
            tail[0]++;
        }
    }
    else {
        length++;
        grid.children[head[0]].children[head[1]].classList.remove("addition");
    }
}

function draw () {
    table.forEach((_, row) => {
        table[row].forEach((_, col) => {
            const cel = grid.children[row].children[col];

            if (table[row][col].body == true) cel.classList.add("body");
            else cel.classList.remove("body");
        });
    });
}

function addition () {
    if (generating_addition) {
        generating_addition = false;

        const row = Math.floor(Math.random() * 49);
        const col = Math.floor(Math.random() * 49);

        grid.children[row].children[col].classList.add("addition");
        table[row][col].addition = true;
    }
}

function check () {
    let lose = false;

    if (direction == 0) {
        if (head[1] == 49) lose = true;
        else lose = table[head[0]][head[1] + 1].body == true;
    }
    else if (direction == 1) {
        if (head[0] == 0) lose = true;
        else lose = table[head[0] - 1][head[1]].body == true;
    }
    else if (direction == 2) {
        if (head[1] == 0) lose = true;
        else lose = table[head[0]][head[1] - 1].body == true;
    }
    else {
        if (head[0] == 49) lose = true;
        else lose = table[head[0] + 1][head[1]].body == true;
    }

    if (lose) {
        alive = false;
        message.innerHTML = `You Lose!<br>Score: ${5 * (length - 3)}`;
        message_wrapper.classList.add("active");
        reset();
    }
}