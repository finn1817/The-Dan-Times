// Game state
let currentPuzzle = null;
let selectedWords = [];
let solvedCategories = [];
let mistakesRemaining = 4;
let gameActive = true;
let shuffledWords = [];

// Current difficulty setting
let currentDifficulty = 'medium'; // Default to medium

// Update initGame function
function initGame(difficulty = currentDifficulty) {
    currentDifficulty = difficulty;
    currentPuzzle = getRandomPuzzleByDifficulty(difficulty);
    selectedWords = [];
    solvedCategories = [];
    mistakesRemaining = 4;
    gameActive = true;
    
    shuffledWords = getShuffledWords(currentPuzzle);
    renderWordGrid();
    updateMistakes();
    clearSolvedGroups();
    clearMessage();
    updateDifficultyDisplay();
}

// Render word grid
function renderWordGrid() {
    const grid = document.getElementById('word-grid');
    grid.innerHTML = '';
    
    // Filter out already solved words
    const availableWords = shuffledWords.filter(item => 
        !solvedCategories.some(cat => cat.name === item.category)
    );
    
    availableWords.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('word-card');
        card.textContent = item.word;
        card.dataset.word = item.word;
        card.dataset.category = item.category;
        
        card.addEventListener('click', () => selectWord(card, item.word));
        
        grid.appendChild(card);
    });
}

// Select/deselect word
function selectWord(card, word) {
    if (!gameActive) return;
    
    if (selectedWords.includes(word)) {
        selectedWords = selectedWords.filter(w => w !== word);
        card.classList.remove('selected');
    } else {
        if (selectedWords.length < 4) {
            selectedWords.push(word);
            card.classList.add('selected');
        }
    }
    
    updateSubmitButton();
}

// Update submit button state
function updateSubmitButton() {
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = selectedWords.length !== 4;
}

// Submit guess
function submitGuess() {
    if (selectedWords.length !== 4 || !gameActive) return;
    
    const result = validateGuess(selectedWords, currentPuzzle);
    
    if (result.correct) {
        handleCorrectGuess(result.category);
    } else {
        handleIncorrectGuess(result);
    }
}

// Handle correct guess
function handleCorrectGuess(category) {
    // Add to solved categories
    solvedCategories.push(category);
    
    // Animate correct cards
    selectedWords.forEach(word => {
        const card = document.querySelector(`.word-card[data-word="${word}"]`);
        if (card) {
            card.classList.add('correct');
        }
    });
    
    setTimeout(() => {
        // Add solved group to the top
        addSolvedGroup(category);
        
        // Clear selection and re-render grid
        selectedWords = [];
        renderWordGrid();
        updateSubmitButton();
        
        // Check if game is complete
        if (isGameComplete(solvedCategories, currentPuzzle.categories.length)) {
            setTimeout(() => endGame(true), 500);
        } else {
            showMessage('Great job! 🎉', 'success');
        }
    }, 600);
}

// Handle incorrect guess
function handleIncorrectGuess(result) {
    mistakesRemaining--;
    updateMistakes();
    
    // Shake selected cards
    selectedWords.forEach(word => {
        const card = document.querySelector(`.word-card[data-word="${word}"]`);
        if (card) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 500);
        }
    });
    
    if (result.closeCall) {
        showMessage(result.message, 'warning');
    } else {
        showMessage('Not quite...', 'error');
    }
    
    // Deselect all
    setTimeout(() => {
        deselectAll();
    }, 500);
    
    // Check if out of mistakes
    if (mistakesRemaining === 0) {
        setTimeout(() => endGame(false), 1000);
    }
}

// Add solved group to display
function addSolvedGroup(category) {
    const container = document.getElementById('solved-groups');
    const group = document.createElement('div');
    group.classList.add('solved-group', `level-${category.difficulty}`);
    
    group.innerHTML = `
        <h3>${category.name}</h3>
        <p>${category.words.join(', ')}</p>
    `;
    
    container.appendChild(group);
}

// Clear solved groups
function clearSolvedGroups() {
    document.getElementById('solved-groups').innerHTML = '';
}

// Update mistakes display
function updateMistakes() {
    const dots = document.querySelectorAll('.mistakes-dots .dot');
    dots.forEach((dot, index) => {
        if (index < mistakesRemaining) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

// Add difficulty display function
function updateDifficultyDisplay() {
    const difficultyBadge = document.querySelector('.difficulty-badge');
    if (difficultyBadge) {
        difficultyBadge.textContent = currentDifficulty.toUpperCase();
        difficultyBadge.className = `difficulty-badge ${currentDifficulty}`;
    }
}

// Shuffle words
function shuffleWords() {
    if (!gameActive) return;
    shuffledWords = shuffleArray(shuffledWords);
    renderWordGrid();
    
    // Reselect previously selected words
    selectedWords.forEach(word => {
        const card = document.querySelector(`.word-card[data-word="${word}"]`);
        if (card) card.classList.add('selected');
    });
}

// Deselect all words
function deselectAll() {
    selectedWords = [];
    document.querySelectorAll('.word-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateSubmitButton();
}

// Show message
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.style.color = type === 'success' ? '#4caf50' : 
                           type === 'error' ? '#f44336' : 
                           type === 'warning' ? '#ff9800' : '#667eea';
    
    setTimeout(() => {
        messageEl.textContent = '';
    }, 2000);
}

// Clear message
function clearMessage() {
    document.getElementById('message').textContent = '';
}

// End game
function endGame(won) {
    gameActive = false;
    
    const modal = document.getElementById('end-game-modal');
    const title = document.getElementById('end-title');
    const message = document.getElementById('end-message');
    const results = document.getElementById('final-results');
    
    if (won) {
        title.textContent = '🎉 Incredible!';
        message.textContent = 'You found all the connections!';
    } else {
        title.textContent = '😔 Game Over';
        message.textContent = `You've run out of guesses. Here are the answers:`;
        
        // Show unsolved categories
        const unsolvedCategories = currentPuzzle.categories.filter(cat => 
            !solvedCategories.some(solved => solved.name === cat.name)
        );
        
        unsolvedCategories.forEach(cat => {
            addSolvedGroup(cat);
        });
    }
    
    // Show all categories in modal
    results.innerHTML = '';
    currentPuzzle.categories.forEach(cat => {
        const resultGroup = document.createElement('div');
        resultGroup.classList.add('result-group', `level-${cat.difficulty}`);
        resultGroup.innerHTML = `
            <h4>${cat.name}</h4>
            <p>${cat.words.join(', ')}</p>
        `;
        results.appendChild(resultGroup);
    });
    
    modal.classList.remove('hidden');
}

// Event listeners
document.getElementById('submit-btn').addEventListener('click', submitGuess);
document.getElementById('shuffle-btn').addEventListener('click', shuffleWords);
document.getElementById('deselect-btn').addEventListener('click', deselectAll);
document.getElementById('play-again-btn').addEventListener('click', () => {
    document.getElementById('end-game-modal').classList.add('hidden');
    initGame();
});

// Difficulty selector
document.getElementById('difficulty-select').addEventListener('change', (e) => {
    const newDifficulty = e.target.value;
    if (confirm(`Start a new ${newDifficulty} game?`)) {
        initGame(newDifficulty);
    } else {
        e.target.value = currentDifficulty; // Revert selection
    }
});

// How to play modal
document.getElementById('how-to-play-btn').addEventListener('click', () => {
    document.getElementById('how-to-play-modal').classList.remove('hidden');
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.add('hidden');
    });
});

// Click outside modal to close
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// Initialize game on load
initGame();