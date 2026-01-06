// Load letters and words data
let allLetterCombos = [];
let allValidWords = [];
let currentPuzzle = null;

// Hardcoded letter combinations that work well with common English words
const KNOWN_GOOD_COMBOS = [
    { center: 'E', outer: ['A', 'R', 'T', 'I', 'N', 'S'] },
    { center: 'A', outer: ['R', 'E', 'T', 'I', 'N', 'S'] },
    { center: 'I', outer: ['N', 'G', 'T', 'E', 'R', 'S'] },
    { center: 'O', outer: ['R', 'T', 'N', 'E', 'S', 'A'] },
    { center: 'R', outer: ['E', 'A', 'T', 'I', 'N', 'S'] },
    { center: 'T', outer: ['E', 'R', 'A', 'I', 'N', 'S'] },
    { center: 'N', outer: ['E', 'R', 'T', 'I', 'A', 'S'] },
    { center: 'S', outer: ['E', 'R', 'T', 'I', 'A', 'N'] },
    { center: 'L', outer: ['E', 'A', 'R', 'T', 'I', 'N'] },
    { center: 'D', outer: ['E', 'A', 'R', 'I', 'N', 'T'] },
    { center: 'C', outer: ['A', 'R', 'E', 'T', 'I', 'N'] },
    { center: 'G', outer: ['R', 'E', 'A', 'I', 'N', 'T'] },
    { center: 'P', outer: ['A', 'R', 'E', 'T', 'I', 'N'] },
    { center: 'M', outer: ['A', 'R', 'E', 'T', 'I', 'N'] },
    { center: 'B', outer: ['A', 'R', 'E', 'I', 'N', 'T'] },
    { center: 'H', outer: ['E', 'A', 'R', 'T', 'I', 'N'] },
    { center: 'F', outer: ['A', 'R', 'E', 'T', 'I', 'N'] },
    { center: 'W', outer: ['A', 'R', 'E', 'I', 'N', 'T'] },
    { center: 'Y', outer: ['E', 'A', 'R', 'I', 'T', 'N'] },
    { center: 'V', outer: ['E', 'A', 'R', 'I', 'T', 'N'] }
];

// Load data from files
async function loadData() {
    try {
        // Use hardcoded letter combinations that work well
        allLetterCombos = KNOWN_GOOD_COMBOS;

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

    // Try multiple random combos until we find one with valid words
    for (let attempt = 0; attempt < 100; attempt++) {
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

        if (validWords.length === 0) {
            continue; // Try another combo
        }

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

        if (maxScore > 0) {
            console.log(`Found valid puzzle with ${validWords.length} words (${pangrams.length} pangrams)`);
            return {
                center: randomCombo.center,
                outer: randomCombo.outer,
                allLetters: allLetters,
                validWords: validWords,
                pangrams: pangrams,
                maxScore: maxScore
            };
        }
    }

    console.error('Unable to find a valid puzzle with current data.');
    return null;
}

// Data is loaded by game.js before starting a puzzle
