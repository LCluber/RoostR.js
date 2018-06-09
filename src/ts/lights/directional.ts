import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

export type Light = 'directional'|'point'|'spot';

export class DirectionalLight {

  position : TYPE6.Vector3;
  diffuse  : TYPE6.Vector3;
  specular : TYPE6.Vector3;
  type     : Light;

  constructor() {
    this.position = new TYPE6.Vector3();
    this.diffuse  = new TYPE6.Vector3(0.6,0.6,0.6);
    this.specular = new TYPE6.Vector3(0.8,0.8,0.8);
    this.type     = 'directional';
  }
  // struct lightSource
  // {
  //   vec3 position;
  //   vec3 diffuse;
  //   vec3 specular;
  //   float constantAttenuation, linearAttenuation, quadraticAttenuation;
  //   float spotCutoff, spotExponent;
  //   vec3 spotDirection;
  // };
  // lightSource light0 = lightSource(
  //   vec3(0.0, 300.0, 300.0),
  //   vec3(0.6, 0.6, 0.6),
  //   vec3(0.8, 0.8, 0.8),
  //   0.0, 1.0, 0.0,
  //   180.0, 0.0,
  //   vec3(0.0, 0.0, 0.0)
  // );

  public setPosition(x: number,y: number,z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }

  public setDiffuse(x: number,y: number,z: number): void {
    this.diffuse.x = x;
    this.diffuse.y = y;
    this.diffuse.z = z;
  }

  public setSpecular(x: number,y: number,z: number): void {
    this.specular.x = x;
    this.specular.y = y;
    this.specular.z = z;
  }

  // public getPosition(): TYPE6.Vector3 {
  //   return this.position;
  // }
  //
  // public getDiffuse(): TYPE6.Vector3 {
  //   return this.diffuse;
  // }
  //
  // public getSpecular(): TYPE6.Vector3 {
  //   return this.specular;
  // }

}
