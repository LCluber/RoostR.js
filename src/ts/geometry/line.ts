import { SubMesh } from './subMesh';

export class Line {

  vertices    : Array<number>;
  thickness   : number;
  subMeshes   : Array<SubMesh>;
  itemSize    : number;
  nbSubMeshes : number;
  primitive   : string;

  constructor(vertices: Array<number>, thickness:number) {
    this.thickness = thickness ? thickness * 0.5 : 1.0;

    this.vertices = vertices;
    this.itemSize = 3;
    this.subMeshes = [
      new SubMesh( 0, vertices.length / this.itemSize)
    ];

    this.primitive = 'LINE_STRIP';
  }

}
