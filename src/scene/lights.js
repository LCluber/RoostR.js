
/**
 * Module dependencies.
 * @api private
 */

import { ucfirst } from '../utils';

function Lights() {
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

Object.assign( Lights.prototype, {

  addLight : function(light){
    var type = light.type;
    this[type + 's'].push(light);
    this['nb' + ucfirst(type) + 's']++;
  },
  
  ClearFlatArrays:function(){
    for (var property in this.flatArrays){
      if (this.flatArrays.hasOwnProperty(property)){
        this.flatArrays[property].length = 0;
      }
    }
  },
  
  flatten : function(){
    this.ClearFlatArrays();
    for (var i = 0 ; i < this.nbTypes ; i++) {
      var type = this.types[i];
      for (var j = 0 ; j < this['nb' + ucfirst(type)] ; j++) {
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
  },
  
  getFlatArray : function(property){
    if(this.flatArrays.hasOwnProperty(property)){
      return this.flatArrays[property];
    }
  }

} );

export { Lights };
