# Move tabs and groups

## Default keyboard shortcuts

| Action               | Shortcut (Mac)                                         | Shortcut (everything else)                           |
| -------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Move tab left        | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>Left</kbd>  | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Left</kbd>  |
| Move tab right       | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>Right</kbd> | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Right</kbd> |
| Move tab group left  | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>,</kbd>     | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>,</kbd>     |
| Move tab group right | <kbd>Cmd</kbd> + <kbd>Control</kbd> + <kbd>.</kbd>     | <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd>     |

The following shortcuts also exist but don't have a default keybinding:

- Pin/Unpin tab
- Ungroup tab

All shortcuts can be assigned/reassigned at
[chrome://extensions/shortcuts](chrome://extensions/shortcuts) in Chrome

## Notes

If a tab runs off the edge of the screen, it wraps back around to the start.

Pinned tabs are fuly supported.

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
```

### Build for production

```sh
npm run build
```

To load the extension in the browser, you'll need to navigate to the extension
management page, turn on "Developer mode", select "Load unpacked" and open the
`dist` directory in this repo.
