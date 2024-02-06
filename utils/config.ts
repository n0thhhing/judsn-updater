import { existsSync } from 'fs';

const doesExist: boolean = existsSync(`${__dirname}/../tests/test.config.json`);
const configPath: FilePath = doesExist
  ? `${__dirname}/../tests/test.config.json`
  : `${__dirname}/../config/config.json`;

const {
  update_offsets,
  update_fields,
  log_offsets,
  output_signature,
  type_check,
  debug,
  format_type,
  paths: {
    regex_out,
    old_dump,
    new_dump,
    offset_file,
    field_file,
    field_output,
    offset_output,
  },
}: UpdaterConfig = doesExist
  ? await import(configPath)
  : require('require-json5').requireJSON5(configPath);

export {
  debug,
  field_file,
  field_output,
  format_type,
  log_offsets,
  new_dump,
  offset_file,
  offset_output,
  old_dump,
  output_signature,
  regex_out,
  type_check,
  update_fields,
  update_offsets,
};
