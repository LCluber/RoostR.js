import { BasicMesh } from './basic';
import { SubMesh } from './subMesh';

export class Quad extends BasicMesh {

  vertices    : number[];
  uvs         : number[];
  subMeshes   : SubMesh[];
  itemSize    : number;
  // nbSubMeshes : number;
  primitive   : string;

  constructor(width: number, height: number) {
    super();
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
    this.subMeshes = [
      new SubMesh( 0, 4)
    ];
    this.itemSize = 3;
    this.primitive = 'TRIANGLE_STRIP';
  }

}
