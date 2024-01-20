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
    const totalStartTime = performance.now();
    const oldFile = new ClassUtils(old_dump);
    const newFile = new ClassUtils(new_dump);
    const offsetInfo: FileOffsets = await getOffsets(offset_file);
    const feildInfo: FileOffsets = await getOffsets(feild_file);
    const feildNames = feildInfo.names;
    const offsetNames = offsetInfo.names;

    const newOffsets: OffsetInfo[] = [];
    const newFeilds: FeildInfo[] = [];

    const newContent = await newFile.content;

    const pushFeild = async (pattern: RegExp, index: number) => {
      const match = pattern.exec(newContent) as FeildMatch | null;

      newFeilds.push({
        feildOffset: match ? match[1] : 'Failed, please update the RegExp',
        name: feildNames[index],
      });
    };

    const pushOffset = async (pattern: RegExp, index: number) => {
      const match = pattern.exec(newContent) as OffsetMatch | null;

      const oldType = await oldFile.findMethodType(
        offsetInfo.offsets[offsetNames.indexOf(offsetNames[index])],
      );
      const newType = await newFile.findMethodType(match ? match[1] : '');

      newOffsets.push({
        offset: match ? match[1] : 'Failed, please update the RegExp',
        name: offsetNames[index],
        type_status: oldType === newType ? 'Passed' : 'Failed',
      });
    };

    for (let i = 0; i < regexPatterns.length; i++) {
      await pushOffset(regexPatterns[i], i);
    }

    const totalElapsedTime = performance.now() - totalStartTime;
    const averageTime = totalElapsedTime / regexPatterns.length;

    if (log_offsets) console.log(newOffsets, { count: newOffsets.length });
    writeOffsets(offset_output, newOffsets);

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
