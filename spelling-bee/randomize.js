// Load letters and words data
let allLetterCombos = [];
let allValidWords = [];
let currentPuzzle = null;

// Load data from files
async function loadData() {
    try {
        // Load letter combinations
        const lettersResponse = await fetch('letters.txt');
        const lettersText = await lettersResponse.text();
        allLetterCombos = lettersText.trim().split('\n').map(line => {
            const [center, ...outer] = line.trim().split('');
            return { center, outer };
        });

        // Load valid words
        const wordsResponse = await fetch('words.txt');
        const wordsText = await wordsResponse.text();
        allValidWords = wordsText.trim().split('\n').map(w => w.toUpperCase());

        console.log(`Loaded ${allLetterCombos.length} letter combinations`);
        console.log(`Loaded ${allValidWords.length} valid words`);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Get random puzzle
function getRandomPuzzle() {
    if (allLetterCombos.length === 0) {
        console.error('No letter combinations loaded!');
        return null;
    }

    const randomCombo = allLetterCombos[Math.floor(Math.random() * allLetterCombos.length)];
    const allLetters = [randomCombo.center, ...randomCombo.outer];

    // Find valid words for this puzzle
    const validWords = allValidWords.filter(word => {
        // Must be at least 4 letters
        if (word.length < 4) return false;
        
        // Must contain center letter
        if (!word.includes(randomCombo.center)) return false;
        
        // All letters must be in the puzzle
        return word.split('').every(letter => allLetters.includes(letter));
    });

    // Find pangrams (words using all 7 letters)
    const pangrams = validWords.filter(word => {
        const uniqueLetters = [...new Set(word.split(''))];
        return uniqueLetters.length === 7;
    });

    // Calculate max score
    let maxScore = 0;
    validWords.forEach(word => {
        if (word.length === 4) {
            maxScore += 1;
        } else {
            maxScore += word.length;
        }
        if (pangrams.includes(word)) {
            maxScore += 7; // Pangram bonus
        }
    });

    return {
        center: randomCombo.center,
        outer: randomCombo.outer,
        allLetters: allLetters,
        validWords: validWords,
        pangrams: pangrams,
        maxScore: maxScore
    };
}

// Data is loaded by game.js before starting a puzzle