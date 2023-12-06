import readline from 'readline';

const writeLine = (...lines: string[]): void =>
  lines.forEach((line) => console.log(line));

const getIo = () =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const readMultilineInput = async (prompt: string): Promise<string> => {
  writeLine(prompt);

  const io = getIo();
  return new Promise((resolve) => {
    const input: string[] = [];

    io.on('line', (line) => {
      if (line === 'END;') {
        io.close();
        resolve(input.join('\n'));
      }

      input.push(line);
    });
  });
};

// eslint-disable-next-line import/prefer-default-export
export const withReadInput = async (
  callback: (input: string) => Promise<string | string[]>,
) => {
  const input = await readMultilineInput('Provide input:');
  const result = await callback(input);

  writeLine(...(Array.isArray(result) ? result : [result]));
};
