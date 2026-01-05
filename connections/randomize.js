// Shuffle array function
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Get shuffled words from puzzle
function getShuffledWords(puzzle) {
    const allWords = puzzle.categories.flatMap(category => 
        category.words.map(word => ({
            word: word,
            category: category.name,
            difficulty: category.difficulty
        }))
    );
    return shuffleArray(allWords);
}