
/**
 * Module dependencies.
 * @api private
 */

import { createShader } from './shader';

function createProgram( context, vertexShader, fragmentShader ){
  //find vert and frag shader before deleting lines and tabs.
  //var reg = shader.match(/"vertex":"([\s\S]*)",[\s\S]*"fragment":"([\s\S]*)"/mi);
  var program = context.createProgram();
  var vshader = createShader(context, vertexShader, 'VERTEX_SHADER');
  var fshader = createShader(context, fragmentShader, 'FRAGMENT_SHADER');
  context.attachShader(program, vshader);
  context.attachShader(program, fshader);
  context.linkProgram(program);
  
  if(!context.getProgramParameter(program, context.LINK_STATUS))
    console.log(context.getProgramInfoLog(program));
  
  return program;
}


export { createProgram };
