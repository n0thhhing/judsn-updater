interface OffsetInfo {
  offset: string;
  name: string;
  type_status: string;
}

interface FileOffsets {
  offsets: string[];
  names: string[];
  entries: OffsetEntry[];
}


interface OffsetMatch extends RegExpExecArray {
  1: string; // Offset
  2: string; // Matched content before EventHandler/Action/Tuple/etc.
  3: string; // Matched content after EventHandler/Action/Tuple/etc.
}


interface OffsetEntry {
  offset: string;
  name: string;
  description: string;
}

interface classUtil {
  getContent(): Promise<string>;
  findMethodType(offset: string): Promise<string | null>;
}

export { type OffsetInfo, type FileOffsets, type OffsetMatch, type OffsetEntry, type classUtil };
