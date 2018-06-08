import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

import { PointLight } from './point';

export class SpotLight extends PointLight {

  cutoff : number;
  exponent : number;
  direction : TYPE6.Vector3;

  constructor() {
    super();

    this.cutoff = 180;
    this.exponent = 0;
    this.direction = new TYPE6.Vector3(1.0,0.0,0.0);
    this.type = 'spot';
  }

  // public setPosition(x,y,z){
  //   this.pointLight.setPosition(x,y,z);
  // }
  //
  // public setDiffuse(){
  //   this.pointLight.setDiffuse(x,y,z);
  // }
  //
  // public setSpecular(){
  //   this.pointLight.setSpecular(x,y,z);
  // }
  //
  // public setConstantAttenuation(){
  //
  // }
  //
  // public setLinearAttenuation(){
  //
  // }
  //
  // public setQuadraticAttenuation(){
  //
  // }

  public setCutoff(): void {

  }

  public setExponent(): void {

  }

  public setDirection(): void {

  }

  // public getPosition(){
  //   return this.PointLight.getPosition();
  // }

  // public getDiffuse(){
  //   return this.PointLight.getDiffuse();
  // }
  //
  // public getSpecular(){
  //   return this.PointLight.getSpecular();
  // }
  //
  // public getConstantAttenuation(){
  //
  // }
  //
  // public getLinearAttenuation(){
  //
  // }
  //
  // public getQuadraticAttenuation(){
  //
  // }

  public getCutoff(): number {
    return this.cutoff;
  }

  public getExponent(): number {
    return this.exponent;
  }

  public getDirection(): TYPE6.Vector3 {
    return this.direction;
  }

}
