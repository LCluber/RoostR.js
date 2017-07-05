
/**
 * Module dependencies.
 * @api private
 */

//import { RendererTarget } from './DOM/canvas';


function Texture( context, img ) {
  this.img = img;
  this.WebGLTexture = context.createTexture();
  this.create(context);
}

Object.assign( Texture.prototype, {

  create: function ( context ) {
    context.bindTexture(context.TEXTURE_2D, this.WebGLTexture);
    context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
    context.texParameteri(  context.TEXTURE_2D,       
                            context.TEXTURE_MAG_FILTER, 
                            context.LINEAR
                          );
    context.texParameteri(  context.TEXTURE_2D, 
                            context.TEXTURE_MIN_FILTER, 
                            context.LINEAR //allow NPOT
                          );
    //allow NPOT
    context.texParameteri(  context.TEXTURE_2D,
                            context.TEXTURE_WRAP_S,
                            context.CLAMP_TO_EDGE
                          );
    //allow NPOT
    context.texParameteri(  context.TEXTURE_2D,
                            context.TEXTURE_WRAP_T,
                            context.CLAMP_TO_EDGE
                          );
    context.texImage2D( context.TEXTURE_2D,
                        0,
                        context.RGBA,
                        context.RGBA,
                        context.UNSIGNED_BYTE,
                        this.img
                      );
    //context.generateMipmap(context.TEXTURE_2D);//comment to allow NPOT
    context.bindTexture(context.TEXTURE_2D, null);
  }

} );

export { Texture };
