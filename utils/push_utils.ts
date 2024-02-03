import chalk from 'chalk';
import {
  update_offsets,
  type FieldMatch,
  type Index,
  type OffsetMatch,
  type OffsetPattern,
  type OffsetType,
  type PushFieldInfo,
  type PushOffsetInfo,
  type PushSignatureOffsetInfo,
} from './';

async function pushField(
  pattern: OffsetPattern,
  index: Index,
  fileInfo: PushFieldInfo,
): Promise<void> {
  try {
    const match: RegExpExecArray | null = pattern.exec(
      fileInfo.newContent,
    ) as FieldMatch | null;

    if (!match) {
      console.error(`No match found for pattern at index ${index}`);

      return;
    }

    fileInfo.newFields.push({
      offset: match[1] || 'Failed, please update the RegExp',
      name: fileInfo.FieldNames[index],
    });
  } catch (error: unknown) {
    console.error('An error occurred in pushField:', error);
  }
}

async function pushSignatureOffset(
  pattern: OffsetPattern,
  index: Index,
  fileInfo: PushSignatureOffsetInfo,
): Promise<void> {
  const {
    oldFile,
    newFile,
    signatureContent,
    offsetInfo,
    offsetNames,
    newOffsets,
  }: PushSignatureOffsetInfo = fileInfo;
  if (update_offsets && offsetInfo && offsetNames) {
    const match: RegExpExecArray | null = pattern.exec(
      await signatureContent,
    ) as OffsetMatch | null;

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

async function pushOffset(
  pattern: OffsetPattern,
  index: Index,
  fileInfo: PushOffsetInfo,
): Promise<void> {
  const {
    oldFile,
    newFile,
    offsetInfo,
    newContent,
    offsetNames,
    newOffsets,
  }: PushOffsetInfo = fileInfo;

  if (update_offsets && offsetInfo && offsetNames) {
    const startTime = Bun.nanoseconds();
    const match: RegExpExecArray | null = pattern.exec(
      newContent,
    ) as OffsetMatch | null;
    const endTime = Bun.nanoseconds();
    const elapsedTime = (endTime - startTime) / 1_000_000;

    console.log(
      chalk.grey(`${offsetNames[index]}: ${chalk.blue(elapsedTime)}ms`),
    );
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

export { pushField, pushOffset };
