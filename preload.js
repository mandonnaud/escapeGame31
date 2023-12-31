const { contextBridge, ipcRenderer } = require('electron')

/*
contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  //Nous pouvons exposer des variables en plus des fonctions
})
*/
contextBridge.exposeInMainWorld('apiEG',{
  monIp: () => ipcRenderer.invoke('monIp'),
  twitchChoixChannel: (channel) => ipcRenderer.invoke('twitchChoixChannel',channel),
  // gestion du serveur
  startServeur: (port) => ipcRenderer.invoke('startServeur',port),
  stopServeur: () => ipcRenderer.invoke('stopServeur'),
  // gestion du client
  startClient: (port,ip) => ipcRenderer.invoke('startClient',port,ip),
  stopClient: () => ipcRenderer.invoke('stopClient'),
  // gestion des messages
  send: (message) => ipcRenderer.invoke('send',message),
  on: (message,callback) => ipcRenderer.on(message,callback),
  // ipcRenderer.send('videoStream', stream);
  videoStream: (stream) => ipcRenderer.invoke('videoStream',stream),

});