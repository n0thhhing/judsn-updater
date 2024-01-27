async function writeRegex(regexArray: RegExp[], filePath: string) {
  let lines = 'const SigniturePatterns: RegExp[] = [';
  for (const regex of regexArray) {
    lines += `\n${regex},`;
  }
  lines += '\n]';
  return await Bun.write(filePath, lines);
}

export { writeRegex };
