const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const ip = require('ip')
const http = require('http');

const WebSocket = require('ws');

var server = http.createServer(function(req, res) {

});
var io=require('socket.io')(server);
var twitch=null;
var tokenTwitch ='';
var twitchChannel='';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')


  const win2 = new BrowserWindow({
    width: 400,
    height: 800
  });
  win2.loadURL('https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=b5z3gqy4nv2mtw6iv8g4mk5cvdxi4y&redirect_uri=http://localhost&scope=chat%3Aread+chat%3Aedit');

  var verifBoucle=setInterval(function(){
    // on regarde l'url de la fenetre
    var url = win2.webContents.getURL();   
    if (url.indexOf('access_token=') == -1) {
      return;
    }
    //  http://localhost/#access_token=7n1l0oktrg29lv7rszjbdlvt9lvlgk&scope=chat%3Aread+chat%3Aedit&token_type=bearer
    // on recupere le token
    tokenTwitch = url.split('access_token=')[1].split('&')[0];
    win2.close();
    clearInterval(verifBoucle);

    twitch = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

    twitch.on('open', () => {
      console.log('Opened connection');
    
      twitch.send('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
      twitch.send(`PASS oauth:`+tokenTwitch);
      twitch.send('NICK EscapeGameBot');

      if (twitchChannel!='') {
        twitch.send('JOIN #' + twitchChannel);
        twitch.send('PRIVMSG #'+twitchChannel+' :Jeu pret');
      } 

    });
    twitch.on('message', (data) => {
      data=data.toString();
      // PING
      if (data.indexOf('PING') != -1) {
        twitch.send('PONG :tmi.twitch.tv');
        return;
      }
      if (twitchChannel!='') {
        // contient PRIVMSG #'+twitchChannel+'
        if (data.indexOf('PRIVMSG #'+twitchChannel) != -1) {
          console.log(data);
          var message=data.split('PRIVMSG #'+twitchChannel+' :')[1];
          // on enleve les retour chariot
          message=message.replace(/(\r\n|\n|\r)/gm, "");
          // on enleve les espaces en debut et fin de chaine
          message=message.trim();
          var pseudo=data.split('display-name=')[1].split(';')[0];
          // on envois le message au render
          win.webContents.send('messageTwitch', pseudo, message);
        }
      }


    });    
  },10);

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
  // twitchChoixChannel
  ipcMain.handle('twitchChoixChannel', (event,channel) => {
    twitchChannel=channel;
    if (twitch!=null) {
      twitch.send('JOIN #' + twitchChannel);
      twitch.send('PRIVMSG #'+twitchChannel+' :Jeu pret');
    }
    
   
    return true;
  });
  // listeWebcam
  ipcMain.handle('listeWebcam', () => {
    const { desktopCapturer } = require('electron');
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
      for (const source of sources) {
        if (source.name === 'Entire screen') {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: source.id,
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720
                }
              }
            })
            handleStream(stream)
          } catch (e) {
            handleError(e)
          }
          return
        }
      }
    })
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