class PipsGame {
    constructor() {
        this.dominoSet = new DominoSet();
        this.puzzleGenerator = new PuzzleGenerator();
        this.currentPuzzle = null;
        this.selectedDomino = null;
        this.placedDominoes = new Map();
        this.difficulty = 'easy';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startNewGame();
    }

    setupEventListeners() {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.startNewGame();
            });
        });

        // Control buttons
        document.getElementById('rotate-btn').addEventListener('click', () => this.rotateSelected());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('check-btn').addEventListener('click', () => this.checkSolution());
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.hideModal();
            this.startNewGame();
        });

        // Drag and drop for dominoes
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('domino')) {
                e.target.classList.add('dragging');
                this.selectedDomino = e.target;
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('domino')) {
                e.target.classList.remove('dragging');
            }
        });

        // Click to select domino
        document.addEventListener('click', (e) => {
            const domino = e.target.closest('.domino');
            if (domino && domino.parentElement.id === 'dominoes-container') {
                document.querySelectorAll('.domino').forEach(d => d.classList.remove('selected'));
                domino.classList.add('selected');
                this.selectedDomino = domino;
            }
        });
    }

    startNewGame() {
        // Generate or use predefined puzzle
        if (PREDEFINED_PUZZLES[this.difficulty] && PREDEFINED_PUZZLES[this.difficulty].length > 0) {
            this.currentPuzzle = PREDEFINED_PUZZLES[this.difficulty][0];
        } else {
            this.currentPuzzle = this.puzzleGenerator.generatePuzzle(this.difficulty);
        }

        this.placedDominoes.clear();
        this.selectedDomino = null;
        
        this.renderGameBoard();
        this.renderDominoes();
    }

    renderGameBoard() {
        const board = document.getElementById('game-board');
        board.innerHTML = '';
        
        const { rows, cols } = this.currentPuzzle.gridSize;
        board.style.gridTemplateColumns = `repeat(${cols}, 50px)`;
        board.style.gridTemplateRows = `repeat(${rows}, 50px)`;

        // Create cell map for regions
        const cellRegionMap = new Map();
        this.currentPuzzle.regions.forEach(region => {
            region.cells.forEach(cell => {
                cellRegionMap.set(`${cell.row},${cell.col}`, region);
            });
        });

        // Create cells
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                const region = cellRegionMap.get(`${row},${col}`);
                if (region) {
                    cell.classList.add(`region-${region.color}`);
                    cell.classList.add('active-cell');
                    
                    // Add rule label to first cell of region
                    if (region.cells[0].row === row && region.cells[0].col === col) {
                        const label = document.createElement('div');
                        label.className = 'region-label';
                        label.textContent = region.rule.label(region.rule.value);
                        cell.appendChild(label);
                    }
                } else {
                    // Inactive cell - not part of any region
                    cell.classList.add('inactive-cell');
                }

                // Only make active cells interactive
                if (region) {
                    // Drop target
                    cell.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    });

                    cell.addEventListener('dragenter', (e) => {
                        e.preventDefault();
                        if (this.canPlaceDomino(row, col)) {
                            cell.classList.add('drop-target');
                        }
                    });

                    cell.addEventListener('dragleave', (e) => {
                        cell.classList.remove('drop-target');
                    });

                    cell.addEventListener('drop', (e) => {
                        e.preventDefault();
                        cell.classList.remove('drop-target');
                        this.placeDomino(row, col);
                    });

                    // Click to place
                    cell.addEventListener('click', () => {
                        if (this.selectedDomino && this.canPlaceDomino(row, col)) {
                            this.placeDomino(row, col);
                        }
                    });
                }

                board.appendChild(cell);
            }
        }
    }

    renderDominoes() {
        const container = document.getElementById('dominoes-container');
        container.innerHTML = '';

        const allDominoes = this.dominoSet.getAllDominoes();
        const usedDominoes = new Set(Array.from(this.placedDominoes.values()).map(p => p.dominoId));

        allDominoes.forEach(domino => {
            const dominoEl = DominoRenderer.createDominoElement(
                domino.value1,
                domino.value2,
                domino.id,
                'horizontal'
            );

            if (usedDominoes.has(domino.id)) {
                dominoEl.classList.add('used');
            }

            container.appendChild(dominoEl);
        });
    }

    canPlaceDomino(row, col) {
        if (!this.selectedDomino) return false;

        const orientation = this.selectedDomino.dataset.orientation;
        const { rows, cols } = this.currentPuzzle.gridSize;

        // Determine the second cell position
        let row2, col2;
        if (orientation === 'horizontal') {
            row2 = row;
            col2 = col + 1;
        } else {
            row2 = row + 1;
            col2 = col;
        }

        // Check bounds
        if (row2 >= rows || col2 >= cols) return false;

        // Check if both cells are active (part of a region)
        const cell1Active = this.isCellActive(row, col);
        const cell2Active = this.isCellActive(row2, col2);
        
        if (!cell1Active || !cell2Active) return false;

        // Check if cells are empty
        const cell1Key = `${row},${col}`;
        const cell2Key = `${row2},${col2}`;

        return !this.placedDominoes.has(cell1Key) && !this.placedDominoes.has(cell2Key);
    }

    isCellActive(row, col) {
        return this.currentPuzzle.regions.some(region => 
            region.cells.some(cell => cell.row === row && cell.col === col)
        );
    }

    placeDomino(row, col) {
        if (!this.selectedDomino) return;

        const dominoId = this.selectedDomino.dataset.id;
        const orientation = this.selectedDomino.dataset.orientation;
        const value1 = parseInt(this.selectedDomino.dataset.value1);
        const value2 = parseInt(this.selectedDomino.dataset.value2);

        const cell1 = { row, col };
        const cell2 = orientation === 'horizontal' 
            ? { row, col: col + 1 }
            : { row: row + 1, col };

        // Place on board
        const boardCell1 = this.getCell(cell1.row, cell1.col);
        const boardCell2 = this.getCell(cell2.row, cell2.col);

        if (!boardCell1 || !boardCell2) return;

        // Create domino element for board
        const boardDomino = DominoRenderer.createDominoElement(value1, value2, dominoId, orientation);
        boardDomino.style.position = 'absolute';
        boardDomino.style.zIndex = '10';
        boardDomino.draggable = false;
        
        // Position spanning both cells
        if (orientation === 'horizontal') {
            boardDomino.style.width = '104px';
            boardDomino.style.height = '50px';
        } else {
            boardDomino.style.width = '50px';
            boardDomino.style.height = '104px';
        }

        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.className = 'remove-domino-btn';
        removeBtn.style.cssText = 'position:absolute;top:0;right:0;background:#f44336;color:white;border:none;width:20px;height:20px;cursor:pointer;border-radius:50%;font-size:12px;line-height:1;z-index:20;';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            this.removeDomino(cell1.row, cell1.col);
        };
        boardDomino.appendChild(removeBtn);

        boardCell1.appendChild(boardDomino);

        // Mark cells as occupied
        const cell1Key = `${cell1.row},${cell1.col}`;
        const cell2Key = `${cell2.row},${cell2.col}`;
        
        this.placedDominoes.set(cell1Key, { dominoId, element: boardDomino, cells: [cell1, cell2], value1, value2 });
        this.placedDominoes.set(cell2Key, { dominoId, element: boardDomino, cells: [cell1, cell2], value1, value2 });

        // Update available dominoes
        this.renderDominoes();
        this.selectedDomino = null;

        // Check if puzzle is complete
        if (this.isPuzzleComplete()) {
            setTimeout(() => this.checkSolution(), 500);
        }
    }

    removeDomino(row, col) {
        const cellKey = `${row},${col}`;
        const placement = this.placedDominoes.get(cellKey);
        
        if (placement) {
            // Remove element
            placement.element.remove();
            
            // Remove from both cells
            placement.cells.forEach(cell => {
                this.placedDominoes.delete(`${cell.row},${cell.col}`);
            });
            
            this.renderDominoes();
        }
    }

    rotateSelected() {
        if (this.selectedDomino && this.selectedDomino.parentElement.id === 'dominoes-container') {
            DominoRenderer.rotateDomino(this.selectedDomino);
        }
    }

    showHint() {
        if (!this.currentPuzzle.solution || this.currentPuzzle.solution.length === 0) {
            this.showError('No hints available for this puzzle');
            return;
        }

        // Find first unsolved domino
        for (const solutionPlacement of this.currentPuzzle.solution) {
            const cell = solutionPlacement.cells[0];
            const cellKey = `${cell.row},${cell.col}`;
            
            if (!this.placedDominoes.has(cellKey)) {
                // Highlight the cells
                const cell1 = this.getCell(cell.row, cell.col);
                const cell2 = this.getCell(
                    solutionPlacement.cells[1].row,
                    solutionPlacement.cells[1].col
                );
                
                [cell1, cell2].forEach(c => {
                    if (c) {
                        c.classList.add('highlight');
                        setTimeout(() => c.classList.remove('highlight'), 2000);
                    }
                });
                
                this.showError(`Try placing ${solutionPlacement.domino} here`);
                return;
            }
        }
    }

    checkSolution() {
        let allCorrect = true;

        // Check each region
        for (const region of this.currentPuzzle.regions) {
            const values = [];
            
            for (const cell of region.cells) {
                const cellKey = `${cell.row},${cell.col}`;
                const placement = this.placedDominoes.get(cellKey);
                
                if (!placement) {
                    allCorrect = false;
                    continue;
                }

                // Determine which value from the domino is in this cell
                const isFirstCell = placement.cells[0].row === cell.row && placement.cells[0].col === cell.col;
                values.push(isFirstCell ? placement.value1 : placement.value2);
            }

            const isValid = this.validateRegion(region, values);
            
            // Visual feedback
            region.cells.forEach(cell => {
                const cellEl = this.getCell(cell.row, cell.col);
                if (cellEl) {
                    cellEl.classList.remove('correct', 'error');
                    cellEl.classList.add(isValid ? 'correct' : 'error');
                }
            });

            if (!isValid) allCorrect = false;
        }

        if (allCorrect) {
            setTimeout(() => this.showVictory(), 500);
        } else {
            this.showError('Some regions are incorrect. Keep trying!');
        }
    }

    validateRegion(region, values) {
        if (values.length !== region.cells.length) return false;

        switch (region.rule.type) {
            case 'sum':
                return values.reduce((a, b) => a + b, 0) === region.rule.value;
            case 'match':
                return values.every(v => v === region.rule.value);
            case 'min':
                return values.every(v => v >= region.rule.value);
            case 'max':
                return values.every(v => v <= region.rule.value);
            case 'different':
                return new Set(values).size === values.length;
            case 'none':
                return true;
            default:
                return true;
        }
    }

    isPuzzleComplete() {
        const totalCells = this.currentPuzzle.regions.reduce((sum, r) => sum + r.cells.length, 0);
        return this.placedDominoes.size === totalCells;
    }

    getCell(row, col) {
        return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    }

    showVictory() {
        document.getElementById('victory-modal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('victory-modal').classList.add('hidden');
    }

    showError(message) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 3000);
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PipsGame();
});