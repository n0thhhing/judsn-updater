import chalk from 'chalk';

async function writeOffsets(
 filePath: FilePath,
 info: OffsetInfo[],
 inputType: inputType,
 formatType: FormatType,
) {
 const startTime = performance.now();
 const lines = [];
 let i = 1;

 for (const offsetInfo of info) {
  let line = '';

  if (inputType === 'offset' && formatType === 'judsn') {
   if ([22, 28, 33, 40, 70].includes(i)) {
    for (let j = 0; j < 2; j++) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`);
     i++;
    }
   }

   if (i === 33) {
    for (let j = 0; j < 4; j++) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`);
     i++;
    }
   }

   if (offsetInfo.name.includes("rarity [2]")) {
    i++;
    continue;
   }
  }

  line = `${inputType === 'offset' ? 'Offset' : 'Field'}[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
  lines.push(line);
  i++;
 }

 Bun.write(Bun.file(filePath), lines.join('\n'));
 const elapsedTime = performance.now() - startTime;
 console.log(`writeOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`);
}

export { writeOffsets };
