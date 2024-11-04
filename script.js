let display = document.getElementById('display');
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

function appendNumber(num) {
    display.value += num;
}

function appendOperator(op) {
    display.value += op;
}

function calculate() {
    try {
        let result = math.evaluate(display.value);
        if (Math.abs(result) > 1e10) {
            result = result.toExponential(5);
        } else {
            result = parseFloat(result.toFixed(8));
        }
        display.value = result;
    } catch (error) {
        display.value = 'Erro';
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
}

function drawAxes() {
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
}

function plotFunction() {
    const functionString = document.getElementById('function-input').value;
    try {
        const f = math.compile(functionString);
        clearCanvas();

        ctx.beginPath();
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 2;

        const scale = 20;
        let lastY;

        for (let i = -10; i <= 10; i += 0.1) {
            const x = i;
            let y;
            try {
                y = f.evaluate({ x: x });
                if (!isFinite(y)) continue;
                if (y > 10) y = 10;
                if (y < -10) y = -10;

                const canvasX = (x + 10) * (canvas.width / scale);
                const canvasY = canvas.height - ((y + 10) * (canvas.height / scale));

                if (i === -10 || !isFinite(lastY)) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
                lastY = y;
            } catch (error) {
                continue;
            }
        }
        ctx.stroke();
    } catch (error) {
        alert('Função inválida. Tente novamente.');
    }
}

// Initialize
drawAxes();
