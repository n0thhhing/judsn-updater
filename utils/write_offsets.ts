import chalk from 'chalk';

// TODO: add format options
async function writeOffsets(
  filePath: FilePath,
  info: OffsetInfo[],
  formatType: FormatType,
): Promise<void> {
  const startTime: Time = performance.now();
  const lines: string[] = [];

  for (const offsetInfo of info) {
    const line: string = `${offsetInfo.offset} -- ${offsetInfo.name}`;

    lines.push(line);
  }

  const elapsedTime: Time = performance.now() - startTime;

  console.log(
    chalk.grey(
      `writeOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
    ),
  );

  Bun.write(Bun.file(filePath), lines.join('\n'));
}

export { writeOffsets };
