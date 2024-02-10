import chalk from 'chalk';
import fs from 'fs';

async function readLibraryFile(filePath: FilePath): Promise<LibData> {
  const startTime: Time = Bun.nanoseconds();

  try {
    const stats: FileStats = await fs.promises.stat(filePath);
    const fileSizeInBytes: number = stats.size;
    const fileSizeInMB: string = (fileSizeInBytes / (1024 * 1024)).toFixed(3);

    const data: LibData = await fs.promises.readFile(filePath);
    const elapsedTime: Time = (Bun.nanoseconds() - startTime) / 1_000_000;
    console.log(
      chalk.gray(
        `readLibraryFile(${filePath}): ${chalk.blue(elapsedTime.toFixed(3))}ms, File Size: ${chalk.blue(fileSizeInMB)} MB`,
      ),
    );

    return data;
  } catch (err) {
    throw new Error(`Error reading library file: ${err}`);
  }
}

export { readLibraryFile };
