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

  public getContent(): Promise<string> {
    const startTime = performance.now();

    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(this.path, { encoding: 'utf8' });
      let data = '';

      stream.on('data', (chunk: any) => {
        data += chunk;
      });

      stream.on('end', () => {
        const elapsedTime = performance.now() - startTime;

        console.log(
          chalk.grey(
            `getContent(${this.path}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
          ),
        );

        resolve(data);
      });

      stream.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  public async getSignature(
    offset: Offset,
    amount: number = 0,
  ): Promise<object | null> {
    try {
      const regexArray: string[] = [];

      for (let i = 0; i < amount; i++) {
        regexArray.push(
          `,\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+\\{\n\\s+"Address": [0-9]+,\n\\s+"Name": "\\S+",\n\\s+"Signature": "(.*)"`,
        );
      }

      const regexStr = regexArray.length > 0 ? regexArray.join('') : '';

      const idx =
        offset !== null && typeof offset === 'number'
          ? offset.toString()
          : offset?.toString() || '';
      const content = await this.content;
      const regex = new RegExp(
        `"Signature": "(.*)",\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+{\n\\s+"Address": ${idx},\n\\s+"Name": "\\S+",\n\\s+"Signature": "(.*)"${regexStr}`,
      );

      const match = regex.exec(content);
      const signatures: string[] = [];
      for (let i = 3; i < regexArray.length + 3; i++) {
        if (match) {
          signatures.push(match[i]);
        }
      }

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
    prevousSig?: MethodSignature,
    signatures?: MethodSignature[],
  ): Promise<string | null> {
    const dataContent: Data = await this.content;
    let sigArray: string[] = [];
    if (signatures)
      for (let i = 0; signatures && i < signatures.length; i++) {
        sigArray.push(
          `,\n\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+\\{\n\\s+"Address": [0-9]+,\n\\s+"Name": "\\S+",\n\\s+"Signature": "${signatures[
            i
          ].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
        );
      }

    const outsignatures = sigArray.length > 0 ? sigArray.join('') : '';
    const regex = new RegExp(
      `${
        prevousSig
          ? `"Signature": "${prevousSig.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&',
            )}",\n\\s+"TypeSignature": "\\S+\"\n\\s+\\},\n\\s+\\{\n\\s+"Address": `
          : ''
      }([0-9]+),\n\\s+"Name": ".*",\\n\\s+"Signature": "${signature.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}"${outsignatures}`,
      'g',
    );
    const match = regex.exec(dataContent);

    return match
      ? `0x${parseInt(match[1], 10).toString(16).toUpperCase()}`
      : null;
  }
}

export { SignatureUtils };
