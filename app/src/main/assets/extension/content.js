(function(){
  var SEL=[];
  var CSS="";
  if(!SEL.length&&!false)return;
  function injectStyle(){if(document.getElementById('__apk_block'))return;try{var st=document.createElement('style');st.id='__apk_block';st.textContent=CSS;(document.head||document.documentElement).appendChild(st);}catch(e){}}
  function hideAll(){SEL.forEach(function(s){try{document.querySelectorAll(s).forEach(function(el){if(el&&el.style){el.style.setProperty('display','none','important');el.style.setProperty('visibility','hidden','important');}});}catch(e){}});}
  injectStyle();hideAll();
  new MutationObserver(function(){injectStyle();hideAll();}).observe(document.documentElement,{childList:true,subtree:true,attributes:true});
  setInterval(function(){injectStyle();hideAll();},500);
})();
