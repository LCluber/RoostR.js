
import { SubMesh } from './subMesh';

export class FullscreenQuad {

  vertices    : Array<number>;
  uvs         : Array<number>;
  subMeshes   : Array<SubMesh>;
  itemSize    : number;
  nbSubMeshes : number;
  primitive   : string;

  constructor() {
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

}
