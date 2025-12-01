# Move tabs and groups

Move tabs and tab groups around using keyboard shortcuts. Extra utilities are
included to pin/unpin/ungroup tabs and to create a new tab in the current group.

## Installation

- [Chrome Web Store](https://chromewebstore.google.com/detail/move-tabs-and-groups/kccnmjkpiedjlkkpnlbbbjhpjklibcmm)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/move-tabs-and-groups/)
- [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/move-tabs-and-groups/odljdbhcpdgddnmfhdpdjhofkjjonofl)

## Default keyboard shortcuts

| Action            | Shortcut (Mac)                                         | Shortcut (everything else)                           |
| ----------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Tab: Move left    | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>Left</kbd>  | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Left</kbd>  |
| Tab: Move right   | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>Right</kbd> | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Right</kbd> |
| Group: Move left  | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>,</kbd>     | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>,</kbd>     |
| Group: Move right | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>.</kbd>     | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd>     |

The following shortcuts also exist but don't have a default keybinding:

- Tab: Pin/Unpin
- Tab: Ungroup
- Tab: Move to the start
- Tab: Move to the end
- Tab: Move to the next window
- Tab: Move to the previous window
- Group: Move to the start
- Group: Move to the end
- Group: Move to the next window
- Group: Move to the previous window
- Group: New tab in current group

All shortcuts can be assigned/reassigned at:

- [chrome://extensions/shortcuts](chrome://extensions/shortcuts) in Chrome
- [edge://extensions/shortcuts](edge://extensions/shortcuts) in Edge
- [about:addons](about:addons) in Firefox by selecting "Manage Extension
  Shortcuts" from the settings cog

## Notes

If a tab runs off the edge of the screen, it wraps back around to the start.

Pinned tabs are fully supported.

If an ungrouped tab is moved around:

- with the single tab shortcuts, it will naturally join and unjoin tab groups as
  it runs into them
- with the tab group shortcuts, it will skip around any existing tab groups

## Development

### Setup

```sh
npm i
```

### Run with hot reloading

```sh
npm run dev
# or for Firefox
npm run dev-firefox
```

### Build for production

Note: the zip step uses Posix commands `rm`, `pushd`, `popd` and `zip`. If
you're on Windows, you may need to use WSL or zip manually.

```sh
npm run build-and-zip
# or for Firefox
npm run build-and-zip-firefox
```

- In Chrome, navigate to the extension management page, turn on "Developer
  mode", select "Load unpacked" and open the `dist` directory in this repo.
- In Firefox, navigate to the extension management page, "Install Add-on From
  File..." and select the `move-tabs-and-groups-firefox.zip` file in this repo.
