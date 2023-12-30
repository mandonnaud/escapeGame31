var motMeleleCore=(opts) => {
  // generateur de mot mélé
  var mm={
    version: "0.0.1",
  };
  
  var theParent;
  if (opts.idHtml) {
    theParent = document.getElementById(opts.idHtml);
  } else {
    theParent = document.body;
  }

  // on verifie les options
  var opts=opts || {};
  // on verifie la largeur
  if (opts.largeur) {
    mm.largeur=opts.largeur;
  } else {
    mm.largeur=10;
  }
  // on verifie la hauteur
  if (opts.hauteur) {
    mm.hauteur=opts.hauteur;
  } else {
    mm.hauteur=10;
  }
  // on generer la grille
  mm.grille=[];
  for (var i=0;i<mm.hauteur;i++) {
    mm.grille[i]=[];
    for (var j=0;j<mm.largeur;j++) {
      mm.grille[i][j]=null;
    }
  }
  
  // on place un maximum de mots imposés
  
  var orientation=[
    [0,1],
    [0,-1],
    [1,0],
    [1,1],
    [1,-1],
    [-1,0],
    [-1,-1],
    [-1,1]
  ];
  mm.listeMot=[];
  mm.listeMotData={};

  var miseEnPage=() => {
    var largeurGeneral=theParent.offsetWidth;
    var hauteurGeneral=theParent.offsetHeight-85;

    grille.style.width=largeurGeneral+'px';
    grille.style.height=hauteurGeneral+'px';
    grille.style.top='85px';
    var largeurLettre=largeurGeneral/mm.largeur;
    var hauteurLettre=hauteurGeneral/mm.hauteur;
    var taille=Math.min(largeurLettre,hauteurLettre);
    for (var i=0;i<motMeleLettreAll.length;i++) {
      motMeleLettreAll[i].style.width=taille+'px';
      motMeleLettreAll[i].style.height=taille+'px';
      motMeleLettreAll[i].style.lineHeight=taille+'px';
      motMeleLettreAll[i].style.fontSize=(taille*0.8)+'px';
    }
    


  }
  
  var motMeleLettreAll;
  var grille=document.createElement("div");
  grille.id="motMeleGrille";
  theParent.appendChild(grille);
  var divMotRestant=document.createElement("div");
  divMotRestant.id="motMeleMotRestant";
  theParent.appendChild(divMotRestant);
  var divPopUp=document.createElement("div");
  divPopUp.id="motMelePopUp";
  theParent.appendChild(divPopUp);
  

  var generationHtml=() => {
   
    // on fouille la grille
    for (var i=0;i<mm.hauteur;i++) {
      var divLigne=document.createElement("div");
      divLigne.className="motMeleLigne";
      grille.appendChild(divLigne);
      for (var j=0;j<mm.largeur;j++) {
        // on regarde si c'est null ou la meme lettre que la premiere      
        var lettre=document.createElement("div");
        lettre.className="motMeleLettre";
        if (mm.grille[i][j]!=null) {
          lettre.innerHTML=mm.grille[i][j];
        } else {
          lettre.innerHTML='&nbsp;';
          // on ajoute une class vide
          lettre.className+=" motMeleVide";
        }
        divLigne.appendChild(lettre);
        
      }
    }
    motMeleLettreAll=document.querySelectorAll('.motMeleLettre');
    
    miseEnPage();
  }


  var nombreDeLettreRestante=mm.hauteur*mm.largeur;
  var peuPlace=(mot,orientation,x,y) => {
    // on verifie si on peut placer le mot
    var x2=x;
    var y2=y;
    var qteLetreNouvelle=0;
    for (var i=0;i<mot.length;i++) {
      // on verifie si on est dans la grille
      if (x2<0 || x2>=mm.hauteur || y2<0 || y2>=mm.largeur) {
        return -1;
      }
      // on verifie si la case est vide ou la meme lettre
      if (mm.grille[x2][y2]!=null && mm.grille[x2][y2]!=mot[i]) {
        return -1;
      }
      if (mm.grille[x2][y2]==null) {
        qteLetreNouvelle++;
      }
      // on passe a la lettre suivante
      x2+=orientation[0];
      y2+=orientation[1]; 
    }
    if (qteLetreNouvelle==0) {
      return -1;
    }
    return qteLetreNouvelle/mot.length;
  };
  var place=(mot,lettres,orientation,x,y,inverse) => {
    // on place le mot
    var x2=x;
    var y2=y;
    var vectureX=orientation[0];
    var vectureY=orientation[1];
    for (var i=0;i<lettres.length;i++) {
      if (mm.grille[x2][y2]==null) {
        nombreDeLettreRestante--;
      }
      if (inverse==true) {
        mm.grille[x2][y2]=lettres[lettres.length-i-1];
      } else {
        mm.grille[x2][y2]=lettres[i];
      }
      // on passe a la lettre suivante
      x2+=vectureX;
      y2+=vectureY;
    }
    mm.listeMot.push(mot);
    
    if (inverse==true) {
      console.log('inverse : '+mot);
      x=x+vectureX*(lettres.length-1);
      y=y+vectureY*(lettres.length-1);
      if (vectureX!=0) vectureX*=-1;
      if (vectureY!=0) vectureY*=-1;
    }
    
    mm.listeMotData[mot]={
      mot: mot,
      x: x,
      y: y,
      orientation: [vectureX,vectureY]
    };
  };
  // on place un mot dans la grille
  var placeurDeMot=(mot) => {
    // on regarde si le mot est deja dans la grille
    if (mm.listeMotData[mot]!=undefined) {
      return true;
    }
    // mon mélange les orientations
    orientation.sort(() => {
      return 0.5 - Math.random();
    });
    // on explose le mot en lettre
    var lettres=mot.split('');
    // on creer la version mirroir du mot
    var lettresMirroir=[];
    for (var i=0;i<lettres.length;i++) {
      lettresMirroir.push(lettres[lettres.length-i-1]);
    }
    var motMirroire=lettresMirroir.join('');

    // on fouille la grille
    for (var i=0;i<mm.hauteur;i++) {
      for (var j=0;j<mm.largeur;j++) {
        // on regarde si c'est null ou la meme lettre que la premiere
        if (mm.grille[i][j]==lettres[0]) {
          // on verifie si on peut placer le mot
          for(var o=0; o<orientation.length;o++) {
            var qte=peuPlace(lettres,orientation[o],i,j);
            if (qte!=-1) {
              var inverse=false;
              if (qte==1) {
                // une chance sur deux de placer le mot à l'envers
                if (Math.random()>0.5) {
                  inverse=true;
                  console.log('inverse : '+mot);
                }
              }
              // on place le mot
              place(mot,lettres,orientation[o],i,j,inverse);              
              // on sort de la boucle
              return true;
            }
            qte=peuPlace(lettresMirroir,orientation[o],i,j);
            if (qte!=-1) {
              console.log('Mirroire : '+mot);
              // on place le mot
              place(mot,lettres,orientation[o],i,j,true);
              // on sort de la boucle
              return true;
            }
          }

          
        }
      }
    }
    // on fouille la grille
    for (var i=0;i<mm.hauteur;i++) {
      for (var j=0;j<mm.largeur;j++) {
        // on regarde si c'est null ou la meme lettre que la premiere
        if (mm.grille[i][j]==null) {
          // on verifie si on peut placer le mot
          for(var o=0; o<orientation.length;o++) {
            var qte=peuPlace(lettres,orientation[o],i,j);
            if (qte!=-1) {
              var inverse=false;
              if (qte==1) {
                // une chance sur deux de placer le mot à l'envers
                if (Math.random()>0.5) {
                  inverse=true;
                  console.log('inverse : '+mot);
                }
              }
              // on place le mot
              place(mot,lettres,orientation[o],i,j,inverse);              
              // on sort de la boucle
              return true;
            }
            qte=peuPlace(lettresMirroir,orientation[o],i,j);
            if (qte!=-1) {
              console.log('Mirroire : '+mot);
              // on place le mot
              place(mot,lettres,orientation[o],i,j,true);
              // on sort de la boucle
              return true;
            }
          }

          
        }
      }
    }
    return false;
  };

  var fouilleMots=async (mots) => {
    // on mélange les mots
    mots.sort(() => {
      return 0.5 - Math.random();
    });
    var marchePas=0;
    // on fouille les mots
    for (var i=0;i<mots.length;i++) {
      // on place le mot
      if (placeurDeMot(mots[i])) {
        // on sort de la boucle
        marchePas=0;
      } else {
        marchePas++;
        if (marchePas>30) {
          // on passe à la taille suivante
          return;
        }
      }
    }
  }
  mm.pret=false;
  var motDicoInit=async () => {
    var mots=['bas','haut','clair','bien','rond','chat','top','beau','page','image','live','joli','fin',
    'deux','trois','quatre','cinq','six','sept','huit','neuf','dix','son','ane','moi','toi','bon',
    'nez','oeil','main','pied','bras','jambe','tete','corps','doigt','cheveux','dent','bouche','oreille','cou',
    'tresse',
    'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo','cours'
    ];
    fouillesMotsParTaille(motParTaille(mots));
    divMotRestant.innerHTML='<strong>'+mm.listeMot.length+'</strong> mots à trouver';
    mm.pret=true;
  }
  var fouillesMotsParTaille=async (data) => {
    var mots=data[0];
    var plusLong=data[1];
    // on fouille les mots des plus long au plus court
    for (var i=plusLong;i>0;i--) {
      if (mots[i]!=undefined) {
        await fouilleMots(mots[i]);
      }
    }
  }
  var motParTaille=(mots) => {
    var plusLong=0;
    var motsParTaille=[];
    for (var i=0;i<mots.length;i++) {
      // longuer du mot
      var longueur=mots[i].length;
      // on regarde si cette taille à déjà un tableau
      if (motsParTaille[longueur]==undefined) {
        motsParTaille[longueur]=[];
      }
      // on ajoute le mot
      motsParTaille[longueur].push(mots[i]);
      // on regarde si c'est le plus long
      if (longueur>plusLong) {
        plusLong=longueur;
      }
    }
    return [motsParTaille,plusLong];

  }

  // on verifie les mots imposés
  if (opts.mots) {
    var motImposetInit=async () => {
      // on trie les mots par longueur
      await fouillesMotsParTaille(motParTaille(opts.mots));
      await motDicoInit();
      
    }
    motImposetInit();
  } else {
    motDicoInit();
  }

  // on attent que la grille soit prete
  var attenteGrille=async () => {
    if (mm.pret) {
      generationHtml();
    } else {
      setTimeout(attenteGrille,100);
    }
  }
  attenteGrille();

  var listeMotTrouve=[];

  var attenteTrouver=() => {
    // on regarde si il y a quelques chose dans la listeMotTrouve
    if (listeMotTrouve.length>0) {
      
      // on affiche une popup
      var mot=listeMotTrouve[0].mot;
      var qui=listeMotTrouve[0].qui;
      // on supprime le mot de la liste
      listeMotTrouve.shift();
      divPopUp.innerHTML='<strong>'+mot+'</strong> trouvé par <strong>'+qui+'</strong>';
      // on fait apparaitre la popup et on la fait disparaitre avec un slide up
      var hauteur=divPopUp.offsetHeight;
      var top=-hauteur;
      var vitesse=hauteur/60;
      // en 600ms on fait apparaitre descendre la popup à 0
      divPopUp.style.top=top+'px';
      var popupUpIn=window.setInterval(() => {
        top+=vitesse;
        divPopUp.style.top=top+'px';
        if (top>=0) {
          window.clearInterval(popupUpIn);
          divPopUp.style.top='0px';
          // on passe en rouge les lettres du mot une par une
          var motData=mm.listeMotData[mot];
          var x=motData.x;
          var y=motData.y;
          var orientation=motData.orientation;
          var x2=x;
          var y2=y;
          var i=0;
          var etape=0;
          var popupUpRouge=window.setInterval(() => {
            switch(etape) {
              case 0:
              case 2:
                motMeleLettreAll[x2*mm.largeur+y2].classList.add('motMeleLettreRouge');
              break;
              case 1:
              case 3:
                // on enleve le rouge
                motMeleLettreAll[x2*mm.largeur+y2].classList.remove("motMeleLettreRouge");
              break;
            }
            
            // on passe a la lettre suivante
            x2+=orientation[0];
            y2+=orientation[1];
            i++;
            if (i>=mot.length) {
              etape++;
              i=0;
              x2=x;
              y2=y;

              if (etape>=4) {

                window.clearInterval(popupUpRouge);
                // on attend 1 seconde
                var popupUpOut=window.setInterval(() => {
                  top-=vitesse;
                  divPopUp.style.top=top+'px';
                  if (top<=-hauteur) {
                    window.clearInterval(popupUpOut);
                    // on supprime le mot de la liste
                    listeMotTrouve.shift();
                    // on attend 1 seconde
                    setTimeout(attenteTrouver,1000);
                  }
                },10);
              }
            }
          


          },100);

          
        }
        
      });
    } else {
      setTimeout(attenteTrouver,100);
    }
  }
  attenteTrouver();


  mm.proposition=(mot,qui) => {

    if (mm.pret==false) {
      return;
    }
    var mot=mot.toLowerCase();
    if (mm.listeMotData[mot]!=undefined) {
      if (mm.listeMotData[mot].trouver!=undefined) {
        return;
      }
      mm.listeMotData[mot].trouver=true;
      console.log(mm.listeMotData[mot]);
      var data=mm.listeMotData[mot];
      var x=data.x;
      var y=data.y;
      var orientation=data.orientation;
      var x2=x;
      var y2=y;
      for (var i=0;i<mot.length;i++) {
        motMeleLettreAll[x2*mm.largeur+y2].className+=" motMeleLettreTrouve";
        // on passe a la lettre suivante
        x2+=orientation[0];
        y2+=orientation[1];
      }
      // on supprime le mot de la liste
      var index=mm.listeMot.indexOf(mot);
      mm.listeMot.splice(index,1);
      listeMotTrouve.push({
        mot: mot,
        qui: qui
      });
      divMotRestant.innerHTML='<strong>'+mm.listeMot.length+'</strong> mots à trouver';
    }
  };

  
  return mm;
};
