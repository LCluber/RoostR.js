
import { SubMesh } from './subMesh';

export class VWing {

  vertices    : Array<number>;
  indices     : Array<number>;
  normals     : Array<number>;
  subMeshes   : Array<SubMesh>;
  itemSize    : number;
  nbSubMeshes : number;
  primitive   : string;

  constructor() {
    this.vertices = [ 0,0,-7.3975,0,-0.2707,0,1.4678,0,0,0,0.5653,1.8374,0,1.4694,0,0,1.553,-1.0874,0,0.7405,-5.3869,2.3189,0.251,0,1.4678,0,0,1.6633,2.6,1.6982,6.65,-0.8596,3.1485,2.3189,0.251,0,1.9333,-0.2938,-1.9828,1.4678,0,0,2.3189,0.251,0,1.4678,0,0,1.4678,0,0,1.6148,-0.4246,-2.7743,1.9333,-0.2938,-1.9828,1.4678,0,0,1.6148,-0.4246,-2.7743,1.6148,-0.4246,-2.7743,1.9333,-0.2938,-1.9828,-1.4678,0,0,-2.3189,0.251,0,-1.6633,2.6,1.6982,-1.4678,0,0,-6.65,-0.8596,3.1485,-1.9333,-0.2938,-1.9828,-2.3189,0.251,0,-1.4678,0,0,-2.3189,0.251,0,-1.4678,0,0,-1.4678,0,0,-1.6148,-0.4246,-2.7743,-1.9333,-0.2938,-1.9828,-1.6148,-0.4246,-2.7743,-1.4678,0,0,-1.6148,-0.4246,-2.7743,-1.9333,-0.2938,-1.9828,0,-0.2707,0,0,0.5653,1.8374,1.4678,0,0,0,-0.2707,0,-1.4678,0,0
                    ];
    this.indices = [ 0,1,2,2,3,4,5,2,4,6,0,2,5,6,2,7,8,9,10,11,12,10,12,13,14,10,15,16,12,17,7,9,18,9,19,20,21,22,9,0,23,1,23,4,3,5,4,23,6,23,0,5,23,6,24,25,26,27,28,29,27,30,28,31,32,27,33,34,28,24,35,25,25,36,37,38,25,39,40,41,42,43,44,41
                    ];
    this.normals = [ 0,-0.1063,-0.9943,0,-0.9819,0.1891,0.9233,-0.2975,0.2427,0,0.0714,0.9974,0,0.9697,0.2443,0,0.9961,-0.088,0,0.9478,-0.3187,0.553,0.7911,0.2613,-0.7402,-0.526,0.4187,-0.0528,0.7418,0.6686,0.7771,-0.1425,0.6131,0.553,0.7911,0.2613,0.8324,-0.4718,-0.2906,-0.7402,-0.526,0.4187,0.553,0.7911,0.2613,-0.7402,-0.526,0.4187,-0.7402,-0.526,0.4187,-0.1135,-0.2998,-0.9472,0.8324,-0.4718,-0.2906,-0.7402,-0.526,0.4187,-0.1135,-0.2998,-0.9472,-0.1135,-0.2998,-0.9472,0.8324,-0.4718,-0.2906,-0.9233,-0.2975,0.2427,-0.553,0.7911,0.2613,0.0528,0.7418,0.6686,0.7402,-0.526,0.4187,-0.7771,-0.1425,0.6131,-0.8324,-0.4718,-0.2906,-0.553,0.7911,0.2613,0.7402,-0.526,0.4187,-0.553,0.7911,0.2613,0.7402,-0.526,0.4187,0.7402,-0.526,0.4187,0.1135,-0.2998,-0.9472,-0.8324,-0.4718,-0.2906,0.1135,-0.2998,-0.9472,0.7402,-0.526,0.4187,0.1135,-0.2998,-0.9472,-0.8324,-0.4718,-0.2906,0,-0.9819,0.1891,0,0.0714,0.9974,0.9233,-0.2975,0.2427,0,-0.9819,0.1891,-0.9233,-0.2975,0.2427
                  ];
    this.subMeshes = [
      new SubMesh( 0, 78),
      new SubMesh(78,  6)
    ];

    this.itemSize = 3;
    this.primitive = 'TRIANGLES';
  }

}