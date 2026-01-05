// Load puzzles from connect-4.js
let allPuzzles = connectionPuzzles;

// Get random puzzle by difficulty
function getRandomPuzzleByDifficulty(difficulty = 'medium') {
    const puzzlesOfDifficulty = allPuzzles[difficulty.toLowerCase()];
    if (!puzzlesOfDifficulty || puzzlesOfDifficulty.length === 0) {
        console.warn(`No puzzles found for difficulty: ${difficulty}. Using medium.`);
        return getRandomPuzzleByDifficulty('medium');
    }
    return puzzlesOfDifficulty[Math.floor(Math.random() * puzzlesOfDifficulty.length)];
}

// Get random puzzle from all difficulties
function getRandomPuzzle() {
    const difficulties = ['easy', 'medium', 'hard', 'extreme'];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    return getRandomPuzzleByDifficulty(randomDifficulty);
}

// Get all puzzles of a difficulty
function getPuzzlesByDifficulty(difficulty) {
    return allPuzzles[difficulty.toLowerCase()] || [];
}

// Get total puzzle count
function getTotalPuzzleCount() {
    return Object.values(allPuzzles).reduce((sum, arr) => sum + arr.length, 0);
}

// Get puzzle count by difficulty
function getPuzzleCountByDifficulty() {
    return {
        easy: allPuzzles.easy.length,
        medium: allPuzzles.medium.length,
        hard: allPuzzles.hard.length,
        extreme: allPuzzles.extreme.length
    };
}