import {
  update_offsets,
  type FieldMatch,
  type Index,
  type OffsetMatch,
  type OffsetType,
  type PushFieldInfo,
  type PushOffsetInfo,
} from './';

async function pushField(
  pattern: RegExp,
  index: Index,
  fileInfo: PushFieldInfo,
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
  index: Index,
  fileInfo: PushOffsetInfo,
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

export { pushField, pushOffset };
