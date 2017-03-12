# Electron Flappy Clone

An [Electron](https://electron.atom.io/) Flappy Bird clone made at [NodeSchool Munich](https://nodeschool.io/munich/).

Made as an excercise to learn Electron and, of course, for fun too. 
[Download it here!](https://www.dropbox.com/s/h6fbe1oagt6hjna/electron-flappy-clone.app.zip?dl=0) (only for OS X (darwin-x64) at the moment). <i>You will be prompted with a warning since it's not an official app, so you can `open it anyway` via the systems preferences as usual.</i>

### Screenshot

<p align="center">
  <img src="https://github.com/perseidas/electron-flappy-clone/blob/master/res/electron-flappy-clone-screenshot.png" alt="Screenshot"       width=600/>
</p>

### How-to

I was super excited doing and completing this project at the NodeSchool (ask the mentors). My original plan was to learn basic Electron with the [workshoper](https://nodeschool.io/#workshopper-list) on [elementary-electron](https://github.com/maxogden/elementary-electron). As soon as it was finished, I remembered completing a tutorial sometime ago about a Flappy Clone in HTML (see credits) so the next challenge was to put that game into an Electron app.

To create your own Electron game:

#### 1. Clone this game or take your favourite HTML5 game and add the Electron ``app.js``

Assuming that you already have checked the basics of [``electron-quick-start``](https://github.com/electron/electron-quick-start), add the following ``app.js`` to your game (already included in this repo):

``` javascript
var electron = require('electron');

electron.app.on("window-all-closed", function(){
  electron.app.quit();
});

electron.app.on('ready', function () {
  var mainWindow = new electron.BrowserWindow({
    width: 600,
    height: 810,
    resizable: false});
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.on("closed", function () {
      mainWindow =  null;
    });
})
```

and then you can test and iterate your game app running it locally:

```bash
electron app.js
```

#### 2. Add the dependencies (packages via NPM) which are listed in the .JSON

Assuming that you already have [``Node.js``](https://nodejs.org/en/) and the node package manager [``npm``](https://www.npmjs.com/) installed 

```bash
npm init
npm install
```

#### 3. Install the [``electron-packager``](https://www.npmjs.com/package/electron-packager) via npm and run it in the game folder 

```bash
electron-packager .
```

#### 4. If you need modifications (like adding a new icon) you can re-package the app and overwrite the current one

```bash
electron-packager . --overwrite --icon=flappy_easyicon.icns
```

### Credits

The original [<i>Flappy Bird</i>](https://en.wikipedia.org/wiki/Flappy_Bird) game (discontinued) is due to Đông Nguyễn from dotGEARS.

Thanks to Max Wihlborg for his [tutorial of the game in HTML5](https://github.com/maxwihlborg/youtube-tutorials/tree/master/flappy), included here.

Game icon credits to author [draseart](http://www.easyicon.net/language.en/1145245-flappy_bird_icon.html)

<b>Special thanks</b> to the mentors, organizers, and sponsors of the event!

## Feedback and contribution

Since this is my first electron app, please let me know if it works (or not)! Changes and improvements are more than welcome! 

## License

electron-flappy-clone is licensed under the [MIT license.](https://github.com/perseidas/electron-flappy-clone/master/LICENSE.txt);  this game app was developed only for educational and entertaining (non-commercial) purposes only.
