
function findById( id ) {
  return document.getElementById(id);
}

function showById(a){
  findById(a).style.display='block';
}

function hideById(a){
  findById(a).style.display='none';
}

function showOverflow(){
  document.body.style.overflow = 'visible';
}

function hideOverflow(){
  document.body.style.overflow = 'hidden';
}

export { findById, showById, hideById, showOverflow, hideOverflow };
