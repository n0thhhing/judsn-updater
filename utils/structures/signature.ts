import fs from 'fs';
import chalk from 'chalk';
import { performance } from 'perf_hooks';

import type {
  FilePath,
  MethodSignature,
  Data,
  SignatureUtils as SignatureUtil,
  Offset,
  Count,
  ReturnedSignature,
  Time,
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
      const startTime: Time = performance.now();

      const contentPromise: Promise<string> = new Promise((resolve, reject) => {
        const stream = fs.createReadStream(this.path, {
          encoding: 'utf8',
        });
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

      const elapsedTime: Time = performance.now() - startTime;
      console.log(
        chalk.grey(
          `getContent(${this.path}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
        ),
      );

      return content;
    } catch (error: any) {
      console.error('Error reading fs:', error);
      return 'failed';
    }
  }

  async findPatterns(patterns: RegExp[] | RegExp): Promise<string> {
    const contentToTest: string = await this.content;

    const getMatches = (pattern: RegExp) => {
      const matches = contentToTest.match(pattern) || [];
      return matches.map((match) => match[1]); // Assuming you want the first capturing group [1]
    };

    const results: string[] = Array.isArray(patterns)
      ? patterns.flatMap(getMatches)
      : getMatches(patterns);

    const totalMatches: number = results.length;

    return `0x${totalMatches.toString(16)}`;
  }

  public async getSignature(
    offset: Offset,
    amount: Count = 0,
  ): Promise<ReturnedSignature> {
    try {
      const regexArray = Array.from(
        { length: amount },
        () =>
          `,\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": [0-9]+,\n      "Name": "\\S+",\n      +"Signature": "(.+)"`,
      );

      const regexStr = regexArray.join('');
      const idx =
        offset !== null && typeof offset === 'number'
          ? offset.toString()
          : offset?.toString() || '';
      const content = await this.content;
      const regex: RegExp = new RegExp(
        `"Signature": "(.*)",\n      "TypeSignature": "\\S+"\n    \\},\n\\s+{\n      "Address": ${idx},\n      "Name": "\\S+",\n      "Signature": "(.*)"${regexStr}`,
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
  
async getName(offset: string | number): Promise<string | null> {
    offset = typeof offset === "number" ? offset.toString() : parseInt(offset).toString()
    const match = new RegExp(`"Address": ${offset},\n\\s+"Name": "(.*)"`, "g").exec(await this.content)
    return match && match[1] ? match[1] : null
  }

  public async getSigOffset(
    signature: MethodSignature,
    previousSignature?: MethodSignature,
    signatures?: MethodSignature[],
  ): Promise<object | null> {
    const dataContent: Data = await this.content;
    const sigArray =
      signatures?.map(
        (sig) =>
          `,\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": [0-9]+,\n      "Name": "\\S+",\n      "Signature": "${sig.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          )}"`,
      ) || [];

    const outSignatures = sigArray.join('');
    const regex = new RegExp(
      `${
        previousSignature
          ? `"Signature": "${previousSignature.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&',
            )}",\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": `
          : ''
      }([0-9]+),\n      "Name": ".*",\\n      "Signature": "${signature.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}"${outSignatures}`,
      'g',
    );
    const match = regex.exec(dataContent);

    return match
      ? {
          newOffset: `0x${parseInt(match[1], 10).toString(16).toUpperCase()}`,
          regex,
        }
      : null;
  }
}
export { SignatureUtils };
