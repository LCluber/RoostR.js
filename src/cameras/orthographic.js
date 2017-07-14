import { Camera } from './camera';

function OrthographicCamera( left, right, top, bottom, near, far) {
  this.left = left;
  this.right = right;
  this.top = top;
  this.bottom = bottom;
  this.near = near;
  this.far = far;

  this.camera = new Camera( TYPE6.Vector3.create(),
                            TYPE6.Vector3.create(),
                            TYPE6.Vector3.create(0.0, 1.0, 0.0)
                          );
  
  this.setProjectionMatrix();
  
}

Object.assign( OrthographicCamera.prototype, {
  
  setProjectionMatrix : function(){
    this.camera.projectionMatrix.orthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
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

export { OrthographicCamera };
