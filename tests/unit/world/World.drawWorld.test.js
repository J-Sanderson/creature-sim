/**
 * @jest-environment jsdom
 */
import 'jest-canvas-mock';
import { World } from '../../../src/world/World';

describe('drawWorld', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const fakeCtx = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      rect: jest.fn(),
      stroke: jest.fn(),
      strokeStyle: null,
      lineWidth: 0,
    };
    jest.spyOn(World.prototype, 'init').mockImplementation(function () {
      const wrapper = document.createElement('div');
      const canvas = document.createElement('canvas');
      wrapper.appendChild(canvas);
      this.elements = {
        root: document.createElement('div'),
        canvasWrapper: wrapper,
        canvas,
      };
      this.ctx = fakeCtx;
      this.drawWorld();
    });
  });
  afterEach(() => jest.restoreAllMocks());

  test('clears a rectangle of the appropriate size', () => {
    const width = 3;
    const height = 4;
    const cellSize = 10;
    const el = document.createElement('div');
    const world = new World(el, { width, height, cellSize });

    expect(world.ctx.clearRect).toHaveBeenCalledTimes(1);
    expect(world.ctx.clearRect).toHaveBeenCalledWith(
      0,
      0,
      width * cellSize,
      height * cellSize
    );
  });

  test('sets canvas element dimensions', () => {
    const width = 3;
    const height = 4;
    const cellSize = 10;
    const el = document.createElement('div');
    const world = new World(el, { width, height, cellSize });

    expect(world.elements.canvas.width).toBe(width * cellSize);
    expect(world.elements.canvas.height).toBe(height * cellSize);
  });

  test('draws world cells', () => {
    const width = 3;
    const height = 4;
    const cellSize = 10;
    const lineWidth = 1;
    let cells = width * height;
    const el = document.createElement('div');
    const world = new World(el, { width, height, cellSize, lineWidth });

    expect(world.ctx.beginPath).toHaveBeenCalledTimes(cells);
    expect(world.ctx.strokeStyle).toBe('#000');
    expect(world.ctx.lineWidth).toBe(lineWidth);
    expect(world.ctx.rect).toHaveBeenCalledTimes(cells);
    expect(world.ctx.rect).toHaveBeenLastCalledWith(
      (height - 1) * cellSize,
      (width - 1) * cellSize,
      cellSize,
      cellSize
    );
    expect(world.ctx.stroke).toHaveBeenCalledTimes(cells);
  });
});
