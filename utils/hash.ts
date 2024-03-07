import chalk from 'chalk';
import * as crypto from 'crypto';
import * as fs from 'fs';

const algorithm = 'aes-256-cbc';
const key = 'abcdef0123456789';

function encryptFile(inputFilePath: string): Promise<string> {
  const start = Bun.nanoseconds();
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputFilePath);
    const cipher = crypto.createCipher(algorithm, key);
    let encryptedData = '';

    input.on('data', (chunk) => {
      encryptedData += cipher.update(chunk, 'utf8', 'hex');
    });

    input.on('end', () => {
      encryptedData += cipher.final('hex');
      console.log(
        chalk.grey(
          `encryptFile(${inputFilePath}): ${chalk.blue((Bun.nanoseconds() - start) / 1_000_000)}ms`,
        ),
      );
      resolve(encryptedData);
    });

    input.on('error', (error) => {
      reject(error);
    });
  });
}

function decryptFile(encryptedData: string): Promise<string> {
  const start = Bun.nanoseconds();
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipher(algorithm, key);
    let decryptedData = '';

    try {
      decryptedData += decipher.update(encryptedData, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');
      console.log(
        chalk.grey(
          `encryptFile(): ${chalk.blue((Bun.nanoseconds() - start) / 1_000_000)}ms`,
        ),
      );
      resolve(decryptedData);
    } catch (error) {
      reject(error);
    }
  });
}

export { decryptFile, encryptFile };
