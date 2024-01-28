# judsn Offset Updater

The script is designed to update offsets in judsn

## Prerequisites

- Bun installed
- Required dependencies installed (`chalk`)

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

## Usage

1. Open the `config.json` file in the `config` directory and configure the necessary parameters (`old_dump`, `new_dump`, `offset_file`).

2. Put the offsets in the offsets.txt file and put your cs files in the specified dump paths you defined in config.json

3. Run the script:

    ```bash
    bun run index.js
    ```

4. The script will update the offsets and log the results.

## Installing bun

- The most simple way to install is using curl or wget, see [docs](https://bun.sh/docs/installation) for more information.

For special cases like Termux, see:

<a href="docs/TERMUX.md"><button style="background-color: #008CBA; color: white; padding: 8px 12px; border: none; border-radius: 5px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; margin: 4px 2px; cursor: pointer;">TERMUX.md</button></a>

## Script Overview

The main script (`index.ts`) uses TypeScript and includes the following features:

- Reads the content of a specified file (`new_dump`).
- Retrieves offset information using a utility function from `get_offsets.ts`.
- Uses regular expressions to extract offsets from the file content.
- Logs the updated offsets if "log_offsets" is true.

## Troubleshooting

In case of errors or unexpected behavior, check the error messages logged in the console.

Feel free to customize and expand upon this script based on your specific requirements.

---

**Note:** Ensure that you have Bun installed or this will not work
