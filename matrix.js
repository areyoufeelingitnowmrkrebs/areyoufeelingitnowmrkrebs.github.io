const settings = {
    colorSpeed: 0.5,
    minSpeed: 0.5,
    maxSpeed: 2.0,
    decayRate: 0.05
};
const c = document.getElementById("c");
const ctx = c.getContext("2d");
let hue = 0;
const fontSize = 14;
let columns = 0;
let rows = 0;
let drops = [];
let speeds = [];
let accumulators = [];
let grid = [];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&()=+[]{}/<>?ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶヷヸヹヺーヽヾヿㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ";
const characters = alphabet.split("");
const getSpeed = () => {
    if (Math.random() < 0.10) {
        return 2.0;
    }
    return Math.random() * (1.2 - 0.6) + 0.5;
};
const init = () => {
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    columns = Math.ceil(c.width / fontSize);
    rows = Math.ceil(c.height / fontSize);
    drops = [];
    speeds = [];
    accumulators = [];
    grid = new Array(columns);
    for (let x = 0; x < columns; x++) {
        grid[x] = new Array(rows);
        for (let y = 0; y < rows; y++) {
            grid[x][y] = { char: '', alpha: 0, hue: 0 };
        }
        drops[x] = Math.floor(Math.random() * -rows);
        speeds[x] = getSpeed();
        accumulators[x] = 0;
    }
};
let lastTime = 0;
const frameDelay = 70;
function draw(currentTime) {
    requestAnimationFrame(draw);
    if (currentTime - lastTime < frameDelay) return;
    lastTime = currentTime;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = fontSize + "px 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'Source Code Pro', 'Menlo', 'Consolas', monospace";
    hue += 3;
    for (let i = 0; i < drops.length; i++) {
        accumulators[i] += speeds[i];
        while (accumulators[i] >= 1) {
            drops[i]++;
            let yIndex = drops[i];
            if (yIndex >= 0 && yIndex < rows) {
                grid[i][yIndex].char = characters[Math.floor(Math.random() * characters.length)];
                grid[i][yIndex].alpha = 1.0;
                grid[i][yIndex].hue = hue;
            }
            if (drops[i] > rows && Math.random() > 0.975) {
                drops[i] = -1;
                speeds[i] = getSpeed();
            }
            accumulators[i]--;
        }
    }
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            let cell = grid[x][y];
            if (cell.alpha > 0) {
                const r = Math.floor(127 * Math.sin(settings.colorSpeed * cell.hue + 0) + 128);
                const g = Math.floor(127 * Math.sin(settings.colorSpeed * cell.hue + 2) + 128);
                const b = Math.floor(127 * Math.sin(settings.colorSpeed * cell.hue + 4) + 128);
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${cell.alpha})`;
                ctx.fillText(cell.char, x * fontSize, y * fontSize);
                cell.alpha -= settings.decayRate;
                if (cell.alpha < 0) cell.alpha = 0;
            }
        }
    }
}
window.onresize = () => {
    init();
};
window.addEventListener('load', () => {
    init();
    requestAnimationFrame(draw);
});
