

function Line( vertices, thickness ) {
  this.thickness = thickness ? thickness * 0.5 : 1.0;

  this.vertices = vertices;
  
  this.itemSize = 3;
  this.numVertices = vertices.length / this.itemSize;
  this.primitive = 'LINE_STRIP';
  
}

Object.assign( Line.prototype, {
  
  // setSize : function(width,height){
  //   width  *= 0.5;
  //   height *= 0.5;
  //   this.vertices = [  width,-height, 0.0,
  //                     -width,-height, 0.0,
  //                      width, height, 0.0,
  //                     -width, height, 0.0 
  //                   ];
  // }

} );

export { Line };
