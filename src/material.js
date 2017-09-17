
/**
 * Module dependencies.
 * @api private
 */

//import { RendererTarget } from './DOM/canvas';
import { Uniform }       from './uniform';

function Material(  ) {
  this.ambient = TYPE6.Vector3.create(0.5, 0.5, 0.5);
  this.diffuse = TYPE6.Vector3.create(0.6, 0.6, 0.6);
  this.specular = TYPE6.Vector3.create(0.8, 0.8, 0.8);
  this.shininess = 8.0;
  
  this.uniforms = {};
  
  //this.program = null;
  
  // vec3(0.5, 0.5, 0.5),
  // vec3(0.6, 0.6, 0.6),
  // vec3(0.8, 0.8, 0.8),
  // 8.0
  this.createUniforms();
}

Object.assign( Material.prototype, {

  createUniforms : function(){
    this.uniforms.materialAmbient = new Uniform('uniform3fv', this.ambient.toArray());
    this.uniforms.materialDiffuse = new Uniform('uniform3fv', this.diffuse.toArray());
    this.uniforms.materialSpecular = new Uniform('uniform3fv', this.specular.toArray());
    this.uniforms.materialShininess = new Uniform('uniform1f', this.shininess);
  },

  setAmbient: function(r,g,b){
    this.ambient.setX(r);
    this.ambient.setY(g);
    this.ambient.setZ(b);
  },
  
  setDiffuse: function(r,g,b){
    this.diffuse.setX(r);
    this.diffuse.setY(g);
    this.diffuse.setZ(b);
  },
  
  setSpecular: function(r,g,b){
    this.specular.setX(r);
    this.specular.setY(g);
    this.specular.setZ(b);
  },
  
  setShininess: function(shininess){
    this.shininess = shininess;
  },
  
  getAmbient: function(){
    return this.ambient;
  },
  
  getDiffuse: function(){
    return this.diffuse;
  },
  
  getSpecular: function(){
    return this.specular;
  },
  
  getShininess: function(){
    return this.shininess;
  }

} );

export { Material };
