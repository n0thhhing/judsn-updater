type FileContent = string;
type OffsetType = string | null;
type time = number;

interface OffsetInfo {
  offset: string;
  name: string;
  type_status: string;
}

interface FeildInfo {
  feildOffset: string;
  name: string;
}

interface FileOffsets {
  offsets: string[];
  names: string[];
  entries: OffsetEntry[];
}

interface FeildMatch extends RegExpExecArray {
  1: string; // offset
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

export {
  type OffsetInfo,
  type FileOffsets,
  type OffsetMatch,
  type FeildMatch,
  type OffsetEntry,
  type classUtil,
  type FeildInfo,
  type FileContent,
  type OffsetType,
  type time,
};
