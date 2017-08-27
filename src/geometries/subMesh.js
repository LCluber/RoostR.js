

function SubMesh( start, count ) {
  
  this.start = start;
  this.count = count;

}

Object.assign( SubMesh.prototype, {

  getStart : function(){
    return this.start;
  },
  
  getCount : function(){
    return this.count;
  }

} );

export { SubMesh };
