import { SigniturePatterns, SignatureUtils } from '../utils';
import fs from 'fs/promises';
import { expect, test } from 'bun:test';

const readOffsetsFromFile = async (filePath) =>
  (await fs.readFile(filePath, 'utf8'))
    .split('\n')
    .map((line) => parseInt(line.split(' -- ')[0]));

try {
  const [offsets, oldOffsets] = await Promise.all([
    readOffsetsFromFile('./dist/offsets.txt'),
    readOffsetsFromFile('./datasets/offsets/offsets.txt'),
  ]);

  const sig = new SignatureUtils('./datasets/dump/data.json');

  for (let i = 0; i < SigniturePatterns.length; i++) {
    test(`offset ${i}`, async () => {
      const pattern = SigniturePatterns[i];
      const [oldOffset, newOffset] = await Promise.all([
        `0x${oldOffsets[i].toString(16).toUpperCase()}`,
        `0x${parseInt(pattern.exec(await sig.content)[1], 10)
          .toString(16)
          .toUpperCase()}`,
      ]);
      const [signatureName, expectedOffset] = await Promise.all([
        sig.getName(newOffset),
        `0x${offsets[i].toString(16).toUpperCase()}`,
      ]);

      console.log({ oldOffset, newOffset, signatureName });
      expect(newOffset).toMatch(expectedOffset);
    });
  }
} catch (error) {
  console.error('Error reading offset files:', error);
}
