import chalk from 'chalk';
import config from './config/config.json';
import {
  getOffsets,
  ClassUtils,
  writeOffsets,
  OffsetPatterns,
  FieldPatterns,
} from './utils';

import type {
  OffsetInfo,
  FileOffsets,
  OffsetMatch,
  FieldMatch,
  FileContent,
  OffsetType,
  Time,
  UpdaterConfig,
} from './utils/types';

const {
  update_offsets,
  update_fields,
  log_offsets,
  paths: {
    old_dump,
    new_dump,
    offset_file,
    field_file,
    field_output,
    offset_output,
  },
}: UpdaterConfig = config;

async function pushField(
  pattern: RegExp,
  index: number,
  fileInfo: {
    newContent: FileContent;
    FieldNames: string[];
    newFields: OffsetInfo[];
  },
): Promise<void> {
  try {
    const match = pattern.exec(fileInfo.newContent) as FieldMatch | null;

    if (!match) {
      console.error(`No match found for pattern at index ${index}`);
      return;
    }

    fileInfo.newFields.push({
      offset: match[1] || 'Failed, please update the RegExp',
      name: fileInfo.FieldNames[index],
    });
  } catch (error) {
    console.error('An error occurred in pushField:', error);
  }
}

async function pushOffset(
  pattern: RegExp,
  index: number,
  fileInfo: {
    oldFile: ClassUtils | null;
    newFile: ClassUtils | null;
    offsetInfo?: FileOffsets;
    newContent: FileContent;
    offsetNames?: string[];
    newOffsets: OffsetInfo[];
  },
): Promise<void> {
  const { oldFile, newFile, offsetInfo, newContent, offsetNames, newOffsets } =
    fileInfo;

  if (update_offsets && offsetInfo && offsetNames) {
    const match = pattern.exec(newContent) as OffsetMatch | null;

    const oldType: OffsetType | null = oldFile
      ? await oldFile.findMethodType(
          offsetInfo.offsets[offsetNames.indexOf(offsetNames[index])],
        )
      : null;
    const newType: OffsetType = newFile
      ? await newFile.findMethodType(match ? match[1] : '')
      : null;

    newOffsets.push({
      offset: match ? match[1] : 'Failed, please update the RegExp',
      name: offsetNames[index],
      typeStatus:
        oldType && newType && oldType === newType ? 'Passed' : 'Failed',
    });
  }
}

async function main() {
  try {
    const oldFile: ClassUtils | null = update_offsets
      ? new ClassUtils(old_dump)
      : null;
    const newFile: ClassUtils | null =
      update_offsets || update_fields ? new ClassUtils(new_dump) : null;
    const offsetInfo: FileOffsets | undefined = update_offsets
      ? await getOffsets(offset_file)
      : undefined;
    const fieldInfo: FileOffsets | undefined = update_fields
      ? await getOffsets(field_file)
      : undefined;
    const fieldNames: string[] = fieldInfo?.names || [];
    const offsetNames: string[] = offsetInfo?.names || [];

    const newOffsets: OffsetInfo[] = [];
    const newFields: OffsetInfo[] = [];

    const newContent: FileContent = newFile ? await newFile.content : '';

    if (update_offsets && offsetInfo && offsetNames) {
      const startTime: Time = performance.now();
      for (const [index, pattern] of OffsetPatterns.entries()) {
        await pushOffset(pattern, index, {
          oldFile,
          newFile,
          offsetInfo,
          newContent,
          offsetNames,
          newOffsets,
        });
      }
      const totalElapsedTime: Time = performance.now() - startTime;
      const averageTime: Time = totalElapsedTime / OffsetPatterns.length;

      console.log(
        chalk.grey(`Total offsets updated: ${chalk.green(newOffsets.length)}`),
      );
      console.log(
        chalk.grey(
          `Average offset exec time: ${chalk.blue(averageTime.toFixed(3))}ms`,
        ),
      );
      writeOffsets(offset_output, newOffsets);
    }

    if (update_fields && fieldInfo) {
      const startTime: Time = performance.now();
      for (const [index, pattern] of FieldPatterns.entries()) {
        await pushField(pattern, index, {
          newContent,
          FieldNames: fieldNames,
          newFields,
        });
      }
      const endTime: Time = performance.now() - startTime;
      const averageTime: Time = endTime / FieldPatterns.length;

      console.log(
        chalk.grey(`Total fields updated: ${chalk.green(newFields.length)}`),
      );
      console.log(
        chalk.grey(
          `Average field exec time: ${chalk.blue(averageTime.toFixed(3))}ms`,
        ),
      );
      writeOffsets(field_output, newFields);
    }

    if (log_offsets && update_offsets) console.log(newOffsets);
    if (field_output && log_offsets) console.log(newFields);

    console.log(
      chalk.grey(
        `Total execution time: ${chalk.blue(
          (Bun.nanoseconds() / 1_000_000).toFixed(3),
        )}ms`,
      ),
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

await main();
