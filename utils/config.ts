const {
  update_offsets,
  update_fields,
  log_offsets,
  output_signature,
  type_check,
  debug,
  paths: {
    regex_out,
    old_dump,
    new_dump,
    offset_file,
    field_file,
    field_output,
    offset_output,
  },
}: UpdaterConfig = await import(
  '../tests/test.config.json' || '../config/config.json'
);

export {
  debug,
  field_file,
  field_output,
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
