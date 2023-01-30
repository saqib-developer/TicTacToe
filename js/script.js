let player = 1;
let canrun = true;
let placesLeft = 9;

function turn(btnId) {
    let possible = document.getElementById(btnId).hasAttribute('name');
    if (placesLeft !== 0) {
        if (!possible && canrun) {
            document.getElementById(btnId).setAttribute('name', 'checked');
            if (player == 1) {
                player++;
                document.getElementById(btnId).firstElementChild.textContent = 'X';
                document.getElementById(btnId).firstElementChild.setAttribute('class', 'cross');
            } else if (player == 2) {
                player--;
                document.getElementById(btnId).firstElementChild.textContent = 'O';
                document.getElementById(btnId).firstElementChild.setAttribute('class', 'circle');
            }
        }
    } else {
        draw();
    }
}

function end(row, column, id) {
    placesLeft--;
    let rowvalue = [];
    let colvalue = [];
    let dig1 = [];
    let t = 4;
    let dig2 = [];
    for (let i = 1; i <= 3; i++) {
        //13 22 31
        rowvalue += document.getElementById('r' + i + '-c' + column).firstElementChild.textContent;
        colvalue += document.getElementById('r' + row + '-c' + i).firstElementChild.textContent;
        dig1 += document.getElementById('r' + i + '-c' + i).firstElementChild.textContent;
        t -= 1;
        dig2 += document.getElementById('r' + i + '-c' + t).firstElementChild.textContent;
    }
    switch (rowvalue) {
        case 'XXX':
            won('X');
            break;
        case 'OOO':
            won('O');
            break;
    }
    switch (colvalue) {
        case 'XXX':
            won('X');
            break;
        case 'OOO':
            won('O');
            break;
    }
    switch (dig1) {
        case 'XXX':
            won('X');
            break;
        case 'OOO':
            won('O');
            break;
    }
    switch (dig2) {
        case 'XXX':
            won('X');
            break;
        case 'OOO':
            won('O');
            break;
    }
}

function won(winner) {
    document.getElementById('result').innerHTML = winner + ' Won the Match'
    console.log(winner + ' Won the Match');
    gameEnded();
}

function draw() {
    document.getElementById('result').innerHTML = 'Match was Drawn'
    console.log('Match was Drawn');
    gameEnded();
}

function gameEnded() {
    canrun = false;
    console.log('Game Ended');
}

function restart() {
    location.reload();
}