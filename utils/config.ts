import type { UpdaterConfig } from './types';
import config from '../config/config.json';

const {
  update_offsets,
  update_fields,
  log_offsets,
  paths: {
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
  update_offsets,
  update_fields,
  log_offsets,
  old_dump,
  new_dump,
  offset_file,
  field_file,
  field_output,
  offset_output,
};
