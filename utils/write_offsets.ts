import { type OffsetInfo } from './types';
import chalk from 'chalk';

async function writeOffsets(
  filePath: string,
  info: OffsetInfo[],
  //updateType: string
): Promise<void> {
  const startTime: number = performance.now();

  let lines: string[] = [];
  for (const offsetInfo of info) {
    const line: string = `${offsetInfo.offset} -- ${offsetInfo.name}`;
    lines.push(line);
  }
  const elapsedTime: number = performance.now() - startTime;
  console.log(
    chalk.grey(
      `writeOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
    ),
  );
  Bun.write(Bun.file(filePath), lines.join('\n'));
}

export { writeOffsets };
