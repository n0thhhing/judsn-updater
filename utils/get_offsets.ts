import { type FileOffsets, type OffsetEntry } from './types'

async function getOffsets(filePath: string): Promise<FileOffsets> {
  const fileContent: string = await Bun.file(filePath).text()
  const lines: string[] = fileContent.split('\n')

  const offsets: string[] = []
  const names: string[] = []
  const entries: OffsetEntry[] = []

  for (const line of lines) {
    if (line.startsWith('--')) {
      continue
    }

    const match: RegExpMatchArray | null = line.match(
      /^(0x[0-9A-Fa-f]+) -- (.+)$/,
    )
    if (match) {
      const [_, offset, name] = match

      offsets.push(offset)
      names.push(name)

      entries.push({
        offset,
        name,
        description: line,
      })
    }
  }

  return { offsets, names, entries }
}

export { getOffsets }
