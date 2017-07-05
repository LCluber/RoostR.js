

//var canvas = require('./canvas');
import { findById } from '../utils';

function RendererTarget( canvasID ) {

  this.canvas = findById(canvasID);
  // default resolution
  this.canvas.width = 1280;
  this.canvas.height = 720;
  this.context = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
  
  this.context.getExtension('OES_standard_derivatives');
  
  this.setFrontFace('CW');
  this.enable('CULL_FACE');
  this.setCullFace('BACK');
  
  this.enable('DEPTH_TEST');
  this.context.depthMask(true);
  //LESS LEQUAL
  this.setDepthTest('LEQUAL');
  // this.context.disable(this.context.DEPTH_TEST);
  // this.context.depthMask(false);
  
  //this.setViewport(1280,720);
  this.setViewport(this.context.drawingBufferWidth, this.context.drawingBufferHeight);
  // console.log(this.context.getParameter(this.context.VIEWPORT));
  this.setClearColor(0.0, 0.0, 0.0, 1.0);
}

Object.assign( RendererTarget.prototype, {

  // Sets the winding orientation. The default value is gl.CCW. Possible values:
  // gl.CW: Clock-wise winding.
  // gl.CCW: Counter-clock-wise winding.
  setFrontFace: function ( mode ) {
    this.context.frontFace(this.context[mode]);
  },
  
  // specifying which WebGL capability to enable. Possible values:
  // gl.BLEND	Activates blending of the computed fragment color values. See WebGLRenderingContext.blendFunc().
  // gl.CULL_FACE	Activates culling of polygons. See WebGLRenderingContext.cullFace().
  // gl.DEPTH_TEST	Activates depth comparisons and updates to the depth buffer. See WebGLRenderingContext.depthFunc().
  // gl.DITHER	Activates dithering of color components before they get written to the color buffer.
  // gl.POLYGON_OFFSET_FILL	Activates adding an offset to depth values of polygon's fragments. See WebGLRenderingContext.polygonOffset().
  // gl.SAMPLE_ALPHA_TO_COVERAGE	Activates the computation of a temporary coverage value determined by the alpha value.
  // gl.SAMPLE_COVERAGE	Activates ANDing the fragment's coverage with the temporary coverage value. See WebGLRenderingContext.sampleCoverage().
  // gl.SCISSOR_TEST	Activates the scissor test that discards fragments that are outside of the scissor rectangle. See WebGLRenderingContext.scissor().
  // gl.STENCIL_TEST	Activates stencil testing and updates to the stencil buffer. See WebGLRenderingContext.stencilFunc().
  enable: function ( capability ) {
    this.context.enable(this.context[capability]);
  },
  
  // specifying whether front- or back-facing polygons are candidates for culling. The default value is gl.BACK. Possible values are:
  // gl.FRONT
  // gl.BACK
  // gl.FRONT_AND_BACK
  setCullFace: function ( mode ) {
    this.context.cullFace(this.context[mode]);
  },


  // GL_ALWAYS	The depth test always passes.
  // GL_NEVER	The depth test never passes.
  // GL_LESS	Passes if the fragment's depth value is less than the stored depth value.
  // GL_EQUAL	Passes if the fragment's depth value is equal to the stored depth value.
  // GL_LEQUAL	Passes if the fragment's depth value is less than or equal to the stored depth value.
  // GL_GREATER	Passes if the fragment's depth value is greater than the stored depth value.
  // GL_NOTEQUAL	Passes if the fragment's depth value is not equal to the stored depth value.
  // GL_GEQUAL	Passes if the fragment's depth value is greater than or equal to the stored depth value.
  setDepthTest: function (mode) {
    this.context.depthFunc(this.context[mode]);
  },

  // specifies the affine transformation of x and y from normalized device coordinates to window coordinates.
  setViewport: function ( width, height ) {
    this.context.viewport(0, 0, width, height); //defaut values
  },
  
  // This specifies what color values to use when calling the clear() method. The values are clamped between 0 and 1.
  setClearColor: function ( red, green, blue, alpha ) {
    this.context.clearColor( red, green, blue, alpha );
  },
  
  clearFrame: function (){
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
  },
  
  getContext: function () {
    return this.context;
	}
  
  

} );

export { RendererTarget };
