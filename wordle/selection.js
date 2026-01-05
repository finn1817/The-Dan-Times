// Game state
let currentRow = 0;
let currentTile = 0;
let currentGuess = '';
let gameOver = false;
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Initialize game board
function initBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.setAttribute('data-row', i);
            tile.setAttribute('data-col', j);
            row.appendChild(tile);
        }
        
        board.appendChild(row);
    }
}

// Handle key press
function handleKeyPress(key) {
    if (gameOver) return;
    
    key = key.toUpperCase();
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        addLetter(key);
    }
}

// Add letter to current guess
function addLetter(letter) {
    if (currentGuess.length < WORD_LENGTH) {
        currentGuess += letter;
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = letter;
        tile.classList.add('filled');
        currentTile++;
    }
}

// Delete last letter
function deleteLetter() {
    if (currentGuess.length > 0) {
        currentTile--;
        currentGuess = currentGuess.slice(0, -1);
        const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

// Submit guess
function submitGuess() {
    if (currentGuess.length !== WORD_LENGTH) {
        showMessage('Not enough letters');
        return;
    }
    
    if (!isValidWord(currentGuess)) {
        showMessage('Not in word list');
        shakeTiles();
        return;
    }
    
    revealGuess();
}

// Reveal guess with color coding
function revealGuess() {
    const guess = currentGuess;
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');
    const result = Array(WORD_LENGTH).fill('absent');
    const usedTargetIndices = new Set();
    
    // First pass: mark correct letters
    guessLetters.forEach((letter, i) => {
        if (letter === targetLetters[i]) {
            result[i] = 'correct';
            usedTargetIndices.add(i);
        }
    });
    
    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
        if (result[i] === 'correct') return;
        
        for (let j = 0; j < targetLetters.length; j++) {
            if (!usedTargetIndices.has(j) && letter === targetLetters[j]) {
                result[i] = 'present';
                usedTargetIndices.add(j);
                break;
            }
        }
    });
    
    // Apply colors to tiles with animation delay
    guessLetters.forEach((letter, i) => {
        setTimeout(() => {
            const tile = document.querySelector(`.tile[data-row="${currentRow}"][data-col="${i}"]`);
            tile.classList.add(result[i]);
            updateKeyboard(letter, result[i]);
        }, i * 200);
    });
    
    // Check win/lose condition after animations
    setTimeout(() => {
        if (guess === targetWord) {
            gameOver = true;
            showMessage('Genius! 🎉');
            setTimeout(() => showEndModal(true), 1000);
        } else if (currentRow === MAX_GUESSES - 1) {
            gameOver = true;
            showMessage(`Game Over! The word was ${targetWord}`);
            setTimeout(() => showEndModal(false), 1000);
        } else {
            currentRow++;
            currentTile = 0;
            currentGuess = '';
        }
    }, WORD_LENGTH * 200 + 200);
}

// Update keyboard key colors
function updateKeyboard(letter, state) {
    const key = document.querySelector(`.key[data-key="${letter}"]`);
    if (!key) return;
    
    const currentState = key.classList.contains('correct') ? 'correct' :
                         key.classList.contains('present') ? 'present' :
                         key.classList.contains('absent') ? 'absent' : 'none';
    
    // Priority: correct > present > absent
    if (currentState === 'correct') return;
    if (currentState === 'present' && state === 'absent') return;
    
    key.classList.remove('correct', 'present', 'absent');
    key.classList.add(state);
}

// Show message
function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    setTimeout(() => {
        messageEl.textContent = '';
    }, 2000);
}

// Shake tiles animation
function shakeTiles() {
    const tiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
    tiles.forEach(tile => {
        tile.style.animation = 'shake 0.5s';
        setTimeout(() => {
            tile.style.animation = '';
        }, 500);
    });
}

// Show end game modal
function showEndModal(won) {
    const modal = document.getElementById('stats-modal');
    const title = document.getElementById('modal-title');
    const message = document.getElementById('modal-message');
    const correctWord = document.getElementById('correct-word');
    
    title.textContent = won ? '🎉 Congratulations!' : '😔 Game Over';
    message.textContent = won ? `You guessed the word in ${currentRow + 1} ${currentRow + 1 === 1 ? 'try' : 'tries'}!` : 'Better luck next time!';
    correctWord.textContent = targetWord;
    
    modal.classList.remove('hidden');
}

// Handle hint button
document.getElementById('hint-btn').addEventListener('click', () => {
    if (gameOver) return;
    
    const hint = getHint();
    if (hint) {
        showMessage(`Hint: Letter "${hint.letter}" is at position ${hint.position}`);
    } else {
        showMessage('No hints available!');
    }
});

// Handle play again
document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('stats-modal').classList.add('hidden');
    resetGame();
});

// Reset game
function resetGame() {
    currentRow = 0;
    currentTile = 0;
    currentGuess = '';
    gameOver = false;
    
    initBoard();
    selectRandomWord();
    
    // Reset keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
    
    showMessage('');
}

// Keyboard event listener
document.addEventListener('keydown', (e) => {
    handleKeyPress(e.key);
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize game
setTimeout(() => {
    if (wordList.length > 0) {
        initBoard();
    }
}, 100);