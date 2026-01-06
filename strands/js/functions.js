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
    // const groupId = 2; // Debugging specific level if needed
    
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
    // Store data globally for spangram check
    window.currentLevelData = data; 

    document.getElementById('theme-text').innerText = data.theme;
    
    // --- Dynamic layout generation ---
    // If we have a list of words (or can infer from solutions),
    // generate a fresh scrambled grid and solution indices each load.
    let wordsList = null;
    if (Array.isArray(data.words) && data.words.length > 0) {
        wordsList = data.words.slice();
    } else if (data.solutions) {
        wordsList = Object.keys(data.solutions);
    }

    if (wordsList && wordsList.length > 0) {
        const generated = generateGridFromWords(wordsList);
        gridLetters = generated.grid;
        wordMap = generated.solutions;
    } else {
        // Fallback to static data if present
        gridLetters = data.grid || "";
        wordMap = data.solutions || {}; 
    }

    totalWords = Object.keys(wordMap).length;
    document.getElementById('count-total').innerText = totalWords;
    
    // Build Grid
    gridEl.innerHTML = '';
    for (let i = 0; i < gridLetters.length; i++) {
        const d = document.createElement('div');
        d.className = 'cell';
        d.innerText = gridLetters[i];
        d.dataset.idx = i;
        gridEl.appendChild(d);
    }

    // --- EVENT LISTENERS (The Fix) ---
    // We attach listeners to the Grid Container, not individual cells
    // This allows us to track the drag continuously.
    
    // Mouse/Touch Down
    gridEl.addEventListener('pointerdown', startDrag);
    
    // Move (Attached to document to catch fast movements)
    document.addEventListener('pointermove', handleMove);
    
    // Up (Attached to document)
    document.addEventListener('pointerup', endDrag);

    // Prevent scrolling on mobile while dragging
    document.body.addEventListener('touchmove', (e) => {
        if(isDragging) e.preventDefault();
    }, { passive: false });
}

// Generate a full-board, fully-connectable layout from a list of words.
// Tries to place each word as an adjacent path using all 48 cells.
function generateGridFromWords(words) {
    const targetCells = COLS * ROWS;
    const totalLetters = words.reduce((sum, w) => sum + w.length, 0);

    // If lengths don't match the board, just fall back to simple row-wise layout.
    if (totalLetters !== targetCells) {
        return simpleRowLayout(words, targetCells);
    }

    // Try multiple times to find a non-overlapping placement for all words.
    for (let attempt = 0; attempt < 40; attempt++) {
        const used = new Set();
        const tempSolutions = {};
        const gridArr = new Array(targetCells);

        const shuffledWords = shuffleArray(words.slice());
        let ok = true;

        for (const word of shuffledWords) {
            const path = findPathForWord(word.length, used);
            if (!path) { ok = false; break; }

            // Randomly flip direction so some words read backwards.
            const finalPath = Math.random() < 0.5 ? path.slice().reverse() : path;
            tempSolutions[word] = finalPath;

            for (let i = 0; i < finalPath.length; i++) {
                const idx = finalPath[i];
                used.add(idx);
                gridArr[idx] = word[i];
            }
        }

        if (ok) {
            // Return solutions in original word order for nicer display.
            const orderedSolutions = {};
            words.forEach(w => { orderedSolutions[w] = tempSolutions[w]; });
            return { grid: gridArr.join(''), solutions: orderedSolutions };
        }
    }

    // Fallback if we couldn't find a perfect placement.
    return simpleRowLayout(words, targetCells);
}

function simpleRowLayout(words, targetCells) {
    let grid = "";
    const solutions = {};
    let idx = 0;
    for (const word of words) {
        const indices = [];
        for (const ch of word) {
            if (idx >= targetCells) break;
            grid += ch;
            indices.push(idx++);
        }
        solutions[word] = indices;
    }
    while (grid.length < targetCells) grid += 'X';
    return { grid, solutions };
}

// 3. Interaction Logic

function startDrag(e) {
    // Find if we clicked a cell
    const cell = e.target.closest('.cell');
    if (!cell || foundWords.size === totalWords) return;

    isDragging = true;
    
    const idx = parseInt(cell.dataset.idx);
    
    // Initialize path with first cell
    // Only if it's not already part of a found word
    if (!isCellFound(idx)) {
        currentPath = [idx];
        updateVisuals();
    }
}

function handleMove(e) {
    if (!isDragging) return;

    // HIT TEST: Check what is under the cursor/finger
    const target = document.elementFromPoint(e.clientX, e.clientY);
    
    if (!target) return;
    
    const cell = target.closest('.cell');
    if (!cell) return;

    const idx = parseInt(cell.dataset.idx);
    const lastIdx = currentPath[currentPath.length - 1];

    if (lastIdx === undefined) return; // Should not happen if startDrag worked

    // Logic 1: If we moved back to the previous cell, BACKTRACK (Deselect last)
    if (currentPath.length > 1 && idx === currentPath[currentPath.length - 2]) {
        currentPath.pop();
        updateVisuals();
        return;
    }

    // Logic 2: Add new cell if Valid
    // Valid = Adjacent AND Not in path AND Not found
    if (idx !== lastIdx && !currentPath.includes(idx) && isAdjacent(lastIdx, idx) && !isCellFound(idx)) {
        currentPath.push(idx);
        updateVisuals();
    }
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    
    // Validate Word
    const formedWord = currentPath.map(i => gridLetters[i]).join("");
    const reversedWord = formedWord.split('').reverse().join('');
    
    let matchedWord = null;
    
    if (wordMap[formedWord]) matchedWord = formedWord;
    else if (wordMap[reversedWord]) matchedWord = reversedWord;
    
    if (matchedWord && !foundWords.has(matchedWord)) {
        foundWords.add(matchedWord);
        finalizeWord(matchedWord);
    } else {
        // Invalid word logic (could add shake animation here)
        console.log("Invalid word:", formedWord);
    }

    // Reset Selection
    currentPath = [];
    updateVisuals();
}

// --- HELPERS ---

function isAdjacent(i1, i2) {
    const r1 = Math.floor(i1 / COLS);
    const c1 = i1 % COLS;
    const r2 = Math.floor(i2 / COLS);
    const c2 = i2 % COLS;
    
    const rowDiff = Math.abs(r1 - r2);
    const colDiff = Math.abs(c1 - c2);
    
    // Must be within 1 step in any direction, but not the same cell
    return (rowDiff <= 1 && colDiff <= 1);
}

function getNeighbors(idx) {
    const neighbors = [];
    const r = Math.floor(idx / COLS);
    const c = idx % COLS;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                neighbors.push(nr * COLS + nc);
            }
        }
    }
    return neighbors;
}

function isCellFound(idx) {
    for (let w of foundWords) {
        if (wordMap[w].includes(idx)) return true;
    }
    return false;
}

// 4. Visuals
function updateVisuals() {
    // Update Cell Highlights
    document.querySelectorAll('.cell').forEach(c => {
        const idx = parseInt(c.dataset.idx);
        if (currentPath.includes(idx)) c.classList.add('selected');
        else c.classList.remove('selected');
    });

    // Draw Line
    if (currentPath.length < 2) {
        polyline.setAttribute('points', '');
        return;
    }

    const points = currentPath.map(idx => getCenterCoord(idx)).join(" ");
    polyline.setAttribute('points', points);
}

function getCenterCoord(idx) {
    const cell = document.querySelector(`.cell[data-idx="${idx}"]`);
    if (!cell) return "0,0";
    
    const rect = cell.getBoundingClientRect();
    const containerRect = document.getElementById('game-container').getBoundingClientRect();
    
    const x = rect.left + rect.width / 2 - containerRect.left;
    const y = rect.top + rect.height / 2 - containerRect.top;
    
    return `${x},${y}`;
}

// Depth‑first search for an unused adjacent path of given length
function findPathForWord(length, used) {
    const allIndices = [];
    for (let i = 0; i < COLS * ROWS; i++) {
        if (!used.has(i)) allIndices.push(i);
    }
    const starts = shuffleArray(allIndices);

    for (const start of starts) {
        const path = [start];
        const visited = new Set([start]);

        if (dfsExtend(path, visited, length, used)) {
            return path;
        }
    }
    return null;
}

function dfsExtend(path, visited, targetLen, used) {
    if (path.length === targetLen) return true;
    const last = path[path.length - 1];
    let neighbors = getNeighbors(last).filter(n => !used.has(n) && !visited.has(n));
    neighbors = shuffleArray(neighbors);

    for (const n of neighbors) {
        visited.add(n);
        path.push(n);
        if (dfsExtend(path, visited, targetLen, used)) return true;
        path.pop();
        visited.delete(n);
    }
    return false;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function finalizeWord(word) {
    const indices = wordMap[word];
    const isSpangram = (word === window.currentLevelData.spangram);
    
    const color = isSpangram ? '#fcf4db' : '#cce5ff'; // Yellow vs Blue bg
    const strokeColor = isSpangram ? '#b59f3b' : '#1c3a5e'; // Darker line

    // 1. Color Cells
    indices.forEach(idx => {
        const c = document.querySelector(`.cell[data-idx="${idx}"]`);
        c.classList.remove('selected');
        c.classList.add(isSpangram ? 'found-spangram' : 'found-word');
    });

    // 2. Add Permanent SVG Line
    // We sort indices based on the path they connect. 
    // NOTE: The JSON "indices" might be out of order if not careful, 
    // but in my provided JSONs they are strictly ordered.
    // If you dragged backwards, we might need to rely on `currentPath` if it matches, 
    // but relying on data is safer for reload.
    
    // Use `currentPath` if it matches the length, otherwise use data (fallback)
    const pointsArray = (currentPath.length === indices.length) ? currentPath : indices;
    
    const points = pointsArray.map(idx => getCenterCoord(idx)).join(" ");
    
    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    newLine.setAttribute('points', points);
    newLine.setAttribute('class', 'connector-line');
    newLine.style.stroke = strokeColor;
    newLine.style.opacity = 0.4;
    newLine.style.strokeWidth = "12";
    
    foundLinesGroup.appendChild(newLine);

    // Update Stats
    document.getElementById('count-found').innerText = foundWords.size;
    if (isSpangram) {
        document.getElementById('span-status').innerText = "FOUND!";
        document.getElementById('span-status').style.color = "#b59f3b";
        document.getElementById('span-status').style.fontWeight = "bold";
    }

    checkWin();
}

function checkWin() {
    if (foundWords.size === totalWords) {
        setTimeout(() => {
            let html = "";
            const spangram = window.currentLevelData.spangram;
            
            // Show Spangram First
            if(foundWords.has(spangram)) {
                html += `<div style="color:#b59f3b; font-weight:bold; font-size:1.4rem; margin-bottom:10px;">${spangram} (Spangram)</div>`;
            }
            
            foundWords.forEach(w => {
                if(w !== spangram) html += `<div>${w}</div>`;
            });
            
            document.getElementById('word-list').innerHTML = html;
            document.getElementById('modal').style.display = 'flex';
        }, 800);
    }
}

function hint() {
    const all = Object.keys(wordMap);
    const missing = all.find(w => !foundWords.has(w));
    if (missing) {
        const idx = wordMap[missing][0];
        const c = document.querySelector(`.cell[data-idx="${idx}"]`);
        c.style.transition = "background 0.5s";
        c.style.backgroundColor = "pink";
        setTimeout(() => c.style.backgroundColor = "", 1000);
    }
}

// Start
initGame();