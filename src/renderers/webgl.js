

//var canvas = require('./canvas');

function WebGLRenderer( context ) {

  this.context = context;
  
}

Object.assign( WebGLRenderer.prototype, {

  // specifying the binding point (target). Possible values:
  // gl.ARRAY_BUFFER: Buffer containing vertex attributes, such as vertex coordinates, texture coordinate data, or vertex color data.
  // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
  createBuffer: function( target, arrayData, drawMethod ) {
    var buffer = this.context.createBuffer();
    //binds a given WebGLBuffer to a target
    this.context.bindBuffer(this.context[target], buffer);
    this.context.bufferData(this.context[target], arrayData, this.context[drawMethod]);
    return buffer;
    
  },

  useProgram: function(program) {
    this.context.useProgram(program);
  },
  
  bindBuffer: function(target, buffer) {
    this.context.bindBuffer(this.context[target], buffer);
  },
  
  vertexAttribPointer: function(index, size, type, normalized, stride, offset){
    this.context.vertexAttribPointer(index, size, this.context[type], normalized, stride, offset);
  },
  
  sendDefaultUniforms: function(program, time){
    this.context.uniform1f(program.uTime, time);
  },
  
  sendTexture: function(program, texture){
    this.context.activeTexture(this.context.TEXTURE0);
    this.context.bindTexture(this.context.TEXTURE_2D, texture);
    this.context.uniform1i(program.uSampler, 0);
  },
  
  drawElements: function(primitive, program, numItems, time, texture){
    this.sendDefaultUniforms(program, time);

    if(texture){
      this.sendTexture(program, texture);
    }
    
    // gl.POINTS: Draws a single dot.
    // gl.LINE_STRIP: Draws a straight line to the next vertex.
    // gl.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
    // gl.LINES: Draws a line between a pair of vertices.
    // gl.TRIANGLE_STRIP
    // gl.TRIANGLE_FAN
    // gl.TRIANGLES: Draws a triangle for a group of three vertices.
    this.context.drawElements(this.context[primitive], numItems, this.context.UNSIGNED_SHORT, 0);
  },
  
  drawArrays: function(primitive, program, numItems, time, texture) {
    this.sendDefaultUniforms(program, time);
    
    if(texture){
      this.sendTexture(program, texture);
    }
    
    // gl.POINTS: Draws a single dot.
    // gl.LINE_STRIP: Draws a straight line to the next vertex.
    // gl.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
    // gl.LINES: Draws a line between a pair of vertices.
    // gl.TRIANGLE_STRIP
    // gl.TRIANGLE_FAN
    // gl.TRIANGLES: Draws a triangle for a group of three vertices.
    this.context.drawArrays(this.context[primitive], 0, numItems);
    
    // this.context.useProgram(program);
    // 
    // this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexPositionBuffer );
    // //this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // this.context.vertexAttribPointer(program.vertexPositionAttribute, vertexPositionBuffer.itemSize, this.context.FLOAT, false, 0, 0);
    // 
    // //if (program.vertexTextureCoordAttribute !== -1) {
    //   this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexTextureCoordBuffer);
    //   this.context.vertexAttribPointer(program.vertexTextureCoordAttribute, 2, this.context.FLOAT, false, 0, 0);
    // //}
    // 
    // 
    // this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, vertexPositionBuffer.numItems);
  }

});

export { WebGLRenderer };
