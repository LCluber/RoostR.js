import * as WEE from '../../../bower_components/Weejs/dist/wee';

import { DirectionalLight } from '../lights/directional';
import { PointLight } from '../lights/point';
import { SpotLight } from '../lights/spot';

export type Light = DirectionalLight | PointLight | SpotLight;

export interface IFlatLights{
  position : Array<number>;
  diffuse : Array<number>;
  specular : Array<number>;
  constantAttenuation : Array<number>;
  linearAttenuation : Array<number>;
  quadraticAttenuation : Array<number>;
  cutoff : Array<number>;
  exponent : Array<number>;
  direction : Array<number>;
  type : Array<number>
}

export class Lights {

  directionals : Array<DirectionalLight>;
  points : Array<PointLight>;
  spots : Array<SpotLight>;
  nbDirectionals : number;
  nbPoints : number;
  nbSpots : number;
  flatArrays : IFlatLights;
  types : Array<string>;
  nbTypes : number;

  constructor(){
    this.directionals = [];
    this.points = [];
    this.spots = [];
    this.nbDirectionals = 0;
    this.nbPoints = 0;
    this.nbSpots = 0;
    this.flatArrays = {
      position : [],
      diffuse : [],
      specular : [],
      constantAttenuation : [],
      linearAttenuation : [],
      quadraticAttenuation : [],
      cutoff : [],
      exponent : [],
      direction : [],
      type : []
    };
    this.types = ['spots', 'points', 'directionals'];
    this.nbTypes = 3;
  }

  public addLight(light:Light): void {
    let type = light.type;
    this[type + 's'].push(light);
    this['nb' + WEE.String.ucfirst(type) + 's']++;
  }

  private ClearFlatArrays(): void {
    for (var property in this.flatArrays){
      if (this.flatArrays.hasOwnProperty(property)){
        this.flatArrays[property].length = 0;
      }
    }
  }

  public flatten(): IFlatLights {
    this.ClearFlatArrays();
    for (var i = 0 ; i < this.nbTypes ; i++) {
      var type = this.types[i];
      for (var j = 0 ; j < this['nb' + WEE.String.ucfirst(type)] ; j++) {
        for (var property in this.flatArrays) {
          if (this[type][j].hasOwnProperty(property) && this.flatArrays.hasOwnProperty(property)){
            var lightProperty = this[type][j][property];
            var flatArraysProperty = this.flatArrays[property];
            if(typeof lightProperty.toArray === 'function'){//vector
              flatArraysProperty.push.apply(flatArraysProperty, lightProperty.toArray());
            }else{//floats, integers, strings
              flatArraysProperty.push(lightProperty);
            }
          }
        }
      }
    }
    return this.flatArrays;
  }

  public getFlatArray(property: string) {
    if(this.flatArrays.hasOwnProperty(property)){
      return this.flatArrays[property];
    }
  }

}
