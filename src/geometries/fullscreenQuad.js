

function FullscreenQuad( ) {

  this.vertices = [  1.0,-1.0,
                    -1.0,-1.0,
                     1.0, 1.0,
                    -1.0, 1.0 
                  ];
  this.uvs = [ 1.0, 0.0,
               0.0, 0.0,
               1.0, 1.0,
               0.0, 1.0
             ];
  this.itemSize = 2;
  this.numVertices = 4;
  
}

Object.assign( FullscreenQuad.prototype, {

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
  //   //if (this.program.textureCoordAttribute !== -1) {
  //     this.program.textureCoordAttribute = this.context.getAttribLocation(this.program, 'aTextureCoord');
  //     this.context.enableVertexAttribArray(this.program.textureCoordAttribute);
  //   //}
  //   this.program.uTime = this.context.getUniformLocation(this.program, 'uTime');
  //   this.program.uScreenResolution = this.context.getUniformLocation(this.program, 'uScreenResolution');
  //   
  //   if (this.program.textureCoordAttribute !== -1) {
  //     this.program.uSampler = this.context.getUniformLocation(this.program, 'uSampler');
  //   }
  //   
  //   this.renderer.useProgram(this.program);//use program before adding static uniforms
  //   
  //   var viewport = this.context.getParameter(this.context.VIEWPORT);
  //   this.context.uniform2f(this.program.uScreenResolution, viewport[2], viewport[3]);
  // },
  // 
  // render: function( camera, time ){
  //   if(this.draw){
  //     this.renderer.useProgram(this.program);
  //     
  //     this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexPositionBuffer);
  //     this.renderer.vertexAttribPointer(this.program.vertexPositionAttribute, this.itemSize, 'FLOAT', false, 0, 0);
  //     
  //     if (this.program.textureCoordAttribute !== -1) {
  //       this.renderer.bindBuffer('ARRAY_BUFFER', this.textureCoordBuffer);
  //       this.renderer.vertexAttribPointer(this.program.textureCoordAttribute, this.itemSize, 'FLOAT', false, 0, 0);
  //     }
  //     
  //     this.renderer.drawArrays(this.program, this.numVertices, time, this.WebGLTexture);
  //   }
  // }

} );

export { FullscreenQuad };
