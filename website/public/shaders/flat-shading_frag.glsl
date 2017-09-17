#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
  precision highp float;
#endif	

varying vec4 vWorldSpaceNormal;
varying vec3 vMaterialColor;
varying vec3 vViewSpaceVertex;

uniform vec3 uMaterialAmbient;
uniform vec3 uMaterialDiffuse;
uniform vec3 uMaterialSpecular;
uniform float uMaterialShininess;


const int NbLights = 2;
//uniform int uLightType[NbLights];
uniform vec3 uLightPosition[NbLights];
uniform vec3 uLightDiffuse[NbLights];
uniform vec3 uLightSpecular[NbLights];

void main(){ 
  vec3 linearColor;
  float attenuation = 1.0; // no attenuation
  vec3 scene_ambient = vec3(0.28, 0.28, 0.28);

  // Calculate the face normal in camera space
  vec3 surfaceNormal = normalize(cross(dFdx(vViewSpaceVertex), dFdy(vViewSpaceVertex)));
  
  vec3 ambient = scene_ambient * vMaterialColor * uMaterialAmbient;

  for (int i = 0; i < NbLights; i++) {
  
    vec3 lightDirection = normalize(uLightPosition[i]);
    
    float lightAmountIntoSurfaceNormal = dot(surfaceNormal, lightDirection);
    
    vec3 diffuse = uLightDiffuse[i] * vMaterialColor * max(0.0, lightAmountIntoSurfaceNormal) * uMaterialDiffuse;
    
    vec3 specular = vec3(0.0, 0.0, 0.0); // no specular reflection
    
    /*if (lightAmountIntoSurfaceNormal >= 0.0) { // light source on the good side?
      vec3 eyeDirection = normalize(-vViewSpaceVertex);
      specular = uLightSpecular[i] * vMaterialColor * pow(max(0.0, dot(reflect(-lightDirection, surfaceNormal), eyeDirection)), uMaterialShininess) * uMaterialSpecular;
    }*/
  
    //linear color
    linearColor += ambient + attenuation * (diffuse + specular);  
  
  }

  //gamma correction
  //vec3 gamma = vec3(1.0/2.2);

  gl_FragColor = vec4(linearColor, 1.0);
  

}
