var differnceCore=(numJoueur) => {
  var listeImage=['bureau','jardin','chat','laure','ago','joke'];
  var etape=0;
  var epreuveDifference=document.getElementById("epreuveDifference");

  var cacheReponse=document.createElement('div');
  cacheReponse.style.display='none';
  cacheReponse.id='cacheReponse';
  epreuveDifference.appendChild(cacheReponse);


  // on creer le div
  var etapeSoloDiv=document.createElement('div');
  etapeSoloDiv.style.display='none';
  etapeSoloDiv.id='etapeSolo';
  epreuveDifference.appendChild(etapeSoloDiv);


  var img=document.createElement('img');
  img.id='etapeSoloImg';
  etapeSoloDiv.appendChild(img);
  var listeMot=['chemin','carte','goutte','crapaud','rebond','fortune','promenade','hausse','poignard','ange','selle',
    'dodu','gel','rugueux','superficiel','dangereux','enlever','animal','briller','massif','feu'];
  var image12qte=16;
  var image12=[];
  // on creer 12 images
  for (var i=0;i<image12qte;i++) {
    image12[i]=document.createElement('img');    
    image12[i].className='differenceImage12';
    etapeSoloDiv.appendChild(image12[i]);
  }



  var theNumero=0;

  var etapeSoloMiseAPlace=() => {
    var hauteur=epreuveDifference.offsetHeight;
    var largeur=epreuveDifference.offsetWidth;
    // on garde la plus petite 
    var taille=hauteur;
    if (largeur<hauteur) {
      taille=largeur;
    }
    // si taille est + grand que 1024
    if (taille>1024) {
      taille=1024;
    }
    // on met la taille de l'image
    img.style.width=taille+'px';
    img.style.height=taille+'px';

    var taille12=taille/4;
    for (var i=0;i<image12qte;i++) {
      image12[i].style.width=taille12+'px';
      image12[i].style.height=taille12+'px';
      // on positionne les images 4 x 4
      image12[i].style.top=Math.floor(i/4)*taille12+'px';
      image12[i].style.left=(i%4)*taille12+'px';
    }
  }

  var modeActif='';
  var etapeSolo=() => {    
    console.log('etapeSolo '+etape+' '+theNumero);
    img.src='img/difference/'+listeImage[etape]+theNumero+'.png';

    // on creer une copie de listeMot
    var listeMot2=[];
    for (var i=0;i<listeMot.length;i++) {
      listeMot2[i]=listeMot[i];
    }
    
    // on tire au sort les 12 images parmis listeMot

    for (var i=0;i<image12qte;i++) {
      var indice=Math.floor(Math.random() * listeMot2.length);
      image12[i].nom=listeMot2[indice];
      image12[i].src='img/differenceMini/'+listeMot2[indice]+'.jpg';
      image12[i].style.display='block';
      image12[i].style.opacity=1;
      listeMot2.splice(indice,1);
    }

    etapeSoloMiseAPlace();
    etapeSoloDiv.style.display='block';
    modeActif='solo';

  };

  var bonneReponse=() => {
    etapeMultiDiv.style.display='none';
    etapeSoloDiv.style.display='none';
    cacheReponse.style.display='block';
    cacheReponse.style.opacity=1;
    epreuveDifference.style.backgroundColor='green';
    mAnim(cacheReponse).delay(1000).complet(() => {
      setTimeout(() => {
        mAnim(cacheReponse).complet(() => {
          epreuveDifference.style.backgroundColor='black';
          cacheReponse.style.display='none';
          cacheReponse.style.opacity=0;
        }).fadeIn();
      },2000);
    }).fadeOut();    
  }

  var mauvaiseReponse=() => {
    etapeMultiDiv.style.display='none';
    etapeSoloDiv.style.display='none';
    cacheReponse.style.display='block';
    cacheReponse.style.opacity=1;
    epreuveDifference.style.backgroundColor='red';
    mAnim(cacheReponse).delay(1000).complet(() => {
      setTimeout(() => {
        mAnim(cacheReponse).complet(() => {
          epreuveDifference.style.backgroundColor='black';
          cacheReponse.style.display='none';
          cacheReponse.style.opacity=0;
        }).fadeIn();
      },2000);
    }).fadeOut();    
  }

  var binImg=(img) => {
    img.addEventListener("click", function() {      
      if (numJoueur==1) {
        annalyseReponse(img.idImg);
        if (theNumero==img.idImg) {
          escapeGame.send({msg:'bonneReponse'});
        } else {
          escapeGame.send({msg:'mauvaiseReponse'});
        }
      } else {
        escapeGame.send({msg:'difClick',idImg:img.idImg});
        if (theNumero==img.idImg) {
          bonneReponse();
        } else {
          mauvaiseReponse();
        }
      }
      
    });
  }

  var annalyseReponse=(idImg) => {
    if (theNumero==idImg) {
      bonneReponse();
      setTimeout(() => {
        nouvelleEtape();
      },4000);
    } else {      
      mauvaiseReponse();
      setTimeout(() => {
        precedenteEtape();
      },4000);
    }
  }





  var etapeMultiDiv=document.createElement('div');
  etapeMultiDiv.style.display='none';
  etapeMultiDiv.id='etapeMulti';
  epreuveDifference.appendChild(etapeMultiDiv);
  var etapeMultiImgs=[];
  for (var i=0;i<4;i++) {
    etapeMultiImgs[i]=document.createElement('img');
    etapeMultiImgs[i].className='differenceImageMulti';
    etapeMultiDiv.appendChild(etapeMultiImgs[i]);
    binImg(etapeMultiImgs[i]);


  }
  var etapeMultiMiseAPlace=() => {
    var hauteur=epreuveDifference.offsetHeight;
    var largeur=epreuveDifference.offsetWidth;
    // on garde la plus petite 
    var taille=hauteur;
    if (largeur<hauteur) {
      taille=largeur;
    }
    // si taille est + grand que 1024
    if (taille>1024) {
      taille=1024;
    }
    // on met la taille de l'image
    for (var i=0;i<4;i++) {
      etapeMultiImgs[i].style.width=taille/2+'px';
      etapeMultiImgs[i].style.height=taille/2+'px';
      // on positionne les images 2 x 2
      etapeMultiImgs[i].style.top=Math.floor(i/2)*(taille/2)+'px';
      etapeMultiImgs[i].style.left=(i%2)*(taille/2)+'px';
    }
  }

  var etapeMulti=() => {
    var liste=[1,2,3,4];
    // on melange la liste
    liste.sort(() => Math.random() - 0.5);
    etapeMultiImgs[0].src='img/difference/'+listeImage[etape]+liste[0]+'.png';
    etapeMultiImgs[0].idImg=liste[0];
    etapeMultiImgs[1].src='img/difference/'+listeImage[etape]+liste[1]+'.png';
    etapeMultiImgs[1].idImg=liste[1];
    etapeMultiImgs[2].src='img/difference/'+listeImage[etape]+liste[2]+'.png';
    etapeMultiImgs[2].idImg=liste[2];
    etapeMultiImgs[3].src='img/difference/'+listeImage[etape]+liste[3]+'.png';
    etapeMultiImgs[3].idImg=liste[3];
    etapeMultiMiseAPlace();
    etapeMultiDiv.style.display='block';
  };

  var precedenteEtape=() => {
    etape-=2;
    if (etape<0) {
      etape=-1;
    }
    nouvelleEtape();

  }
  var nouvelleEtape=() => { 
    // tirage au sort du numero (entre 1 et 4)
    theNumero=Math.ceil(Math.random() * 4);
    etape++;
    // on verifie si on est a la fin
    if (etape>=listeImage.length) {
      escapeGame.etapeSuivanteJ1();
      return;
    }
    if (etape%2==0) {
      etapeSolo();      
    } else {
      etapeMulti();    
    }
    setTimeout(() => {
      escapeGame.send({msg:'difEtape',etape:etape,theNumero:theNumero});
    },1000);
  }

  var numJoueur;
  return {
    out:() => {
      epreuveDifference.style.display="none";
    },
    init:(numJoueur2) => {
      numJoueur=numJoueur2;
      console.log('INIT DIFFERENCE '+numJoueur);
      epreuveDifference.style.display="block";
      if (numJoueur==1) {
        etape=-1;
        nouvelleEtape();
      }
    },
    message:(data) => {
      console.log(data);
      switch(data.msg) {
        case 'difEtape':
          etape=data.etape;
          theNumero=data.theNumero;
          if (etape%2==0) {
            etapeMulti();
          } else {
            etapeSolo();
          }
          break;
        case 'difClick':
          annalyseReponse(data.idImg);
          break;
        case 'bonneReponse':
          bonneReponse();
          break;
        case 'mauvaiseReponse':
          mauvaiseReponse();
          break;

      }
    },
    twitch:(peudo,message) => {
      if (modeActif=='solo') {
        for (var i=0;i<image12qte;i++) {
          if (image12[i].nom==message) {
            mAnim(image12[i]).fadeOut();
          }
        }
      }

    }
  }

};