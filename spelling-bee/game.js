// Game state
let currentWord = '';
let foundWords = [];
let score = 0;
let currentRank = 'Beginner';

// Rank thresholds (percentage of max score)
const ranks = [
    { name: 'Beginner', threshold: 0 },
    { name: 'Good', threshold: 0.15 },
    { name: 'Great', threshold: 0.35 },
    { name: 'Amazing', threshold: 0.55 },
    { name: 'Genius', threshold: 0.75 }
];

// Wait for puzzle to load
let initAttempts = 0;
function waitForPuzzle() {
    if (currentPuzzle && currentPuzzle.validWords.length > 0) {
        initGame();
    } else if (initAttempts < 50) {
        initAttempts++;
        setTimeout(waitForPuzzle, 100);
    } else {
        document.getElementById('message').textContent = 'Error loading puzzle. Please refresh.';
    }
}

// Initialize game
function initGame() {
    if (!currentPuzzle) {
        currentPuzzle = getRandomPuzzle();
    }
    
    currentWord = '';
    foundWords = [];
    score = 0;
    
    renderHoneycomb();
    updateDisplay();
    updateStats();
    
    console.log(`Puzzle loaded: ${currentPuzzle.validWords.length} valid words`);
    console.log(`Pangrams: ${currentPuzzle.pangrams.length}`);
}

// Render honeycomb
function renderHoneycomb() {
    const svg = document.getElementById('honeycomb');
    svg.innerHTML = '';
    
    const hexSize = 40;
    const hexPositions = [
        { x: 150, y: 175, type: 'center' }, // Center
        { x: 150, y: 95, type: 'outer' },   // Top
        { x: 220, y: 135, type: 'outer' },  // Top-right
        { x: 220, y: 215, type: 'outer' },  // Bottom-right
        { x: 150, y: 255, type: 'outer' },  // Bottom
        { x: 80, y: 215, type: 'outer' },   // Bottom-left
        { x: 80, y: 135, type: 'outer' }    // Top-left
    ];
    
    // Shuffle outer letters
    const outerLetters = [...currentPuzzle.outer].sort(() => Math.random() - 0.5);
    
    hexPositions.forEach((pos, index) => {
        const letter = pos.type === 'center' ? currentPuzzle.center : outerLetters.shift();
        
        const hexGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        hexGroup.classList.add('hex', pos.type);
        hexGroup.dataset.letter = letter;
        
        // Hexagon polygon
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = pos.x + hexSize * Math.cos(angle);
            const y = pos.y + hexSize * Math.sin(angle);
            points.push(`${x},${y}`);
        }
        
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.join(' '));
        
        // Letter text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', pos.x);
        text.setAttribute('y', pos.y);
        text.textContent = letter;
        
        hexGroup.appendChild(polygon);
        hexGroup.appendChild(text);
        svg.appendChild(hexGroup);
        
        // Click handler
        hexGroup.addEventListener('click', () => addLetter(letter, pos.type === 'center'));
    });
}

// Add letter to current word
function addLetter(letter, isCenter) {
    currentWord += letter;
    updateDisplay();
    
    // Visual feedback
    const display = document.getElementById('input-display');
    display.classList.add('pulse');
    setTimeout(() => display.classList.remove('pulse'), 300);
}

// Update input display
function updateDisplay() {
    const display = document.getElementById('input-display');
    
    if (currentWord.length === 0) {
        display.textContent = '';
        return;
    }
    
    // Highlight center letters
    display.innerHTML = currentWord.split('').map(letter => {
        if (letter === currentPuzzle.center) {
            return `<span class="center-letter">${letter}</span>`;
        }
        return letter;
    }).join('');
}

// Delete last letter
function deleteLetter() {
    if (currentWord.length > 0) {
        currentWord = currentWord.slice(0, -1);
        updateDisplay();
    }
}

// Shuffle outer letters
function shuffleLetters() {
    renderHoneycomb();
    
    // Visual feedback
    const honeycomb = document.getElementById('honeycomb');
    honeycomb.style.transform = 'rotate(360deg)';
    honeycomb.style.transition = 'transform 0.5s';
    setTimeout(() => {
        honeycomb.style.transform = '';
        honeycomb.style.transition = '';
    }, 500);
}

// Submit word
function submitWord() {
    const message = document.getElementById('message');
    message.className = 'message';
    
    // Validation checks
    if (currentWord.length < 4) {
        showMessage('Too short! Words must be at least 4 letters.', 'error');
        shakeDisplay();
        return;
    }
    
    if (!currentWord.includes(currentPuzzle.center)) {
        showMessage('Must use the center letter!', 'error');
        shakeDisplay();
        return;
    }
    
    if (foundWords.includes(currentWord)) {
        showMessage('Already found!', 'error');
        shakeDisplay();
        return;
    }
    
    if (!currentPuzzle.validWords.includes(currentWord)) {
        showMessage('Not in word list', 'error');
        shakeDisplay();
        return;
    }
    
    // Valid word!
    foundWords.push(currentWord);
    
    // Calculate points
    let points = currentWord.length === 4 ? 1 : currentWord.length;
    const isPangram = currentPuzzle.pangrams.includes(currentWord);
    
    if (isPangram) {
        points += 7;
        showMessage('🎉 PANGRAM! +' + points + ' points!', 'special');
    } else {
        showMessage('Great! +' + points + ' points', 'success');
    }
    
    score += points;
    currentWord = '';
    
    updateDisplay();
    updateStats();
    updateFoundWords();
}

// Show message
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    
    setTimeout(() => {
        message.textContent = '';
        message.className = 'message';
    }, 2000);
}

// Shake animation
function shakeDisplay() {
    const display = document.getElementById('input-display');
    display.classList.add('shake');
    setTimeout(() => display.classList.remove('shake'), 300);
}

// Update stats
function updateStats() {
    document.getElementById('words-found').textContent = foundWords.length;
    document.getElementById('score').textContent = score;
    
    // Update rank
    const percentage = score / currentPuzzle.maxScore;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (percentage >= ranks[i].threshold) {
            currentRank = ranks[i].name;
            break;
        }
    }
    
    document.getElementById('rank').textContent = currentRank;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = (percentage * 100) + '%';
}

// Update found words list
function updateFoundWords() {
    const list = document.getElementById('found-words');
    list.innerHTML = '';
    
    foundWords.sort().forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-item';
        if (currentPuzzle.pangrams.includes(word)) {
            wordDiv.classList.add('pangram');
        }
        wordDiv.textContent = word;
        list.appendChild(wordDiv);
    });
    
    document.getElementById('found-count').textContent = foundWords.length;
}

// Toggle found words visibility
document.getElementById('toggle-words').addEventListener('click', () => {
    const list = document.getElementById('found-words');
    const isVisible = list.style.display !== 'none';
    list.style.display = isVisible ? 'none' : 'block';
    document.getElementById('toggle-words').textContent = 
        (isVisible ? 'Show' : 'Hide') + ` Found Words (${foundWords.length})`;
});

// Button event listeners
document.getElementById('delete-btn').addEventListener('click', deleteLetter);
document.getElementById('shuffle-btn').addEventListener('click', shuffleLetters);
document.getElementById('submit-btn').addEventListener('click', submitWord);

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        submitWord();
    } else if (key === 'BACKSPACE') {
        e.preventDefault();
        deleteLetter();
    } else if (currentPuzzle.allLetters.includes(key)) {
        addLetter(key, key === currentPuzzle.center);
    }
});

// Start game when puzzle is ready
waitForPuzzle();