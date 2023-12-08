import { withInput } from './support/io';

// const demoInput = `LLR
//
// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)`;

const demoInput = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

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
        nodeString.match(
          /^([a-z0-9]{3}) = \(([a-z0-9]{3}), ([a-z0-9]{3})\)$/i,
        ) || [];

      return [node, { L, R }];
    }),
  );

  // const start = 'AAA';
  // const end = 'ZZZ';
  // let current = start;
  //
  // while (current !== end) {
  //   current = nodes[current][stepProvider.next];
  // }
  //

  const currentValues = Object.keys(nodes).filter((node) => node.endsWith('A'));
  const results: number[] = [];
  currentValues.forEach((value) => {
    const stepProvider = new InstructionsProvider(instructions);

    let current = value;
    while (!current.endsWith('Z')) {
      current = nodes[current][stepProvider.next];
    }

    results.push(stepProvider.steps);
  });
  // console.log(currentValues);
  // while (!doesAllValuesEndWith(currentValues, 'Z')) {
  //   const nextStep = stepProvider.next;
  //
  //   currentValues.forEach((current, index, array) => {
  //     // eslint-disable-next-line no-param-reassign
  //     array[index] = nodes[current][nextStep];
  //   });
  // }

  const greatestCommonDivisor = (a: number, b: number): number => {
    if (a === 0) return b;
    return greatestCommonDivisor(b % a, a);
  };

  while (results.length > 1) {
    const a = results.pop() as number;
    const b = results.pop() as number;

    results.push((a * b) / greatestCommonDivisor(a, b));
  }

  return results[0].toString();
}, demoInput);
