// Global State
let gridLetters = "";
let wordMap = {}; // Maps WORD -> [Indices]
let foundWords = new Set();
let currentPath = [];
let isDragging = false;
let totalWords = 0;

// Config
const COLS = 6;
const ROWS = 8;

// DOM Elements
const gridEl = document.getElementById('grid');
const polyline = document.getElementById('drag-polyline');
const foundLinesGroup = document.getElementById('found-lines');

// 1. Initialize Game
async function initGame() {
    // Randomly pick group 1-5
    const groupId = Math.floor(Math.random() * 5) + 1;
    console.log(`Loading Group ${groupId}`);

    try {
        const response = await fetch(`groups/group_${groupId}.txt`);
        if (!response.ok) throw new Error("Failed to load level");
        
        const data = await response.json();
        setupLevel(data);
    } catch (e) {
        console.error(e);
        document.getElementById('theme-text').innerText = "Error loading puzzle.";
    }
}

// 2. Setup Level Data
function setupLevel(data) {
    document.getElementById('theme-text').innerText = data.theme;
    gridLetters = data.grid;
    wordMap = data.solutions; // Object: "WORD": [indices]
    
    // Calculate total words
    totalWords = Object.keys(wordMap).length;
    document.getElementById('count-total').innerText = totalWords;
    
    // Build Grid
    gridEl.innerHTML = '';
    for (let i = 0; i < gridLetters.length; i++) {
        const d = document.createElement('div');
        d.className = 'cell';
        d.innerText = gridLetters[i];
        d.dataset.idx = i;
        
        // Touch/Mouse Events
        d.addEventListener('pointerdown', startDrag);
        d.addEventListener('pointerenter', enterCell);
        
        gridEl.appendChild(d);
    }

    // Global Pointer Up
    document.addEventListener('pointerup', endDrag);
    
    // Prevent scrolling on mobile while dragging
    document.body.addEventListener('touchmove', (e) => {
        if(isDragging) e.preventDefault();
    }, { passive: false });
}

// 3. Interaction Logic
function startDrag(e) {
    if (foundWords.size === totalWords) return;
    
    isDragging = true;
    gridEl.setPointerCapture(e.pointerId);
    
    const idx = parseInt(e.target.dataset.idx);
    
    // Reset path
    currentPath = [idx];
    updateVisuals();
}

function enterCell(e) {
    if (!isDragging) return;
    
    const idx = parseInt(e.target.dataset.idx);
    const lastIdx = currentPath[currentPath.length - 1];
    
    // If we moved to the previous cell, backtrack (remove last)
    if (currentPath.length > 1 && idx === currentPath[currentPath.length - 2]) {
        currentPath.pop();
        updateVisuals();
        return;
    }

    // Rules: Must be adjacent, not already in path (unless backtracking), not a found cell
    if (isAdjacent(lastIdx, idx) && !currentPath.includes(idx) && !isCellFound(idx)) {
        currentPath.push(idx);
        updateVisuals();
    }
}

// Helper: Check adjacency (including diagonals)
function isAdjacent(i1, i2) {
    const r1 = Math.floor(i1 / COLS);
    const c1 = i1 % COLS;
    const r2 = Math.floor(i2 / COLS);
    const c2 = i2 % COLS;
    return (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1);
}

function isCellFound(idx) {
    // Check if index is in any found word's array
    for (let w of foundWords) {
        if (wordMap[w].includes(idx)) return true;
    }
    return false;
}

// 4. Visuals (The "Connecting" Line)
function updateVisuals() {
    // 1. Highlight Cells
    document.querySelectorAll('.cell').forEach(c => {
        const idx = parseInt(c.dataset.idx);
        if (currentPath.includes(idx)) c.classList.add('selected');
        else c.classList.remove('selected');
    });

    // 2. Draw SVG Line
    if (currentPath.length < 2) {
        polyline.setAttribute('points', '');
        return;
    }

    const points = currentPath.map(idx => {
        return getCenterCoord(idx);
    }).join(" ");
    
    polyline.setAttribute('points', points);
}

function getCenterCoord(idx) {
    const cell = document.querySelector(`.cell[data-idx="${idx}"]`);
    const rect = cell.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    const x = rect.left + rect.width / 2 - containerRect.left;
    const y = rect.top + rect.height / 2 - containerRect.top;
    return `${x},${y}`;
}

// 5. End Drag & Validate
function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    
    // Construct word from indices
    const formedWord = currentPath.map(i => gridLetters[i]).join("");
    
    // Check forward and reverse
    let validKey = null;
    if (wordMap[formedWord]) validKey = formedWord;
    else if (wordMap[formedWord.split('').reverse().join('')]) validKey = formedWord.split('').reverse().join('');
    
    if (validKey && !foundWords.has(validKey)) {
        // Success!
        foundWords.add(validKey);
        finalizeWord(validKey);
    } else {
        // Shake animation could go here
    }

    // Clear Selection
    currentPath = [];
    updateVisuals(); // Clears grey line
}

function finalizeWord(word) {
    const indices = wordMap[word];
    const isSpangram = indices.length >= 7 && (indices[0] < 6 || indices[0] > 41) && (indices[indices.length-1] < 6 || indices[indices.length-1] > 41); 
    // ^ Simple heuristic, usually handled by manual flag in data, but we'll infer or just color by order.
    // Actually, let's just use a hardcoded check if it spans edges or simply check the data flag if we added one. 
    // For now, let's assume Spangram is the longest word or explicitly defined in data? 
    // We will infer Spangram based on the "spangram" key in data? No, data structure below uses generic key.
    // Let's assume the Spangram is the one that is YELLOW.
    
    // For the clone, we will check if it matches the "spangram" text in the JSON (if we add it).
    // Let's add a `spangram` string to the JSON to make this easy.
    
    const isSpan = (word === currentLevelData.spangram); 
    const color = isSpan ? '#fcf4db' : '#cce5ff';
    const stroke = isSpan ? '#b59f3b' : '#1c3a5e';

    // 1. Color Cells
    indices.forEach(idx => {
        const c = document.querySelector(`.cell[data-idx="${idx}"]`);
        c.classList.remove('selected');
        c.classList.add(isSpan ? 'found-spangram' : 'found-word');
    });

    // 2. Create Permanent Line
    const points = indices.map(idx => getCenterCoord(idx)).join(" ");
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    newLine.setAttribute('points', points);
    newLine.setAttribute('class', 'connector-line');
    newLine.style.stroke = color; // Background color for line (thick)
    newLine.style.opacity = 0.5;
    foundLinesGroup.appendChild(newLine);

    // Update Stats
    document.getElementById('count-found').innerText = foundWords.size;
    if (isSpan) document.getElementById('span-status').innerText = "FOUND!";

    checkWin();
}

function checkWin() {
    if (foundWords.size === totalWords) {
        setTimeout(() => {
            const list = Array.from(foundWords).join("<br>");
            document.getElementById('word-list').innerHTML = list;
            document.getElementById('modal').style.display = 'flex';
        }, 800);
    }
}

// Hint Function
function hint() {
    // Find a word not found
    const all = Object.keys(wordMap);
    const missing = all.find(w => !foundWords.has(w));
    if (missing) {
        const idx = wordMap[missing][0];
        const c = document.querySelector(`.cell[data-idx="${idx}"]`);
        c.style.backgroundColor = "pink";
        setTimeout(() => c.style.backgroundColor = "", 1000);
    }
}

// Store current level data globally so we can check spangram
let currentLevelData = null;
const originalSetup = setupLevel;
setupLevel = function(data) {
    currentLevelData = data;
    originalSetup(data);
}

// Boot
initGame();