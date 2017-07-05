
function VWing( ) {

  this.vertices = [ 0,0,-7.3975,0,-0.2707,0,1.4678,0,0,0,0.5653,1.8374,0,1.4694,0,0,-0.2707,0,0,1.553,-1.0874,0,0.7405,-5.3869,2.3189,0.251,0,1.4678,0,0,1.6633,2.6,1.6982,6.65,-0.8596,3.1485,2.3189,0.251,0,1.9333,-0.2938,-1.9828,1.4678,0,0,2.3189,0.251,0,1.4678,0,0,1.4678,0,0,1.6148,-0.4246,-2.7743,1.9333,-0.2938,-1.9828,1.4678,0,0,1.6148,-0.4246,-2.7743,1.6148,-0.4246,-2.7743,1.9333,-0.2938,-1.9828,-1.4678,0,0,0,-0.2707,0,-2.3189,0.251,0,-1.6633,2.6,1.6982,-1.4678,0,0,-6.65,-0.8596,3.1485,-1.9333,-0.2938,-1.9828,-2.3189,0.251,0,-1.4678,0,0,-2.3189,0.251,0,-1.4678,0,0,-1.4678,0,0,-1.6148,-0.4246,-2.7743,-1.9333,-0.2938,-1.9828,-1.6148,-0.4246,-2.7743,-1.4678,0,0,-1.6148,-0.4246,-2.7743,-1.9333,-0.2938,-1.9828
                  ];
  this.indices = [ 0,1,2,2,3,4,5,3,2,6,2,4,7,0,2,6,7,2,8,9,10,11,12,13,11,13,14,15,11,16,17,13,18,8,10,19,10,20,21,22,23,10,0,24,1,24,4,3,25,24,3,6,4,24,7,24,0,6,24,7,26,27,28,29,30,31,29,32,30,33,34,29,35,36,30,26,37,27,27,38,39,40,27,41
                  ];
  this.normals = [ 0,-0.1063,-0.9943,0,-0.9819,0.1891,0.9233,-0.2975,0.2427,0,0.0714,0.9974,0,0.9697,0.2443,0,-0.9819,0.1891,0,0.9961,-0.088,0,0.9478,-0.3187,0.553,0.7911,0.2613,-0.7402,-0.526,0.4187,-0.0528,0.7418,0.6686,0.7771,-0.1425,0.6131,0.553,0.7911,0.2613,0.8324,-0.4718,-0.2906,-0.7402,-0.526,0.4187,0.553,0.7911,0.2613,-0.7402,-0.526,0.4187,-0.7402,-0.526,0.4187,-0.1135,-0.2998,-0.9472,0.8324,-0.4718,-0.2906,-0.7402,-0.526,0.4187,-0.1135,-0.2998,-0.9472,-0.1135,-0.2998,-0.9472,0.8324,-0.4718,-0.2906,-0.9233,-0.2975,0.2427,0,-0.9819,0.1891,-0.553,0.7911,0.2613,0.0528,0.7418,0.6686,0.7402,-0.526,0.4187,-0.7771,-0.1425,0.6131,-0.8324,-0.4718,-0.2906,-0.553,0.7911,0.2613,0.7402,-0.526,0.4187,-0.553,0.7911,0.2613,0.7402,-0.526,0.4187,0.7402,-0.526,0.4187,0.1135,-0.2998,-0.9472,-0.8324,-0.4718,-0.2906,0.1135,-0.2998,-0.9472,0.7402,-0.526,0.4187,0.1135,-0.2998,-0.9472,-0.8324,-0.4718,-0.2906
                ];
  this.itemSize = 3;
  this.numIndices = 84;

}

Object.assign( VWing.prototype, {

  // setTexture: function(texture){
  //   this.WebGLTexture = texture.WebGLTexture;
  // },
  // 
  // createProgram: function(vertexShader, fragmentShader) {
  //   console.log('Create program');
  //   this.program = createProgram( this.context, vertexShader, fragmentShader );
  //   
  //   this.program.vertexPositionAttribute = this.context.getAttribLocation(this.program, 'aVertexPosition');
  //   this.context.enableVertexAttribArray(this.program.vertexPositionAttribute);
  //   
  //   this.program.vertexNormalAttribute = this.context.getAttribLocation(this.program, 'aVertexNormal');
  //   this.context.enableVertexAttribArray(this.program.vertexNormalAttribute);
  //   
  //   this.program.modelMatrixUniform = this.context.getUniformLocation(this.program, 'uModelMatrix');
  //   this.program.viewMatrixUniform = this.context.getUniformLocation(this.program, 'uViewMatrix');
  //   this.program.projectionMatrixUniform = this.context.getUniformLocation(this.program, 'uProjectionMatrix');
  //   
  //   this.program.uTime = this.context.getUniformLocation(this.program, 'uTime');
  //   //this.program.uScreenResolution = this.context.getUniformLocation(this.program, 'uScreenResolution');
  //   
  //   //if (this.WebGLTexture) {
  //     this.program.uSampler = this.context.getUniformLocation(this.program, 'uSampler');
  //   //}
  //   
  //   this.renderer.useProgram(this.program);//use program before adding static uniforms
  //   
  // },
  // 
  // sendMatrixUniforms: function(camera) {
  //   this.context.uniformMatrix4fv(this.program.modelMatrixUniform, false, this.modelMatrix.get());
  //   this.context.uniformMatrix4fv(this.program.projectionMatrixUniform, false, camera.projectionMatrix.get());
  //   this.context.uniformMatrix4fv(this.program.viewMatrixUniform, false, camera.viewMatrix.get());
  // },
  // 
  // render: function( camera, time ){
  //   if(this.draw){
  //     this.renderer.useProgram(this.program);
  //     
  //     this.renderer.bindBuffer('ELEMENT_ARRAY_BUFFER', this.indexBuffer);
  //     this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexPositionBuffer);
  //     this.renderer.vertexAttribPointer(this.program.vertexPositionAttribute, this.itemSize, 'FLOAT', false, 0, 0);
  //     
  //     this.renderer.vertexAttribPointer(this.program.vertexNormalAttribute, this.itemSize, 'FLOAT', false, 0, 0);
  //     
  //     this.sendMatrixUniforms(camera);
  //     this.renderer.drawElements(this.program, this.numIndices, time, this.WebGLTexture);
  //   }
  // }

} );

export { VWing };
