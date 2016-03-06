import { Block, BlockGrid, COLOURS } from '../app/javascript/grid';
import { assert, expect } from 'chai';

let { describe, it } = window;

describe('Block', () => {
    it('should be created with correctly', () => {
        let testCoords = [
            [1, 2],
            [4, 9],
            [0, 0]
        ];

        testCoords.forEach((testCoord) => {
            let block = new Block(...testCoord);
            assert.equal(block.x, testCoord[0], 'x is set correctly');
            assert.equal(block.y, testCoord[1], 'y is set correctly');
            assert.ok(COLOURS.indexOf(block.colour) > -1, 'colour is valid');
        });
    });
});

describe('BlockGrid', function () {
    describe('#traverseAndRemoveMatchingNeighbours', function () {
        const expectations = [
            {
                description: 'should remove a single colour with no matching neighbours',
                params: {
                    block: {x: 0, y: 0, colour: 'red'},
                    grid: [
                        [ {x: 0, y: 0, colour: 'red'}, {x: 0, y: 1, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                }
            },
            {
                description: 'should remove a pair of matching colours',
                params: {
                    block: {x: 0, y: 0, colour: 'red'},
                    grid: [
                        [ {x: 0, y: 0, colour: 'red'}, {x: 0, y: 1, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'red'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'transparent'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                }
            },
            {
                description: 'should remove another pair of matching colours',
                params: {
                    block: {x: 0, y: 0, colour: 'red'},
                    grid: [
                        [ {x: 0, y: 0, colour: 'red'}, {x: 0, y: 1, colour: 'red'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'} ]
                    ]
                }
            },
            {
                description: 'should remove a square block of matching colours',
                params: {
                    block: {x: 0, y: 0, colour: 'red'},
                    grid: [
                        [ {x: 0, y: 0, colour: 'red'}, {x: 0, y: 1, colour: 'red'} ],
                        [ {x: 1, y: 0, colour: 'red'}, {x: 1, y: 1, colour: 'red'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'transparent'}, {x: 1, y: 1, colour: 'transparent'} ]
                    ]
                }
            },
            {
                description: 'should do nothing with transparent blocks',
                params: {
                    block: {x: 0, y: 0, colour: 'transparent'},
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'transparent'}, {x: 1, y: 1, colour: 'transparent'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'transparent'}, {x: 1, y: 1, colour: 'transparent'} ]
                    ]
                }
            }
        ];

        expectations.forEach((testCase) => {
            it(testCase.description, function () {
                const {params, result} = testCase;
                const newGrid = new BlockGrid().traverseAndRemoveMatchingNeighbours(params.block, params.grid);
                expect(newGrid).to.deep.equal(result.grid);
            });
        });
    });

    describe('#reorderColumns', function () {
        const expectations = [
            {
                description: 'should move a single transparent block to the top of its column',
                params: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'blue'}, {x: 0, y: 2, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'}, {x: 1, y: 2, colour: 'blue'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'blue'}, {x: 0, y: 1, colour: 'blue'}, {x: 0, y: 2, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'yellow'}, {x: 1, y: 1, colour: 'green'}, {x: 1, y: 2, colour: 'blue'} ]
                    ]
                }
            },
            {
                description: 'should move a multiple transparent blocks to the top of their columns',
                params: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'transparent'}, {x: 0, y: 1, colour: 'red'}, {x: 0, y: 2, colour: 'blue'} ],
                        [ {x: 1, y: 0, colour: 'transparent'}, {x: 1, y: 1, colour: 'transparent'}, {x: 1, y: 2, colour: 'green'} ]
                    ]
                },
                result: {
                    grid: [
                        [ {x: 0, y: 0, colour: 'red'}, {x: 0, y: 1, colour: 'blue'}, {x: 0, y: 2, colour: 'transparent'} ],
                        [ {x: 1, y: 0, colour: 'green'}, {x: 1, y: 1, colour: 'transparent'}, {x: 1, y: 2, colour: 'transparent'} ]
                    ]
                }
            }

        ];

        expectations.forEach((testCase) => {
            it(testCase.description, function () {
                const {params, result} = testCase;
                const newGrid = new BlockGrid().reorderColumns(params.grid);
                expect(newGrid).to.deep.equal(result.grid);
            });
        });
    });
});
