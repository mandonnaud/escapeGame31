const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path');

const http = require('http');
const WebSocket = require('ws');
var server = http.createServer(function(req, res) {
  console.log(req);
});
var serverOuvert=false;
var io=require('socket.io')(server);
var twitch=null;
var twitchReady=false;
var tokenTwitch ='';
var twitchChannel='';

var ip=require('ip');


var ipClient='';

http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
  resp.on('data', function(ip) {
    
    ipClient=ip.toString();
  });
});


var win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 1920,
    height: 1080,
    titleBarStyle:'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  // si win est actualisé
  win.webContents.on('did-finish-load', () => {
    if (serverOuvert) {
      // on stop le serveur
      server.close();
      serverOuvert=false;
    }
  });


  const win2 = new BrowserWindow({
    width: 400,
    height: 800,
    titleBarStyle:'hidden',
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

      twitchReady=true;
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

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    server.close();
    // on previens le render
    win.webContents.send('serveurError', 'Le port est déjà utilisé');
  } else {
    console.log(error);

  }
});

io.on('connection', (socket) => {
  socketIo=socket;
  console.log('a user connected');
  // on previens le render
  win.webContents.send('serverConnect');
  socket.on('message', (data) => {
    console.log('=>'+data);
    // on envois le message au render
    win.webContents.send('outMessage', data);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});




app.whenReady().then(() => {
  ipcMain.handle('monIp', () => {
    // on retourne l'ip de l'ordinateur (non local)
    

    return ipClient+' ou '+ip.address();
  });
  ipcMain.handle('startServeur', (event,port) => {
    console.log('LANCEMENT SERVEUR');
    // on verifie si le port est bien un nombre
    if (isNaN(port)) {
      return false;
    }
    // on verifie si le port est bien entre 0 et 65535
    if (port<0 || port>65535) {
      return false;
    }
    
    
    try {
      // on demarre le serveur socket.io
      // ipClient
      server.listen(port,ip.address(),() => {
        serverOuvert=true;
        // on envois un message au render
        event.sender.send('serverOn');

        
      });
      
    } catch (error) {
      console.log(error);
      return false;
    }
   
    
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
    socketIo = require('socket.io-client')('http://' + ip + ':' + port);
    
    // on verifie la connection
    socketIo.on('connect', (socket) => {
      // on envois un message au render
      console.log('Ok');
      // on ecoute les messages
      socketIo.on('message', (data) => {
        console.log(data);
        // on envois le message au render
        event.sender.send('outMessage', data);
      });
    });
    // on envois un message au serveur
   

    return true;
  });
  ipcMain.handle('stopClient', () => {
    // on demarre le client socket.io
    socketIo.close();
    return true;
  });
  ipcMain.handle('send',  (event,message) => {
    // on envois un message au serveur
    if (socketIo) {
     socketIo.emit('message', message);
    } else {
      io.emit('message', message);
    }
    
    
    return true;
  });
  



  
  ipcMain.handle('twitchChoixChannel', (event,channel) => {
    if (twitchChannel!=channel) {
      twitchChannel=channel;
      if (twitchReady) {
        twitch.send('JOIN #' + twitchChannel);
        twitch.send('PRIVMSG #'+twitchChannel+' :Jeu pret');
      }   
    }
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