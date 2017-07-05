
/**
 * Module dependencies.
 * @api private
 */

//import { RendererTarget } from './DOM/canvas';

function createShader(context, str, type){
  var shader = context.createShader(context[type]);
  context.shaderSource(shader, str);
  context.compileShader(shader);
  if(!context.getShaderParameter(shader, context.COMPILE_STATUS)){
      console.log(str);
      console.log(context.getShaderInfoLog(shader));
  }
  return shader;
}

export { createShader };
