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

interface ClassUtil {
  getContent(): Promise<string>;
  findMethodType(offset: Offset): Promise<string | null>;
}

interface SignatureUtil {
  getContent(): Promise<string>;
  getSignature(offset: Offset, amount: number = 0): Promise<object | null>;
  getSigOffset(
    signiture: MethodSignature,
    prevousSig?: MethodSignature,
    signatures: MethodSignature[],
  ): Promise<object | null>;
}

interface configPaths {
  regex_out: string;
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
  output_signature: boolean;
  paths: configPaths;
}

interface OffsetInfo {
  offset: Offset;
  name: string;
  typeStatus?: string;
}

interface OffsetEntry {
  offset: Offset;
  name: string;
  description: string;
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

interface PushFieldInfo {
  newContent: FileContent;
  FieldNames: string[];
  newFields: OffsetInfo[];
}

interface PushOffsetInfo {
  oldFile: ClassUtil | null;
  newFile: ClassUtil | null;
  offsetInfo?: FileOffsets;
  newContent: FileContent;
  offsetNames?: string[];
  newOffsets: OffsetInfo[];
}

export {
  ClassUtil,
  Count,
  CsContent,
  Data,
  FieldMatch,
  FileContent,
  FileOffsets,
  FilePath,
  Index,
  MethodSignature,
  Offset,
  OffsetEntry,
  OffsetInfo,
  OffsetMatch,
  OffsetType,
  PushFieldInfo,
  PushOffsetInfo,
  ReturnedSignature,
  SignatureUtil,
  Time,
  UpdaterConfig,
};
