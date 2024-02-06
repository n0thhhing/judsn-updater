import chalk from 'chalk';

// TODO: add format options
async function writeOffsets(
 filePath: FilePath,
 info: OffsetInfo[],
 inputType: inputType,
 formatType: FormatType,
): Promise<void> {
 const startTime: Time = performance.now();
 const lines: string[] = [];

 if (!(formatType === 'judsn')) {
  for (const offsetInfo of info) {
   const line: string = `${offsetInfo.offset} -- ${offsetInfo.name}`;

   lines.push(line);
  }
 } else {
  let i = 1;
  let line: string = "";
  if (inputType === 'offset') {
   for (const offsetInfo of info) {
    if (i === 22) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    } else if (i === 28) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    } else if (i === 33) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    } else if (offsetInfo.name.includes("rarity [2]")) {
     continue;
    } else if (i === 40) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    } else if (i === 70) {
     lines.push(`Offset[${i}] = 0x2602920 -- broken`)
     i++
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    } else {
     line = `Offset[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
     i++
    }
    lines.push(line);
   }
  } else if (inputType === 'field') {
    for (const offsetInfo of info) {
     line = `Field[${i}] = ${offsetInfo.offset} -- ${offsetInfo.name}`;
      lines.push(line);
     i++
     }
  }
 }
 Bun.write(Bun.file(filePath), lines.join('\n'));
 const elapsedTime: Time = performance.now() - startTime;
 console.log(
  chalk.grey(
   `writeOffsets(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
  ),
 );
}

export { writeOffsets };
