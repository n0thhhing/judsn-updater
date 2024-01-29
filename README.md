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

### Installing Bun [<img src="assets/logo.svg" alt="Bun" class="logo" style="border-radius: 50%; vertical-align: -5px; height: 25px; width: 25px; translate: 5px;"/>](https://bun.sh/docs)

- The simplest way to install is found in the official [<kbd>`docs`</kbd>](https://bun.sh/docs/installation)

- For special cases like Termux, see <span style="margin-right: 5px;">[<kbd>`TERMUX.md` </kbd>](docs/TERMUX.md)</span>

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

- [<kbd>`bench.test.ts`</kbd>](tests/bench.test.ts) - for updating offsets other than the judsn one (you can update any offset)
- [<kbd>`match.test.ts`</kbd>](tests/match.test.ts) - a slighly faster updater for judsn

---

**Note:** Ensure that you have Bun installed or this will not work
