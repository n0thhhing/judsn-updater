import chalk from 'chalk';

async function writeOffsets(
  filePath,
  info,
  inputType,
  formatType,
) {
  const startTime = performance.now();
  const lines = [];

  for (let i = 0; i < info.length; i++) {
    const offsetInfo = info[i];
    let line;

    if (formatType !== 'judsn') {
      line = `${offsetInfo.offset} -- ${offsetInfo.name}`;
    } else {
      if (inputType === 'offset') {
        switch (i) {
          case 21:
          case 27:
          case 32:
          case 39:
          case 69:
            line = `Offset[${i + 1}] = 0x2602920 -- broken`;
            break;
          default:
            if (offsetInfo.name.includes("rarity [2]")) continue;
            line = `Offset[${i + 1}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
        }
      } else {
        line = `Field[${i + 1}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
      }
    }

    lines.push(line);
  }

  Bun.write(Bun.file(filePath), lines.join('\n'));
  const elapsedTime = performance.now() - startTime;
  console.log(
    chalk.grey(
      `writeOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
    ),
  );
}

export { writeOffsets };
