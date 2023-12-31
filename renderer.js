

// contient les configurations de base et les fonctions de base de communication
var _bInstancce=() => {
  // ecranPreJeu1 : choix du joueur
  var ecranPreJeu1 = document.getElementById("ecranPreJeu1");
  var boutonJoueur1=document.getElementById("boutonJoueur1");
  var boutonJoueur2=document.getElementById("boutonJoueur2");
  // ecranPreJeu2 : creation du serveur ou connection au serveur
  var ecranPreJeu2 = document.getElementById("ecranPreJeu2");
  ecranPreJeu2.style.display="none";
  var ecranPreJeu2joueur1=document.getElementById("ecranPreJeu2joueur1");
  ecranPreJeu2joueur1.style.display="none";
  var ecranPreJeu2monIp=document.getElementById("ecranPreJeu2monIp");
  var ecranPreJeu2port=document.getElementById("ecranPreJeu2port");
  var ecranPreJeu2boutonSuivant=document.getElementById("ecranPreJeu2boutonSuivant");
  var ecranPreJeu2joueur2=document.getElementById("ecranPreJeu2joueur2");
  ecranPreJeu2joueur2.style.display="none";
  var ecranPreJeu2ipJoueur1=document.getElementById("ecranPreJeu2ipJoueur1");
  var ecranPreJeu2portJoueur1=document.getElementById("ecranPreJeu2portJoueur1");
  var ecranPreJeu2joueur1bouton=document.getElementById("ecranPreJeu2joueur1bouton");
  var ecranPreJeu2info=document.getElementById("ecranPreJeu2info");
  ecranPreJeu2info.style.display="none";
  // ecranPreJeu3 : configuration du jeu
  var ecranPreJeu3 = document.getElementById("ecranPreJeu3");
  ecranPreJeu3.style.display="none";
  var ecranPreJeu3Suivant=document.getElementById("ecranPreJeu3Suivant");
  var ecranPreJeu3channelTwitch=document.getElementById("ecranPreJeu3channelTwitch");
  var videoSource=document.getElementById("videoSource");

  var _b={
    joueur:0,
  }


  boutonJoueur1.addEventListener("click", async function(){
    ecranPreJeu1.style.display="none";
    // si joueur 1, on affiche son ip
    ecranPreJeu2joueur1.style.display="block";
    var monIp=await apiEG.monIp();
    ecranPreJeu2monIp.innerHTML=monIp;
    _b.joueur=1;
    ecranPreJeu2joueur1bouton.addEventListener("click",async function(){
      ecranPreJeu2joueur1bouton.style.display="none";
      ecranPreJeu2port.disabled=true;
      apiEG.startServeur(ecranPreJeu2port.value);
    });
    ecranPreJeu2.style.display="block";
  });
  // serverOn
  apiEG.on('serverOn', () => {
    //etape3();
    ecranPreJeu2info.style.display="block";
    
  });
  // serveurError
  apiEG.on('serveurError', (mevent,message) => {
    alert(message);
    ecranPreJeu2port.disabled=false;
    ecranPreJeu2joueur1bouton.style.display="block";
  });
  // serverConnect
  apiEG.on('serverConnect', () => {
    ecranPreJeu2.style.display="none";
    etape3();
  });

  boutonJoueur2.addEventListener("click", function(){
    ecranPreJeu1.style.display="none";
    _b.joueur=2;
    ecranPreJeu2joueur2.style.display="block";
    ecranPreJeu2boutonSuivant2.addEventListener("click", function(){
      ecranPreJeu2.style.display="none";
      apiEG.startClient(ecranPreJeu2portJoueur1.value,ecranPreJeu2ipJoueur1.value);
      etape3();
    });
    ecranPreJeu2.style.display="block";
  });

  etape3=() => {
    ecranPreJeu3.style.display="block";
    ecranPreJeu3Suivant.addEventListener("click", function(){
      // on envois le channel twitch
      apiEG.twitchChoixChannel(ecranPreJeu3channelTwitch.value);
      ecranPreJeu3.style.display="none";
      escapeGame.depart(_b.joueur);


    });
    

  };
/*
  var webcam=document.getElementById("webcam");
  var listeCamera=async () => {
    var devices=await navigator.mediaDevices.enumerateDevices();
    var html='<option value="">Choisir une camera</option>';
    //Iterate over all of the devices
    for (var index = 0; index < devices.length; index++) {
      var device = devices[index];
      if (device.kind == "videoinput") {
        html+='<option value="'+device.deviceId+'">'+device.label+'</option>';
      }
    }
    videoSource.innerHTML=html;
  } 
  listeCamera();
  videoSource.addEventListener("change", async function(){
    
    var constraints = {
      audio: false,
      video: {
        deviceId: { exact: videoSource.value }
      }
    };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      // Utilisez le flux vidéo ici
      // Si vous avez besoin de l'envoyer au processus principal, vous pouvez le faire via IPC
      
      
      webcam.srcObject=stream;
      webcam.play();
      
    })
    .catch(err => {
      console.log('Erreur lors de la récupération du flux vidéo:', err);
    });
  });
  */

  

  return _b;
};


var _b=_bInstancce();

// on gere les retour du main
apiEG.on('connect', () => {
  console.log('hourra');
});
apiEG.on('messageTwitch', (event,pseudo,message) => {
  if (escapeGame) {
    escapeGame.twitch(pseudo,message);
  }
});
// outMessage
apiEG.on('outMessage', (event,message) => {
  if (escapeGame) {
    escapeGame.message(message);
  }
});