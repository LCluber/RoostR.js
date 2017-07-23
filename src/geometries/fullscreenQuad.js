

function FullscreenQuad( ) {

  this.vertices = [  1.0,-1.0,
                    -1.0,-1.0,
                     1.0, 1.0,
                    -1.0, 1.0 
                  ];
  this.uvs = [ 1.0, 0.0,
               0.0, 0.0,
               1.0, 1.0,
               0.0, 1.0
             ];
  this.itemSize = 2;
  this.numVertices = 4;
  
}

Object.assign( FullscreenQuad.prototype, {

} );

export { FullscreenQuad };
