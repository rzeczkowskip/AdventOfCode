import readline from 'readline';

export const writeLine = (...lines: string[]): void =>
  lines.forEach((line) => console.log(line));

const getIo = () =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

export const readMultilineInput = async (prompt: string): Promise<string> => {
  writeLine(prompt);

  const io = getIo();
  return new Promise((resolve) => {
    const input: string[] = [];

    io.on('line', (line) => {
      if (line === '') {
        io.close();
        resolve(input.join('\n'));
      }

      input.push(line);
    });
  });
};
