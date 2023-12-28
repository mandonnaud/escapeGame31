var motMeleleCore=(opts) => {
  // generateur de mot mélé
  var mm={
    version: "0.0.1",
  };
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
    var marchePas=0;
    // on fouille les mots
    for (var i=0;i<mots.length;i++) {
      // on place le mot
      if (placeurDeMot(mots[i])) {
        // on sort de la boucle
        marchePas=0;
      } else {
        marchePas++;
        if (marchePas>10) {
          // on passe à la taille suivante
          return;
        }
      }
    }
  }

  // on verifie les mots imposés
  if (opts.mots) {
    var motImposetInit=async () => {
      // on trie les mots par longueur
      var motsImposerParTaille=[];
      var plusLong=0;
      for (var i=0;i<opts.mots.length;i++) {
        // longuer du mot
        var longueur=opts.mots[i].length;
        // on regarde si cette taille à déjà un tableau
        if (motsImposerParTaille[longueur]==undefined) {
          motsImposerParTaille[longueur]=[];
        }
        // on ajoute le mot
        motsImposerParTaille[longueur].push(opts.mots[i]);
        // on regarde si c'est le plus long
        if (longueur>plusLong) {
          plusLong=longueur;
        }
      }
      
      // on fouille les mots des plus long au plus court
      for (var i=plusLong;i>0;i--) {
        if (motsImposerParTaille[i]!=undefined) {
          await fouilleMots(motsImposerParTaille[i]);
        }
      }
    }
    motImposetInit();
  }
  return mm;
};
var mmTeste=motMeleleCore({
  longueur:10,
  hauteur:10,
  mots:['laure','phelipon','ago','coloriages','crayon','papier','feutre','stylo','gomme','couleurs','youtube','twitch','samuel',
  'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo']
})