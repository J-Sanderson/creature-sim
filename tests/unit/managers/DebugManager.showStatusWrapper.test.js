/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';

describe('showStatusWrapper', () => {
  let debugManager;
  let world;
  beforeEach(() => {
    debugManager = new DebugManager();
    world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);
  });

  test('adds status wrapper to world elements', () => {
    expect(world.elements).toHaveProperty('statusWrapper');
  });

  test('status wrapper is HTML div element', () => {
    expect(world.elements.statusWrapper).toBeInstanceOf(HTMLDivElement);
  });

  test('status wrapper has status-wrapper class', () => {
    expect(
      world.elements.statusWrapper.classList.contains('status-wrapper')
    ).toBe(true);
  });

  test('status wrapper has initial status content', () => {
    expect(world.elements.statusWrapper.querySelector('p')?.textContent).toBe(
      'Status'
    );
  });

  test('status wrapper is child of world root element', () => {
    expect(world.elements.statusWrapper.parentElement).toBe(
      world.elements.root
    );
    expect(world.elements.root.contains(world.elements.statusWrapper)).toBe(
      true
    );
  });
});
