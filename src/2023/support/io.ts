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
export const withInput = async (
  callback: (input: string) => Promise<string | string[]>,
  demoInput?: string,
) => {
  const useDemoInput =
    process.env?.DEMO === '1' && typeof demoInput === 'string';

  const input = useDemoInput
    ? demoInput
    : await readMultilineInput('Provide input:');

  const start = Date.now();
  const result = await callback(input.trim());
  const end = Date.now();

  writeLine(
    ...(Array.isArray(result) ? result : [result]),
    `Solution time: ${end - start}ms`,
  );
};
