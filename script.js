// Canvas and context setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Selectors for controls
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const sizeEl = document.getElementById('size');
const colorEl = document.getElementById('color');
const backgroundEl = document.getElementById('background');
const undoBtn = document.getElementById('undo');
const eraserBtn = document.getElementById('eraser');
const pencilBtn = document.getElementById('pencil');
const downloadBtn = document.getElementById('download');
const clearBtn = document.getElementById('clear');

// Drawing variables
let size = 10;
let color = colorEl.value;
let isDrawing = false;
let x, y;
let undoStack = [];
let isEraser = false;
let isPencil = true;

// Update the displayed brush size
function updateSizeOnScreen() {
    sizeEl.innerText = size;
}

// Save canvas state for undo functionality
function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 10) undoStack.shift(); // Limit to 10 states
}

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
    saveState();
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const x2 = e.offsetX;
    const y2 = e.offsetY;
    draw(x2, y2);
    x = x2;
    y = y2;
});

canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();  // Prevent default touch behavior
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    isDrawing = true;
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
    saveState();
});

canvas.addEventListener('touchmove', (e) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
    e.preventDefault();  // Prevent scrolling or zooming during drawing
});

canvas.addEventListener('touchend', () => (isDrawing = false));
canvas.addEventListener('touchcancel', () => (isDrawing = false));

// Drawing function
function draw(x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isEraser ? getCurrentBackgroundColor() : color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
}

// Increase and decrease brush size
increaseBtn.addEventListener('click', () => {
    size = Math.min(size + 2, 50); // Limit max size to 50
    updateSizeOnScreen();
});

decreaseBtn.addEventListener('click', () => {
    size = Math.max(size - 2, 5); // Limit min size to 5
    updateSizeOnScreen();
});

// Change brush color
colorEl.addEventListener('input', (e) => {
    color = e.target.value;
    isEraser = false; // Switch to brush if color is changed
});

// Change background color
backgroundEl.addEventListener('input', (e) => {
    canvas.style.backgroundColor = e.target.value;
});

// Get current background color (for eraser tool)
function getCurrentBackgroundColor() {
    return window.getComputedStyle(canvas).backgroundColor || '#ffffff'; // Default white if no color is set
}

// Undo functionality
undoBtn.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const previousState = undoStack.pop();
        ctx.putImageData(previousState, 0, 0);
    }
});

// Eraser functionality
eraserBtn.addEventListener('click', () => {
    isEraser = true;
    isPencil = false;
});

// Pencil functionality
pencilBtn.addEventListener('click', () => {
    isEraser = false;
    isPencil = true;
    color = colorEl.value; // Revert to selected color
});

// Download canvas as image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Clear canvas
clearBtn.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

// Resize canvas to fit mobile screens
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.9;  // 90% of the screen width
    canvas.height = window.innerHeight * 0.6; // 60% of the screen height
});
