import chalk from 'chalk';
import type { FileOffsets, Offset, OffsetEntry } from './types';

async function getOffsets(filePath: string): Promise<FileOffsets> {
  const startTime: number = performance.now();
  const fileContent: string = await Bun.file(filePath).text();
  const lines: string[] = fileContent.split('\n');

  const offsets: Offset[] = [];
  const names: string[] = [];
  const entries: OffsetEntry[] = [];

  for (const line of lines) {
    if (line.startsWith('--')) {
      continue;
    }

    const match: RegExpMatchArray | null = line.match(
      /^(0x[\dA-Fa-f]+) -- (.+)$/,
    );

    if (match) {
      const [, offset, name] = match;

      offsets.push(offset);
      names.push(name);

      entries.push({
        offset,
        name,
        description: line,
      });
    }
  }

  const elapsedTime: number = performance.now() - startTime;

  console.log(
    chalk.grey(
      `getOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
    ),
  );

  return { offsets, names, entries };
}

export { getOffsets };
