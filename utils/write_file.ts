import { type OffsetInfo } from "./types";

async function writeOffsets(filePath: string , info: OffsetInfo[]): Promise<void> {
  let lines: string = "";
  for (const offsetInfo of info) {
    const line: string = `${offsetInfo.offset} -- ${offsetInfo.name}`;
    lines += `${line.split("\n").length > 0 ? `\n` : ``}`;
  }
  Bun.write(Bun.file(filePath), lines);
}

export { writeOffsets };