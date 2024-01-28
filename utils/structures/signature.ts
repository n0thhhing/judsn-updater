import chalk from 'chalk';
import fs from 'fs';
import { performance } from 'perf_hooks';

import type {
  Count,
  Data,
  FilePath,
  MethodSignature,
  Offset,
  OffsetPattern,
  ReturnedSignature,
  SignatureName,
  SignatureOutput,
  SignatureUtil,
  Time,
  Signature,
} from '../';

class SignatureUtils implements SignatureUtil {
  public path: FilePath;
  public readonly content: Data | Promise<Data>;

  constructor(csPath: FilePath) {
    this.path = csPath;
    this.content = this.getContent();
  }

  public async getContent(): Promise<Data> {
    try {
      const startTime: Time = performance.now();

      const contentPromise: Promise<Data> = new Promise((resolve, reject) => {
        const stream: fs.ReadStream = fs.createReadStream(this.path, {
          encoding: 'utf8',
        });

        let data: string= '';

        stream.on('data', (chunk) => {
          data += chunk;
        });

        stream.on('end', () => {
          resolve(data);
        });

        stream.on('error', (error: unknown) => {
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
    } catch (error: unknown) {
      console.error('Error reading fs:', error);

      return 'failed';
    }
  }

  public async getSignature(
    offset: Offset,
    amount: Count = 0,
  ): Promise<ReturnedSignature> {
    try {
      const regexArray: Signature[] = Array.from(
        { length: amount },
        () =>
          `,\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": [0-9]+,\n      "Name": "\\S+",\n      +"Signature": "(.+)"`,
      );

      const regexStr: string = regexArray.join('');
      const idx: string =
        offset !== null && typeof offset === 'number'
          ? offset.toString()
          : offset?.toString() || '';

      const content: Data = await this.content;
      const regex: OffsetPattern = new RegExp(
        `"Signature": "(.*)",\n      "TypeSignature": "\\S+"\n    \\},\n\\s+{\n      "Address": ${idx},\n      "Name": "\\S+",\n      "Signature": "(.*)"${regexStr}`,
      );

      const match: RegExpExecArray | null = regex.exec(content);
      const signatures: Signature[] = match ? match.slice(3) : [];

      return match
        ? {
            sig1: match[1],
            signature: match[2],
            signatures,
          }
        : null;
    } catch (error: unknown) {
      console.error(error);

      return null;
    }
  }

  async getName(offset: Offset): Promise<SignatureName | null> {
    offset =
      typeof offset === 'number'
        ? offset.toString()
        : parseInt(offset).toString();
    const match: RegExpExecArray | null = new RegExp(
      `"Address": ${offset},\n\\s+"Name": "(.*)"`,
      'g',
    ).exec(await this.content);
    return match && match[1] ? match[1] : null;
  }

  public async getSigOffset(
    signature: MethodSignature,
    previousSignature?: MethodSignature,
    signatures?: MethodSignature[],
  ): Promise<SignatureOutput | null> {
    const dataContent: Data = await this.content;
    const sigArray: Signature[] =
      signatures?.map(
        (sig) =>
          `,\n      "TypeSignature": "\\S+"\n    \\},\n    \\{\n      "Address": [0-9]+,\n      "Name": "\\S+",\n      "Signature": "${sig.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&',
          )}"`,
      ) || [];

    const outSignatures: Signature = sigArray.join('');
    const regex: OffsetPattern = new RegExp(
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
      'gu',
    );

    const match: RegExpExecArray | null = regex.exec(dataContent);

    return match
      ? {
          newOffset: `0x${parseInt(match[1]).toString(16).toUpperCase()}`,
          regex,
        }
      : null;
  }
}
export { SignatureUtils };
