# xeditlib

Node.js wrapper for [XEditLib.dll](https://github.com/z-edit/xedit-lib) — programmatic access to xEdit for Bethesda game plugins (ESP/ESM/ESL).

Uses [koffi](https://koffi.dev/) for FFI bindings. No C++ compilation required — just install and go.

## Why this exists

The original [xelib npm package](https://www.npmjs.com/package/xelib) is a placeholder that doesn't work. The real xelib (from [zEdit](https://github.com/z-edit/zedit)) used native C++ bindings via [nan](https://github.com/nodejs/nan), which broke on modern Node.js versions and required a full C++ build toolchain.

This package replaces all of that with pure JavaScript FFI calls via koffi, making it work on any modern Node.js (14+) without compilation.

## Supported Games

- The Elder Scrolls IV: Oblivion (`GM_TES4`)
- The Elder Scrolls V: Skyrim (`GM_TES5`)
- The Elder Scrolls V: Skyrim Special Edition / VR (`GM_SSE`)
- Fallout 3 (`GM_FO3`)
- Fallout: New Vegas (`GM_FNV`)
- Fallout 4 / VR (`GM_FO4`)

## Installation

```bash
npm install xeditlib
```

XEditLib.dll and its data files are bundled in the package.

### Registry Requirement

XEditLib reads the game installation path from the Windows registry. For Skyrim SE/VR, you need:

```
HKLM\SOFTWARE\WOW6432Node\Bethesda Softworks\Skyrim Special Edition
  Installed Path = "C:\your\game\path\"
```

## Quick Start

```js
const xelib = require('xeditlib');

xelib.init();
xelib.setLanguage('English');
xelib.setGamePath('C:\\Games\\Skyrim Special Edition\\');
xelib.setGameMode(xelib.GM_SSE);
xelib.clearMessages();

// Load plugins (async — loader runs in background)
xelib.loadPlugins('Skyrim.esm', true, false);

xelib.waitForLoader().then(() => {
    xelib.clearMessages();

    const skyrim = xelib.fileByName('Skyrim.esm');
    console.log('File:', xelib.name(skyrim));

    // Navigate elements
    const weapGroup = xelib.getElement(skyrim, 'WEAP');
    console.log('Weapons:', xelib.elementCount(weapGroup));

    // Read record values
    const weapons = xelib.getElements(weapGroup);
    for (const w of weapons.slice(0, 5)) {
        const name = xelib.displayName(w);
        const fid = xelib.getFormID(w).toString(16).padStart(8, '0');
        const dmg = xelib.getValue(w, 'DATA\\Damage');
        console.log(`  [${fid}] ${name} (damage: ${dmg})`);
        xelib.release(w);
    }

    // Always release handles and close
    xelib.release(weapGroup);
    xelib.release(skyrim);
    xelib.close();
});
```

## API Overview

All 163 XEditLib functions are wrapped. Key categories:

### Setup
| Method | Description |
|--------|-------------|
| `init()` | Initialize XEditLib |
| `close()` | Shut down XEditLib |
| `setGamePath(path)` | Set game installation path |
| `setGameMode(mode)` | Set game mode (`GM_SSE`, `GM_FO4`, etc.) |
| `setLanguage(lang)` | Set language (e.g. `'English'`) |
| `loadPlugins(list, smartLoad, buildRefs)` | Load plugins by name (comma or `\n` separated) |
| `waitForLoader(timeout?)` | Returns Promise that resolves when loading completes |

### File Handling
| Method | Description |
|--------|-------------|
| `fileByName(name)` | Get file handle by filename |
| `fileByIndex(i)` | Get file handle by load order index |
| `addFile(name)` | Create a new plugin file |
| `saveFile(handle, path?)` | Save a plugin file |

### Element Navigation
| Method | Description |
|--------|-------------|
| `getElement(handle, path)` | Get child element by path |
| `getElements(handle, path?, sort?, filter?, sparse?)` | Get all child elements (returns handle array) |
| `elementCount(handle)` | Count child elements |
| `hasElement(handle, path)` | Check if element exists |
| `name(handle)` | Get element name |
| `displayName(handle)` | Get display name |
| `path(handle)` | Get element path |
| `signature(handle)` | Get record signature |

### Values
| Method | Description |
|--------|-------------|
| `getValue(handle, path?)` | Get string value |
| `setValue(handle, path, value)` | Set string value |
| `getIntValue(handle, path?)` | Get integer value |
| `setIntValue(handle, path, value)` | Set integer value |
| `getFloatValue(handle, path?)` | Get float value |
| `setFloatValue(handle, path, value)` | Set float value |
| `getFlag(handle, path, name)` | Get flag state |
| `setFlag(handle, path, name, enabled)` | Set flag state |

### Records
| Method | Description |
|--------|-------------|
| `getFormID(handle, local?)` | Get FormID |
| `setFormID(handle, id, local?, fixRefs?)` | Set FormID |
| `getRecord(fileH, formID, searchMasters?)` | Get record by FormID |
| `getRecords(handle, search?, includeOverrides?)` | Get records by signature |
| `getOverrides(handle)` | Get override records |
| `getWinningOverride(handle)` | Get winning override |
| `copyElement(handle, dest, asNew?)` | Copy element to another file |
| `isMaster(handle)` / `isOverride(handle)` | Check record type |

### Serialization
| Method | Description |
|--------|-------------|
| `elementToJson(handle)` | Serialize element to JSON string |
| `elementFromJson(handle, path, json)` | Deserialize from JSON |

### Handle Management
| Method | Description |
|--------|-------------|
| `release(handle)` | Release a handle (important — prevents leaks!) |
| `releaseNodes(handle)` | Release node tree |
| `cleanStore()` | Clean handle store |
| `resetStore()` | Reset handle store |

### Advanced Access
| Property | Description |
|----------|-------------|
| `raw` | Direct access to all raw DLL bindings |
| `wcb(str)` | Create UCS-2 wide char buffer from string |
| `getString(fn)` | Low-level string getter helper |
| `getArray(fn)` | Low-level array getter helper |

## Important Notes

### Handle Management
Every `getElement`, `getElements`, `fileByName`, etc. returns a handle (uint32). You **must** call `release(handle)` when done to prevent handle leaks. XEditLib has a finite handle store.

### XEditLib.dll Internals
These are documented here because they cost us hours of debugging:

1. **All strings are UCS-2/UTF-16LE** (Delphi `PWideChar`). The wrapper handles this automatically — you pass normal JS strings.

2. **`init()` and `close()` are void** — they don't return success/failure. If something goes wrong during init, it surfaces later.

3. **Delphi `WordBool` = `uint16`** (2 bytes), not a regular boolean.

4. **String return pattern**: Functions don't return strings directly. They write a length to a pointer, then you call `GetResultString` to retrieve the value. The wrapper handles this automatically.

5. **Game modes**: Use `GM_SSE` (4) for both Skyrim Special Edition and Skyrim VR.

## Credits

- [XEditLib](https://github.com/z-edit/xedit-lib) by matortheeternal (bundled DLL, MIT license)
- [zEdit](https://github.com/z-edit/zedit) by matortheeternal (reference implementation)
- [koffi](https://koffi.dev/) by Niels Martignène (FFI engine)

## License

MIT
