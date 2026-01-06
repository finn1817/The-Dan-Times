// Hand-crafted board layouts for the Pips game.
//
// Each shape describes:
// - an overall gridSize (rows/cols big enough to contain the shape)
// - a list of regions
//     - id: numeric region id
//     - cells: array of { row, col } squares belonging to the region
//     - rule: { type, value, label }
//         type: "sum" | "match" | "min" | "max" | "different" | "zero"
//         value: number | null
//         label: function(value) -> string (used by game.js)
//     - color: string used as CSS suffix (region-<color>)

// NOTE: Shapes and puzzles here are original, not copied from NYT.

// Helper rule factories
const Rules = {
	sum(value) {
		return { type: 'sum', value, label: v => `${v}` };
	},
	min(value) {
		return { type: 'min', value, label: v => `${v}↑` };
	},
	max(value) {
		return { type: 'max', value, label: v => `${v}↓` };
	},
	match(value) {
		return { type: 'match', value, label: v => `${v}` };
	},
	different() {
		return { type: 'different', value: null, label: () => '⊕' };
	},
	// Zero-region: all cells must be 0 pips, behaves like a sum=0 but
	// communicates intent more clearly.
	zero() {
		return { type: 'zero', value: 0, label: () => '0' };
	},
};

// A very simple "stair" shape similar to your paint mockup.
// Grid: 5x5, three main regions plus a zero region of neutral cells.
const basicStairShape = {
	id: 'basic-stair-1',
	gridSize: { rows: 5, cols: 5 },
	regions: [
		// Top left 2x2 square (sum rule)
		{
			id: 0,
			cells: [
				{ row: 0, col: 0 },
				{ row: 0, col: 1 },
				{ row: 1, col: 0 },
				{ row: 1, col: 1 },
			],
			rule: Rules.sum(6),
			color: 'purple',
		},

		// Right vertical bar (min rule)
		{
			id: 1,
			cells: [
				{ row: 0, col: 3 },
				{ row: 1, col: 3 },
				{ row: 2, col: 3 },
				{ row: 3, col: 3 },
			],
			rule: Rules.min(3),
			color: 'teal',
		},

		// Bottom horizontal bar (sum rule)
		{
			id: 2,
			cells: [
				{ row: 3, col: 1 },
				{ row: 3, col: 2 },
				{ row: 4, col: 1 },
				{ row: 4, col: 2 },
			],
			rule: Rules.sum(12),
			color: 'orange',
		},

		// Neutral zero region in the gaps (acts like 0-valued squares)
		{
			id: 3,
			cells: [
				{ row: 2, col: 1 },
				{ row: 2, col: 2 },
			],
			rule: Rules.zero(),
			color: 'gray',
		},
	],
};

// Collection by difficulty. These are boards only – the domino solution
// is defined in puzzle-generator / PREDEFINED_PUZZLES.
export const BOARD_SHAPES = {
	easy: [basicStairShape],
	medium: [],
	hard: [],
};

export { Rules };

// CommonJS support for tests or Node usage
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { BOARD_SHAPES, Rules };
}

