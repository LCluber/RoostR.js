
/**
 * Module dependencies.
 * @api private
 */

import { DirectionalLight } from './directional';

function PointLight(  ) {
  this.directionalLight = new DirectionalLight();
  
  this.constantAttenuation = 0;
  this.linearAttenuation = 1.0;
  this.quadraticAttenuation = 0;
  this.type = 'point';
}

Object.assign( PointLight.prototype, {

  setPosition: function(x,y,z){
    this.directionalLight.setPosition(x,y,z);
  },
  
  setDiffuse: function(x,y,z){
    this.directionalLight.setDiffuse(x,y,z);
  },
  
  setSpecular: function(x,y,z){
    this.directionalLight.setSpecular(x,y,z);
  },
  
  setConstantAttenuation: function(){
    
  },
  
  setLinearAttenuation: function(){
    
  },
  
  setQuadraticAttenuation: function(){
    
  },
  
  getPosition: function(){
    return this.DirectionalLight.getPosition();
  },
  
  getDiffuse: function(){
    return this.DirectionalLight.getDiffuse();
  },
  
  getSpecular: function(){
    return this.DirectionalLight.getSpecular();
  },
  
  getConstantAttenuation: function(){
    return this.constantAttenuation;
  },
  
  getLinearAttenuation: function(){
    return this.linearAttenuation;
  },
  
  getQuadraticAttenuation: function(){
    return this.quadraticAttenuation;
  }

} );

export { PointLight };
