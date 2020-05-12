#ifdef GL_ES
  precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVelocity;
//attribute vec3 aVertexNormal;

uniform float uStartTime;
uniform float uStartSize;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;
//varying vec3 vWorldSpaceNormal;

void main(){
  
  local_time = uTime - uStartTime;
  
  vec3 base_position = start_position + 
                 velocity * local_time + 
                 acceleration * local_time * local_time;
  
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
  //vWorldSpaceNormal = aVertexNormal;
}
