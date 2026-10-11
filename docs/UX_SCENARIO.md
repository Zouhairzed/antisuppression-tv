# UX Scenario — Antisuppression Bars

Copy these steps into the UX scenario template downloaded from LG Seller Lounge.

| Item | Value |
|---|---|
| App name | Antisuppression Bars |
| App ID | com.zouhair.antisuppressionbars |
| Version | 0.1.0 |
| Resolution | 1920 × 1080 |
| Input | Standard LG remote (arrows, OK, BACK, colour keys). Magic Remote pointer is not used. |
| Network | Not required. The app works fully offline. |
| Login / account | None |
| In-app purchases / ads | None |
| Special hardware | None. Users are expected to wear red-green (bichrome) glasses, but every feature can be tested without them. |

## 1. First launch
1. Launch the app from the Home launcher. The splash screen appears, then the **"Before you start"** notice.
2. Press **OK**. The notice closes and the **home menu** appears: twelve tiles in a 4 × 3 grid, each with an icon and a short description: Reading, Shape Blaster, Lane Racer, Hop & Duck, Snake, Maze Mouse, Block Drop, Split Stack, Ball & Paddle, Fruit Catcher, Settings.
3. The home menu is shown without bars so it is easy to read. Vertical red and green bars cover the screen in Reading and in every game; this is the core function of the app.
4. Relaunch the app: the notice is not shown again.

## 2. Home menu
1. Press **◀ / ▶** to move the highlight between tiles, and **▲ / ▼** to move between rows.
2. Press **OK** to open the highlighted item.
3. Press **BACK** on the home menu to exit the app.

## 3. Reading
1. Select **Reading**. The **story list** appears (without bars): 19 tiles, each with a drawing of the story's subject, its title and its language — 12 in English, 4 in French, 3 in Arabic.
   Press **◀ ▲ ▼ ▶** to choose and **OK** to open; **BACK** returns to the home menu.
2. The story opens under the bars, with its drawing next to the title. Press **▼ / ▲** to scroll.
3. Press **◀ / ▶** to go to the previous / next story. The footer shows "story N of 19" and the language.
   Arabic stories are displayed right-to-left.
4. Press **RED** to switch bars between vertical (default) and horizontal.
5. Press **GREEN** to change the bar width.
6. Press **OK** to open Settings; press **OK** or **BACK** to close it.
7. Press **BACK** to return to the story list.

## 4. Settings panel (available from anywhere with BLUE, or from the menu)
1. Press **▲ / ▼** to choose a setting: Glasses, Orientation, Bar width, Bar strength, Red colour, Green colour (or Blue colour), Colour test, Weaker eye, Strong-eye contrast, Text size, Music, Sound effects.
   - **Glasses** switches between red / green and red / blue. With red / blue, the bars become red and blue and the Green shade row is replaced by Blue shade.
   - Each colour row shows a swatch and its value; **◀ / ▶** steps through preset colours. The defaults are red #9B1819 and green #1A9B1C at 100% bar strength.
   - **Colour test** (press **OK**) opens the colour test and picker described in section 4a.
   - **Weaker eye** (behind red lens / behind green lens) tells the two-eye games which colour the weaker eye sees.
   - **Strong-eye contrast** (100% down to 20%) darkens everything that only the stronger eye sees in the two-eye games.
   - **Music** (on / off) controls the soft background music in games. **Sound effects** (on / off) controls the short sounds for menus, moves, shots, jumps, pickups and losing a life.
2. Press **◀ / ▶** to change the value. The bars update immediately behind the panel (bars are shown while Settings is open, even over the home menu).
3. Press **OK**, **BACK** or **BLUE** to close.
4. Exit and relaunch the app: the chosen settings are kept.

## 4a. Colour test & picker (Settings → Colour test → OK)
1. Two tests are shown side by side: **Green bars** (or **Blue bars**) and **Red bars**. Each shows a white cat seen through a square of that bar colour, exactly as the app draws things under that bar. The red bars and app bars are hidden on this screen.
2. Next to each test: a colour swatch with its value, and **R**, **G**, **B** sliders (0–255).
3. Press **▲ / ▼** to move between the sliders and buttons, and **◀ / ▶** to change the highlighted slider in steps of 5 (hold to keep changing). The test square and swatch update immediately.
4. User instruction on screen: close the eye behind the green lens and, looking through the red lens only, adjust the green colour until the cat disappears; then the same for red with the green lens.
5. **Reset to default** restores that colour; **Use default colours** restores both; **Done** or **BACK** saves and returns to Settings.
6. With the Magic Remote pointer, sliders can also be dragged and buttons clicked.

## 5. Games (common behaviour)
- The score is shown top left, the play time top centre, and lives (3 hearts) top right.
- Losing a life makes the player flash briefly. At 0 lives, a **Game over** screen shows the score and best score.
- On Game over: **OK** plays again, **BACK** returns to the menu.
- **YELLOW** pauses and resumes. **BLUE** opens Settings and pauses the game.
- Soft background music plays during a game, with a different theme for each game. It stops when the game is paused, when Settings is open, on Game over and on returning to the menu. All sounds are generated by the app (no audio files, no network).
- **BACK** during play returns to the home menu.
- If the app is sent to the background (e.g. the Home button), the game pauses.

### 5a. Shape Blaster
1. Select **Shape Blaster**. Shapes fall from the top of the screen.
2. Press and hold **◀ / ▶** to move the cannon.
3. Hold **OK** (or **▲**) to fire. Hitting a shape adds 10 points.
4. A shape reaching the ground costs one life.

### 5b. Lane Racer
1. Select **Lane Racer**. The car drives on a 3-lane road.
2. Press **◀ / ▶** to change lane. At least one lane is always free.
3. Hitting a car or cone costs one life. Speed increases over time.

### 5c. Hop & Duck
1. Select **Hop & Duck**. A cat runs from left to right.
2. Press **▲** or **OK** to jump over blocks.
3. Hold **▼** to duck under birds.
4. Touching a star adds 25 points. Touching a block or bird costs one life.

### 5d. Snake
1. Select **Snake**. A short snake moves inside a walled field; a piece of food appears.
2. Press **◀ ▲ ▼ ▶** to steer. The snake cannot reverse directly.
3. Eating food adds 10 points and makes the snake longer and slightly faster.
4. Hitting the wall or the snake's own body costs one life and restarts the snake (score is kept).

### 5e. Maze Mouse
1. Select **Maze Mouse**. A mouse starts in a maze full of crumbs; two cats start in the middle.
2. Press **◀ ▲ ▼ ▶** to choose the mouse's direction; it turns at the next opening.
3. Each crumb adds 1 point. A cheese wedge (one in each corner area) adds 5 points and makes the cats hollow and scared for 7 seconds.
4. Touching a scared cat adds 50 points and sends it home. Touching a normal cat costs one life.
5. Eating every crumb adds 100 points and starts the next level with faster cats; "Level N" appears at the top.

### 5f. Block Drop
1. Select **Block Drop**. Blocks made of four squares fall into a well 10 squares wide. The next block is shown on the right; lines cleared and the level on the left.
2. Press **◀ / ▶** to move the block (hold to keep moving), **▲** or **OK** to rotate it, and hold **▼** to drop it faster.
3. An outline shows where the block will land.
4. Completing a full row clears it: 1, 2, 3 or 4 rows give 10, 30, 50 or 80 points times the level. Every 10 rows the level goes up and blocks fall faster.
5. If the stack reaches the top, one life is lost and the well is emptied (the score is kept).

## 5x. Two-eye games (Split Stack, Ball & Paddle, Fruit Catcher)
- In these three games the red/green bars are not shown. Instead, parts of the game are drawn only in the weaker eye's colour and other parts only in the stronger eye's colour (dimmed by **Strong-eye contrast**), so each eye sees different pieces. The two colours are the **Red colour** and **Green colour** (or **Blue colour**) from Settings; **Weaker eye** decides which one the weaker eye gets. Frames, text and score are white (both eyes).
- Lives, pause, Settings, music and Game over work as in the other games.

### 5g. Split Stack
1. Same controls and rules as Block Drop (5f).
2. The falling block, its landing outline and the next block are drawn for the weaker eye; the stack is drawn for the stronger eye.

### 5h. Ball & Paddle
1. Bricks fill the top of a walled court. The ball serves by itself after a moment (or press **OK** / **▲**).
2. Hold **◀ / ▶** to move the paddle. Where the ball hits the paddle sets its angle.
3. Returning the ball adds 1 point, breaking a brick 10. Clearing all bricks adds 100 and starts a faster level ("Level N" top left).
4. Missing the ball costs one life. The ball and bricks are drawn for the weaker eye, the paddle for the stronger eye.

### 5i. Fruit Catcher
1. Apples, pears, cherries and bananas fall, mixed with bugs. Hold **◀ / ▶** to move the basket.
2. Catching fruit adds points, with a growing combo bonus. Dropping fruit only resets the combo. Catching a bug costs one life.
3. Fruit and bugs are drawn for the weaker eye, the basket for the stronger eye. Fruit falls faster and bugs become more frequent over time.

## Expected key behaviour summary
| Key | Menu | Reading | Games | Settings |
|---|---|---|---|---|
| ▲ ▼ | move between rows | scroll | jump / duck, steer, rotate / drop faster, serve | choose |
| ◀ ▶ | move between tiles | change story | move / change lane / steer | change value |
| OK | open item | open Settings | fire / jump / rotate / serve / restart | close |
| BACK | exit app | story list | menu | close |
| RED | — | bar orientation | — | — |
| GREEN | — | bar width | — | — |
| YELLOW | — | — | pause | — |
| BLUE | Settings | Settings | Settings (pauses) | close |
