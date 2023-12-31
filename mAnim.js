var mAnim=(elem) => {
  var core={}; // Toutes les fonctions
  var _html=[]; // Tableau des éléments à animer
  var dure; // dure en milliseconde par défaut 1000 ( .dure(XXX) pour changer )
  var type; // type d'animation par défaut '' ( .type('XXX') pour changer )
  var curs=0; // eta de l'animation
  var fin; // nombre d'etape n'animation
  var TAUX=40; // millisconde entre deux annimation
  var style={}; // liste des style à animer
  var filterEffect=['blur','brightness','contrast','grayscale','hue-rotate','saturate','sepia']; // Liste des style de filter
  var transformEffect=['rotate','rotateX','rotateY','rotateZ','scale','scaleX','scaleY','scaleZ','skew','skewX','skewY','translate','translateX','translateY','translateZ']; // Liste des style de transform
  var eventComplet; // Event complet
  // Calcul de l'animation
  var calcul=(x, type) => {
    switch (type) {
      case 'linear':
          return x;
      default: return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
  };
  // Id du setInterval
  var idInterval;
  // Fonction d'animation
  var animation=() => {
    // On incrémente l'etape
    curs++;  
    // on stock les style de transform et filter
    var transform='';
    var filter='';
    for(var nomStyle in style) {
      
      var syleC=style[nomStyle];
      if (syleC[2]==undefined) syleC[2]='px';
      // On calcul la nouvelle valeur
      var nouveau=(syleC[0] + ((syleC[1] - syleC[0]) * calcul(curs/fin,type)));
      // On cherche si filter ou transform
      var fait=false;
      if (filterEffect.indexOf(nomStyle)!=-1) {
        filter+=nomStyle+'('+nouveau+syleC[2]+') ';
        fait=true;        
      }
      if (transformEffect.indexOf(nomStyle)!=-1) {
        transform+=nomStyle+'('+nouveau+syleC[2]+') ';
        fait=true;
      }
      // Si ce n'est pas filter ou transform on applique le style
      if (!fait) {       
        _html.forEach((elem) => {
          //console.log(_html);
          elem.style[nomStyle] = nouveau + syleC[2];
        });
      }
    };
    // On applique les style de transform et filter
    if (transform!='' || filter!='') {
      _html.forEach((elem) => {
        if (transform!='') {
          elem.style.transform=transform;
        }
        if (filter!='') {
          elem.style.filter=filter;
        }
      });
    }
    
    if (curs >= fin) {
      window.clearInterval(idInterval);
      if (eventComplet!=null) {
        eventComplet();
        core.fini==true;
      }
    }
  };
  
  core.complet=(fc) => {
    eventComplet=fc;
    return core;
  };
  var debugStatus=false;
  core.debug=() => {
    debugStatus=true;
    return core;
  };
  core.completRemove=() => {
    eventComplet=() => {
      _html.forEach((elem) => {
        elem.remove();
      });
    };
    return core;
  };
  core.completHide=() => {
    eventComplet=() => {
      _html.forEach((elem) => {
        elem.style.display='none';
      });
    };
    return core;
  };
  core.dure=(d) => {
    dure=d;
    return core;
  };
  core.type=(t) => {
    type=t;
    return core;
  };
  var delayT=0;
  core.delay=(d) => {
    delayT=d;
    return core;
  };
  var vraiPlay=() => {
    idInterval = window.setInterval(animation,TAUX);
  };
  var timeOut;
  core.play=() => {
    if (dure==null) dure=1000;
    if (type==null) type='';
    fin=Math.floor(dure/TAUX);
    if (delayT==0) vraiPlay();
    else {
      timeOut=setTimeout(vraiPlay,delayT);
    }
    if (debugStatus) {
      console.log(_html);
      console.log('dure : '+dure);
      console.log('type : '+type);
      console.log('fin : '+fin);
      console.log(style);
    }
    return core;
  };
  core.fini=false;
  core.stop=()=> {
    if (timeOut) window.clearTimeout(timeOut);
    if (idInterval) window.clearInterval(idInterval);
    return core;
  };
  core.style=(obj)=> {
    for(nomStyle in obj) {
      style[nomStyle]=obj[nomStyle];
    }
    return core;
  };
  core.fadeIn=(avecCheck=true) => {
    // si style.opacity n'est pas défini
    if (style.opacity==undefined) style.opacity=[0,1,''];
    // si duration n'est pas défini
    if (dure==null) dure=900;
    // si type n'est pas défini    
    if (type==null) type='linear';
    // si avecCheck est true
    if (avecCheck!=false) {
      if (avecCheck==true) avecCheck='block';
      var _html2=[];
      _html.forEach((elem) => {
        var vraiStyle=window.getComputedStyle(elem);
        // Si l'element est invisible, on le rend visible
        if (vraiStyle.display=='none') {
          elem.style.display=avecCheck;
          elem.style.opacity=0;
          _html2.push(elem);
        } else if (vraiStyle.opacity==0) {
          _html2.push(elem);
        }
      });
      if (_html2.length==0) {
        return core;
      } 
      _html=_html2;  

    }
    core.play();
    return core;
  };

  core.fadeOut=(avecCheck=true) => {
    // si style.opacity n'est pas défini
    if (style.opacity==undefined) style.opacity=[1,0,''];
    // si duration n'est pas défini
    if (dure==null) dure=300;
    // si type n'est pas défini    
    if (type==null) type='linear';
    if (avecCheck!=false) {
      var _html2=[];
      _html.forEach((elem) => {
        var vraiStyle=window.getComputedStyle(elem);
        if (vraiStyle.display!='none') {
          if (vraiStyle.opacity!=0) {
            _html2.push(elem);
          }
        }
      });
      if (_html2.length==0) {
        return core;
      }
      _html=_html2;
    }
    core.play();
    return core;
  };

  core.slideDown=(avecCheck=true) => {
    var listeCore=[];
    if (dure==null) dure=600;
    if (avecCheck==true) avecCheck='block';
    _html.forEach((elem) => {
      
      var onLeFait=true;
      var leStyle=elem.style;
      leStyle.opacity=0;
      var vraiStyle=window.getComputedStyle(elem);
      if (avecCheck!=false) {
        if (vraiStyle.display=='none') {
          leStyle.display=avecCheck;
        } else {
          onLeFait=false;
        }
      }
      if (onLeFait) {
        leStyle.height = 'auto';
        leStyle.minHeight='';
        var heightViser=elem.offsetHeight;
        leStyle.minHeight='0px';
        leStyle.overflow = 'hidden';
        leStyle.height = '0px';
        style.height=[0,heightViser,'px'];
        // On recuper le paddingTop et paddingBottom
        var paddingTop=parseInt(vraiStyle.paddingTop);
        var paddingBottom=parseInt(vraiStyle.paddingBottom);
        style.paddingTop=[0,paddingTop,'px'];
        style.paddingBottom=[0,paddingBottom,'px'];
        leStyle.paddingTop='0px';
        leStyle.paddingBottom='0px';
        if (_html.length==1) {
          leStyle.opacity=1;
          core.play();
        } else {
          listeCore.push(clone(elem));
        }
        
      }     
      leStyle.opacity=1; 
    });
    if (_html.length==1) {
      return core;
    } else {
      return listeCore;
    }
  };

  core.slideUp=(avecCheck=true) => {
    var listeCore=[];
    // si duration n'est pas défini
    if (dure==null) dure=600;
    _html.forEach((elem) => {
      var onLeFait=true;
      var leStyle=elem.style;
      var vraiStyle=window.getComputedStyle(elem);
      if (avecCheck!=false) {
        if (vraiStyle.display=='none') {
          onLeFait=false;
        }
      }
      if (onLeFait) {
        leStyle.height = 'auto';
        var heightViser=elem.offsetHeight;
        leStyle.height = heightViser+'px';
        leStyle.overflow = 'hidden';
        style.height=[heightViser,0,'px'];
        leStyle.minHeight='0px';
        // On recuper le paddingTop et paddingBottom
        var paddingTop=parseInt(vraiStyle.paddingTop);
        var paddingBottom=parseInt(vraiStyle.paddingBottom);
        style.paddingTop=[paddingTop,0,'px'];
        style.paddingBottom=[paddingBottom,0,'px'];
        var completAvant=eventComplet;
        eventComplet=() => {
          leStyle.display='none';
          leStyle.paddingTop='';
          leStyle.paddingBottom='';
          if (completAvant!=null) completAvant();
        };
        if (_html.length==1) {
          core.play();
        } else {
          listeCore.push(clone(elem));
        }        
      }      

    });
    if (_html.length==1) {
      return core;
    } else {
      return listeCore;
    }
  };


  function clone(elem) {
    var mAnimClone=mAnim(elem);
    mAnimClone.style(style);
    mAnimClone.dure(dure);
    if (type!=null) mAnimClone.type(type);
    if (eventComplet!=null) mAnimClone.complet(eventComplet);
    mAnimClone.play();
  }
  // si c'est un element
  if (typeof(elem)=='object' && elem.nodeType==1) {
    _html=[elem];
  // si c'est un tableau d'elements
  } else if (typeof(elem)=='object' && elem.length!=undefined) {
    _html=elem;
  } 
  // sinon
  else {
    //console.error('Erreur : mAnim() doit recevoir un objet DOM ou un tableau d\'objets DOM '+typeof(elem));
    //console.error(elem);
    return core;
  }

  return core;
};
mAnim.getOpacity=(elem) => {
  return (elem.style.opacity=='')?0:parseFloat(elem.style.opacity);
}