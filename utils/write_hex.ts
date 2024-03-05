import chalk from 'chalk';
import { getHex, readLibraryFile, signature_length } from './';

// TODO: make this not dumb... again
async function writeHex(
  filePath: FilePath,
  libPath: FilePath,
  info: OffsetInfo[],
): Promise<void> {
  const startTime: Time = performance.now();
  const lines: string[] = [];
  const libData = await readLibraryFile(libPath);

  let i: Index = 1;
  let line: string = '';
  for (const offsetInfo of info) {
    if (i === 33) {
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      line = `Hex[${i}] = "${getHex(libData, offsetInfo.offset, signature_length)}" -- ${offsetInfo.name}`;
      i++;
    } else if (
      offsetInfo.name.includes('rarity [2]') ||
      offsetInfo.name.includes('unlock hidden/exclusive gadgets')
    ) {
      continue;
    } else if (i === 40 || i === 22) {
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      line = `Hex[${i}] = "${getHex(libData, offsetInfo.offset, signature_length)}" -- ${offsetInfo.name}`;
      i++;
    } else if (i === 70 || i === 28) {
      lines.push(`Hex[${i}] = "broken"`);
      i++;
      line = `Hex[${i}] = "${getHex(libData, offsetInfo.offset, signature_length)}" -- ${offsetInfo.name}`;
      i++;
    } else if (i === 74) {
      i += 2;
      line = `Hex[${i}] = "${getHex(libData, offsetInfo.offset, signature_length)}" -- ${offsetInfo.name}`;
      i++;
    } else {
      line = `Hex[${i}] = "${getHex(libData, offsetInfo.offset, signature_length)}" -- ${offsetInfo.name}`;
      i++;
    }
    lines.push(line);
  }

  Bun.write(Bun.file(filePath), lines.join('\n'));
  const elapsedTime: Time = performance.now() - startTime;
  console.log(
    chalk.grey(
      `writeHex(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
    ),
  );
}

export { writeHex };
