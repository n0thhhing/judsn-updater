import chalk from 'chalk';

import {
  ClassUtils,
  FieldPatterns,
  OffsetPatterns,
  field_file,
  field_output,
  getOffsets,
  log_offsets,
  new_dump,
  offset_file,
  offset_output,
  old_dump,
  pushField,
  pushOffset,
  update_fields,
  update_offsets,
  writeOffsets,
  type FileContent,
  type FileOffsets,
  type OffsetInfo,
  type Time,
} from './utils';

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

      await Promise.all(
        OffsetPatterns.map(async (pattern, index) =>
          pushOffset(pattern, index, {
            oldFile,
            newFile,
            offsetInfo,
            newContent,
            offsetNames,
            newOffsets,
          }),
        ),
      );

      const totalElapsedTime: Time = performance.now() - startTime;
      const averageTime: Time = totalElapsedTime / OffsetPatterns.length;

      console.log(
        chalk.grey(`Total offsets updated: ${chalk.green(newOffsets.length)}`),
      );

      console.log(
        chalk.grey(
          `Total processing time: ${chalk.blue(totalElapsedTime.toFixed(3))}ms`,
        ),
      );
      writeOffsets(offset_output, newOffsets);
    }

    if (update_fields && fieldInfo) {
      const startTime: Time = performance.now();

      await Promise.all(
        FieldPatterns.map(async (pattern, index) =>
          pushField(pattern, index, {
            newContent,
            FieldNames: fieldNames,
            newFields,
          }),
        ),
      );

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
process.exit(0);
