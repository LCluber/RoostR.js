
import { SubMesh } from './subMesh';

export interface IQuad {
  vertices : Float32Array;
  indices : Int32Array;
  uvs : Float32Array;
}

export class MultiQuad {

  vertices    : Array<number>;
  indices     : Array<number>;
  uvs     : Array<number>;
  subMeshes   : Array<SubMesh>;
  itemSize    : number;
  nbSubMeshes : number;
  primitive   : string;

  quad        : IQuad;

  constructor(width: number, height: number, quantity: number) {
    width = width ? width * 0.5 : 1.0;
    height = height ? height * 0.5 : 1.0;

    this.quad = {
      vertices : new Float32Array([  width, -height, 0.0,
                                    -width,  height, 0.0,
                                    -width, -height, 0.0,
                                     width,  height, 0.0
                                  ]),
      indices : new Float32Array([ 0,1,2,
                                   0,3,1
                                 ]),
      uvs : new Float32Array([ 1.0, 0.0,
                               0.0, 1.0,
                               0.0, 0.0,
                               1.0, 1.0
                            ])
    };

    this.vertices = [];
    this.indices = [];
    this.uvs = [];

    this.subMeshes = [
      new SubMesh( 0, 4)
    ];
    this.itemSize = 3;
    this.primitive = 'TRIANGLE';
  }

  private createQuads(length: number): void {
    for (var i = 0 ; i < length ; i++) {
      this.vertices.push.apply(this.vertices, this.quad.vertices);
      this.indices.push.apply(this.indices, this.createIndices(i));
      this.uvs.push.apply(this.uvs, this.quad.uvs);
    }

  }

  private createIndices(quadIndex: number): Array<number> {
    var indices = [];
    for(var i = 0 ; i < 6 ; i++) {
      indices.push(this.quad.indices[i] + quadIndex * 4);
    }
    return indices;
  }

}
