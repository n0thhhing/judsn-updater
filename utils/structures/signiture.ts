import fs from 'fs';
import chalk from 'chalk';
import { performance } from 'perf_hooks';

import type {
  FilePath,
  MethodSignature,
  Data,
  SignatureUtils as SignatureUtil,
  Offset,
} from '../types';

class SignatureUtils implements SignatureUtil {
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

        stream.on('data', (chunk) => {
          data += chunk;
        });

        stream.on('end', () => {
          resolve(data);
        });

        stream.on('error', (error) => {
          reject(error);
        });
      });

      const content: Data = await contentPromise;

      const elapsedTime: number = performance.now() - startTime;
      console.log(
        chalk.grey(
          `getContent(${this.path}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
        ),
      );

      return content;
    } catch (error: any) {
      console.error('Error reading file:', error);
      return 'failed';
    }
  }

  public async getSignature(
    offset: Offset,
    amount: number = 0,
  ): Promise<object | null> {
    try {
      const regexArray = Array.from(
        { length: amount },
        () =>
          `,\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+\\{\n\\s+"Address": [0-9]+,\n\\s+"Name": "\\S+",\n\\s+"Signature": "(.+)"`,
      );

      const regexStr = regexArray.join('');
      const idx =
        offset !== null && typeof offset === 'number'
          ? offset.toString()
          : offset?.toString() || '';
      const content = await this.content;
      const regex = new RegExp(
        `"Signature": "(.*)",\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+{\n\\s+"Address": ${idx},\n\\s+"Name": "\\S+",\n\\s+"Signature": "(.*)"${regexStr}`,
      );

      const match = regex.exec(content);
      const signatures = match ? match.slice(3) : [];

      return match
        ? {
            sig1: match[1],
            signature: match[2],
            signatures,
          }
        : null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getSigOffset(
    signature: MethodSignature,
    previousSig?: MethodSignature,
    signatures?: MethodSignature[],
  ): Promise<string | null> {
    const dataContent: Data = await this.content;
    const sigArray =
      signatures?.map(
        (sig) =>
          `,\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+\\{\n\\s+"Address": [0-9]+,\n\\s+"Name": "\\S+",\n\\s+"Signature": "${sig.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          )}"`,
      ) || [];

    const outSignatures = sigArray.join('');
    const regex = new RegExp(
      `${
        previousSig
          ? `"Signature": "${previousSig.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&',
            )}",\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+\\{\n\\s+"Address": `
          : ''
      }([0-9]+),\n\\s+"Name": ".*",\\n\\s+"Signature": "${signature.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}"${outSignatures}`,
      'g',
    );
    const match = regex.exec(dataContent);

    return match
      ? `0x${parseInt(match[1], 10).toString(16).toUpperCase()}`
      : null;
  }
}
export { SignatureUtils };
