

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
  var ecranPreJeu2boutonSuivant2=document.getElementById("ecranPreJeu2boutonSuivant2");

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
    ecranPreJeu2boutonSuivant.addEventListener("click", function(){
      ecranPreJeu2.style.display="none";
      apiEG.startServeur(ecranPreJeu2port.value);
    });
    ecranPreJeu2.style.display="block";
  });

  boutonJoueur2.addEventListener("click", function(){
    ecranPreJeu1.style.display="none";
    _b.joueur=2;
    ecranPreJeu2joueur2.style.display="block";
    ecranPreJeu2boutonSuivant2.addEventListener("click", function(){
      ecranPreJeu2.style.display="none";
      apiEG.startClient(ecranPreJeu2portJoueur1.value,ecranPreJeu2ipJoueur1.value);
    });
    ecranPreJeu2.style.display="block";
  });

  

  return _b;
};
var _b=_bInstancce();

// on gere les retour du main
apiEG.on('connect', () => {
  console.log('hourra');
});