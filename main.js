const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const ip = require('ip')
const http = require('http');
var server = http.createServer(function(req, res) {

});
var io=require('socket.io')(server);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('monIp', () => {
    // on retourne l'ip de l'ordinateur
    return ip.address();
  });
  ipcMain.handle('startServeur', (event,port) => {
    
    // on demarre le serveur socket.io
    console.log(port);
    server.listen(port, ip.address());
    
    return true;
  });
  ipcMain.handle('stopServeur', () => {
    // on demarre le serveur socket.io
    server.close();
    return true;
  });
  var socketIo=null;
  ipcMain.handle('startClient', (event,port,ip) => {
    // on demarre le client socket.io
    io = require('socket.io-client');
    io.connect('http://' + ip + ':' + port);
    
    // on verifie la connection
    socketIo.on('connect', () => {
      // on envois un message au render
      event.sender.send('connect');
      
    });
    // on envois un message au serveur
    io.emit('message', 'coucou');

    return true;
  });
  ipcMain.handle('stopClient', () => {
    // on demarre le client socket.io
    io.close();
    return true;
  });
  ipcMain.handle('send', (message,important) => {
    // on envois un message au serveur
    io.emit('message', message);
    return true;
  });

  createWindow()  

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})