export interface Pattern {
  name: string;
  category: string;
  description: string;
  grid: number[][];
}

// Cell type IDs:
// 0=Empty, 1=AI Art, 2=ChatGPT Essay, 3=Deepfake, 4=AI Music,
// 5=SEO Spam, 6=AI Influencer, 7=Clickbait, 8=AI Code

export const PATTERNS: Pattern[] = [
  {
    name: 'The Viral Loop',
    category: 'gliders',
    description: 'Clickbait + AI Art moving diagonally',
    grid: [
      [0, 7, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [7, 1, 7, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 7, 0, 0],
    ],
  },
  {
    name: 'The Content Farm',
    category: 'stills',
    description: 'Self-sustaining SEO + Essay block',
    grid: [
      [2, 2, 2, 2, 2],
      [2, 5, 5, 5, 2],
      [2, 5, 5, 5, 2],
      [2, 5, 5, 5, 2],
      [2, 2, 2, 2, 2],
    ],
  },
  {
    name: 'The Hype Cycle',
    category: 'oscillators',
    description: 'Influencer + Art + Clickbait cycle',
    grid: [
      [0, 6, 0],
      [1, 0, 7],
      [0, 1, 0],
      [7, 0, 6],
      [0, 7, 0],
    ],
  },
  {
    name: 'npm install',
    category: 'exploders',
    description: 'AI Code cluster cascade collapse',
    grid: [
      [0, 8, 8, 8, 0],
      [8, 8, 8, 8, 8],
      [8, 8, 0, 8, 8],
      [8, 8, 8, 8, 8],
      [0, 8, 8, 8, 0],
    ],
  },
  {
    name: 'Dead Internet',
    category: 'fills',
    description: 'Bots talking to bots',
    grid: [
      [5, 2, 6, 7, 5, 2],
      [7, 5, 2, 5, 7, 6],
      [2, 7, 5, 6, 2, 5],
      [6, 2, 7, 2, 5, 7],
      [5, 6, 5, 7, 6, 2],
      [2, 5, 6, 5, 2, 6],
    ],
  },
  {
    name: 'The Algorithm',
    category: 'methuselahs',
    description: 'Small seed, chaotic growth over hundreds of gens',
    grid: [
      [0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 0, 0],
      [7, 0, 0, 0, 0, 3, 0],
      [0, 0, 6, 0, 0, 0, 2],
    ],
  },
  {
    name: 'Sloppy Glider',
    category: 'gliders',
    description: 'Classic glider shape with mixed slop',
    grid: [
      [0, 1, 0],
      [0, 0, 5],
      [7, 1, 5],
    ],
  },
  {
    name: 'AI Art Gallery',
    category: 'stills',
    description: 'A stable cluster of AI art',
    grid: [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1],
    ],
  },
  {
    name: 'Music Festival',
    category: 'oscillators',
    description: 'Pulsing AI music cluster',
    grid: [
      [0, 4, 4, 0],
      [4, 0, 0, 4],
      [4, 0, 0, 4],
      [0, 4, 4, 0],
    ],
  },
  {
    name: 'Deepfake Factory',
    category: 'exploders',
    description: 'Spawns disguised deepfakes in all directions',
    grid: [
      [0, 3, 0, 3, 0],
      [3, 0, 3, 0, 3],
      [0, 3, 0, 3, 0],
    ],
  },
];
