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
2. Press **OK**. The notice closes and the **home menu** appears with seven items: Reading, Shape Blaster, Lane Racer, Hop & Duck, Snake, Maze Mouse, Settings.
3. Red and green horizontal bars cover the whole screen. This is the core function of the app.
4. Relaunch the app: the notice is not shown again.

## 2. Home menu
1. Press **▲ / ▼** to move the highlight between items.
2. Press **OK** to open the highlighted item.
3. Press **BACK** on the home menu to exit the app.

## 3. Reading
1. Select **Reading**. A story is shown under the bars.
2. Press **▼ / ▲** to scroll the story.
3. Press **◀ / ▶** to switch between 6 stories. The footer shows "story N of 6".
4. Press **RED** to switch bars between horizontal and vertical.
5. Press **GREEN** to change the bar width.
6. Press **OK** to open Settings; press **OK** or **BACK** to close it.
7. Press **BACK** to return to the home menu.

## 4. Settings panel (available from anywhere with BLUE, or from the menu)
1. Press **▲ / ▼** to choose a setting: Orientation, Bar width, Bar strength, Red shade, Green shade, Text size.
2. Press **◀ / ▶** to change the value. The bars update immediately behind the panel.
3. Press **OK**, **BACK** or **BLUE** to close.
4. Exit and relaunch the app: the chosen settings are kept.

## 5. Games (common behaviour)
- The score is shown top left, the play time top centre, and lives (3 hearts) top right.
- Losing a life makes the player flash briefly. At 0 lives, a **Game over** screen shows the score and best score.
- On Game over: **OK** plays again, **BACK** returns to the menu.
- **YELLOW** pauses and resumes. **BLUE** opens Settings and pauses the game.
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

## Expected key behaviour summary
| Key | Menu | Reading | Games | Settings |
|---|---|---|---|---|
| ▲ ▼ | move | scroll | jump / duck, steer (Snake, Maze Mouse) | choose |
| ◀ ▶ | — | change story | move / change lane / steer | change value |
| OK | open item | open Settings | fire / jump / restart | close |
| BACK | exit app | menu | menu | close |
| RED | — | bar orientation | — | — |
| GREEN | — | bar width | — | — |
| YELLOW | — | — | pause | — |
| BLUE | Settings | Settings | Settings (pauses) | close |
