#ifdef GL_ES
  precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

varying vec4 vWorldSpaceNormal;
varying vec3 vMaterialColor;
varying vec3 vViewSpaceVertex;

void main(){

  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  vWorldSpaceNormal = uModelMatrix * vec4(aVertexNormal, 0.0);
  vViewSpaceVertex = (uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0)).xyz;  
  vMaterialColor = aVertexNormal * 0.5 + 0.5;// from 0 to 1

}
