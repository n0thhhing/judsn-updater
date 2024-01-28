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

- The most simple way to install is using curl or wget, see <a href="https://bun.sh/docs/installation" class="btn btn-primary">Installation Docs</a> for more information.

- For special cases like Termux, see: <a href="docs/TERMUX.md" class="btn btn-secondary">Termux Installation</a>

<style>
  /* Button Styles */
  .btn {
    display: inline-block;
    padding: 10px 20px;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
    margin-right: 10px; /* Add margin to separate buttons */
  }

  /* Primary Button */
  .btn-primary {
    background-color: #3498db;
    color: #fff;
  }

  /* Secondary Button */
  .btn-secondary {
    background-color: #2ecc71;
    color: #fff;
  }
</style>


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
