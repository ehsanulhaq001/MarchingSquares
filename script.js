let cnv;
let ctx;
let rows;
let cols;
let field = new Array();
let noise;
let z;
let rez = getRez() / 2;
let noiseSpread = 0.1;

window.onload = function() {
    setup();
    window.requestAnimationFrame(draw);
};

function setup() {
    cnv = document.querySelector("#cnv");
    ctx = cnv.getContext("2d");
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
    cnv.style.backgroundColor = "black";
    rows = (cnv.height - (cnv.height % 10)) / rez;
    cols = (cnv.width - (cnv.width % 10)) / rez;
    noise = new OpenSimplexNoise(Date.now());
    z = 0;
}

function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);

    let x = 0;
    for (let i = 0; i < rows; i++) {
        x += noiseSpread;
        let y = 0;
        for (let j = 0; j < cols; j++) {
            y += noiseSpread;

            field[cols * i + j] = noise.noise3D(x, y, z);
            drawSquare(i, j);

            field[cols * i + j] = Math.ceil(field[cols * i + j]);
            drawBorder(i, j);
        }
    }
    z += 0.02;
    requestAnimationFrame(draw);
}

function drawSquare(i, j) {
    let color = 255 * Math.abs(field[cols * i + j]);
    ctx.beginPath();
    ctx.rect(rez * j, rez * i, (rez * 2) / 3, (rez * 2) / 3);
    ctx.fillStyle = "rgb(" + 0 + ", " + color + ", " + 0 + ")";
    ctx.fill();
}

function getRez() {
    if (window.innerWidth > window.innerHeight) {
        max = window.innerWidth;
    } else {
        max = window.innerHeight;
    }
    return Math.floor(max / 40);
}

function drawBorder(i, j) {
    let a = { x: rez * (j + 0.5), y: rez * i };
    let b = { x: rez * (j + 1), y: rez * (i + 0.5) };
    let c = { x: rez * (j + 0.5), y: rez * (i + 1) };
    let d = { x: rez * j, y: rez * (i + 0.5) };

    ctx.strokeStyle = "lime";
    switch (getState(i, j)) {
        case 1:
            drawLine(c, d);
            break;
        case 2:
            drawLine(b, c);
            break;
        case 3:
            drawLine(b, d);
            break;
        case 4:
            drawLine(a, b);
            break;
        case 5:
            drawLine(a, d);
            drawLine(b, c);
            break;
        case 6:
            drawLine(a, c);
            break;
        case 7:
            drawLine(a, d);
            break;
        case 8:
            drawLine(a, d);
            break;
        case 9:
            drawLine(a, c);
            break;
        case 10:
            drawLine(a, b);
            drawLine(c, d);
            break;
        case 11:
            drawLine(a, b);
            break;
        case 12:
            drawLine(b, d);
            break;
        case 13:
            drawLine(b, c);
            break;
        case 14:
            drawLine(c, d);
            break;
        default:
            break;
    }
}

function getState(i, j) {
    a = field[cols * i + j];
    b = field[cols * i + j + 1];
    c = field[cols * (i + 1) + j + 1];
    d = field[cols * (i + 1) + j];
    return a * 8 + b * 4 + c * 2 + d * 1;
}

function drawLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}