import {Logger} from '@lcluber/mouettejs';
import { Shader } from './shader';

export class Program {

  static create( context: WebGLRenderingContext, vertexShader:string, fragmentShader:string ): WebGLProgram {
    //find vert and frag shader before deleting lines and tabs.
    //var reg = shader.match(/"vertex":"([\s\S]*)",[\s\S]*"fragment":"([\s\S]*)"/mi);
    let program = context.createProgram();
    let vshader = Shader.create(context, vertexShader, 'VERTEX_SHADER');
    let fshader = Shader.create(context, fragmentShader, 'FRAGMENT_SHADER');
    context.attachShader(program, vshader);
    context.attachShader(program, fshader);
    context.linkProgram(program);

    if(!context.getProgramParameter(program, context.LINK_STATUS)){
      //console.log(context.getProgramInfoLog(program));
      Logger.error('program creation failed : ' + context.getProgramInfoLog(program));
    }

    return program;
  }
}
