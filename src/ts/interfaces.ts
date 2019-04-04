import { Uniform } from './uniform';

// export interface WebGLRenderingContext {
//   [key: string]: any;
// }

export interface ICustomUniforms {
  [key: string]: Uniform;
}

export interface IMaterialUniforms{
  materialAmbient : Uniform;
  materialDiffuse : Uniform;
  materialSpecular : Uniform;
  materialShininess : Uniform;
  //[key: string]: any;
}

export interface IProgram extends WebGLProgram {
  vertexNormal      : GLint;
  vertexPosition    : GLint;
  textureCoord      : GLint;
  sampler           : WebGLUniformLocation;
  modelMatrix       : WebGLUniformLocation;
  projectionMatrix  : WebGLUniformLocation;
  viewMatrix        : WebGLUniformLocation;
  time              : WebGLUniformLocation;
  screenResolution  : WebGLUniformLocation;
  // [key: string]: any;
}

export interface IFlatLights{
  position : number[];
  diffuse : number[];
  specular : number[];
  constantAttenuation : number[];
  linearAttenuation : number[];
  quadraticAttenuation : number[];
  cutoff : number[];
  exponent : number[];
  direction : number[];
  type : number[]
}
