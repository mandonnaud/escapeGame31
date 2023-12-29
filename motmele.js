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
  

  var generationHtml=() => {
    var grille=document.createElement("div");
    grille.className="motMeleGrille";
    theParent.appendChild(grille);
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
        return false;
      }
      // on verifie si la case est vide ou la meme lettre
      if (mm.grille[x2][y2]!=null && mm.grille[x2][y2]!=mot[i]) {
        return false;
      }
      if (mm.grille[x2][y2]==null) {
        qteLetreNouvelle++;
      }
      // on passe a la lettre suivante
      x2+=orientation[0];
      y2+=orientation[1]; 
    }
    if (qteLetreNouvelle==0) {
      return false;
    }
    return true;
  };
  var place=(mot,orientation,x,y) => {
    // on place le mot
    var x2=x;
    var y2=y;
    for (var i=0;i<mot.length;i++) {
      if (mm.grille[x2][y2]==null) {
        nombreDeLettreRestante--;
      }
      mm.grille[x2][y2]=mot[i];
      // on passe a la lettre suivante
      x2+=orientation[0];
      y2+=orientation[1];
    }
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
    // on fouille la grille
    for (var i=0;i<mm.hauteur;i++) {
      for (var j=0;j<mm.largeur;j++) {
        // on regarde si c'est null ou la meme lettre que la premiere
        if (mm.grille[i][j]==null || mm.grille[i][j]==lettres[0]) {
          // on verifie si on peut placer le mot
          for(var o=0; o<orientation.length;o++) {
            if (peuPlace(lettres,orientation[o],i,j)) {
              // on place le mot
              place(lettres,orientation[o],i,j);
              mm.listeMot.push(mot);
              mm.listeMotData[mot]={
                mot: mot,
                x: i,
                y: j,
                orientation: orientation[o]
              };
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
    'un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix',
    'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo'
    ];
    fouillesMotsParTaille(motParTaille(mots));
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



  
  console.log(mm);
  return mm;
};
var mmTeste=motMeleleCore({
  largeur:15,
  hauteur:10,
  idHtml:'teste',
  mots:['laure','phelipon','ago','coloriages','magique','detente','crayon','dessin','peinture','pinceau',
  'papier','feutre','stylo','gomme','couleurs','youtube','twitch','samuel',
  'rond','chat',
  'marqueur','aquarelle','texture','art','page','image','live',
  'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo']
})