import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';
import { Camera } from './camera';

export class OrthographicCamera extends Camera {

  left : number;
  right : number;
  top : number;
  bottom : number;
  near : number;
  far : number;
  //camera : Camera;

  constructor(left: number, right: number, top: number, bottom: number, near: number, far: number) {

    super(  new TYPE6.Vector3(),
            new TYPE6.Vector3(),
            new TYPE6.Vector3(0.0, 1.0, 0.0)
          );

    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;

    this.setProjectionMatrix();
    super.setViewMatrix();
  }

  public setProjectionMatrix(): void {
    this.projectionMatrix.orthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
  }

}
