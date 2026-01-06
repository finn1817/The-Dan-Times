// Complete set of dominoes (0-0 to 6-6)
class DominoSet {
    constructor() {
        this.dominoes = this.generateFullSet();
    }

    generateFullSet() {
        const set = [];
        for (let i = 0; i <= 6; i++) {
            for (let j = i; j <= 6; j++) {
                set.push({ value1: i, value2: j, id: `${i}-${j}` });
            }
        }
        return set;
    }

    getAllDominoes() {
        return [...this.dominoes];
    }

    getDominoById(id) {
        return this.dominoes.find(d => d.id === id);
    }
}

class DominoRenderer {
    static createDominoElement(value1, value2, id, orientation = 'horizontal') {
        const domino = document.createElement('div');
        domino.className = `domino ${orientation}`;
        domino.dataset.id = id;
        domino.dataset.value1 = value1;
        domino.dataset.value2 = value2;
        domino.dataset.orientation = orientation;
        domino.draggable = true;

        const half1 = document.createElement('div');
        half1.className = 'domino-half';
        half1.appendChild(this.createPips(value1));

        const half2 = document.createElement('div');
        half2.className = 'domino-half';
        half2.appendChild(this.createPips(value2));

        domino.appendChild(half1);
        domino.appendChild(half2);

        return domino;
    }

    static createPips(value) {
        const pipsContainer = document.createElement('div');
        pipsContainer.className = `pips pips-${value}`;

        for (let i = 0; i < value; i++) {
            const pip = document.createElement('div');
            pip.className = 'pip';
            pipsContainer.appendChild(pip);
        }

        return pipsContainer;
    }

    static rotateDomino(dominoElement) {
        const currentOrientation = dominoElement.dataset.orientation;
        const newOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        
        dominoElement.className = `domino ${newOrientation}`;
        dominoElement.dataset.orientation = newOrientation;

        return newOrientation;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DominoSet, DominoRenderer };
}