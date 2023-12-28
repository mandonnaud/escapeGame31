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
  // gestion du serveur
  startServeur: (port) => ipcRenderer.invoke('startServeur',port),
  stopServeur: () => ipcRenderer.invoke('stopServeur'),
  // gestion du client
  startClient: (port,ip) => ipcRenderer.invoke('startClient',port,ip),
  stopClient: () => ipcRenderer.invoke('stopClient'),
  // gestion des messages
  send: (message,important) => ipcRenderer.invoke('send',message,important),
  on: (message,callback) => ipcRenderer.on(message,callback),

});