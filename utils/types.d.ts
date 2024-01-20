type FileContent = string;
type OffsetType = string | null;
type Time = number;

interface configPaths {
  old_dump: string;
  new_dump: string;
  offset_file: string;
  field_file: string;
  offset_output: string;
  field_output: string;
}

interface UpdaterConfig {
  log_offsets: boolean;
  update_offsets: boolean;
  update_fields: boolean;
  paths: configPaths;
}

interface OffsetInfo {
  offset: string;
  name: string;
  typeStatus?: string;
}

interface FileOffsets {
  offsets: string[];
  names: string[];
  entries: OffsetEntry[];
}

interface FieldMatch extends RegExpExecArray {
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

interface ClassUtils {
  getContent(): Promise<string>;
  findMethodType(offset: string): Promise<string | null>;
}

interface PushFieldInfo {
  newContent: FileContent;
  FieldNames: string[];
  newFields: OffsetInfo[];
}

interface PushOffsetInfo {
  oldFile: ClassUtils | null;
  newFile: ClassUtils | null;
  offsetInfo?: FileOffsets;
  newContent: FileContent;
  offsetNames?: string[];
  newOffsets: OffsetInfo[];
}

export {
  PushOffsetInfo,
  PushFieldInfo,
  OffsetInfo,
  FileOffsets,
  OffsetMatch,
  FieldMatch,
  OffsetEntry,
  ClassUtils,
  FileContent,
  OffsetType,
  Time,
  UpdaterConfig,
};
