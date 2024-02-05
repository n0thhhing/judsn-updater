import { expect, test } from 'bun:test';
import fs from 'fs/promises';

import {
  SignatureUtils,
  regex_out,
  writeRegex,
  type Data,
  type Offset,
  type OffsetPattern,
} from '../utils';

const readOffsetsFromFile = async (filePath: string): Promise<number[]> => {
  const data: Data = await fs.readFile(filePath, 'utf8');

  return data.split('\n').map((line) => parseInt(line.split(' -- ')[0]));
};

const sig: SignatureUtils = new SignatureUtils('./data/dump/data.json');
const offsets: Offset[] = await readOffsetsFromFile('./dist/offsets.txt');
const regexArray: OffsetPattern[] = [];
let iterationCount = 0;

await Promise.all(
  offsets.map(async (offset, i) => {
    test(`offset${i}`, async () => {
      const oldOffset = `0x${offset.toString(16).toUpperCase()}`;
      const { sig1, signature, signatures }: any = await sig.getSignature(
        offset,
        40,
      );

      const { newOffset, regex }: any = signature
        ? await sig.getSigOffset(signature, sig1, signatures)
        : { newOffset: null, regex: null };

      console.log({
        signature,
        offset: { newOffset, parsed: parseInt(newOffset || 'NaN') },
      });
      expect(newOffset).toMatch(oldOffset);
      regexArray.push(regex);

      iterationCount++;

      if (iterationCount === offsets.length) {
        writeRegex(regexArray, regex_out);
      }
    });
  }),
);
