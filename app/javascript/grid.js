export const COLOURS = ['red', 'green', 'blue', 'yellow'];
const MAX_X = 10;
const MAX_Y = 10;
const EMPTY_COLOUR = 'transparent';

function copy (obj) {
    return JSON.parse(JSON.stringify(obj));
}

export class Block {
    constructor (x, y) {
        this.x = x;
        this.y = y;
        this.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    }
}

export class BlockGrid {
    constructor () {
        this.grid = [];

        for (let x = 0; x < MAX_X; x++) {
            let col = [];
            for (let y = 0; y < MAX_Y; y++) {
                col.push(new Block(x, y));
            }

            this.grid.push(col);
        }

        return this;
    }

    render (el = document.querySelector('#gridEl')) {
        for (let x = 0; x < MAX_X; x++) {
            let id = 'col_' + x;
            let colEl = document.createElement('div');
            colEl.className = 'col';
            colEl.id = id;
            el.appendChild(colEl);

            for (let y = MAX_Y - 1; y >= 0; y--) {
                let block = this.grid[x][y],
                    id = `block_${x}x${y}`,
                    blockEl = document.createElement('div');

                blockEl.id = id;
                blockEl.className = 'block';
                blockEl.style.background = block.colour;
                blockEl.addEventListener('click', (evt) => this.blockClicked(evt, block));
                colEl.appendChild(blockEl);
            }
        }

        return this;
    }

    // Dump all state and rerender.
    _purgeAndRender () {
        document.getElementById('gridEl').innerHTML = '';
        this.render();
    }

    _updateGrid (grid) {
        this.grid = grid;
        this._purgeAndRender();
    }

    _getGrid () {
        return copy(this.grid);
    }

    _getCoords (x, y, grid) {
        return grid[x] && grid[x][y];
    }

    isEmpty (block = {}) {
        return block.colour === EMPTY_COLOUR;
    }

    isMatchingNeighbour (blockA, blockB) {
        if (this.isEmpty(blockA) ||
            this.isEmpty(blockA)) {
            return false;
        }

        return (blockA && blockA.colour) &&
               (blockB && blockB.colour) &&
               (blockA.colour === blockB.colour);
    }

    reorderColumns (grid) {
        return grid.map((col) => {
            const remainingBlocks = col.filter((block) => block.colour !== EMPTY_COLOUR);
            const emptyBlocks = col.filter((block) => block.colour === EMPTY_COLOUR);
            return remainingBlocks.concat(emptyBlocks)
                .map((block, i) => {
                    block.y = i;
                    return block;
                });
        });
    }

    traverseAndRemoveMatchingNeighbours (block, grid) {
        const coordTransformations = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        const {x, y} = block;

        const matchingNeighbours = coordTransformations
          .map(([xTransform, yTransform]) => this._getCoords(x + xTransform, y + yTransform, grid))
          .filter((neighbouringBlock) => this.isMatchingNeighbour(block, neighbouringBlock));

        // TODO: Nasty mutation. Ideally we'd return some state as a result of traversing
        // but this avoids infinite recursive loops for now.
        this._getCoords(x, y, grid).colour = EMPTY_COLOUR;

        matchingNeighbours.forEach((neighbouringBlock) => {
            this.traverseAndRemoveMatchingNeighbours(neighbouringBlock, grid);
        });
    }

    blockClicked (e, block) {
        const newGrid = this._getGrid();
        this.traverseAndRemoveMatchingNeighbours(block, newGrid);
        this._updateGrid(
          this.reorderColumns(newGrid)
      );
    }
}

window.addEventListener('DOMContentLoaded', () => new BlockGrid().render());
