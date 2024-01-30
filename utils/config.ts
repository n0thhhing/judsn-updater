import config from '../config/config.json';

import type { UpdaterConfig } from './types';

const {
  update_offsets,
  update_fields,
  log_offsets,
  output_signature,
  paths: {
    regex_out,
    old_dump,
    new_dump,
    offset_file,
    field_file,
    field_output,
    offset_output,
  },
}: UpdaterConfig = config;

export {
  config,
  field_file,
  field_output,
  log_offsets,
  new_dump,
  offset_file,
  offset_output,
  old_dump,
  output_signature,
  regex_out,
  update_fields,
  update_offsets,
};
