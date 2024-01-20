import { getOffsets } from './utils/get_offsets';
import { ClassUtils } from './utils/structures/class_utils';
import { writeOffsets } from './utils/write_offsets';
import { regexPatterns } from './utils/patterns.ts';
import chalk from 'chalk';

import {
  type OffsetInfo,
  type FeildInfo,
  type FileOffsets,
  type OffsetMatch,
  type FeildMatch,
  type FileContent,
  type OffsetType,
  type time,
} from './utils/types';

import {
  update_offsets,
  update_feilds,
  old_dump,
  new_dump,
  offset_file,
  feild_file,
  offset_output,
  log_offsets,
} from './config/config.json';

async function main() {
  try {
    const oldFile: ClassUtils | null = update_offsets
      ? new ClassUtils(old_dump)
      : null;
    const newFile: ClassUtils | null =
      update_offsets || update_feilds ? new ClassUtils(new_dump) : null;
    const offsetInfo: FileOffsets = await getOffsets(offset_file);
    const feildInfo: FileOffsets = await getOffsets(feild_file);
    const feildNames: string[] = feildInfo.names;
    const offsetNames: string[] = offsetInfo.names;

    const newOffsets: OffsetInfo[] = [];
    const newFeilds: FeildInfo[] = [];

    const newContent: FileContent = newFile ? await newFile.content : '';

    const pushFeild = async (pattern: RegExp, index: number): Promise<void> => {
      const match = pattern.exec(newContent) as FeildMatch | null;

      newFeilds.push({
        feildOffset: match ? match[1] : 'Failed, please update the RegExp',
        name: feildNames[index],
      });
    };

    const pushOffset = async (
      pattern: RegExp,
      index: number,
    ): Promise<void> => {
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
        type_status:
          oldType && newType && oldType === newType ? 'Passed' : 'Failed',
      });
    };

    if (update_offsets)
      for (let i = 0; i < regexPatterns.length; i++) {
        await pushOffset(regexPatterns[i], i);
      };

    const totalElapsedTime: time = Bun.nanoseconds() / 1_000_000;
    const averageTime: time = totalElapsedTime / regexPatterns.length;

    if (log_offsets && update_offsets)
      console.log(newOffsets, { count: newOffsets.length });
    writeOffsets(offset_output, newOffsets);

    if (update_offsets)
      console.log(
        chalk.grey(
          `Average regex.exec time: ${chalk.blue(
            averageTime.toFixed(3),
          )}ms\nTotal execution time: ${chalk.blue(
            (Bun.nanoseconds() / 1_000_000).toFixed(3),
          )}ms`,
        ),
      );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

await main();
