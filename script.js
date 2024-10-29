const canvas = document.getElementById('canvas');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEL = document.getElementById('size');
const colorEl = document.getElementById('color');
const clearEl = document.getElementById('clear');

const ctx = canvas.getContext('2d');

let size = 10
let isPressed = false
colorEl.value = 'black'
let color = colorEl.value
let x
let y

canvas.addEventListener('mousedown', (e) => {
    isPressed = true

    x = e.offsetX
    y = e.offsetY
})

document.addEventListener('mouseup', (e) => {
    isPressed = false

    x = undefined
    y = undefined
})

canvas.addEventListener('mousemove', (e) => {
    if(isPressed) {
        const x2 = e.offsetX
        const y2 = e.offsetY

        drawCircle(x2, y2)
        drawLine(x, y, x2, y2)

        x = x2
        y = y2
    }
})

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.lineWidth = size * 2
    ctx.stroke()
}

function updateSizeOnScreen() {
    sizeEL.innerText = size
}

increaseBtn.addEventListener('click', () => {
    size += 3

    if(size > 50) {
        size = 50
    }

    updateSizeOnScreen()
})

decreaseBtn.addEventListener('click', () => {
    size -= 3

    if(size < 5) {
        size = 5
    }

    updateSizeOnScreen()
})

colorEl.addEventListener('change', (e) => color = e.target.value)

clearEl.addEventListener('click', () => ctx.clearRect(0,0, canvas.width, canvas.height))

let undoStack = [];

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;
    // Save the current canvas state to the undo stack
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 10) {
        undoStack.shift();  // Limit undo history to 10 actions
    }
    x = e.offsetX;
    y = e.offsetY;
});

document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0) {
        let previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
    }
});

let isEraser = false;

document.getElementById('eraser').addEventListener('click', () => {
    isEraser = !isEraser;
    if (isEraser) {
        color = '#f5f5f5';  // Set color to match the background
    } else {
        color = colorEl.value;  // Revert to selected color
    }
});

document.getElementById('download').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

document.getElementById('background').addEventListener('input', (e) => {
    const bgColor = e.target.value;
    canvas.style.backgroundColor = bgColor;
});
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Variables for tracking the drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = 5; // Size of the brush
let brushColor = '#000000'; // Color of the brush

// Function to start drawing
function startDrawing(x, y) {
    isDrawing = true;
    [lastX, lastY] = [x, y];
}

// Function to draw
function draw(x, y) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

// Function to stop drawing
function stopDrawing() {
    isDrawing = false;
}


// Event listeners for touch
canvas.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
});

canvas.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault(); // Prevent scrolling while drawing
});

canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// Example function to change brush size and color
function changeBrush(size, color) {
    brushSize = size;
    brushColor = color;
}
