
/**
 * Module dependencies.
 * @api private
 */

import { PointLight } from './point';

function SpotLight(  ) {
  
  this.pointLight = new PointLight();
  
  this.cutoff = 180;
  this.exponent = 0;
  this.direction = TYPE6.Vector3.create(1.0,0.0,0.0);
  this.type = 'spot';
}

Object.assign( SpotLight.prototype, {

  setPosition: function(x,y,z){
    this.pointLight.setPosition(x,y,z);
  },
  
  setDiffuse: function(){
    this.pointLight.setDiffuse(x,y,z);
  },
  
  setSpecular: function(){
    this.pointLight.setSpecular(x,y,z);
  },
  
  setConstantAttenuation: function(){
    
  },
  
  setLinearAttenuation: function(){
    
  },
  
  setQuadraticAttenuation: function(){
    
  },
  
  setSpotCutoff: function(){
    
  },
  
  setSpotExponent: function(){
    
  },
  
  setSpotDirection: function(){
    
  },
  
  getPosition: function(){
    return this.PointLight.getPosition();
  },
  
  getDiffuse: function(){
    return this.PointLight.getDiffuse();
  },
  
  getSpecular: function(){
    return this.PointLight.getSpecular();
  },
  
  getConstantAttenuation: function(){
    
  },
  
  getLinearAttenuation: function(){
    
  },
  
  getQuadraticAttenuation: function(){
    
  },
  
  getCutoff: function(){
    return this.spotCutoff;
  },
  
  getExponent: function(){
    return this.spotExponent;
  },
  
  getDirection: function(){
    return this.spotDirection;
  }

} );

export { SpotLight };
