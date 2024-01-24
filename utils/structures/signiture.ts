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

  public async getSignature(
    offset: Offset,
    amount: Count = 0,
  ): Promise<ReturnedSignature> {
    try {
      const regexArray: object = Array.from(
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
      /*const regex: RegExp = new RegExp(
        `"Signature": "(.*)",\\s+"TypeSignature": "\\S+"\n\\s+\\},\n\\s+{\n\\s+"Address": ${idx},\n\\s+"Name": "\\S+",\n\\s+"Signature": "(.*)"${regexStr}`,
      );*/

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
    previousSignature?: MethodSignature,
    signatures?: MethodSignature[],
  ): Promise<string | null> {
    const dataContent: Data = await this.content;
    const escapedSignature = signature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const escapedPreviousSignature = previousSignature
      ? previousSignature.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      : '';

    const processSignature = async (sig: MethodSignature) => {
      const escapedSig = sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return `,\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": [0-9]+,\n      "Name": "\\S+",\n      "Signature": "${escapedSig}"`;
    };

    const signaturesPromises = (signatures || []).map((sig) =>
      processSignature(sig),
    );
    const sigArray = await Promise.all(signaturesPromises);

    const regexPattern = `${previousSignature ? `"Signature": "${escapedPreviousSignature}",\\s*"TypeSignature": "\\S+"\\s*},\\s*{\\s*"Address": ` : ''}([0-9]+),\\s*"Name": "\\S+",\\s*"Signature": "${escapedSignature}"${sigArray.join('')}`;

    const regex = new RegExp(regexPattern);
    const match = regex.exec(dataContent);

    if (match) {
      return `0x${(+match[1]).toString(16).toUpperCase()}`;
    }

    return null;
  }
}
export { SignatureUtils };
