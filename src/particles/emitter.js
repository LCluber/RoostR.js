
import { Particle } from './particle';

function ParticleEmitter( width, height, quantity, context ) {

  this.pool = [];
  this.poolLength = 0;
  //this.position = 

  this.mesh = new ROOSTR.Mesh( new ROOSTR.MultiQuad(width, height,quantity), context );
  
  this.flatArrays = {
    position : [],
    velocity : [],
    lifeTime : [],
    frameStart : [],
    startTime : [],
    startSize : [],
    endSize : [],
  };
  
  numParticles: 40,
  lifeTime: 2,
  timeRange: 2,
  startSize: 50,
  endSize: 90,
  positionRange: [10, 10, 10],
  // velocity:[0, 0, 60],
  // velocityRange: [15, 15, 15],
  // acceleration: [0, 0, -20],
  spinSpeedRange: 4}

}

Object.assign( ParticleEmitter.prototype, {

  createParticles : function(poolLength){
    for (var i = 0 ; i < poolLength ; i++){
      var radius = TYPE6.Random.float( 0, 140 ); //120
      var angle  = TYPE6.Random.float( 0, TYPE6.Trigonometry.TWOPI );
      this.pool.push(new Particle());
      this.pool[i].setVelocity( TYPE6.Trigonometry.cosineEquation( radius, angle, 0, 0 ),
                                TYPE6.Trigonometry.sineEquation( radius, angle, 0, 0 ),
                                0.0
                              );
      
    }
    this.poolLength = poolLength;
  },
  
  clearFlatArrays:function(){
    for (var property in this.flatArrays){
      if (this.flatArrays.hasOwnProperty(property)){
        this.flatArrays[property].length = 0;
      }
    }
  },
  
  flatten : function(){
    this.ClearFlatArrays();
    //for (var i = 0 ; i < this.nbTypes ; i++) {
      //var type = this.types[i];
      for (var j = 0 ; j < this.poolLength ; j++) {
        for (var property in this.flatArrays) {
          var particle = this.pool[j];
          if (particle.hasOwnProperty(property) && this.flatArrays.hasOwnProperty(property)){
            var particleProperty = particle[property];
            var flatArraysProperty = this.flatArrays[property];
            if(typeof lightProperty.toArray === 'function'){//vector
              flatArraysProperty.push.apply(flatArraysProperty, particleProperty.toArray());
            }else{//floats, integers, strings
              flatArraysProperty.push(particleProperty);
            }
          }
        }
      }
    //}
  },
  
  getFlatArray : function(property){
    if(this.flatArrays.hasOwnProperty(property)){
      return this.flatArrays[property];
    }
  }

} );

export { ParticleEmitter };
