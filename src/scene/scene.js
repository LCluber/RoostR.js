
/**
 * Module dependencies.
 * @api private
 */

import { SceneRenderer }  from '../renderer/scene';
import { SceneGraph } from './sceneGraph';
import { Lights } from './lights';


function Scene(context) {
  this.meshes = [];
  this.nbMeshes = 0;
  
  this.lights = new Lights();
  
  this.context = context;
  this.renderer = new SceneRenderer(this.context);
  this.graph = new SceneGraph();
}

Object.assign( Scene.prototype, {
  
  addMesh: function ( mesh ) {
    this.meshes.push(mesh);
    this.nbMeshes++;
  },
  
  addLight: function ( light ) {
    this.lights.addLight(light);
    //this.lights.push(light);
    //this.nbLights++;
  },
  
  getLightsProperty : function(property){
    return this.lights.getFlatArray(property);
  },
  
  // clear: function () {
  //   this.meshes = [];
  //   this.nbMeshes = 0;
  // },
  
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
    this.lights.flatten();
    //this.order();
    //if (this.getRendererBlendMode()){
      this.disableBlendMode();
    //}
    for (var i = 0 ; i < this.nbMeshes ; i++) {
      //if (!this.meshes[i].blendMode) {
        this.meshes[i].render( camera, this.lights.getFlatArray(), time, false );
      //}
    }
    
    this.renderBlended(camera, time);
  },
  
  renderBlended: function (camera, time) {
    this.enableBlendMode('FUNC_ADD', 'SRC_ALPHA', 'ONE');
    for (var i = 0 ; i < this.nbMeshes ; i++) {
      //if (this.meshes[i].blendMode) {
        this.meshes[i].render( camera, this.lights.getFlatArray(), time, true );
      //}
    }
  },
  
  computeWorldMatrices: function(){
    for (var i = 0 ; i < this.nbMeshes ; i++) {
      this.meshes[i].computeWorldMatrix( this.graph );
    }
  }
  
  // order: function (){
  //   var z = -999999;
  //   for (var i = 0 ; i < this.nbMeshes ; i++) {
  //     if(this.meshes[i].worldMatrix.m[14] > z){
  //       
  //     }
  //   }
  // }
  
  
});

export { Scene };
