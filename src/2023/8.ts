import { sumArrayValues } from './support/array';
import { withInput } from './support/io';
import { strToInt } from './support/number';

const demoInput = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

class InstructionsProvider {
  private currentIndex: number = 0;

  private maxIndex: number;

  private stepCount: number = 0;

  constructor(private readonly instructions: string) {
    this.maxIndex = instructions.length - 1;
  }

  get steps(): number {
    return this.stepCount;
  }

  get next(): 'L' | 'R' {
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = 0;
    }

    const step = this.instructions[this.currentIndex];

    this.currentIndex += 1;
    this.stepCount += 1;

    return step as 'L' | 'R';
  }
}

withInput(async (input) => {
  const [instructions, , ...nodesString] = input.split('\n');

  const nodes = Object.fromEntries(
    nodesString.map((nodeString) => {
      const [, node, L, R] =
        nodeString.match(/^([a-z]{3}) = \(([a-z]{3}), ([a-z]{3})\)$/i) || [];

      return [node, { L, R }];
    }),
  );

  const stepProvider = new InstructionsProvider(instructions);
  const start = 'AAA';
  const end = 'ZZZ';
  let current = start;

  while (current !== end) {
    current = nodes[current][stepProvider.next];
  }

  return stepProvider.steps.toString();
}, demoInput);
