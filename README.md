# Antisuppression Bars — LG webOS TV app

Red/green reading bars for at-home antisuppression vision therapy (amblyopia / lazy eye),
used with bichrome (red-green) or red-blue glasses. Inspired by the
[Antisuppression Reading Bars](https://chromewebstore.google.com/detail/antisuppression-reading-b/kebomdjipbhpnlhamgnckhlobfgnabhk) Chrome extension.

> ⚠️ Supplement only — use under the guidance of an optometrist or ophthalmologist.

## Important platform limitation
webOS TV apps **cannot draw on top of other apps** (no system overlay like a browser extension).
The bars are shown over content *inside this app*: the built-in reader (19 stories in English, French and Arabic) and ten games.

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
| **Split Stack** *(two-eye)* — falling block for the weaker eye, stack for the stronger eye | as Block Drop |
| **Ball & Paddle** *(two-eye)* — ball and bricks for the weaker eye, paddle for the stronger eye | ◀ ▶ move, OK serve |
| **Fruit Catcher** *(two-eye)* — fruit and bugs for the weaker eye, basket for the stronger eye | ◀ ▶ move |
| **Hidden Picture** *(two-eye)* — find the shape hidden in dots split between the eyes | ◀ ▶ choose, OK answer |

Two-eye games switch the bars off and draw each part in one eye's colour instead. They use
**Settings → Weaker eye** and **Settings → Strong-eye contrast**.

In every game: YELLOW pause · BLUE settings · BACK menu. Best scores are saved per game.
Games have soft background music and sound effects; each can be turned off in Settings.

The home menu is drawn without bars. **Settings → Glasses** switches between red/green and
red/blue. **Settings → Colour test** shows a cat through each bar colour with R / G / B pickers,
to tune the colours to your glasses and screen. Defaults are red #9B1819 and green #1A9B1C
at 100% strength.

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
js/story-art.js  story drawings
js/library.js    story list
js/calibrate.js  colour test and picker
js/games/        engine.js + blaster, racer, runner, snake, maze, blocks (+ split stack), paddle, fruit, picture
assets/          icon.png (80x80), largeIcon.png (130x130), splash.png (1920x1080)
docs/            store submission notes
```

## Remote controls
| Key | Menu | Reading (19 stories: English, French, Arabic) | Settings panel |
|---|---|---|---|
| ▲ ▼ | move | scroll text | move selection |
| ◀ ▶ | move | previous / next story | change value |
| OK | open item | open settings | close settings |
| BACK | exit app | back to story list | close settings |
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
