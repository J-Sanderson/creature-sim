/**
 * @jest-environment jsdom
 */

import { DebugManager } from '../../../src/managers/DebugManager';
import { worldBuilder } from '../../helpers/worldBuilder';

describe('showStatusWrapper', () => {
  test('adds status wrapper to world elements', () => {
    const debugManager = new DebugManager();
    let world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);

    expect(world.elements).toHaveProperty('statusWrapper');
  });

  test('status wrapper is HTML div element', () => {
    const debugManager = new DebugManager();
    let world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);

    expect(world.elements.statusWrapper).toBeInstanceOf(HTMLDivElement);
  });

  test('status wrapper has status-wrapper class', () => {
    const debugManager = new DebugManager();
    let world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);

    expect(Array.from(world.elements.statusWrapper.classList)).toContain(
      'status-wrapper'
    );
  });

  test('status wrapper has initial status content', () => {
    const debugManager = new DebugManager();
    let world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);

    expect(world.elements.statusWrapper.innerHTML).toBe('<p>Status</p>');
  });

  test('status wrapper is child of world root element', () => {
    const debugManager = new DebugManager();
    let world = worldBuilder({ entities: { items: [], creatures: [] } });
    debugManager.showStatusWrapper(world);

    expect(world.elements.statusWrapper.parentElement).toBe(
      world.elements.root
    );
  });
});
