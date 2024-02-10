import chalk from 'chalk';
import { debug, type_check, update_offsets } from './';

const compiledPattern: CompiledPattern = new Map<OffsetPattern, RegExp>();

async function pushField(
  pattern: OffsetPattern,
  index: Index,
  fileInfo: PushFieldInfo,
): Promise<void> {
  try {
    const startExecTime: Time = debug ? Bun.nanoseconds() : NaN;

    const match: RegExpExecArray | null = pattern.exec(
      fileInfo.newContent,
    ) as FieldMatch | null;

    const execTime: Time = debug
      ? (Bun.nanoseconds() - startExecTime) / 1_000_000
      : NaN;

    if (!match) {
      console.error(`No match found for pattern at index ${index}`);

      return;
    }

    if (debug) {
      console.log(
        chalk.grey(
          `${chalk.red('[Debug] - ')}${fileInfo.FieldNames[index]}: ${chalk.blue(execTime)}ms (${chalk.yellow('exec time')})`,
        ),
      );
    }

    fileInfo.newFields.push({
      offset: match[1] || 'Failed, please update the RegExp',
      name: fileInfo.FieldNames[index],
    });
  } catch (error: unknown) {
    console.error('An error occurred in pushField:', error);
  }
}

async function pushOffset(
  pattern: OffsetPattern,
  index: Index,
  fileInfo: PushOffsetInfo,
): Promise<void> {
  const { oldFile, newFile, offsetInfo, newContent, offsetNames, newOffsets } =
    fileInfo;

  if (!(update_offsets && offsetInfo && offsetNames)) {
    return;
  }

  const compiledRegex: OffsetPattern =
    compiledPattern.get(pattern) ||
    (compiledPattern.set(pattern, new RegExp(pattern.source)),
    compiledPattern.get(pattern)!);

  const startExecTime: Time = debug ? Bun.nanoseconds() : NaN;
  const match: RegExpExecArray | null = compiledRegex.exec(
    newContent,
  ) as OffsetMatch | null;
  const execTime: Time = debug
    ? (Bun.nanoseconds() - startExecTime) / 1_000_000
    : NaN;

  const startInfoTime: Time = debug && type_check ? Bun.nanoseconds() : NaN;
  const offsetIndex: Index = type_check
    ? offsetNames.indexOf(offsetNames[index])
    : 1;
  const oldType: OffsetType = type_check
    ? oldFile && (await oldFile.findMethodType(offsetInfo.offsets[offsetIndex]))
    : null;
  const newType: OffsetType = type_check
    ? newFile && match && (await newFile.findMethodType(match[1]))
    : null;
  const infoTime: Time =
    debug && type_check ? (Bun.nanoseconds() - startInfoTime) / 1_000_000 : NaN;

  if (debug) {
    console.log(
      chalk.grey(
        `${chalk.red('[Debug] - ')}${offsetNames[index]}: ${chalk.blue(execTime)}ms (${chalk.yellow(`exec time`)})${type_check ? ` | ${chalk.blue(infoTime)}ms (${chalk.yellow(`info time`)})` : ''} ${chalk.blue(offsetInfo.offsets[index])} => ${chalk.blue(match && match[1] ? match[1] : 'failed')}`,
      ),
    );
  }

  newOffsets.push({
    offset: match?.[1] || 'Failed, please update the RegExp',
    name: offsetNames[index],
    typeStatus:
      oldType && newType && oldType === newType
        ? 'Passed'
        : type_check
          ? 'Failed'
          : 'typecheck is off',
  });
}

export { pushField, pushOffset };
