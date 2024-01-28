import * as fs from 'fs';
import type { FilePath, OffsetPattern } from './';

function writeRegex(regexArray: OffsetPattern[], filePath: FilePath): void {
  fs.writeFileSync(
    filePath,
    `const SigniturePatterns: RegExp[] = [\n${regexArray.map((regex) => `${regex},`).join('\n')}\n];`,
  );
}

export { writeRegex };
