

function Camera( position, target, up) {
  
  this.viewMatrix = TYPE6.Matrix4x3.create();
  this.projectionMatrix = TYPE6.Matrix4x4.create();
  
  this.position = position;
  this.target   = target;
  this.up       = up;
  
}

Object.assign( Camera.prototype, {

  setPosition : function(vector3){
    this.position.setX(vector3.getX());
    this.position.setY(vector3.getY());
    this.position.setZ(vector3.getZ());
  },
  
  setTarget : function(vector3){
    this.target.setX(vector3.getX());
    this.target.setY(vector3.getY());
    this.target.setZ(vector3.getZ());
  },
  
  setUp : function(vector3){
    this.up.setX(vector3.getX());
    this.up.setY(vector3.getY());
    this.up.setZ(vector3.getZ());
  },
  
  setViewMatrix : function(){
    this.viewMatrix.lookAtRH(
      this.position,
      this.target,
      this.up
    );
  },
  
  getViewMatrix : function(){
    return this.viewMatrix.toArray();
  },
  
  getProjectionMatrix : function(){
    return this.projectionMatrix.toArray();
  }
  
});

export { Camera };
