interface OffsetEntry {
  offset: string;
  name: string;
  description: string;
}

interface FileOffsets {
  offsets: string[];
  names: string[];
  entries: OffsetEntry[];
}

// Function to read and parse the file
async function getOffsets(filePath: string): Promise<FileOffsets> {
  const fileContent = await Bun.file(filePath).text();
  const lines = fileContent.split("\n");

  const offsets: string[] = [];
  const names: string[] = [];
  const entries: OffsetEntry[] = [];

  for (const line of lines) {
    if (line.startsWith("--")) {
      continue;
    }

    const match = line.match(/^(0x[0-9A-Fa-f]+) -- (.+)$/);
    if (match) {
      const offset = match[1];
      const name = match[2];

      offsets.push(offset);
      names.push(name);

      entries.push({
        offset,
        name,
        description: line,
      });
    }
  }

  return { offsets, names, entries };
}

export { getOffsets };
