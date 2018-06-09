import * as TYPE6 from '../../../bower_components/Type6js/dist/type6';

export class SceneGraph {

  model: Array<TYPE6.Matrix4x3>;
  nbModel : number;
  modelStackTop : number;

  constructor(context:WebGLRenderingContext){
    this.model = [ new TYPE6.Matrix4x3() ]; //model matrices
    this.model[0].identity();
    this.nbModel = this.model.length;
    this.modelStackTop = 0;
  }

  public pushModelMatrix(modelMatrix:TYPE6.Matrix4x3): void {
    this.modelStackTop++;
    if (this.modelStackTop === this.nbModel) {
      this.model.push(new TYPE6.Matrix4x3());
      this.nbModel++;
    }
    this.model[this.modelStackTop].copy(modelMatrix);
  }

  public popModelMatrix(): void{
    this.modelStackTop--;
  }

  public getWorldMatrix(): TYPE6.Matrix4x3 {
    return this.model[this.modelStackTop];
  }

}
