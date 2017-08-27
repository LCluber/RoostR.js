#ifdef GL_ES
  precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
varying vec3 vWorldSpaceNormal;

void main(){
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  vWorldSpaceNormal = aVertexNormal;
}
