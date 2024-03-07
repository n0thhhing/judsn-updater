import * as crypto from 'crypto';
import * as fs from 'fs';

const algorithm = 'aes-256-cbc';

function encryptFile(inputFilePath: string, key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputFilePath);
    const cipher = crypto.createCipher(algorithm, key);
    let encryptedData = '';

    input.on('data', (chunk) => {
      encryptedData += cipher.update(chunk, 'utf8', 'hex');
    });

    input.on('end', () => {
      encryptedData += cipher.final('hex');
      resolve(encryptedData);
    });

    input.on('error', (error) => {
      reject(error);
    });
  });
}

function decryptFile(encryptedData: string, key: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const decipher = crypto.createDecipher(algorithm, key);
    let decryptedData = '';

    try {
      decryptedData += decipher.update(encryptedData, 'hex', 'utf8');
      decryptedData += decipher.final('utf8');
      resolve(decryptedData);
    } catch (error) {
      reject(error);
    }
  });
}

// Example usage:
const inputFile = 'data/dump/old.cs';
const key = 'abcdef0123456789'; // 32 bytes for AES-256

encryptFile(inputFile, key)
  .then((encryptedData) => {
    console.log(encryptedData);
    // return decryptFile(encryptedData, key);
  })
  /* .then((decryptedData) => {
    console.log('Decrypted content:', decryptedData);
  })*/
  .catch((error) => {
    console.error('Error:', error);
  });
