var escapeGame=(() => {
  var core={};

  var motMelele1=null;
  var listeJeu=[
    {
      init:() => {
        document.getElementById('teste').style.display='block';
        motMelele1=motMeleleCore({
          largeur:21,
          hauteur:14,
          idHtml:'teste',
          mots:['laure','phelipon','ago','coloriages','magique','detente','crayon','dessin','peinture','pinceau',
          'papier','feutre','stylo','gomme','couleurs','youtube','twitch','samuel','portrait','bisous','fresque','fond','fusain','encre','pastel',
          'rond','chat','tache','uni','vive','teinte','ocre','signe','lutin','inktober',
          'marqueur','aquarelle','texture','art','page','image','live','croquis',
          'rouge','vert','bleu','noir','cyan','magenta','jaune','orange','violet','rose','gris','blanc','marron','beige','turquoise','indigo']
        });
        console.log(motMelele1);
      },
      twitch:(peudo,message) => {
        if (motMelele1!=null) {
          motMelele1.proposition(message,peudo);
        }
        
      }
     

    }
  ];
  var etape=-1;

  core.depart=() => {
    etape++;
    if (listeJeu[etape] && listeJeu[etape].init) {
      listeJeu[etape].init();
    }

  };
  core.twitch=(pseudo,message) => {
    console.log(message);
    if (listeJeu[etape] && listeJeu[etape].twitch) {
      listeJeu[etape].twitch(pseudo,message);
    }
  };

  return core;
})();