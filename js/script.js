// document.getElementById('b1').innerHTML = 'Hide';
let player = 1;
function turn(btnId) {
    if (player == 1) {
        player++;
        cross(btnId);
    } else if (player == 2) {
        player--;
        circle(btnId);
    }
}

function cross(btnId) {
    document.getElementById(btnId).firstElementChild.textContent = "X";
}

function circle(btnId) {
    document.getElementById(btnId).firstElementChild.textContent = 'O';
}