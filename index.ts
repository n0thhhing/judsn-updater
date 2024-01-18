import {
  ClassUtils,
  type OffsetMatch,
} from "./utils/structures/class_utils.ts";
import { old_dump, new_dump, offset_file } from "./config/config.json";
import { getOffsets, type FileOffsets } from "./utils/get_offsets";
import chalk from "chalk";

interface OffsetInfo {
  offset: string;
  name: string;
  type_status: string;
}

async function main() {
  try {
    const oldFile: ClassUtils = new ClassUtils(old_dump);
    const newFile: ClassUtils = new ClassUtils(new_dump);
    const offsetInfo: FileOffsets = await getOffsets(offset_file);
    const names: string[] = offsetInfo.names;
    const totalStartTime: number = performance.now();

    const regexPatterns: RegExp[] = [
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+internal int \S+\(int \S+\).*\n\n\s+\/\/ RVA.*\n\s+internal float get_Health/, // clan parts
      /\/\/ RVA: (0x4[0-9A-F]+).*\n\s+public int \S+\(int \S+\).*\n\n.*\n\s+public int \S+.*\n\n.*\n\s+public void \.ctor/, // clan parts
      /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal int get_Energy/, // clan energy
      /\/\/ RVA.*\n\s+internal void .ctor\(\S+ \S+\).*\n\n.*\n\s+internal void \.ctor\(string \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int/g, // free lottery
      /get_BaseCount.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g, // lottery currence
      /\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+.*\n\n\s+.*\n\s+private void \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(\)/g, // collectibles
      /\s+\/\/ RVA: 0x3[A-F0-9]+.*\n\s+public bool \S+\(Nullable<.*FreeSpin.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+)/g, // free chest count
      /(0x2[A-F0-9]+).*\n\s+internal static bool \S+ \S+.*\n\n.*\n.*\n.*\n.*\n.*\n\n.*\n\s+internal static void.*bool.*= True.*\n\n.*\n.*\n\n.*\n\s+internal static Offer/g, // gem clicker
      /internal int \S+\(\).*\n\n.*\n\s+internal int \S+\(\).*\n\n.*\n\s+internal void \S+\(int \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool \S+/g, // task clicker
      /internal void \.ctor\(Dictionary<string\, object> \S+.*\n\n.*\n\s+internal Dictionary<string, object> \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal bool/g, // pixel clicker
      /\[CompilerGenerated\]\n\s+\/\/ RVA: 0x5.*\n\s+internal int \S+\(\).*\n\n\s+\[CompilerGenerated\]\n.*\n\s+private void \S+\(int \S+\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+internal bool/g, // black market clicker
      /\[CompilerGenerated\]\n.*\n\s+internal static void \S+\(Action<string> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal static GameOb.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // gadget unlocker
      /internal ModuleData\.ModuleType \S+\(\).*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal ModuleData\.ModuleCategory \S+\(\).*\n\n.*\n\s+internal int.*\n\n.*\n\s+internal.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // module %
      /internal void \.ctor\(int \S+ ModuleData.ModuleRarity .*\n\n.*\n\s+internal bool.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // max modules
      /internal void .ctor\(int \S+ ModuleData.*\n\n.*\n.*\n\n.*\n.*\n\n.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+).*\n\s+internal bool/g, // max modules
      /internal ModuleData \S+\(\).*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal ModuleData.ModuleType \S+\(\).*\n\n.*\n\s+internal ModuleData.ModuleCategory.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // max modules
      /internal int \S+\(\).*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal int \S+\(int \S+\).*\n\n.*\n\s+internal bool \S+\(\).*\n\n.*\n\s+internal override string/g, // no parts modules
      /\s+internal static void \S+\(Action<float, bool> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal virtual string.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // no gadget cooldown
      /\s+internal static void \S+\(Action<float, bool> \S+.*\n\n\s+\/\/ RVA: 0x2.*\n\s+internal virtual string.*\n\n.*\n.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n.*\n\n.*\/.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal virtual float/g, // no gadget cooldown
      /\s+internal static int\[.*\n\n\s+\[.*\]\n.*\n\s+internal static void.*\(Action.*\n\n\s+\[\S+\]\n.*\n\s+internal static void \S+\(Action.*\n\n.*\n\s+internal static void.*\n\n.*\n\s+internal static int.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n.*\n\n\s+\/\/ RVA: (0x2[A-F0-9]+)/, // xp
      /public bool.*\n\n.*\n\s+public long \S+\(\).*\n\n\s+.*\n\s+public long \S+\(\).*\n\n\s+.*\n\s+public long \S+\(\).*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+).*\n\s+public bool.*\n\n.*\n\s+public bool/g, // lobby bundles
      /internal static int \S+\(int.*\n\n\s+\/\/ RVA: 0x5[A-F0-9]+.*\n\s+internal static float \S+\(int.*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static float.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // fire rate
      /internal static bool \S+\(\).*\n\n.*\n\s+internal static float \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static bool \S+\(\).*/g, // inf ammo
      /internal static SceneInfo \S+\(\S+ \S+\).*\n\n.*\n\s+internal static int.*bool.*\n\n.*\n.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // team kill
      /\s+\/\/ RVA: (0x1[A-F0-9]+).*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n.*\n\s+internal static bool \S+\(\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static void/g, // team kill
      /internal void \S+\(WeaponSounds\.\S+ \S+ = 0.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+)/g, // god
      /private void \S+\(ref float.*\n\n.*\n.*\n\n\s+\/\/ RVA: (0x4[A-F0-9]+)/g, // god
      /private void OnDestroy\(\).*\n\n\s+\/\/ RVA: (0x5[A-F0-9]+).*\n\s+private void OnTriggerEnter\(/g, // god
      /\/\/ RVA: (0x[A-F0-9]+).*\n\s+private void OnController.*\n\n.*\n\s+private void OnDestroy\(\).*\n\n\s+\/\/ RVA: 0x5[A-F0-9]+.*\n\s+private void OnTriggerEnter\(/g, // god
      /internal static void \S+\(int \S+\).*\n\n\s+\/\/ RVA: (0x3[A-F0-9]+).*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static void \S+\(int \S+\).*\n\n.*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static void \S+\(int \S+\).*\n\n.*\s+internal static int.*\n\n.*\n\s+public void \.ctor/g, // arena score
      /\/\/ RVA: (0x[A-F0-9]+).*\n\s+public int GetFreeCheckpointsCount\(\)/g, // free checkpoint count
      /\/\/ RVA: 0x[A-F0-9]+.*\s+internal virtual ItemRarity get_Rarity.*\n\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // rarity
      /\/\/ RVA: (0x[A-F0-9]+).*\s+internal virtual ItemRarity get_Rarity.*\n\n\s+\/\/ RVA: 0x[A-F0-9]+/g, //, rarity
      /\/\/ RVA: (0x2[A-F0-9]+).*\n\s+internal int \S+\(\S+ \S+\).*\n\n.*\n\s+private void \S+\(Nullable/g, // rewards multiplier
      /\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\).*\n\n.*\n\s+internal static \S+ \S+\(\S+ \S+, \S+ \S+\).*\n\n.*\s+internal static ValueTuple<.*>/g, // super chests
      /\[Extension\]\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\S+ \S+, \S+ \S+ \S+ \S+\).*\n\n\s+\[/g, // clan chests
      /internal static \S+ \S+\(\S+ \S+\).*\n\n\s+\/\/ RVA: (0x[A-F0-9]+).*\n\s+internal static int \S+\(\S+ \S+\, \S+ \S+\).*\n\n.*\n\s+internal static int.*\n\n.*\n\s+internal static string/g, // clan
      /\[Extension\]\n\s+\/\/ RVA: 0x[A-F0-9]+.*\n\s+internal static int \S+\(\S+ \S+, \S+ \S+ \S+ \S+\).*\n\n\s+\[.*\n\s+\/\/ RVA: (0x[A-F0-9]+)/g, // clan super chest points
      //g
    ];

    const newOffsets: OffsetInfo[] = [];

    const pushOffset = async (pattern: RegExp, index: number) => {
      const match: OffsetMatch | null = pattern.exec(
        await newFile.content
      ) as OffsetMatch | null;

      if (match && match[1] !== null) {
        const oldType: string | null = await oldFile.findMethodType(
          offsetInfo.offsets[names.indexOf(names[index])]
        );
        const newType: string | null = await newFile.findMethodType(match[1]);
        newOffsets.push({
          offset: match[1],
          name: names[index],
          type_status: oldType === newType ? "Passed" : "Failed",
        });
      } else {
        console.error("Pattern match failed or result is null");
      }
    };

    for (let i = 0; i < regexPatterns.length; i++) {
      await pushOffset(regexPatterns[i], i);
    }

    const totalElapsedTime: number = performance.now() - totalStartTime;
    const averageTime: number = totalElapsedTime / regexPatterns.length;
    console.log(newOffsets, { count: newOffsets.length });
    console.log(
      chalk.grey(
        `Average execution time: ${chalk.blue(
          averageTime.toFixed(3)
        )}ms\nTotal execution time: ${chalk.blue(
          totalElapsedTime.toFixed(3)
        )}ms`
      )
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

await main();
