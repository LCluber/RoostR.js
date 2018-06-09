import * as TYPE6 from '../../bower_components/Type6js/dist/type6';

import { Uniform } from './uniform';

export interface IMaterialUniforms{
  materialAmbient : Uniform;
  materialDiffuse : Uniform;
  materialSpecular : Uniform;
  materialShininess : Uniform;
}

export class Material {

  ambient   : TYPE6.Vector3;
  diffuse   : TYPE6.Vector3;
  specular  : TYPE6.Vector3;
  shininess : number;

  uniforms : IMaterialUniforms;

  constructor(){
    this.ambient   = new TYPE6.Vector3(0.5, 0.5, 0.5);
    this.diffuse   = new TYPE6.Vector3(0.6, 0.6, 0.6);
    this.specular  = new TYPE6.Vector3(0.8, 0.8, 0.8);
    this.shininess = 8.0;

    this.uniforms = {
      materialAmbient : new Uniform('uniform3fv', this.ambient.toArray()),
      materialDiffuse : new Uniform('uniform3fv', this.diffuse.toArray()),
      materialSpecular : new Uniform('uniform3fv', this.specular.toArray()),
      materialShininess : new Uniform('uniform1f', this.shininess)
    };

  }

}
