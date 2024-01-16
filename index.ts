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
        return {
          content,
          str: `readDumpFile(${new_dump}): ${chalk.blue(elapsedTime.toFixed(3))}ms`,
        };
      } catch (error: any) {
        console.error("Error reading file:", error);
        return { content: "failed", str: "failed" };
      }
    })();

    const offset_info = await getOffsets(offset_file);
    const names = offset_info.names;
    let i = 0;
    let newOffsets: OffsetInfo[] = [];

    const regexPatterns = [
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+internal int \S+\(int \S+\).*\n\n\s+\/\/ RVA.*\n\s+internal float get_Health/,
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+public int \S+\(int \S+\).*\n\n.*\n\s+public int \S+.*\n\n.*\n\s+public void \.ctor/,
      /\/\/ RVA: (0x[A-F0-9]+.*\n\s+internal int get_Energy)/,
      /\/\/ RVA.*\n\s+internal void .ctor\(\S+ \S+\).*\n\n.*\n\s+internal void \.ctor\(string \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int/g,
      /get_BaseCount.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g,
      /\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+.*\n\n\s+.*\n\s+private void \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(\)/g,
      /\/\/ RVA: 0x3[A-F0-9]+.*\n\s+public bool \S+\(Nullable<.*FreeSpin.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g,
      /(0x2[A-F0-9]+).*\n\s+internal static bool \S+ \S+.*\n\n.*\n.*\n.*\n.*\n.*\n\n.*\n\s+internal static void.*bool.*= True.*\n\n.*\n.*\n\n.*\n\s+internal static Offer/g,
      /internal int \S+\(\).*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal void \S+\(int \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+/g,
      /internal void \.ctor\(Dictionary<string\, object> \S+.*\n\n.*\n\s+internal Dictionary<string, object> \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool/g,
      /\[CompilerGenerated\]\n\s+\/\/ RVA: 0x5.*\n\s+internal int \S+\(\).*\n\n\s+\[CompilerGenerated\]\n.*\n\s+private void \S+\(int \S+\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+internal bool/g,
      /\[CompilerGenerated\]\n.*\n\s+internal static void \S+\(Action<string> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal static GameOb.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g,
      /internal ModuleData\.ModuleType \S+\(\).*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal ModuleData\.ModuleCategory \S+\(\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g,
      /internal void \.ctor\(int \S+ ModuleData.ModuleRarity .*\n\n.*\n\s+internal bool.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g,
    ];
    const totalStartTime = performance.now(); // Track total time

    const pushOffset = (pattern: RegExp) => {
      const patternStartTime = performance.now();
      const match = pattern.exec(newFile.content);
      const patternElapsedTime = performance.now() - patternStartTime;

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

    const totalElapsedTime = performance.now() - totalStartTime;
    const averageTime = totalElapsedTime / regexPatterns.length;
    console.log(newOffsets);
    console.log(chalk.grey(newFile.str));
    console.log(
      chalk.grey(`Average execution time: ${chalk.blue(averageTime.toFixed(3))}ms`),
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

await main();
