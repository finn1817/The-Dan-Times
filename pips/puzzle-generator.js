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

// Predefined puzzles matching real Pips game style
const PREDEFINED_PUZZLES = {
    easy: [
        {
            gridSize: { rows: 6, cols: 7 },
            regions: [
                // Top left L-shape
                { id: 0, cells: [{row:0,col:1},{row:1,col:1},{row:2,col:1},{row:2,col:0}], rule: {type:'sum',value:9,label:(v)=>`${v}`}, color:'purple' },
                // Top right square
                { id: 1, cells: [{row:0,col:4},{row:0,col:5},{row:1,col:4},{row:1,col:5}], rule: {type:'sum',value:11,label:(v)=>`${v}`}, color:'pink' },
                // Middle vertical bar
                { id: 2, cells: [{row:2,col:3},{row:3,col:3},{row:4,col:3},{row:5,col:3}], rule: {type:'sum',value:11,label:(v)=>`${v}`}, color:'cyan' },
                // Bottom left square
                { id: 3, cells: [{row:4,col:0},{row:4,col:1},{row:5,col:0},{row:5,col:1}], rule: {type:'sum',value:7,label:(v)=>`${v}`}, color:'orange' }
            ],
            solution: [
                { domino: '5-2', cells: [{row:0,col:1},{row:1,col:1}], orientation: 'vertical' },
                { domino: '1-1', cells: [{row:2,col:1},{row:2,col:0}], orientation: 'horizontal' },
                { domino: '6-5', cells: [{row:0,col:4},{row:0,col:5}], orientation: 'horizontal' },
                { domino: '0-0', cells: [{row:1,col:4},{row:1,col:5}], orientation: 'horizontal' },
                { domino: '6-0', cells: [{row:2,col:3},{row:3,col:3}], orientation: 'vertical' },
                { domino: '5-0', cells: [{row:4,col:3},{row:5,col:3}], orientation: 'vertical' },
                { domino: '3-2', cells: [{row:4,col:0},{row:4,col:1}], orientation: 'horizontal' },
                { domino: '1-1', cells: [{row:5,col:0},{row:5,col:1}], orientation: 'horizontal' }
            ],
            difficulty: 'easy'
        },
        {
            gridSize: { rows: 7, cols: 7 },
            regions: [
                // Top T-shape
                { id: 0, cells: [{row:0,col:2},{row:0,col:3},{row:0,col:4},{row:1,col:3},{row:2,col:3},{row:3,col:3}], rule: {type:'sum',value:24,label:(v)=>`${v}`}, color:'green' },
                // Left square
                { id: 1, cells: [{row:2,col:0},{row:2,col:1},{row:3,col:0},{row:3,col:1}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'blue' },
                // Right square
                { id: 2, cells: [{row:2,col:5},{row:2,col:6},{row:3,col:5},{row:3,col:6}], rule: {type:'sum',value:10,label:(v)=>`${v}`}, color:'pink' },
                // Bottom horizontal
                { id: 3, cells: [{row:5,col:1},{row:5,col:2},{row:6,col:1},{row:6,col:2}], rule: {type:'min',value:3,label:(v)=>`${v}↑`}, color:'orange' }
            ],
            solution: [
                { domino: '6-6', cells: [{row:0,col:2},{row:0,col:3}], orientation: 'horizontal' },
                { domino: '5-4', cells: [{row:0,col:4},{row:1,col:3}], orientation: 'vertical' },
                { domino: '2-1', cells: [{row:2,col:3},{row:3,col:3}], orientation: 'vertical' },
                { domino: '1-0', cells: [{row:2,col:0},{row:3,col:0}], orientation: 'vertical' },
                { domino: '6-2', cells: [{row:2,col:1},{row:3,col:1}], orientation: 'vertical' },
                { domino: '5-3', cells: [{row:2,col:5},{row:2,col:6}], orientation: 'horizontal' },
                { domino: '1-1', cells: [{row:3,col:5},{row:3,col:6}], orientation: 'horizontal' },
                { domino: '4-3', cells: [{row:5,col:1},{row:5,col:2}], orientation: 'horizontal' },
                { domino: '6-5', cells: [{row:6,col:1},{row:6,col:2}], orientation: 'horizontal' }
            ],
            difficulty: 'easy'
        },
        {
            gridSize: { rows: 5, cols: 6 },
            regions: [
                // Top horizontal strip
                { id: 0, cells: [{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:0,col:4}], rule: {type:'max',value:3,label:(v)=>`${v}↓`}, color:'yellow' },
                // Middle cross shape
                { id: 1, cells: [{row:2,col:1},{row:2,col:2},{row:1,col:2},{row:3,col:2}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'purple' },
                // Bottom right L
                { id: 2, cells: [{row:3,col:4},{row:3,col:5},{row:4,col:4},{row:4,col:5}], rule: {type:'sum',value:8,label:(v)=>`${v}`}, color:'cyan' }
            ],
            solution: [
                { domino: '1-0', cells: [{row:0,col:1},{row:0,col:2}], orientation: 'horizontal' },
                { domino: '3-2', cells: [{row:0,col:3},{row:0,col:4}], orientation: 'horizontal' },
                { domino: '5-1', cells: [{row:1,col:2},{row:2,col:2}], orientation: 'vertical' },
                { domino: '6-3', cells: [{row:2,col:1},{row:3,col:2}], orientation: 'vertical' },
                { domino: '4-2', cells: [{row:3,col:4},{row:3,col:5}], orientation: 'horizontal' },
                { domino: '1-1', cells: [{row:4,col:4},{row:4,col:5}], orientation: 'horizontal' }
            ],
            difficulty: 'easy'
        }
    ],
    medium: [
        {
            gridSize: { rows: 7, cols: 8 },
            regions: [
                // Scattered square patterns
                { id: 0, cells: [{row:0,col:1},{row:0,col:2},{row:1,col:1},{row:1,col:2}], rule: {type:'min',value:4,label:(v)=>`${v}↑`}, color:'orange' },
                { id: 1, cells: [{row:0,col:5},{row:0,col:6},{row:1,col:5},{row:1,col:6}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'purple' },
                { id: 2, cells: [{row:2,col:3},{row:3,col:3},{row:4,col:3},{row:5,col:3}], rule: {type:'sum',value:18,label:(v)=>`${v}`}, color:'green' },
                { id: 3, cells: [{row:3,col:0},{row:3,col:1},{row:4,col:0},{row:4,col:1}], rule: {type:'sum',value:9,label:(v)=>`${v}`}, color:'pink' },
                { id: 4, cells: [{row:4,col:5},{row:4,col:6},{row:5,col:5},{row:5,col:6}], rule: {type:'max',value:4,label:(v)=>`${v}↓`}, color:'yellow' }
            ],
            solution: [
                { domino: '6-5', cells: [{row:0,col:1},{row:0,col:2}], orientation: 'horizontal' },
                { domino: '4-4', cells: [{row:1,col:1},{row:1,col:2}], orientation: 'horizontal' },
                { domino: '1-2', cells: [{row:0,col:5},{row:0,col:6}], orientation: 'horizontal' },
                { domino: '6-3', cells: [{row:1,col:5},{row:1,col:6}], orientation: 'horizontal' },
                { domino: '6-6', cells: [{row:2,col:3},{row:3,col:3}], orientation: 'vertical' },
                { domino: '5-1', cells: [{row:4,col:3},{row:5,col:3}], orientation: 'vertical' },
                { domino: '5-1', cells: [{row:3,col:0},{row:4,col:0}], orientation: 'vertical' },
                { domino: '2-1', cells: [{row:3,col:1},{row:4,col:1}], orientation: 'vertical' },
                { domino: '3-2', cells: [{row:4,col:5},{row:4,col:6}], orientation: 'horizontal' },
                { domino: '4-0', cells: [{row:5,col:5},{row:5,col:6}], orientation: 'horizontal' }
            ],
            difficulty: 'medium'
        },
        {
            gridSize: { rows: 8, cols: 7 },
            regions: [
                // Diagonal staircase pattern
                { id: 0, cells: [{row:1,col:1},{row:1,col:2},{row:2,col:1},{row:2,col:2}], rule: {type:'sum',value:12,label:(v)=>`${v}`}, color:'blue' },
                { id: 1, cells: [{row:2,col:3},{row:2,col:4},{row:3,col:3},{row:3,col:4}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'green' },
                { id: 2, cells: [{row:3,col:5},{row:4,col:5},{row:5,col:5},{row:6,col:5}], rule: {type:'sum',value:15,label:(v)=>`${v}`}, color:'purple' },
                { id: 3, cells: [{row:5,col:2},{row:5,col:3},{row:6,col:2},{row:6,col:3}], rule: {type:'min',value:3,label:(v)=>`${v}↑`}, color:'orange' }
            ],
            solution: [
                { domino: '6-2', cells: [{row:1,col:1},{row:1,col:2}], orientation: 'horizontal' },
                { domino: '3-1', cells: [{row:2,col:1},{row:2,col:2}], orientation: 'horizontal' },
                { domino: '0-1', cells: [{row:2,col:3},{row:2,col:4}], orientation: 'horizontal' },
                { domino: '6-2', cells: [{row:3,col:3},{row:3,col:4}], orientation: 'horizontal' },
                { domino: '5-4', cells: [{row:3,col:5},{row:4,col:5}], orientation: 'vertical' },
                { domino: '6-0', cells: [{row:5,col:5},{row:6,col:5}], orientation: 'vertical' },
                { domino: '4-3', cells: [{row:5,col:2},{row:5,col:3}], orientation: 'horizontal' },
                { domino: '6-5', cells: [{row:6,col:2},{row:6,col:3}], orientation: 'horizontal' }
            ],
            difficulty: 'medium'
        }
    ],
    hard: [
        {
            gridSize: { rows: 9, cols: 9 },
            regions: [
                // Scattered complex patterns
                { id: 0, cells: [{row:1,col:2},{row:1,col:3},{row:2,col:2},{row:2,col:3}], rule: {type:'sum',value:9,label:(v)=>`${v}`}, color:'purple' },
                { id: 1, cells: [{row:1,col:5},{row:1,col:6},{row:2,col:5},{row:2,col:6}], rule: {type:'different',value:null,label:()=>'⊕'}, color:'cyan' },
                { id: 2, cells: [{row:3,col:1},{row:4,col:1},{row:5,col:1},{row:6,col:1}], rule: {type:'sum',value:21,label:(v)=>`${v}`}, color:'green' },
                { id: 3, cells: [{row:4,col:3},{row:4,col:4},{row:5,col:3},{row:5,col:4}], rule: {type:'max',value:4,label:(v)=>`${v}↓`}, color:'yellow' },
                { id: 4, cells: [{row:3,col:6},{row:3,col:7},{row:4,col:6},{row:4,col:7}], rule: {type:'min',value:4,label:(v)=>`${v}↑`}, color:'orange' },
                { id: 5, cells: [{row:6,col:4},{row:6,col:5},{row:7,col:4},{row:7,col:5}], rule: {type:'sum',value:10,label:(v)=>`${v}`}, color:'pink' }
            ],
            solution: [
                { domino: '5-2', cells: [{row:1,col:2},{row:1,col:3}], orientation: 'horizontal' },
                { domino: '1-1', cells: [{row:2,col:2},{row:2,col:3}], orientation: 'horizontal' },
                { domino: '0-1', cells: [{row:1,col:5},{row:1,col:6}], orientation: 'horizontal' },
                { domino: '6-2', cells: [{row:2,col:5},{row:2,col:6}], orientation: 'horizontal' },
                { domino: '6-6', cells: [{row:3,col:1},{row:4,col:1}], orientation: 'vertical' },
                { domino: '4-5', cells: [{row:5,col:1},{row:6,col:1}], orientation: 'vertical' },
                { domino: '3-2', cells: [{row:4,col:3},{row:4,col:4}], orientation: 'horizontal' },
                { domino: '4-0', cells: [{row:5,col:3},{row:5,col:4}], orientation: 'horizontal' },
                { domino: '5-4', cells: [{row:3,col:6},{row:3,col:7}], orientation: 'horizontal' },
                { domino: '6-5', cells: [{row:4,col:6},{row:4,col:7}], orientation: 'horizontal' },
                { domino: '3-5', cells: [{row:6,col:4},{row:6,col:5}], orientation: 'horizontal' },
                { domino: '2-0', cells: [{row:7,col:4},{row:7,col:5}], orientation: 'horizontal' }
            ],
            difficulty: 'hard'
        }
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PuzzleGenerator, PREDEFINED_PUZZLES };
}