

function Camera( fov, zNear, zFar, context) {
  this.fov = fov;
  this.ratio = 0;
  this.zNear = zNear;
  this.zFar = zFar;
  
  this.context = context;
  
  this.viewMatrix = TYPE6.Matrix4x3.create();
  this.projectionMatrix = TYPE6.Matrix4x4.create();
  
  // this.viewMatrix.identity();
  // this.projectionMatrix.identity();
  
  this.position = TYPE6.Vector3.create(0.0, 0.0, 0.0);
  this.target   = TYPE6.Vector3.create(0.0, 0.0, 0.0);
  this.up       = TYPE6.Vector3.create(0.0, 1.0, 0.0);
  
  this.setProjectionMatrix();
  
}

Object.assign( Camera.prototype, {
  
  setProjectionMatrix : function(){
    var viewport = this.context.getParameter(this.context.VIEWPORT);
    this.ratio = viewport[2] / Math.max(1, viewport[3]);
    this.projectionMatrix.perspective(this.fov, this.ratio, this.zNear, this.zFar);
  },
  
  setPosition : function(vector3){
    this.position.setX(vector3.getX());
    this.position.setY(vector3.getY());
    this.position.setZ(vector3.getZ());
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
