<!-- markdownlint-capture -->
<!-- markdownlint-disable -->

# offset updater

The script is designed to update offsets for judsn, the bun framework was used to develop & test everything

## Prerequisites

- Required dependencies installed (`chalk`, `typescript`, `Bun`)

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/n0thhhing/judsn-updater
   cd judsn-updater
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

### Installing Bun <img src="data/assets/logo.svg" alt="Bun" class="logo" style="border-radius: 20px; padding: 10px; vertical-align: -15px; translate: -4px; width: 20px; height: 20px;"/>

- The simplest way to install is found in the official [<kbd>`docs`</kbd>](https://bun.sh/docs/installation)

- For special cases like Termux, see <span style="margin-right: 5px;">[<kbd>`TERMUX.md` </kbd>](data/docs/TERMUX.md)</span>

##Config

### Configuration Options README

The config file is in <span style="margin-right: 5px;">[<kbd>`config/config.json` </kbd>](config/config.json)</span> and each are used as follows:
- **update_offsets**: Specifies if the offsets in `data/offsets/offsets.txt` should be updated.
- **update_fields**: Specifies if the fields in `data/offsets/fields.txt` should be updated.
- **get_hex**: Specifies if all the hex to the offsets will have an output.
- **log_offsets**: Specifies if the resulting offsets are logged to console.
- **output_signature**: Specifies if there is an output signature.
- **type_check**: Specifies type verification and if the offsets should be type checked after being updated (the regex itself would probably fail before you need this).
- **debug**: Adds extra time schemas.
- **format_type**: The output format, options: `judsn`, `default`.
- **signature_length**: The length of the output hex.
  
#### Paths:
- **lib_path**: Path to the `libil2cpp.so` file to extract hex from.
- **regex_out**: Path to the output file for regex.
- **old_dump**: Path to update from.
- **new_dump**: Path to update to.
- **offset_output**: Path where the resulting offsets will be stored.
- **field_output**: Path where the resulting fields will be stored.
- **hex_output**: Path where the hex will be stored.
- **offset_file**: The offset input file.
- **field_file**: The offset output file.

## Usage

1. Open the `config.json` file in the `config` directory and configure the necessary parameters (`old_dump`, `new_dump`, `offset_file`).

2. Put the offsets in the offsets.txt file and put your cs files in the specified dump paths you defined in config.json

3. Run the script:

   ```bash
   bun run index.js
   ```

4. The script will update the offsets and log the results.

## Troubleshooting

In case of errors or unexpected behavior, check the error messages logged in the console or submit an issue.

Feel free to customize and expand upon this based on your specific requirements.

## Extras

- [<kbd>`bench.test.ts`</kbd>](tests/bench.test.ts) - for updating offsets other than the judsn ones (you can update any offset)
- [<kbd>`match.test.ts`</kbd>](tests/match.test.ts) - a slighly faster updater for judsn

---

**Note:** Ensure that you have Bun installed or this will not work
