var escapeGame=(() => {
  var core={};
  var numJoueur=0;
  var etapeSuivanteJ1=() => {
    // on verifie si l'etape à out
    if (listeJeu[etape] && listeJeu[etape].out) {
      listeJeu[etape].out();
    }
    etape++;
    send({msg:'etapeSuivante',etape:etape});
    etapeSuivante();
  };
  core.etapeSuivanteJ1=etapeSuivanteJ1;
  var etapeSuivante=() => {   
    if (listeJeu[etape] && listeJeu[etape].init) {
      listeJeu[etape].init(numJoueur);
    }
  };
 

  var etapeMotMele=() => {
    var motMelele1=null;
    var motMelele1div=null;
    var motMelele1J1=false;
    var motMelele1J2=false;
    var motMeleleFini=() => {
      if (motMelele1J1 && motMelele1J2) {
        setTimeout(() => {
          etapeSuivanteJ1();
        },3000);
      }
    };
    return {
      out:() => {
        var epreuveMotMelee=document.getElementById('epreuveMotMelee');
        epreuveMotMelee.style.display='none';
        epreuveMotMelee.innerHTML='';
      },
      init:() => {
        var epreuveMotMelee=document.getElementById('epreuveMotMelee');
        epreuveMotMelee.style.display='block';
        motMelele1=motMeleleCore({
          largeur:21,
          hauteur:14,
          idHtml:'epreuveMotMelee',
          callBackTrouver:(qteMotRestant) => {
            send({msg:'motRestant',qte:qteMotRestant},qteMotRestant==0);
            if (numJoueur==1) {
              if (qteMotRestant==0) {                
                motMelele1J1=true;
                motMeleleFini();
              }
            }
          },
          mots:['laure','phelipon','ago','coloriages','magique','detente','crayon','dessin','peinture','pinceau',
          'papier','feutre','stylo','gomme','couleurs','youtube','twitch','samuel','portrait','bisous','fresque','fond','fusain','encre','pastel',
          'rond','chat','tache','uni','vive','teinte','ocre','signe','lutin','inktober','qui','quoi',
          'marqueur','aquarelle','texture','art','page','image','live','croquis','sourire','patreon','boutique','instagram',
          'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo']
        });
        // on creer le div pour afficher les mots restant de l'autre
        motMelele1div=document.createElement('div');
        motMelele1div.id='motMeleMotRestantAutre';
        epreuveMotMelee.appendChild(motMelele1div);
      },
      message:(data) => {
        if (data.msg=='motRestant') {
          motMelele1div.innerHTML='<strong>'+data.qte+'</strong> restant chez l\'autre';
          if (numJoueur==1) {
            if (data.qte==0) {
              motMelele1J2=true;
              motMeleleFini();
            }

          }
        }
      },
      twitch:(peudo,message) => {
        if (motMelele1!=null) {
          motMelele1.proposition(message,peudo);
        }
        
      }
    };
  };
  var debutCore=() => {
    var pret1=false;
    var pret2=false;
    var debutEscapeGame=document.getElementById('debutEscapeGame');
    debutEscapeGame.style.display='none';
    var debutEscapeGameCompteur=document.getElementById('debutEscapeGameCompteur');
    debutEscapeGameCompteur.style.display='none';
    var debutEscapeGameBtPret=document.getElementById('debutEscapeGameBtPret');
    debutEscapeGameBtPret.addEventListener('click',() => {
      debutEscapeGameBtPret.style.display='none';
      if (numJoueur==1) {
        debutEscapeGame1.classList.add('pret');
        pret1=true;
        deuxPret();
      } else {
        debutEscapeGame2.classList.add('pret');
      }
      mAnim(debutEscapeGame1).fadeIn();
      mAnim(debutEscapeGame2).fadeIn();
      send({msg:'debutPret'});
    });
    var deuxPret=() => {
      if (pret1 && pret2) {
        compteur();
        send({msg:'compteur'});

        
      }
    }
    var compteur=() => {
      var num=5;
      debutEscapeGame1.style.display='none';
      debutEscapeGame2.style.display='none';
      debutEscapeGameCompteur.style.display='block';
      debutEscapeGameCompteur.innerHTML=num;
      var interval=setInterval(() => {
        num--;
        debutEscapeGameCompteur.innerHTML=num;
        if (num==-1) {
          clearInterval(interval);
          debutEscapeGameCompteur.style.display='none';
          if (numJoueur==1) {
            etapeSuivanteJ1();
          }
        }
      },1000);


      
    }

    var debutEscapeGame1=document.getElementById('debutEscapeGame1');
    debutEscapeGame1.style.display='none';
    var debutEscapeGame2=document.getElementById('debutEscapeGame2');
    debutEscapeGame2.style.display='none';
    
    return {
      init:() => {
        mAnim(debutEscapeGame).fadeIn();
      },
      message:(data) => {
        switch(data.msg) {
          case 'debutPret':
            if (numJoueur==2) {
              debutEscapeGame1.classList.add('pret');
            } else {
              debutEscapeGame2.classList.add('pret');
              pret2=true;
              deuxPret();
            }
          break;
          case 'compteur':
            compteur();
            break;
        }
      }
    }
  }

  var etapeLabonneImage=() => {
    return differnceCore();
  }
  
  var listeJeu=[
    {
      init:() => {
        send({msg:'pretBjoueur'});
      },
      message:(data) => {
        if (data.msg=='pretBjoueur') {
          if (numJoueur==1) {
            etapeSuivanteJ1();
          } else {
            send({msg:'pretBjoueur'});
          }
        }

      }
    },
    mastermineJS(),
    debutCore(),
    etapeMotMele(),
    etapeLabonneImage(),
    {
      init:() => {
        alert('GAGENER');
      }
    }
  ];
  var etape=-1;

  core.depart=(idJoueur) => {
    numJoueur=idJoueur;
    etape++;
    if (listeJeu[etape] && listeJeu[etape].init) {
      listeJeu[etape].init(numJoueur);
    }

  };
  var listeMessageImportant=[];
  var numeroMessageImportant=0;
  var send=(data,important) => {
    if (important==undefined) important=true;
    if (important==true) {
      numeroMessageImportant++;
      data.numeroMessageImportant=numeroMessageImportant;
    }
    apiEG.send(JSON.stringify(data));
    if (important==true) {
      data.time=new Date().getTime();
      listeMessageImportant.push(data);
    }
  };
  core.send=send;
  setInterval(() => {
    // on verifie si on a des messages important qui n'ont pas ete recu
    var date=new Date().getTime();
    listeMessageImportant.forEach((element) => {
      if (date-element.time>5000) {
        send(element,false);
      }
    });
  },500);


  core.message=(data) => {
    data=JSON.parse(data);
    // si numeroMessageImportant
    if (data.msg=='bienRecu') {
      console.log('Message bien recu');
      var index=listeMessageImportant.findIndex((element) => {
        return parseInt(element.numeroMessageImportant)==parseInt(data.numeroMessageImportant);
      });
      if (index!=-1) {
        listeMessageImportant.splice(index,1);
      }
      return;
    }

    if (data.numeroMessageImportant) {
      // on envois un bien recu
      send({msg:'bienRecu',numeroMessageImportant:data.numeroMessageImportant},false);
    }

    if (data.msg=='etapeSuivante') {
      if (numJoueur==2) {
        if (listeJeu[etape] && listeJeu[etape].out) {
          listeJeu[etape].out();
        }
        etape=data.etape;
        etapeSuivante();
      }
    } else if (listeJeu[etape] && listeJeu[etape].message) {
      listeJeu[etape].message(data);
    }
  }
  core.twitch=(pseudo,message) => {
    console.log(message);
    if (listeJeu[etape] && listeJeu[etape].twitch) {
      listeJeu[etape].twitch(pseudo,message);
    }
  };

  return core;
})();