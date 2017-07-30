

function Quad( width, height ) {
  width = width ? width * 0.5 : 1.0;
  height = height ? height * 0.5 : 1.0;
  // this.vertices = [  1.0,-1.0, 0.0,
  //                   -1.0,-1.0, 0.0,
  //                    1.0, 1.0, 0.0,
  //                   -1.0, 1.0, 0.0 
  //                 ];
  this.vertices = [  width, -height, 0.0,
                    -width, -height, 0.0,
                     width,  height, 0.0,
                    -width,  height, 0.0 
                  ];
  this.uvs = [ 1.0, 0.0,
               0.0, 0.0,
               1.0, 1.0,
               0.0, 1.0
             ];
  this.itemSize = 3;
  this.numVertices = 4;
  this.primitive = 'TRIANGLE_STRIP';
  
}

Object.assign( Quad.prototype, {
  
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

export { Quad };
