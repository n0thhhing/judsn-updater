import fs from 'fs';
import chalk from 'chalk';
import type { FilePath, MethodSigniture, Data } from '../types';

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
