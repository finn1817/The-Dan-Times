// Validate if selected words form a correct group
function validateGuess(selectedWords, puzzle) {
    // Check each category
    for (const category of puzzle.categories) {
        const categoryWords = category.words.map(w => w.toUpperCase());
        const selectedUpper = selectedWords.map(w => w.toUpperCase());
        
        // Check if all selected words are in this category
        const matches = selectedUpper.filter(word => categoryWords.includes(word)).length;
        
        if (matches === 4) {
            return {
                correct: true,
                category: category
            };
        } else if (matches === 3) {
            return {
                correct: false,
                closeCall: true,
                message: "One away..."
            };
        }
    }
    
    return {
        correct: false,
        closeCall: false
    };
}

// Check if all categories are solved
function isGameComplete(solvedCategories, totalCategories) {
    return solvedCategories.length === totalCategories;
}