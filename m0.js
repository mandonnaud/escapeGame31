
var m0={
  all:(selector,content=document) =>{
    return content.querySelectorAll(selector);
  },
  id:(selector,content=document) =>{
    return content.getElementById(selector);
  },
  style:(element,style) => {
    for(var indexS in style) {
      element.style[indexS]=style[indexS];
    }
  },
  hide:(element) => {
    element.style.display='none';
  },
  show:(element,display='block') => {
    element.style.display=display;
  },
  create:(tag,attributs={}) => {
    var elem=document.createElement(tag);
    for(var nomA in attributs) {
      switch (nomA) {
        case 'class':
          elem.className=attributs[nomA];
        break;
        case 'style':
          m0.style(elem,attributs[nomA]);
        break;
        case 'dataset':
          for(var nomD in attributs[nomA]) {
            elem.dataset[nomD]=attributs[nomA][nomD];
          }      
        break;
        default:
          elem[nomA]=attributs[nomA];
        break;
      }
    }
    return elem; 
  },
  event:(element,eventName,func,option={passive:true}) => {
    element.addEventListener(eventName,func,option);
  },
  init:(func) => {
    m0.event(window,'DOMContentLoaded',func);
  }
};