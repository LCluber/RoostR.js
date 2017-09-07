
/**
 * Module dependencies.
 * @api private
 */

import { SceneRenderer }  from '../renderer/scene';
import { SceneGraph } from './sceneGraph';


function Scene(context) {
  this.objects = [];
  this.nbObjects = 0;
  this.context = context;
  this.renderer = new SceneRenderer(this.context);
  this.graph = new SceneGraph();
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
  
  enableBlendMode:function(equation, source, destination){
    this.renderer.enableBlendMode(equation, source, destination);
  },
  
  disableBlendMode:function() {
    this.renderer.disableBlendMode();
  },
  
  getRendererBlendMode:function(){
    this.renderer.getParameter(this.context.BLEND);
  },
  
  render: function (camera, time) {
    
    this.computeWorldMatrices();
    
    //this.order();
    //if (this.getRendererBlendMode()){
      this.disableBlendMode();
    //}
    for (var i = 0 ; i < this.nbObjects ; i++) {
      //if (!this.objects[i].blendMode) {
        this.objects[i].render( camera, time, false );
      //}
    }
    
    this.renderBlended(camera, time);
  },
  
  renderBlended: function (camera, time) {
    this.enableBlendMode('FUNC_ADD', 'SRC_ALPHA', 'ONE');
    for (var i = 0 ; i < this.nbObjects ; i++) {
      //if (this.objects[i].blendMode) {
        this.objects[i].render( camera, time, true );
      //}
    }
  },
  
  computeWorldMatrices: function(){
    for (var i = 0 ; i < this.nbObjects ; i++) {
      this.objects[i].computeWorldMatrix( this.graph );
    }
  },
  
  // order: function (){
  //   var z = -999999;
  //   for (var i = 0 ; i < this.nbObjects ; i++) {
  //     if(this.objects[i].worldMatrix.m[14] > z){
  //       
  //     }
  //   }
  // }
  
  
});

export { Scene };
