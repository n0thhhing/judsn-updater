type FileContent = string;
type OffsetType = string | null;
type Time = number;
type FilePath = string;
type Data = string | Promise<string>;
type MethodSignature = string;
type CsContent = string | Promise<string>;
type Offset = string | number;
type Index = number;
type Count = number;
type ReturnedSignature = object | null;

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
  offset: Offset;
  name: string;
  typeStatus?: string;
}

interface FileOffsets {
  offsets: Offset[];
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
  offset: Offset;
  name: string;
  description: string;
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

interface ClassUtils {
  getContent(): Promise<string>;
  findMethodType(offset: Offset): Promise<string | null>;
}

interface SignatureUtils {
  getContent(): Promise<string>;
  getSignature(offset: Offset, amount: number = 0): Promise<object | null>;
  getSigOffset(
    signiture: MethodSigniture,
    prevousSig?: MethodSignature,
    signatures: MethodSignature[],
  ): Promise<string | null>;
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
  FilePath,
  MethodSignature,
  Data,
  CsContent,
  SignatureUtils,
  Offset,
  Index,
  Count,
};
