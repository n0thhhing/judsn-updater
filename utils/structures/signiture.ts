import fs from 'fs';
import chalk from 'chalk';
import type { SymbolTable } from 'typescript';

type FilePath = string;
type Data = string | Promise<string>;
type MethodSigniture = string;

class SignitureUtils {
  public path: FilePath;
  public readonly content: Data;

  constructor(csPath: FilePath) {
    this.path = csPath;
    this.content = this.getContent();
  }

  public async getContent(): Promise<string> {
    try {
      const startTime: number = performance.now();

      const contentPromise: Promise<string> = new Promise((resolve, reject) => {
        const stream = fs.createReadStream(this.path, { encoding: 'utf8' });
        let data = '';

        stream.on('data', (chunk: any) => {
          data += chunk;
        });

        stream.on('end', () => {
          resolve(data);
        });

        stream.on('error', (error: any) => {
          reject(error);
        });
      });

      const content: Data = await contentPromise;

      const elapsedTime: number = performance.now() - startTime;
      console.log(
        chalk.grey(
          `readDumpFile(${this.path}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
        ),
      );

      return content;
    } catch (error: any) {
      console.error('Error reading file:', error);
      return 'failed';
    }
  }

  async getSignature(offset: string | number): Promise<MethodSigniture | null> {
    const start = performance.now();
    try {
      const idx =
        offset !== null && typeof offset === 'number'
          ? offset.toString()
          : parseInt(offset).toString();

      const content = await this.content;

      const regex = new RegExp(`${idx}.*\\n.*\\n.*"Signature": "(.*)"`, 'g');
      const match = regex.exec(content);
      const signature = match ? match[1] : null;

      return signature;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getSigOffset(Signiture: MethodSigniture): Promise<string | null> {
    const dataContent: Data = await this.content;
    const regex: RegExp = new RegExp(
      `([0-9]+).*\\n.*\\n.*"Signature": "${Signiture.replace(/\(/g, '\\(')
        .replace(/\*/g, '\\*')
        .replace(/\)/g, '\\)')
        .replace(/\./g, '\\.')}"`,
      'g',
    );
    const match = regex.exec(dataContent);
    if (match && match[1]) {
      const newOffset = match[1];
      return `0x${parseInt(newOffset).toString(16).toUpperCase()}`;
    } else {
      return null;
    }
  }
}

export { SignitureUtils };

const parsed_offsets = (filePath: string) => {
  const offsets: number[] = [];
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  for (const line of lines) {
    const [offset] = line.split(' -- ');
    offsets.push(parseInt(offset));
  }
  return offsets;
};

const sig = new SignitureUtils('./datasets/dump/data.json');
/*console.log(
  await sig.getSigOffset(
    'int32_t PlaceableItemSettings___________ (PlaceableItemSettings_o* __this, int32_t _________, const MethodInfo* method);',
  ),
);*/
const passed: string[] = [];
const failed: object[] = [];

const parsed = parsed_offsets('./dist/offsets.txt');
for (let i = 0; i <= parsed.length - 1; i++) {
  let offset = parsed[i];
  const strOffset = `0x${offset.toString(16).toUpperCase()}`;
  const signiture = await sig.getSignature(offset);
  const newOffset = signiture ? await sig.getSigOffset(signiture) : null;
  const status = strOffset === newOffset ? 'passed' : 'failed';
  console.log({ signiture, oldOffset: strOffset, newOffset, status });
  if (status === 'passed') {
    passed.push(strOffset);
  } else {
    failed.push({ old: strOffset, new: newOffset});
  }
}

console.log(
  chalk.green(`Passed: ${chalk.blue(passed.length)}\n`) +
  chalk.red(`Failed: ${chalk.blue(failed.length)}\n`) +
  chalk.grey(`Total: ${chalk.blue(passed.length + failed.length)}`)
)