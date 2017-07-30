
function Cube( size ) {
  size = size ? size * 0.5 : 1.0;
  
  this.vertices = [  size,-size,-size,
                    -size,-size, size,
                     size,-size, size,
                    -size, size, size,
                     size, size,-size,
                     size, size, size,
                    -size,-size,-size,
                    -size, size,-size
                  ];
  this.indices = [  0,1,2, 3,4,5,
                    5,0,2, 4,6,0,
                    6,3,1, 2,3,5,
                    0,6,1, 3,7,4,
                    5,4,0, 4,7,6,
                    6,7,3, 2,1,3
                  ];
  this.normals = [ 0.5773,-0.5773,-0.5773,
                  -0.5773,-0.5773, 0.5773, 
                   0.5773,-0.5773, 0.5773,
                  -0.5773, 0.5773, 0.5773,
                   0.5773, 0.5773,-0.5773,
                   0.5773, 0.5773, 0.5773,
                  -0.5773,-0.5773,-0.5773,
                  -0.5773, 0.5773,-0.5773
                ];
  this.itemSize = 3;
  this.numIndices = 36;
  this.primitive = 'TRIANGLES';

}

Object.assign( Cube.prototype, {

  // setTexture: function(texture){
  //   this.mesh.setTexture(texture);
  // },
  
  

} );

export { Cube };
