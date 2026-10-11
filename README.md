# Antisuppression Bars — LG webOS TV app

Red/green reading bars for at-home antisuppression vision therapy (amblyopia / lazy eye),
used with bichrome (red-green) or red-blue glasses. Inspired by the
[Antisuppression Reading Bars](https://chromewebstore.google.com/detail/antisuppression-reading-b/kebomdjipbhpnlhamgnckhlobfgnabhk) Chrome extension.

> ⚠️ Supplement only — use under the guidance of an optometrist or ophthalmologist.

## Important platform limitation
webOS TV apps **cannot draw on top of other apps** (no system overlay like a browser extension).
The bars are shown over content *inside this app*: the built-in reader and six games.

## Games
All games draw in white on black, so the red/green bars split every object between the eyes —
each eye sees only part of each object, encouraging both eyes to work together.

| Game | Controls |
|---|---|
| **Shape Blaster** — shoot falling shapes before they land | ◀ ▶ move, hold OK fire |
| **Lane Racer** — dodge traffic on a 3-lane road | ◀ ▶ change lane |
| **Hop & Duck** — a cat runs; jump blocks, duck birds, grab stars | ▲/OK jump, hold ▼ duck |
| **Snake** — eat food, grow longer, avoid walls and your own tail | ◀ ▲ ▼ ▶ steer |
| **Maze Mouse** — eat every crumb while cats chase you; big cheese scares them | ◀ ▲ ▼ ▶ move |
| **Block Drop** — rotate falling blocks to fill and clear complete lines | ◀ ▶ move, ▲/OK rotate, hold ▼ drop |

In every game: YELLOW pause · BLUE settings · BACK menu. Best scores are saved per game.
Games have soft background music and sound effects; each can be turned off in Settings.

The home menu is drawn without bars. **Settings → Glasses** switches between red/green and
red/blue; each colour has its own shade list because screens show colour differently.

## Project layout
```
appinfo.json     webOS app manifest (id, icons, resolution)
index.html       entry page
css/app.css      1920x1080 TV layout
js/settings.js   persisted settings + option lists
js/bars.js       bar rendering (CSS repeating gradient)
js/app.js        menu, screens, remote-control navigation
js/sound.js      synthesized music and sound effects (Web Audio)
js/menu-art.js   menu tile icons
js/games/        engine.js + blaster, racer, runner, snake, maze, blocks
assets/          icon.png (80x80), largeIcon.png (130x130), splash.png (1920x1080)
docs/            store submission notes
```

## Remote controls
| Key | Menu | Reading (11 stories: 8 English, 3 Arabic) | Settings panel |
|---|---|---|---|
| ▲ ▼ | move | scroll text | move selection |
| ◀ ▶ | move | previous / next story | change value |
| OK | open item | open settings | close settings |
| BACK | exit app | back to menu | close settings |
| RED | — | toggle horizontal/vertical | — |
| GREEN | — | next bar width | — |
| BLUE | settings | settings | close settings |

Game controls are listed above. The full tester walkthrough is in
[docs/UX_SCENARIO.md](docs/UX_SCENARIO.md).

## Develop & test
1. Install the webOS TV CLI: `npm install -g @webos-tools/cli`
2. Quick check in a desktop browser: open `index.html` — arrows + Enter, Esc = BACK,
   R/G/Y/B = colour keys.
3. Package: `ares-package .` → produces `com.zouhair.antisuppressionbars_0.1.0_all.ipk`
4. On the TV: install the **Developer Mode** app, enable it, then
   `ares-setup-device` and `ares-install -d <tv> *.ipk`
5. Or run in the webOS TV Simulator from the SDK.

## Publishing
See [docs/PUBLISHING.md](docs/PUBLISHING.md).
