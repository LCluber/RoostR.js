import { Camera } from './camera';

function PerspectiveCamera( fov, zNear, zFar, context ) {
  this.fov = fov;
  this.ratio = 0;
  this.zNear = zNear;
  this.zFar = zFar;
  
  this.context = context;
  
  this.camera = new Camera( TYPE6.Vector3.create(),
                            TYPE6.Vector3.create(),
                            TYPE6.Vector3.create(0.0, 1.0, 0.0)
                          );
  
  this.setProjectionMatrix();
  
}

Object.assign( PerspectiveCamera.prototype, {
  
  setProjectionMatrix : function(){
    var viewport = this.context.getParameter(this.context.VIEWPORT);
    this.ratio = viewport[2] / Math.max(1, viewport[3]);
    this.camera.projectionMatrix.perspective(this.fov, this.ratio, this.zNear, this.zFar);
    this.camera.setViewMatrix();
  },
  
  setPosition : function(vector3){
    this.camera.setPosition(vector3);
    this.camera.setViewMatrix();
  },
  
  setTarget : function(vector3){
    this.camera.setTarget(vector3);
    this.camera.setViewMatrix();
  },
  
  setUp : function(vector3){
    this.camera.setUp(vector3);
    this.camera.setViewMatrix();
  },
  
  getViewMatrix : function(){
    return this.camera.getViewMatrix();
  },
  
  getProjectionMatrix : function(){
    return this.camera.getProjectionMatrix();
  }
  
});

export { PerspectiveCamera };
