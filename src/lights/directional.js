
/**
 * Module dependencies.
 * @api private
 */

function DirectionalLight(  ) {
  this.position = TYPE6.Vector3.create();
  this.diffuse  = TYPE6.Vector3.create(0.6,0.6,0.6);
  this.specular = TYPE6.Vector3.create(0.8,0.8,0.8);
  this.type = 'directional';
  // struct lightSource
  // {
  //   vec3 position;
  //   vec3 diffuse;
  //   vec3 specular;
  //   float constantAttenuation, linearAttenuation, quadraticAttenuation;
  //   float spotCutoff, spotExponent;
  //   vec3 spotDirection;
  // };
  // lightSource light0 = lightSource(
  //   vec3(0.0, 300.0, 300.0),
  //   vec3(0.6, 0.6, 0.6),
  //   vec3(0.8, 0.8, 0.8),
  //   0.0, 1.0, 0.0,
  //   180.0, 0.0,
  //   vec3(0.0, 0.0, 0.0)
  // );
  
}

Object.assign( DirectionalLight.prototype, {

  setPosition: function(x,y,z){
    this.position.setX(x);
    this.position.setY(y);
    this.position.setZ(z);
  },
  
  setDiffuse: function(x,y,z){
    this.diffuse.setX(x);
    this.diffuse.setY(y);
    this.diffuse.setZ(z);
  },
  
  setSpecular: function(){
    this.specular.setX(x);
    this.specular.setY(y);
    this.specular.setZ(z);
  },
  
  getPosition: function(){
    return this.position;
  },
  
  getDiffuse: function(){
    return this.diffuse;
  },
  
  getSpecular: function(){
    return this.specular;
  }
  

} );

export { DirectionalLight };
