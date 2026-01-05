// Word list management and random selection
let wordList = [];
let targetWord = '';

// Load words from file
async function loadWords() {
    try {
        const response = await fetch('words.txt');
        const text = await response.text();
        wordList = text.split('\n').map(word => word.trim().toUpperCase()).filter(word => word.length === 5);
        
        if (wordList.length === 0) {
            console.error('No valid words loaded');
            return false;
        }
        
        selectRandomWord();
        return true;
    } catch (error) {
        console.error('Error loading words:', error);
        return false;
    }
}

// Select a random word from the list
function selectRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    targetWord = wordList[randomIndex];
    console.log('New word selected (shhh! 🤫)'); // For debugging
    // console.log('Answer:', targetWord); // Uncomment to cheat!
}

// Check if a word exists in the word list
function isValidWord(word) {
    return wordList.includes(word.toUpperCase());
}

// Get a hint (reveal a random letter)
function getHint() {
    if (!targetWord) return null;
    
    const revealedLetters = new Set();
    const tiles = document.querySelectorAll('.tile.filled');
    
    tiles.forEach(tile => {
        const letter = tile.textContent;
        if (targetWord.includes(letter)) {
            revealedLetters.add(letter);
        }
    });
    
    // Find letters not yet revealed
    const unrevealedLetters = targetWord.split('').filter(letter => !revealedLetters.has(letter));
    
    if (unrevealedLetters.length === 0) {
        return targetWord[0]; // All revealed, return first letter
    }
    
    // Return a random unrevealed letter and its position
    const randomLetter = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
    const position = targetWord.indexOf(randomLetter) + 1;
    
    return { letter: randomLetter, position: position };
}

// Initialize
loadWords();