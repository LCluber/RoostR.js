import * as MOUETTE from '../../bower_components/Mouettejs/dist/mouette';

export type ShaderType = 'VERTEX_SHADER'|'FRAGMENT_SHADER';

export class Shader {

  static create(context:WebGLRenderingContext, str: string, type: ShaderType): WebGLShader {
    let shader = context.createShader(context[type]);
    context.shaderSource(shader, str);
    context.compileShader(shader);
    if(!context.getShaderParameter(shader, context.COMPILE_STATUS)){
        //console.log(str);
        //console.log(context.getShaderInfoLog(shader));
        MOUETTE.Logger.error('shader creation failed : ' + context.getShaderInfoLog(shader));
    }
    return shader;
  }

}
