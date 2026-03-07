const settings = {
    minSpeed: 0.5,
    maxSpeed: 2.0,
    decayRate: 0.05
};

const c = document.getElementById("c");
const ctx = c.getContext("2d", { alpha: false });

let hue = 0;
const fontSize = 14;
let columns = 0;
let rows = 0;
let totalCells = 0;

let drops, speeds, accumulators;
let alphas, charIndices, targetHues, xPixels, yPixels;

let colorCache = new Array(7560);
let randomLUT = new Float32Array(10000);
let randomIdx = 0;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&()=+[]{}/<>?ЯИГДЖЗЙЛПФЦЧШЩЪЫЬЭЮァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺーヽヾヿㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ";
const characters = alphabet.split("");
let lastTime = Date.now();

function fastRandom() {
    randomIdx = (randomIdx + 1) % 10000;
    return randomLUT[randomIdx];
}

function getSpeed() {
    if (fastRandom() < 0.10) return 2.0;
    return fastRandom() * (1.2 - 0.6) + 0.5;
}

function initCache() {
    for(let h = 0; h < 360; h++) {
        for(let a = 0; a <= 20; a++) {
            colorCache[h * 21 + a] = `hsla(${h}, 100%, 50%, ${a / 20.0})`;
        }
    }
}

function initMatrix() {
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    if (c.width === 0 || c.height === 0) return;

    for(let i = 0; i < 10000; i++) {
        randomLUT[i] = Math.random();
    }
    randomIdx = 0;

    columns = Math.ceil(c.width / fontSize) | 0;
    rows = Math.ceil(c.height / fontSize) | 0;
    totalCells = columns * rows;

    drops = new Int32Array(columns);
    speeds = new Float32Array(columns);
    accumulators = new Float32Array(columns);

    alphas = new Float32Array(totalCells);
    charIndices = new Uint16Array(totalCells);
    targetHues = new Uint16Array(totalCells);
    xPixels = new Uint16Array(totalCells);
    yPixels = new Uint16Array(totalCells);

    for (let i = 0; i < totalCells; i++) {
        let x = i % columns;
        let y = (i / columns) | 0;

        alphas[i] = 0.0;
        charIndices[i] = 0;

        targetHues[i] = (x * 45 + y * 45) % 360;

        xPixels[i] = x * fontSize;
        yPixels[i] = y * fontSize;
    }

    for (let x = 0; x < columns; x++) {
        drops[x] = (fastRandom() * -rows) | 0;
        speeds[x] = getSpeed();
        accumulators[x] = 0.0;
    }
    lastTime = Date.now();
}

function draw() {
    let currentTime = Date.now();
    let dt = currentTime - lastTime;
    lastTime = currentTime;

    if (dt > 500) dt = 16;
    let timeScale = dt / 100.0;
    let decayStep = settings.decayRate * timeScale;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.font = fontSize + "px monospace";
    ctx.textBaseline = "top";

    hue = (hue + 3 * timeScale) % 360;
    let globalHueInt = hue | 0;
    let charLen = characters.length;

    for (let x = 0; x < columns; x++) {
        accumulators[x] += speeds[x] * timeScale;
        while (accumulators[x] >= 1.0) {
            drops[x]++;
            let yIndex = drops[x];

            if (yIndex >= 0 && yIndex < rows) {
                let cellIndex = yIndex * columns + x;
                charIndices[cellIndex] = (fastRandom() * charLen) | 0;
                alphas[cellIndex] = 1.0;
            }

            if (yIndex > rows && fastRandom() > 0.99) {
                drops[x] = -1;
                speeds[x] = getSpeed();
            }
            accumulators[x]--;
        }
    }

    let lastStyle = null;

    for (let i = 0; i < totalCells; i++) {
        let a = alphas[i];

        if (a > 0.01) {
            let currentHue = targetHues[i] + globalHueInt;
            if (currentHue >= 360) currentHue -= 360;

            let alphaIndex = (a * 20.0) | 0;
            if (alphaIndex > 20) alphaIndex = 20;

            let cacheIndex = currentHue * 21 + alphaIndex;
            let nextStyle = colorCache[cacheIndex];

            if (nextStyle !== lastStyle) {
                ctx.fillStyle = nextStyle;
                lastStyle = nextStyle;
            }

            ctx.fillText(characters[charIndices[i]], xPixels[i], yPixels[i]);

            alphas[i] = a - decayStep;
        } else if (a > 0.0) {
            alphas[i] = 0.0;
        }
    }

    requestAnimationFrame(draw);
}

window.addEventListener('resize', initMatrix);

initCache();
initMatrix();
draw();
