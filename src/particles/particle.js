

function Particle( /*width, height*/ ) {

  // 'attribute vec4 uvLifeTimeFrameStart; // uv, lifeTime, frameStart\n' +
  // 'attribute vec4 positionStartTime;    // position.xyz, startTime\n' +
  // 'attribute vec4 velocityStartSize;    // velocity.xyz, startSize\n' +
  // 'attribute vec4 accelerationEndSize;  // acceleration.xyz, endSize\n' +
  // 'attribute vec4 spinStartSpinSpeed;   // spinStart.x, spinSpeed.y\n' +
  // 'attribute vec4 colorMult;            // multiplies color and ramp textures\n' +

  this.position = TYPE6.Vector3.create();
  this.velocity = TYPE6.Vector3.create();
  this.lifeTime = 0;
  this.frameStart = 0;
  this.startTime = 0;
  this.startSize = 0;
  this.endSize = 0;

}

Object.assign( Particle.prototype, {

  setPosition : function(x,y,z){
    this.position.setX(x);
    this.position.setY(y);
    this.position.setZ(z);
  },
  
  setVelocity : function(x,y,z){
    this.velocity.setX(x);
    this.velocity.setY(y);
    this.velocity.setZ(z);
  }


} );

export { Particle };
