
/**
 * Module dependencies.
 * @api private
 */


import { RendererTarget } from './renderers/target';

//import { Texture } from './texture';

function Scene( canvasID ) {
  this.rendererTarget = new RendererTarget( canvasID );
  this.context = this.rendererTarget.getContext();
  this.objects = [];
  this.nbObjects = 0;
}

Object.assign( Scene.prototype, {
  
  add: function ( object ) {
    this.objects.push(object);
    this.nbObjects++;
  },
  
  clear: function () {
    this.objects = [];
    this.nbObjects = 0;
  },
  
  render: function (camera, time) {
    for (var i = 0 ; i < this.nbObjects ; i++) {
      this.objects[i].render( camera, time );
    }
  },
  
  clearFrame: function (){
    this.rendererTarget.clearFrame();
  },
  
  getContext: function(){
    return this.rendererTarget.getContext();
  }
  
});

export { Scene };
