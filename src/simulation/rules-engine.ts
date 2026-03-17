import { Grid } from './grid';
import { CELL_TYPES, getCellType, countType, countFriendly } from './cell-types';

interface BirthCandidate {
  type: number;
  sameTypeCount: number;
  priority: number;
}

export function evaluateTick(grid: Grid, wrap: boolean): void {
  const { width, height } = grid;

  // Clear the next buffer
  grid.next.fill(0);

  // Phase 1: Survival + Predation for existing cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cellType = grid.get(x, y);
      if (cellType === 0) continue;

      const neighbors = grid.getNeighbors(x, y, wrap);
      const typeConfig = getCellType(cellType);
      const rules = typeConfig.rules;

      // Count friendly neighbors (self + symbiont)
      const friendlyCount = countFriendly(neighbors, cellType, rules.symbiont);

      // Check custom death condition first
      let dies = false;
      if (rules.deathCondition && rules.deathCondition(neighbors, cellType)) {
        dies = true;
      }

      // Check survival range using friendly count
      if (!dies) {
        const [min, max] = rules.surviveRange;
        dies = friendlyCount < min || friendlyCount > max;
      }

      // Check predation: if enough predator neighbors, CONVERT to predator type
      if (rules.predator !== undefined) {
        const predatorCount = countType(neighbors, rules.predator);
        const threshold = rules.predatorThreshold ?? 2;
        if (predatorCount >= threshold) {
          // Convert to predator type (overrides survival)
          grid.setNext(x, y, rules.predator);
          continue;
        }
      }

      if (!dies) {
        grid.setNext(x, y, cellType);
      }

      // ChatGPT Essay special: 5% chance to convert adjacent AI Code
      if (!dies && cellType === 2 && Math.random() < 0.05) {
        const neighborCoords = grid.getNeighborCoords(x, y, wrap);
        for (const [nx, ny] of neighborCoords) {
          if (grid.get(nx, ny) === 8 && grid.next[ny * width + nx] === 8) {
            grid.setNext(nx, ny, 2);
            break; // Convert only one per tick
          }
        }
      }

      // Clickbait special: on natural death (not predation), 20% chance to explode
      if (dies && cellType === 7 && Math.random() < 0.2) {
        const neighborCoords = grid.getNeighborCoords(x, y, wrap);
        for (const [nx, ny] of neighborCoords) {
          if (grid.get(nx, ny) === 0 && grid.next[ny * width + nx] === 0) {
            grid.setNext(nx, ny, Math.floor(Math.random() * 8) + 1);
          }
        }
      }
    }
  }

  // Phase 2: Birth for empty cells
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Skip if already occupied (by survival, predation, or clickbait explosion)
      if (grid.next[y * width + x] !== 0) continue;
      if (grid.get(x, y) !== 0) continue; // Was occupied but died — don't birth here in same tick

      const neighbors = grid.getNeighbors(x, y, wrap);
      const candidates: BirthCandidate[] = [];

      for (const type of CELL_TYPES) {
        if (type.id === 0) continue;
        if (type.rules.birthCondition(neighbors, type.id)) {
          candidates.push({
            type: type.id,
            sameTypeCount: countType(neighbors, type.id),
            priority: type.rules.conflictPriority,
          });
        }
      }

      if (candidates.length === 0) continue;

      // Conflict resolution: local majority first, then priority tiebreak
      candidates.sort((a, b) => {
        if (b.sameTypeCount !== a.sameTypeCount) return b.sameTypeCount - a.sameTypeCount;
        if (b.priority !== a.priority) return b.priority - a.priority;
        return Math.random() - 0.5; // Random final tiebreak
      });

      grid.next[y * width + x] = candidates[0].type;
    }
  }

  // Phase 3: AI Code cascade (redesigned — only propagates through dense nodes)
  applyAICodeCascade(grid, wrap);

  // Phase 4: Update metadata (deepfake disguise)
  updateMetadata(grid);
}

function applyAICodeCascade(grid: Grid, wrap: boolean): void {
  const { width, height } = grid;

  // Find AI Code cells that just died
  const deadCodeCells: Array<[number, number]> = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid.get(x, y) === 8 && grid.next[y * width + x] === 0) {
        deadCodeCells.push([x, y]);
      }
    }
  }

  if (deadCodeCells.length === 0) return;

  for (const [dx, dy] of deadCodeCells) {
    // 20% chance per dead cell to trigger cascade
    if (Math.random() >= 0.2) continue;

    // BFS: only propagate through cells with 3+ Code neighbors (dense nodes)
    const visited = new Set<number>();
    const queue: Array<[number, number]> = [];
    const cluster: Array<[number, number]> = [];

    const startNeighbors = grid.getNeighborCoords(dx, dy, wrap);
    for (const [nx, ny] of startNeighbors) {
      const idx = ny * width + nx;
      if (grid.get(nx, ny) === 8 && grid.next[idx] === 8 && !visited.has(idx)) {
        // Only enter dense nodes (3+ code neighbors)
        const codeNeighborCount = countType(grid.getNeighbors(nx, ny, wrap), 8);
        if (codeNeighborCount >= 3) {
          queue.push([nx, ny]);
          visited.add(idx);
        }
      }
    }

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      cluster.push([cx, cy]);

      const coords = grid.getNeighborCoords(cx, cy, wrap);
      for (const [nx, ny] of coords) {
        const idx = ny * width + nx;
        if (grid.get(nx, ny) === 8 && grid.next[idx] === 8 && !visited.has(idx)) {
          const codeNeighborCount = countType(grid.getNeighbors(nx, ny, wrap), 8);
          if (codeNeighborCount >= 3) {
            queue.push([nx, ny]);
            visited.add(idx);
          }
        }
      }
    }

    // Kill the dense cluster
    for (const [cx, cy] of cluster) {
      grid.setNext(cx, cy, 0);
    }
  }
}

function updateMetadata(grid: Grid): void {
  const { width, height } = grid;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const meta = grid.getMetadata(x, y);
      if (meta > 0) {
        grid.setMetadata(x, y, meta - 1);
      }

      // Deepfake: 30% chance to set disguise on birth
      const idx = y * width + x;
      if (grid.next[idx] === 3 && grid.current[idx] !== 3) {
        if (Math.random() < 0.3) {
          grid.setMetadata(x, y, 3);
        }
      }
    }
  }
}
