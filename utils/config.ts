import { existsSync } from 'fs';

const doesExist: boolean = existsSync(`${__dirname}/../tests/test.config.json`);
const configPath: FilePath = doesExist
  ? `${__dirname}/../tests/test.config.json`
  : `${__dirname}/../config/config.json`;

const {
  update_offsets,
  update_fields,
  get_hex,
  log_offsets,
  output_signature,
  type_check,
  debug,
  format_type,
  signature_length,
  dev,
  paths: {
    lib_path,
    regex_out,
    old_dump,
    new_dump,
    field_output,
    offset_output,
    hex_output,
    offset_file,
    field_file,
  },
}: UpdaterConfig = await import(configPath);

export {
  debug,
  dev,
  field_file,
  field_output,
  format_type,
  get_hex,
  hex_output,
  lib_path,
  log_offsets,
  new_dump,
  offset_file,
  offset_output,
  old_dump,
  output_signature,
  regex_out,
  signature_length,
  type_check,
  update_fields,
  update_offsets,
};
