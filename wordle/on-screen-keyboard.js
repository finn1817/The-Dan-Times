// On-screen keyboard layout
const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

// Create keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    keyboardLayout.forEach(row => {
        const keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.classList.add('key');
            keyButton.setAttribute('data-key', key);
            
            if (key === 'ENTER' || key === 'BACKSPACE') {
                keyButton.classList.add('wide');
                keyButton.textContent = key === 'ENTER' ? 'ENTER' : '←';
            } else {
                keyButton.textContent = key;
            }
            
            keyButton.addEventListener('click', () => {
                if (key === 'BACKSPACE') {
                    handleKeyPress('Backspace');
                } else {
                    handleKeyPress(key);
                }
            });
            
            keyboardRow.appendChild(keyButton);
        });
        
        keyboard.appendChild(keyboardRow);
    });
}

// Initialize keyboard when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createKeyboard);
} else {
    createKeyboard();
}