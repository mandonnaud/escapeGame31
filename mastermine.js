var mastermineJS=() => {
  var lesCouleurs=["rouge","vert","bleu","jaune","orange","violet","rose","blanc"];
  var tirage=[];
  var etapeActuel='';
  var tirageQte=0;
  var etape=-1;
  var epreuve=0;
  var nouvelleEpreuve=() => {
    epreuveFini=false;
    epreuve++;
    if (epreuve>3) {
      escapeGame.etapeSuivanteJ1();
      return;
    }
    tirage=[];
    switch(epreuve) {
      case 1:
        // on tire 4 couleurs       
        // on donnera des indices tres tres precis (ex : A rouge bien placé, B vert mal place, C bleu absent)
        tirageQte=3;
        for (var i=0;i<tirageQte;i++) {
          tirage.push(lesCouleurs[Math.floor(Math.random() * lesCouleurs.length)]);
        }
      break;
      case 2:
        // on tire 4 couleurs
        // on ne donnera des indices sans les couleurs (ex : A bien placé, B mal place, C absent)
        tirageQte=4;
        for (var i=0;i<tirageQte;i++) {
          tirage.push(lesCouleurs[Math.floor(Math.random() * lesCouleurs.length)]);
        }
      break;
      case 3:
        // on tire 5 couleurs
        // one donnera des indices flou, qte sans position (ex : 1 bien placé, 1 mal place, 1 absent)        
        tirageQte=5;
        for (var i=0;i<tirageQte;i++) {
          tirage.push(lesCouleurs[Math.floor(Math.random() * lesCouleurs.length)]);
        }
      break;
    }
    
    console.log(tirage);
    nouvelleEtape();
  }

  var nouvelleEtape=() => {
    etape++;
    if (etape%2==0) {
      etapeProposition();
      escapeGame.send({msg:'mastermineEtapeIndince'});
    } else {
      etapeIndice();
      escapeGame.send({msg:'mastermineEtapeProposition',tirageQte:tirageQte});
    }
  }



  var epreuveMasterMine=document.getElementById('epreuveMasterMine');
  var mesChoix=[];

  // on creer le div pour afficher les propositions
  var propoDiv=document.createElement('div');
  propoDiv.id='mastermineProposition';
  epreuveMasterMine.appendChild(propoDiv);
  var antiClick=document.createElement('div');
  antiClick.id='masterminePropositionAntiClick';
  antiClick.style.display='none';
  propoDiv.appendChild(antiClick);

  var porpoValider=document.createElement('div');
  porpoValider.style.display='none';
  porpoValider.id='masterminePropositionValider';
  // class bouton
  porpoValider.className='bouton';
  porpoValider.innerHTML='Valider';
  propoDiv.appendChild(porpoValider);

  // div qui contiendra les x choix
  var propoDivListe=document.createElement('div');
  propoDivListe.id='masterminePropositionListe';
  propoDiv.appendChild(propoDivListe);

  porpoValider.addEventListener('click',() => {
    porpoValider.style.display='none';
    propoDiv.style.display='none';
    // si joueur 1
    if (numJoueur==1) {
      verifReponse();
    } else {
      escapeGame.send({msg:'masterminVerif',mesChoix:mesChoix});
    }
  });

  var epreuveFini=false;

  var verifReponse=() => {
    var htmlIndice='';
    var tousBon=true;
    switch(epreuve) {
      case 1:
        // on donnera des indices tres tres precis (ex : A rouge bien placé, B vert mal place, C bleu absent)
        for(var i in mesChoix) {
          var couleur=mesChoix[i];
          if (mesChoix[i]==tirage[i]) {
            htmlIndice+='ABCDE'[i]+' '+couleur+' bien placé<br>';
          } else {
            tousBon=false;
            if (tirage.indexOf(mesChoix[i])!=-1) {
              htmlIndice+='ABCDE'[i]+' n\'est pas '+couleur+', mais existe<br>';
            } else {
              htmlIndice+='il n\'y a pas de '+couleur+'<br>';
            }
          }
        }
      break;
      case 2:
        // on ne donnera des indices sans les couleurs (ex : A bien placé, B mal place, C absent)
        for(var i in mesChoix) {
          if (mesChoix[i]==tirage[i]) {
            htmlIndice+='ABCDE'[i]+' bien placé<br>';
          } else {
            tousBon=false;
            if (tirage.indexOf(mesChoix[i])!=-1) {
              htmlIndice+='ABCDE'[i]+' mal placé<br>';
            }
          } 
        }
        if (htmlIndice=='') {
          htmlIndice='aucun couleur n\'existe<br>';
        }
      break;
      case 3:
        // one donnera des indices flou, qte sans position (ex : 1 bien placé, 1 mal place)
        var bienplacer=0;
        var malplacer=0;
        for(var i in mesChoix) {
          if (mesChoix[i]==tirage[i]) {
            bienplacer++;
          } else {
            tousBon=false;
            if (tirage.indexOf(mesChoix[i])!=-1) {
              malplacer++;
            }
          }
        }
        htmlIndice+=bienplacer+' bien placé<br>';
        htmlIndice+=malplacer+' mal placé<br>';
      break;
    }
    if (tousBon) {
      epreuveFini=true;
    }
    if (etapeActuel=='proposition') {
      // on envois les indices
      escapeGame.send({msg:'mastermineIndice',htmlIndice:htmlIndice});
    } else {
      affichierIndince(htmlIndice);
    }





  }
  




  var choixEnCoursElem=null;
  var choixEnCoursId=null;
  var bindChoixCouluer=(elem,id) => {
    elem.addEventListener('click',() => {
      antiClick.style.display='block';
      escapeGame.send({msg:'mastermineChoixCouleur',id:id});
      choixEnCoursElem=elem;
      choixEnCoursId=id;
      elem.className='masterminePropositionChoix';
    });
  } 
  var bindChoixPublic=(elem,id) => {
    elem.addEventListener('click',() => {
      antiClick.style.display='block';
      escapeGame.send({msg:'mastermineChoixPublic',id:id});
      choixEnCoursElem=elem;
      choixEnCoursId=id;
      elem.className='masterminePropositionChoix';
    });
  }
  var masterminePropositionChoixS;

  var choixDuPlublic=0;
  var etapeProposition=() => {
    etapeActuel='proposition';
    // on tire une des possibilité reserver au public
    choixDuPlublic=Math.floor(Math.random() * tirageQte);    
    porpoValider.style.display='none';

    var html='';
    for (var i=0;i<tirageQte;i++) {
      mesChoix[i]=null;
      html+='<div class="masterminePropositionChoix'+(choixDuPlublic==i?' choixPublic':'')+'"></div>';
    }
    propoDivListe.innerHTML=html;
    masterminePropositionChoixS=document.getElementsByClassName('masterminePropositionChoix');
    // au click on fait apparaitre les couleurs
    for (var i=0;i<masterminePropositionChoixS.length;i++) {
      if (choixDuPlublic!=i) {
        bindChoixCouluer(masterminePropositionChoixS[i],i);       
      } else {
        bindChoixPublic(masterminePropositionChoixS[i],i);
      }
    }    
    indiceDiv.style.display='none';
    propoDiv.style.display='block';
  }






  // partie indice
  var indiceDiv=document.createElement('div');
  indiceDiv.id='mastermineIndice';
  epreuveMasterMine.appendChild(indiceDiv);

  var indiceResultat=document.createElement('div');
  indiceResultat.style.display='none';
  indiceResultat.id='mastermineIndiceResultat';
  indiceDiv.appendChild(indiceResultat);
  var indiceResultatTexte=document.createElement('div');
  indiceResultatTexte.id='mastermineIndiceResultatTexte';
  indiceResultat.appendChild(indiceResultatTexte);
  var indiceValider=document.createElement('div');
  indiceValider.id='mastermineIndiceValider';
  indiceValider.className='bouton';
  indiceValider.innerHTML='Valider';
  indiceResultat.appendChild(indiceValider);

  var affichierIndince=(texte) => {
    indiceResultatTexte.innerHTML=texte;
    indiceResultat.style.display='block';
    indiceResultat.style.opacity=0;    
    mAnim(indiceResultat).fadeIn();
  }

  indiceValider.addEventListener('click',() => {
    indiceResultat.style.display='none';
    if (numJoueur==1) {
      if (epreuveFini) {
        escapeGame.etapeSuivanteJ1();
        //nouvelleEpreuve();
      } else {
        nouvelleEtape();
      }
    } else {
      escapeGame.send({msg:'mastermineEtapeIndinceValider'});
    }



  });

  var propoLesCouleurs=document.createElement('div');
  propoLesCouleurs.id='masterminePropositionLesCouleurs';
  propoLesCouleurs.style.display='none';
  indiceDiv.appendChild(propoLesCouleurs);

  var propoTwitch=document.createElement('div');
  propoTwitch.id='masterminePropositionTwitch';
  propoTwitch.style.display='none';
  indiceDiv.appendChild(propoTwitch);

  var div=document.createElement('div');
  div.innerHTML='Choix du public';
  div.id='masterminePropositionTwitchTitre';
  propoTwitch.appendChild(div);

  var masterminePropositionTwitchValider=document.createElement('div');
  masterminePropositionTwitchValider.id='masterminePropositionTwitchValider';
  masterminePropositionTwitchValider.innerHTML='Valider';
  propoTwitch.appendChild(masterminePropositionTwitchValider);
 
  console.log(masterminePropositionTwitchValider);
  console.log(masterminePropositionTwitchValider.id);
  masterminePropositionTwitchValider.addEventListener('click',() => {
    console.log('IIC');
    if (voteOuvert) {
      voteOuvert=false;
      propoTwitch.style.display='none';

      var listeDeCouleurAuMax=[];
      // on cheche less couleurs qui on opteni voteMax
      for(var couleur in voteTwitch) {
        if (voteTwitch[couleur]==voteMax) {
          listeDeCouleurAuMax.push(couleur);
        }
      }
      // on tire une couleur au hasard
      var couleur=listeDeCouleurAuMax[Math.floor(Math.random() * listeDeCouleurAuMax.length)];
      escapeGame.send({msg:'mastermineChoixCouleurFait',couleur:couleur});
      
    }
  });

  var divCouleurTwitch={};


  var curs=0;
  // on creer un div pour chaque couleur
  var creationCouleurBt=(couleur) => {
    var div=document.createElement('div');
    div.className='masterminePropositionLesCouleursDiv c'+couleur;
    propoLesCouleurs.appendChild(div);
    div.addEventListener('click',() => {
      escapeGame.send({msg:'mastermineChoixCouleurFait',couleur:couleur});
      propoLesCouleurs.style.display='none';
    });
    divCouleurTwitch[couleur]=document.createElement('div');
    divCouleurTwitch[couleur].className='masterminePropositionTwitchDiv c'+couleur;
    divCouleurTwitch[couleur].innerHTML='<span>'+couleur+'</span>';
    // on positionne les div à 33% les uns des autres en 3x3 (via curs)
    divCouleurTwitch[couleur].style.left=((curs%3)*33)+16+'%';
    divCouleurTwitch[couleur].style.top=(Math.floor(curs/3)*33)+16+'%';
    propoTwitch.appendChild(divCouleurTwitch[couleur]);
    curs++;
  };
  for (var i=0;i<lesCouleurs.length;i++) {
    creationCouleurBt(lesCouleurs[i]);
  }

  
  var etapeIndice=() => {
    etapeActuel='indice';

    indiceDiv.style.display='block';
    propoDiv.style.display='none';
    propoLesCouleurs.style.display='none';

  }
  

  var voteTwitchPseudo={};
  var voteTwitch={};
  var voteOuvert=false;
  var voteMax=0;

  var numJoueur=0;

  return {
    init:(numJoueur2) => {
      numJoueur=numJoueur2;
      if (numJoueur==1) {
        nouvelleEpreuve();        
      }
      epreuveMasterMine.style.display='block';
    },
    out:() => {
      epreuveMasterMine.style.display='none';
    },
    message:(data) => {
      switch(data.msg) {
        case 'mastermineIndice':
          affichierIndince(data.htmlIndice);
        break;
        case 'mastermineEtapeIndinceValider':
          if (numJoueur==1) {
            if (epreuveFini) {
              escapeGame.etapeSuivanteJ1();
              //nouvelleEpreuve();
            } else {
              nouvelleEtape();
            }
          }
        break;
        case 'masterminVerif':
          if (numJoueur==1) {
            mesChoix=data.mesChoix;
            verifReponse();
          }
          
        break;
        case 'mastermineChoixCouleurFait':
          if (etapeActuel=='proposition') {
            if (choixEnCoursId!=null) {
              mesChoix[choixEnCoursId]=data.couleur;
              choixEnCoursElem.className='masterminePropositionChoix c'+data.couleur;
              choixEnCoursElem=null;
              choixEnCoursId=null;
              antiClick.style.display='none';
              // on verifie si on a tout les choix
              var ok=true;
              for (var i=0;i<tirageQte;i++) {
                if (mesChoix[i]==null) {
                  ok=false;
                }
              }
              if (ok==true) {
                mAnim(porpoValider).fadeIn();
              }

            }
          }
        break;
        case 'mastermineChoixPublic':
          if (etapeActuel=='indice') {
            propoTwitch.style.display='block';
            masterminePropositionTwitchValider.style.display='none';
            propoTwitch.style.opacity=0;
            mAnim(propoTwitch).fadeIn();
            // on reset tous les divCouleurTwitch à 3%
            for(var couleur in divCouleurTwitch) {
              divCouleurTwitch[couleur].style.width='3%';
              divCouleurTwitch[couleur].style.height='3%';
            };
            voteMax=0;
            voteTwitchPseudo={};
            voteTwitch={};   
            voteOuvert=true;         
          }
        break;
        case 'mastermineChoixCouleur':
          if (etapeActuel=='indice') {
            mAnim(propoLesCouleurs).fadeIn();
          }          
        break;
        case 'mastermineEtapeIndince':
          etapeIndice();
        break;
        case 'mastermineEtapeProposition':
          tirageQte=data.tirageQte;
          etapeProposition();
        break;          
      }
    },
    twitch:(peudo,message) => {
      if (voteOuvert==true) {
        // pas present dans voteTwitchPseudo
        if (voteTwitchPseudo[peudo]==undefined) {
          // si le message est une couleur
          if (lesCouleurs.indexOf(message)!=-1) {
            masterminePropositionTwitchValider.style.display='block';
            // si la leslesCouleurss n'est pas dans voteTwitch
            if (voteTwitch[message]==undefined) {
              voteTwitch[message]=1;
            } else {
              voteTwitch[message]++;
            }
            if (voteMax<voteTwitch[message]) {
              voteMax=voteTwitch[message];
            }
            voteTwitchPseudo[peudo]=true;
            // on redimensionne les divCouleurTwitch en fonction du vote ( 3% + ((voteMax/vote*30%) )
            for(var couleur in divCouleurTwitch) {
              var vote=0;
              if (voteTwitch[couleur]!=undefined) {
                vote=voteTwitch[couleur];
              }
              var taille=3+((vote/voteMax)*30);
              divCouleurTwitch[couleur].style.width=taille+'%';
              divCouleurTwitch[couleur].style.height=taille+'%';
            }
            
          }
        }
      }
    }
  }
};