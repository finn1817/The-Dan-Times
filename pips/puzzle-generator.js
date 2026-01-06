class PuzzleGenerator {
    constructor() {
        this.ruleTypes = ['sum', 'match', 'min', 'max', 'different', 'none'];
        this.regionColors = ['pink', 'blue', 'orange', 'green', 'purple', 'yellow', 'gray'];
    }

    generatePuzzle(difficulty = 'easy') {
        const config = this.getDifficultyConfig(difficulty);
        const grid = this.createGrid(config.gridSize);
        const regions = this.createRegions(grid, config);
        const placement = this.solvePuzzle(grid, regions);
        
        return {
            gridSize: config.gridSize,
            regions: regions,
            solution: placement,
            difficulty: difficulty
        };
    }

    getDifficultyConfig(difficulty) {
        const configs = {
            easy: { gridSize: { rows: 5, cols: 7 }, regionCount: 4, dominoCount: 10 },
            medium: { gridSize: { rows: 6, cols: 8 }, regionCount: 6, dominoCount: 15 },
            hard: { gridSize: { rows: 7, cols: 10 }, regionCount: 8, dominoCount: 21 }
        };
        return configs[difficulty] || configs.easy;
    }

    createGrid(size) {
        const grid = [];
        for (let row = 0; row < size.rows; row++) {
            grid[row] = [];
            for (let col = 0; col < size.cols; col++) {
                grid[row][col] = {
                    row, col,
                    region: null,
                    domino: null
                };
            }
        }
        return grid;
    }

    createRegions(grid, config) {
        const regions = [];
        const cells = [];
        
        // Flatten grid
        for (let row of grid) {
            for (let cell of row) {
                cells.push(cell);
            }
        }

        // Shuffle cells
        this.shuffleArray(cells);

        // Determine cells for dominoes
        const dominoCells = cells.slice(0, config.dominoCount * 2);
        
        // Create regions
        let regionId = 0;
        let cellsProcessed = 0;

        while (cellsProcessed < dominoCells.length) {
            const regionSize = Math.min(
                Math.floor(Math.random() * 4) + 2,
                dominoCells.length - cellsProcessed
            );
            
            const regionCells = dominoCells.slice(cellsProcessed, cellsProcessed + regionSize);
            const ruleType = this.ruleTypes[Math.floor(Math.random() * this.ruleTypes.length)];
            const color = this.regionColors[regionId % this.regionColors.length];

            const region = {
                id: regionId,
                cells: regionCells.map(c => ({ row: c.row, col: c.col })),
                rule: this.generateRule(ruleType, regionSize),
                color: color
            };

            regions.push(region);
            
            regionCells.forEach(cell => {
                cell.region = regionId;
            });

            regionId++;
            cellsProcessed += regionSize;
        }

        return regions;
    }

    generateRule(type, regionSize) {
        const rules = {
            sum: { type: 'sum', value: Math.floor(Math.random() * 20) + 10, label: (v) => `${v}` },
            match: { type: 'match', value: Math.floor(Math.random() * 6) + 1, label: (v) => `${v}` },
            min: { type: 'min', value: Math.floor(Math.random() * 4) + 2, label: (v) => `${v}↑` },
            max: { type: 'max', value: Math.floor(Math.random() * 4) + 2, label: (v) => `${v}↓` },
            different: { type: 'different', value: null, label: () => '⊕' },
            none: { type: 'none', value: null, label: () => '' }
        };

        return rules[type] || rules.none;
    }

    solvePuzzle(grid, regions) {
        // For demo purposes, create a valid random placement
        // In a real implementation, this would use backtracking
        const dominoSet = new DominoSet();
        const availableDominoes = dominoSet.getAllDominoes();
        this.shuffleArray(availableDominoes);

        const placement = [];
        const usedCells = new Set();

        for (const region of regions) {
            for (let i = 0; i < region.cells.length - 1; i += 2) {
                if (i + 1 < region.cells.length) {
                    const cell1 = region.cells[i];
                    const cell2 = region.cells[i + 1];
                    const cellKey1 = `${cell1.row},${cell1.col}`;
                    const cellKey2 = `${cell2.row},${cell2.col}`;

                    if (!usedCells.has(cellKey1) && !usedCells.has(cellKey2)) {
                        const domino = availableDominoes.pop();
                        if (domino) {
                            placement.push({
                                domino: domino.id,
                                cells: [cell1, cell2],
                                orientation: Math.abs(cell1.row - cell2.row) > 0 ? 'vertical' : 'horizontal'
                            });
                            usedCells.add(cellKey1);
                            usedCells.add(cellKey2);
                        }
                    }
                }
            }
        }

        return placement;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Predefined puzzles
const PREDEFINED_PUZZLES = {
    easy: [
        {
            gridSize: { rows: 5, cols: 7 },
            regions: [
                { id: 0, cells: [{row:0,col:0},{row:0,col:1},{row:1,col:0},{row:1,col:1}], rule: {type:'sum',value:14,label:(v)=>`${v}`}, color:'pink' },
                { id: 1, cells: [{row:0,col:2},{row:0,col:3},{row:1,col:2}], rule: {type:'match',value:3,label:(v)=>`${v}`}, color:'blue' },
                { id: 2, cells: [{row:2,col:0},{row:2,col:1},{row:3,col:0},{row:3,col:1}], rule: {type:'min',value:4,label:(v)=>`${v}↑`}, color:'orange' },
                { id: 3, cells: [{row:2,col:2},{row:2,col:3},{row:3,col:2},{row:3,col:3}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'green' }
            ],
            solution: [
                { domino: '6-6', cells: [{row:0,col:0},{row:0,col:1}], orientation: 'horizontal' },
                { domino: '1-1', cells: [{row:1,col:0},{row:1,col:1}], orientation: 'horizontal' },
                { domino: '3-3', cells: [{row:0,col:2},{row:1,col:2}], orientation: 'vertical' },
                { domino: '5-4', cells: [{row:2,col:0},{row:3,col:0}], orientation: 'vertical' },
                { domino: '4-5', cells: [{row:2,col:1},{row:3,col:1}], orientation: 'vertical' },
                { domino: '2-6', cells: [{row:2,col:2},{row:3,col:2}], orientation: 'vertical' },
                { domino: '3-5', cells: [{row:2,col:3},{row:3,col:3}], orientation: 'vertical' }
            ],
            difficulty: 'easy'
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PuzzleGenerator, PREDEFINED_PUZZLES };
}