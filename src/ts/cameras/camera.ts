import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

export class Camera {

  viewMatrix : TYPE6.Matrix4x3;
  projectionMatrix : TYPE6.Matrix4x4;

  position : TYPE6.Vector3;
  target   : TYPE6.Vector3;
  up       : TYPE6.Vector3;

  constructor(position: TYPE6.Vector3, target: TYPE6.Vector3, up: TYPE6.Vector3) {

    this.viewMatrix = new TYPE6.Matrix4x3();
    this.projectionMatrix = new TYPE6.Matrix4x4();

    this.position = position;
    this.target   = target;
    this.up       = up;

  }

  public setViewMatrix(): void {
    this.viewMatrix.lookAtRH(
      this.position,
      this.target,
      this.up
    );
  }

  public setPosition(x:number,y:number,z:number): void {
    this.position.set(x,y,z);
    this.setViewMatrix();
  }

  public setTarget(x:number,y:number,z:number): void {
    this.target.set(x,y,z);
    this.setViewMatrix();
  }

  public setUp(x:number,y:number,z:number): void {
    this.up.set(x,y,z);
    this.setViewMatrix();
  }

  public getViewMatrix(): Float32Array {
    return this.viewMatrix.toArray();
  }

  public getProjectionMatrix(): Float32Array {
    return this.projectionMatrix.toArray();
  }

}
