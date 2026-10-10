# Antisuppression Bars — LG webOS TV app

Red/green reading bars for at-home antisuppression vision therapy (amblyopia / lazy eye),
used with bichrome (red-green) glasses. Inspired by the
[Antisuppression Reading Bars](https://chromewebstore.google.com/detail/antisuppression-reading-b/kebomdjipbhpnlhamgnckhlobfgnabhk) Chrome extension.

> ⚠️ Supplement only — use under the guidance of an optometrist or ophthalmologist.

## Important platform limitation
webOS TV apps **cannot draw on top of other apps** (no system overlay like a browser extension).
The bars are shown over content *inside this app* — the built-in reader, and later
e.g. bundled stories, exercises, or games.

## Project layout
```
appinfo.json     webOS app manifest (id, icons, resolution)
index.html       entry page
css/app.css      1920x1080 TV layout
js/settings.js   persisted settings + option lists
js/bars.js       bar rendering (CSS repeating gradient)
js/app.js        remote-control navigation
assets/          icon.png (80x80), largeIcon.png (130x130), splash.png (1920x1080)
docs/            store submission notes
```

## Remote controls
| Key | Reading mode | Settings panel |
|---|---|---|
| ▲ ▼ | scroll text | move selection |
| ◀ ▶ | — | change value |
| OK | open settings | close settings |
| BACK | exit app | close settings |
| RED | toggle horizontal/vertical | — |
| GREEN | next bar width | — |

## Develop & test
1. Install the webOS TV CLI: `npm install -g @webos-tools/cli`
2. Quick check in a desktop browser: open `index.html` (use arrow keys + Enter).
3. Package: `ares-package .` → produces `com.zouhair.antisuppressionbars_0.1.0_all.ipk`
4. On the TV: install the **Developer Mode** app, enable it, then
   `ares-setup-device` and `ares-install -d <tv> *.ipk`
5. Or run in the webOS TV Simulator from the SDK.

## Publishing
See [docs/PUBLISHING.md](docs/PUBLISHING.md).
