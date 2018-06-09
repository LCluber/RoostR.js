
import { SubMesh } from './subMesh';

export class Cube {

  vertices    : Array<number>;
  indices     : Array<number>;
  normals     : Array<number>;
  subMeshes   : Array<SubMesh>;
  itemSize    : number;
  nbSubMeshes : number;
  primitive   : string;

  constructor(size: number) {

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
    this.subMeshes = [
      new SubMesh( 0, 36)
    ];
    this.itemSize = 3;
    this.primitive = 'TRIANGLES';
  }

}
