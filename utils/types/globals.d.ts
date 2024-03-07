declare global {
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
  type ReturnedSignature = EvaluatedSignatures | null;
  type OffsetPattern = RegExp;
  type SignatureName = string;
  type Signature = string;
  type CompiledPattern = Map<OffsetPattern, RegExp>;
  type FormatType = 'default' | 'judsn';
  type Names = string;
  type inputType = 'offset' | 'field';
  type LibData = Buffer;
  type SignatureLength = number;

  const OffsetPatterns: OffsetPattern[];
  const FieldPatterns: OffsetPattern[];
  const SigniturePatterns: OffsetPattern[];

  class ClassUtils {
    path: FilePath;
    readonly content: CsContent | Promise<CsContent>;
    constructor(csPath: FilePath);
    getContent(): Promise<CsContent>;
    findMethodType(offset: Offset): Promise<OffsetType>;
  }

  class SignatureUtils {
    path: FilePath;
    readonly content: Data | Promise<Data>;
    constructor(csPath: FilePath);
    getContent(): Promise<Data>;
    getSignature(offset: Offset, amount?: Count): Promise<ReturnedSignature>;
    getSigOffset(
      signature: MethodSignature,
      previousSignature?: MethodSignature,
      signatures?: MethodSignature[],
    ): Promise<SignatureOutput | null>;
    getName(offset: Offset): Promise<SignatureName | null>;
  }

  interface FileStats {
    size: number;
  }

  interface EvaluatedSignatures {
    sig1: string;
    signature: string;
    signatures: string[];
  }

  interface SignatureOutput {
    newOffset: Offset;
    regex: OffsetPattern;
  }

  interface configPaths {
    lib_path: FilePath;
    regex_out: FilePath;
    old_dump: FilePath;
    new_dump: FilePath;
    offset_output: FilePath;
    field_output: FilePath;
    hex_output: FilePath;
    offset_file: FilePath;
    field_file: FilePath;
  }

  interface UpdaterConfig {
    log_offsets: boolean;
    update_offsets: boolean;
    get_hex: boolean;
    update_fields: boolean;
    output_signature: boolean;
    type_check: boolean;
    debug: boolean;
    format_type: FormatType;
    signature_length: SignatureLength;
    dev: boolean;
    paths: configPaths;
  }

  interface OffsetInfo {
    offset: Offset;
    name: Names;
    typeStatus?: string;
  }

  interface OffsetEntry {
    offset: Offset;
    name: Names;
    description: string;
  }

  interface FileOffsets {
    offsets: Offset[];
    names: Names[];
    entries: OffsetEntry[];
  }

  interface FieldMatch extends RegExpExecArray {
    0: string; // whole match
    1: string; // offset
  }

  interface OffsetMatch extends RegExpExecArray {
    0: string; // whole match
    1: string; // Offset
    2: string; // Matched content before EventHandler/Action/Tuple/etc.
    3: string; // Matched content after EventHandler/Action/Tuple/etc.
  }

  interface PushSignatureOffsetInfo {
    oldFile: ClassUtil | null;
    newFile: ClassUtil | null;
    signatureContent: Data;
    offsetInfo?: FileOffsets;
    offsetNames?: Names[] | null;
    newOffsets: OffsetInfo[];
  }

  interface PushFieldInfo {
    newContent: FileContent;
    FieldNames: Names[];
    newFields: OffsetInfo[];
  }

  interface PushOffsetInfo {
    oldFile: ClassUtil | null;
    newFile: ClassUtil | null;
    offsetInfo?: FileOffsets;
    newContent: FileContent;
    offsetNames?: Names[];
    newOffsets: OffsetInfo[];
  }

  function pushField(
    pattern: OffsetPattern,
    index: Index,
    fileInfo: PushFieldInfo,
  ): Promise<void>;
  function pushOffset(
    pattern: OffsetPattern,
    index: Index,
    fileInfo: PushOffsetInfo,
  ): Promise<void>;
  function writeOffsets(
    filePath: FilePath,
    info: OffsetInfo[],
    inputType: inputType,
    formatType: FormatType,
  ): Promise<void>;
  function getOffsets(filePath: FilePath): Promise<FileOffsets>;
  function writeRegex(regexArray: OffsetPattern[], filePath: FilePath): void;
}

export {};
