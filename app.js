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
