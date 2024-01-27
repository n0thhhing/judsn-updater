import { expect, test } from 'bun:test';
import fs from 'fs/promises';
import { regex_out, writeRegex } from '../utils';
import { SignatureUtils } from '../utils/structures/signature';

const readOffsetsFromFile = async (filePath: string): Promise<number[]> => {
  const data = await fs.readFile(filePath, 'utf8');

  return data.split('\n').map((line) => parseInt(line.split(' -- ')[0]));
};

const sig = new SignatureUtils('./datasets/dump/data.json');
const offsets = await readOffsetsFromFile('./dist/offsets.txt');
const regexArray: RegExp[] = [];
let iterationCount = 0;

await Promise.all(
  offsets.map(async (offset, i) => {
    test(`offset${i}`, async () => {
      const oldOffset = `0x${offset.toString(16).toUpperCase()}`;
      const { signature, sig1, signatures } = await sig.getSignature(
        offset,
        40,
      );

      const { newOffset, regex } = signature
        ? await sig.getSigOffset(signature, sig1, signatures)
        : { newOffset: null, regex: null };

      // console.log({ signature, offset: { newOffset, parsed: parseInt(newOffset || "NaN") } });
      expect(newOffset).toMatch(oldOffset);
      regexArray.push(regex);

      iterationCount++;

      if (iterationCount === offsets.length) {
        writeRegex(regexArray, regex_out);
      }
    });
  }),
);
