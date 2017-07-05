#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
  precision highp float;
#endif	

uniform float uTime;

varying vec4 vWorldSpaceNormal;
varying vec3 vMaterialColor;
varying vec3 vViewSpaceVertex;

void main(){ 

  vec3 lightDirection = normalize(vec3(0.0,1.0,2.0));
  
  // Calculate the face normal in camera space
  vec3 surfaceNormal = normalize(cross(dFdx(vViewSpaceVertex), dFdy(vViewSpaceVertex)));

  float diffuse = max(0.2, dot(lightDirection, surfaceNormal) * 0.6);

  gl_FragColor = vec4(vMaterialColor * max(0.2, diffuse), 1.0);

}
