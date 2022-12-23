let player = 1;
function turn() {
    if (player == 1) {
        player++;
        cross();
    } else if (player == 2) {
        player--;
        circle();
    }
}

function cross() {
    // document.getElementsByTagName('button').innerHTML = 'X';
}

function circle() {
    // document.getElementsByTagName('button').innerHTML = 'O';
}