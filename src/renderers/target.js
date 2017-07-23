

//var canvas = require('./canvas');
import { findById } from '../utils';

function RendererTarget( canvasID ) {

  this.canvas = findById(canvasID);
  // default resolution
  this.canvas.width = 1280;
  this.canvas.height = 720;
  this.context = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl",{alpha:false});
  
  this.context.getExtension('OES_standard_derivatives');
  
  this.setFrontFace('CW');
  this.enable('CULL_FACE');
  this.setCullFace('BACK');
  
  this.setDepthFunc('LEQUAL');
  this.enableDepthTest();
  
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
  // GL_BLEND	Activates blending of the computed fragment color values. See WebGLRenderingContext.blendFunc().
  // GL_CULL_FACE	Activates culling of polygons. See WebGLRenderingContext.cullFace().
  // GL_DEPTH_TEST	Activates depth comparisons and updates to the depth buffer. See WebGLRenderingContext.depthFunc().
  // GL_DITHER	Activates dithering of color components before they get written to the color buffer.
  // GL_POLYGON_OFFSET_FILL	Activates adding an offset to depth values of polygon's fragments. See WebGLRenderingContext.polygonOffset().
  // GL_SAMPLE_ALPHA_TO_COVERAGE	Activates the computation of a temporary coverage value determined by the alpha value.
  // GL_SAMPLE_COVERAGE	Activates ANDing the fragment's coverage with the temporary coverage value. See WebGLRenderingContext.sampleCoverage().
  // GL_SCISSOR_TEST	Activates the scissor test that discards fragments that are outside of the scissor rectangle. See WebGLRenderingContext.scissor().
  // GL_STENCIL_TEST	Activates stencil testing and updates to the stencil buffer. See WebGLRenderingContext.stencilFunc().
  // Examples
  // Transparency is best implemented using blend function (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA) with primitives sorted from farthest to nearest. Note that this transparency calculation does not require the presence of alpha bitplanes in the frame buffer.
  // Blend function (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA) is also useful for rendering antialiased points and lines in arbitrary order.
  enable: function ( capability ) {
    this.context.enable(this.context[capability]);
  },
  
  disable: function ( capability ) {
    this.context.disable(this.context[capability]);
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
  setDepthFunc: function (mode) {
    this.context.depthFunc(this.context[mode]);
  },

  // gl.ZERO	0,0,0,0	Multiplies all colors by 0.
  // gl.ONE	1,1,1,1	Multiplies all colors by 1.
  // gl.SRC_COLOR	RS, GS, BS, AS	Multiplies all colors by the source colors.
  // gl.ONE_MINUS_SRC_COLOR	1-RS, 1-GS, 1-BS, 1-AS	Multiplies all colors by 1 minus each source color.
  // gl.DST_COLOR	RD, GD, BD, AD	Multiplies all colors by the destination color.
  // gl.ONE_MINUS_DST_COLOR	1-RD, 1-GD, 1-BD, 1-AD	Multiplies all colors by 1 minus each destination color.
  // gl.SRC_ALPHA	AS, AS, AS, AS	Multiplies all colors by the source alpha value.
  // gl.ONE_MINUS_SRC_ALPHA	1-AS, 1-AS, 1-AS, 1-AS	Multiplies all colors by 1 minus the source alpha value.
  // gl.DST_ALPHA	AD, AD, AD, AD	Multiplies all colors by the destination alpha value.
  // gl.ONE_MINUS_DST_ALPHA	1-AD, 1-AD, 1-AD, 1-AD	Multiplies all colors by 1 minus the destination alpha value.
  // gl.CONSTANT_COLOR	RC, GC, BC, AC	Multiplies all colors by a constant color.
  // gl.ONE_MINUS_CONSTANT_COLOR	1-RC, 1-GC, 1-BC, 1-AC	Multiplies all colors by 1 minus a constant color.
  // gl.CONSTANT_ALPHA	AC, AC, AC, AC	Multiplies all colors by a constant alpha value.
  // gl.ONE_MINUS_CONSTANT_ALPHA	1-AC, 1-AC, 1-AC, 1-AC	Multiplies all colors by 1 minus a constant alpha value.
  // gl.SRC_ALPHA_SATURATE	
  // min(AS, 1 - AD), min(AS, 1 - AD), min(AS, 1 - AD), 1 Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1.
  setBlendFunction: function ( sourceFactor, destinationFactor ) {
    this.context.blendFunc( this.context[sourceFactor], this.context[destinationFactor] );
  },

  // GL_FUNC_ADD
  // GL_FUNC_SUBTRACT
  // GL_FUNC_REVERSE_SUBTRACT
  // GL_MIN
  // GL_MAX
  setBlendEquation: function ( mode ) {
    this.context.blendEquation( this.context[mode] );
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
	},
  
  enableDepthTest:function(){
    this.enable('DEPTH_TEST');
    this.context.depthMask(true);
    //this.gl.depthFunc(this.gl.LESS);
    //this.setDepthFunc('LEQUAL');
  },
  
  disableDepthTest:function(){
    this.disable('DEPTH_TEST');
    this.context.depthMask(false);
  },
  
  enableBlendMode:function(equation, source, destination){
    this.setBlendEquation(equation);
    this.setBlendFunction(source, destination);
    this.enable('BLEND');
  },
  
  disableBlendMode:function() {
    this.disable('BLEND');
  }

} );

export { RendererTarget };
