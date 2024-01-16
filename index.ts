import { getOffsets } from "./utils/get_offsets";
import chalk from "chalk";

const { old_dump, new_dump, offset_file } = require("./config/config.json");

interface OffsetInfo {
  offset: string;
  name: string;
}

async function main() {
  try {
    const newFile = await (async () => {
      try {
        const startTime = performance.now();
        const content = await Bun.file(new_dump).text();
        const elapsedTime = performance.now() - startTime;
        console.log(
          chalk.grey(`this.content(${new_dump}): ${elapsedTime.toFixed(3)}ms`),
        );
        return content;
      } catch (error: any) {
        console.error("Error reading file:", error);
        return "wat";
      }
    })();

    const offset_info = await getOffsets(offset_file);
    const names = offset_info.names;
    let i = 0;
    let newOffsets: OffsetInfo[] = []; // Explicitly specify the type

    const regexPatterns = [
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+internal int \S+\(int \S+\).*\n\n\s+\/\/ RVA.*\n\s+internal float get_Health/,
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+public int \S+\(int \S+\).*\n\n.*\n\s+public int \S+.*\n\n.*\n\s+public void \.ctor/,
      /\/\/ RVA: (0x[A-F0-9]+.*\n\s+internal int get_Energy)/,
      /\/\/ RVA.*\n\s+internal void .ctor\(\S+ \S+\).*\n\n.*\n\s+internal void \.ctor\(string \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int/g,
      /get_BaseCount.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g,
      /\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+.*\n\n\s+.*\n\s+private void \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(\)/g,
      /\/\/ RVA: 0x3[A-F0-9]+.*\n\s+public bool \S+\(Nullable<.*FreeSpin.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g,
      // Add more regex patterns for the remaining offsets...
    ];

    const pushOffset = (pattern: RegExp) => {
      const match = pattern.exec(newFile);
      if (match && match[1] !== null) {
        newOffsets.push({
          offset: match[1],
          name: names[i],
        });
        i++;
      } else {
        console.error("Pattern match failed or result is null");
      }
    };

    regexPatterns.forEach(pushOffset);

    console.log(newOffsets);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

await main();
