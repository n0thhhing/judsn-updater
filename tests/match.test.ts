import { expect, test } from 'bun:test';
import fs from 'fs/promises';

import {
  SignatureUtils,
  SigniturePatterns,
  type Offset,
  type OffsetPattern,
} from '../utils';

const readOffsetsFromFile = async (filePath: string) =>
  (await fs.readFile(filePath, 'utf8'))
    .split('\n')
    .map((line: string) => parseInt(line.split(' -- ')[0]));

try {
  const [offsets, oldOffsets]: number[][] = await Promise.all([
    readOffsetsFromFile('./dist/offsets.txt'),
    readOffsetsFromFile('./datasets/offsets/offsets.txt'),
  ]);

  const sig: SignatureUtils = new SignatureUtils('./datasets/dump/data.json');

  for (let i = 0; i < SigniturePatterns.length; i++) {
    test(`offset ${i}`, async () => {
      const pattern: OffsetPattern = SigniturePatterns[i];
      const [oldOffset, match]: (RegExpExecArray | string | null)[] =
        await Promise.all([
          `0x${oldOffsets[i].toString(16).toUpperCase()}`,
          pattern.exec(await sig.content),
        ]);

      const newOffset: Offset = `0x${parseInt(
        match && match[1] ? match[1] : '0',
      )
        .toString(16)
        .toUpperCase()}`;
      const [signatureName, expectedOffset]: (string | null)[] =
        await Promise.all([
          sig.getName(newOffset),
          `0x${offsets[i].toString(16).toUpperCase()}`,
        ]);

      console.log({ oldOffset, newOffset, signatureName });
      expect(newOffset).toMatch(expectedOffset ? expectedOffset : '');
    });
  }
} catch (error) {
  console.error('Error reading offset files:', error);
}
