import {Vector3,Matrix4x3,Matrix4x4} from 'type6js';

export class Camera {

  viewMatrix : Matrix4x3;
  projectionMatrix : Matrix4x4;

  position : Vector3;
  target   : Vector3;
  up       : Vector3;

  constructor(position: Vector3, target: Vector3, up: Vector3) {

    this.viewMatrix = new Matrix4x3();
    this.projectionMatrix = new Matrix4x4();

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
