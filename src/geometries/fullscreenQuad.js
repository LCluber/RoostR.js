import { SubMesh } from './subMesh';

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
  this.subMeshes = [
    new SubMesh( 0, 4)
  ];
  this.itemSize = 2;
  this.primitive = 'TRIANGLE_STRIP';
  
}

// Object.assign( FullscreenQuad.prototype, {
// 
// } );

export { FullscreenQuad };
