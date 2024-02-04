import * as fs from 'fs';

function writeRegex(regexArray: OffsetPattern[], filePath: FilePath): void {
  fs.writeFileSync(
    filePath,
    `const SigniturePatterns: RegExp[] = [\n${regexArray
      .map((regex) => `${regex},`)
      .join('\n')}\n];`,
  );
}

export { writeRegex };
