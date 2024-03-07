import * as fs from 'fs';
import * as crypto from 'crypto';
import chalk from "chalk"

async function hashFile(filePath: string): Promise<string> {
  const start = Bun.nanoseconds()
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('error', (error) => {
      reject(error);
    });

    hash.setEncoding('hex');

    stream.on('end', () => {
      hash.end();
      console.log(chalk.grey(`hashFile(${filePath}): ${chalk.blue((Bun.nanoseconds() - start) / 1_000_000)}ms`))
      resolve(hash.read());
    });

    stream.pipe(hash);
  });
}

export { hashFile }