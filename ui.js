document.addEventListener("DOMContentLoaded", () => {
    const lines = document.querySelectorAll('.term-line');
    const prompt = document.querySelector('.term-prompt');
    const terminal = document.getElementById('terminal-screen');
    lines.forEach(l => l.style.display = 'none');
    prompt.style.display = 'none';
    const cursorEl = document.createElement('span');
    cursorEl.className = 'cursor';
    const initLine = document.createElement('div');
    initLine.className = 'term-line';
    initLine.appendChild(cursorEl);
    terminal.insertBefore(initLine, terminal.firstChild);
    let currentLine = 0;
    function showNextLine() {
        if (currentLine === 0 && initLine.parentNode) {
            initLine.remove(); 
        }
        if (currentLine < lines.length) {
            lines[currentLine].style.display = 'block';
            lines[currentLine].appendChild(cursorEl);
            currentLine++;
            let nextDelay = Math.floor(Math.random() * 1200) + 300;
            setTimeout(showNextLine, nextDelay);
        } else {
            prompt.style.display = 'flex';
            prompt.appendChild(cursorEl); 
        }
    }
    setTimeout(showNextLine, 1500);
    const activeLeds = document.querySelectorAll('.cyber-btn:not(.distrokid-placeholder) .led.act');
    function flickerLED(led) {
        if (Math.random() > 0.4) {
            led.classList.add('on');
        } else {
            led.classList.remove('on');
        }
        let pause = Math.random();
        let nextTime = pause < 0.1 ? Math.random() * 1000 : Math.random() * 150;
        setTimeout(() => flickerLED(led), nextTime);
    }
    activeLeds.forEach(led => flickerLED(led));
});