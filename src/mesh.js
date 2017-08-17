import { ucfirst }       from './utils';
import { createProgram } from './program';
import { Uniform }       from './uniform';
import { WebGLRenderer } from './renderers/webgl';

function Mesh( mesh, context ) {

  this.vertices    = mesh.vertices ? mesh.vertices : null;
  this.indices     = mesh.indices ? mesh.indices : null;
  this.normals     = mesh.normals ? mesh.normals : null;
  this.uvs         = mesh.uvs ? mesh.uvs : null;
  this.itemSize    = mesh.itemSize ? mesh.itemSize : null;
  this.numIndices  = mesh.numIndices ? mesh.numIndices : null;
  this.numVertices = mesh.numVertices ? mesh.numVertices : null;
  
  this.primitive   = mesh.primitive ? mesh.primitive : null;
  
  //this.cameraDefaultPosition = mesh.cameraDefaultPosition ? mesh.cameraDefaultPosition : TYPE6.Vector3.create(0.0,0.0,0.0);
  
  this.customUniforms = {};
  
  this.context = context;
  
  this.renderer = new WebGLRenderer(this.context);
  
  this.WebGLTexture = null;
  
  this.vertexPositionBuffer = this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.vertices), 'STATIC_DRAW');
  this.indexBuffer          = this.indices ? this.renderer.createBuffer('ELEMENT_ARRAY_BUFFER', new Uint16Array(this.indices), 'STATIC_DRAW') : null;
  this.vertexNormalBuffer   = this.normals ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.normals), 'STATIC_DRAW') : null;
  this.textureCoordBuffer   = this.uvs ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.uvs), 'STATIC_DRAW') : null;

  this.modelMatrix = TYPE6.Matrix4x3.create();
  this.rotationMatrix = TYPE6.Matrix4x3.create();
  
  //this.modelMatrix.identity();
  //this.rotationMatrix.identity();
  
  this.active = true;
  
  this.drawMethod = this.indices ? 'drawElements' : 'drawArrays';
  

}

Object.assign( Mesh.prototype, {

  /**
  * Set the element as active
  * @since 0.4.0
  * @method
  */
  setActive : function(){
    this.active = true;
  },
  
  /**
  * Set the element as inactive
  * @since 0.4.0
  * @method
  */
  setInactive : function(){
    this.active = false;
  },
  
  /**
  * Toggle the element between active and inactive.
  * @since 0.4.0
  * @method
  * @returns {vector} The active boolean
  */
  toggleActive : function(){
    this.active = !this.active;
    return this.active;
  },
  
  /**
  * Return true if the element is active. false otherwise
  * @since 0.4.0
  * @method
  */
  isActive : function(){
    return this.active;
  },

  setTexture: function(texture){
    this.WebGLTexture = texture.WebGLTexture;
  },

  addUniform: function(name, type, value){
    if (!this.customUniforms.hasOwnProperty(name)){
      this.customUniforms[name] = new Uniform(type, value);
    }
  },
  
  setUniform: function(name, value){
    if (this.customUniforms.hasOwnProperty(name)){
      this.customUniforms[name].value = value;
    }
  },

  createTextureProgram: function(){
    if (this.WebGLTexture) {
      this.addProgramUniform('sampler');
    }
  },

  createPositionsProgram: function(){
    this.addProgramAttribute('vertexPosition');
  },

  createNormalsProgram: function(){
    if (this.normals) {
      this.addProgramAttribute('vertexNormal');
    }
  },

  createUvsProgram: function(){
    if (this.uvs && this.WebGLTexture) {
      this.addProgramAttribute('textureCoord');
    }
  },

  createMatrixUniformsProgram: function(){
    this.addProgramUniform('modelMatrix');
    this.addProgramUniform('viewMatrix');
    this.addProgramUniform('projectionMatrix');
  },

  createDefaultUniformsProgram: function(){
    this.addProgramUniform('time');
    this.addProgramUniform('screenResolution');
  },

  createCustomUniformsProgram: function(){
    for (var property in this.customUniforms) {
      if (this.customUniforms.hasOwnProperty(property)) {
        this.addProgramUniform(property);
      }
    }
  },

  sendScreenResolution: function(){
    var viewport = this.context.getParameter(this.context.VIEWPORT);
    this.context.uniform2f(this.program.screenResolution, viewport[2], viewport[3]);
  },

  createProgram: function(vertexShader, fragmentShader) {
    this.program = createProgram( this.context, vertexShader, fragmentShader );
    
    this.createPositionsProgram();
    this.createNormalsProgram();
    this.createUvsProgram();
    this.createMatrixUniformsProgram();
    this.createDefaultUniformsProgram();
    this.createCustomUniformsProgram();
    this.createTextureProgram();
    
    this.renderer.useProgram(this.program);//use program before adding static uniforms
    
    this.sendScreenResolution();
    
  },
  
  addProgramAttribute: function(name){
    //var attribute = name + 'Attribute'; 
    this.program[name] = this.context.getAttribLocation(this.program, 'a' + ucfirst(name));
    this.context.enableVertexAttribArray(this.program[name]);
  },
  
  addProgramUniform: function(name){
    //var attribute = name + 'Uniform'; 
    this.program[name] = this.context.getUniformLocation(this.program, 'u' + ucfirst(name));
  },
  
  sendMatrixUniforms: function(camera) {
    this.context.uniformMatrix4fv(this.program.modelMatrix,      false, this.modelMatrix.toArray());
    this.context.uniformMatrix4fv(this.program.projectionMatrix, false, camera.getProjectionMatrix());
    this.context.uniformMatrix4fv(this.program.viewMatrix,       false, camera.getViewMatrix());
  },
  
  sendCustomUniforms: function() {
    for (var property in this.customUniforms) {
      if (this.customUniforms.hasOwnProperty(property)) {
        var uniform = this.customUniforms[property];
        this.context[uniform.type](this.program[property], uniform.value);
      }
    }
  },
  
  sendDefaultUniforms: function(time){
    this.context.uniform1f(this.program.time, time);
  },
  
  sendTexture: function(){
    if(this.WebGLTexture){
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D, this.WebGLTexture);
      this.context.uniform1i(this.program.sampler, 0);
    }
  },
  
  sendUvs: function(){
    if (this.uvs && this.WebGLTexture) {
      this.renderer.bindBuffer('ARRAY_BUFFER', this.textureCoordBuffer );
      this.renderer.vertexAttribPointer(this.program.textureCoord, 2, 'FLOAT', false, 0, 0);
    }
  },
  
  sendNormals: function(){
    if (this.normals) {
      this.renderer.vertexAttribPointer(this.program.vertexNormal, this.itemSize, 'FLOAT', false, 0, 0);
    }
  },
  
  sendPositions: function(){
    if(this.indices) {
      this.renderer.bindBuffer('ELEMENT_ARRAY_BUFFER', this.indexBuffer);
    }
    this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexPositionBuffer);
    this.renderer.vertexAttribPointer(this.program.vertexPosition, this.itemSize, 'FLOAT', false, 0, 0);
  },
  
  render: function( camera, time ){
    if(this.isActive()) {
      this.renderer.useProgram(this.program);
      
      this.sendPositions();
      this.sendNormals();
      this.sendUvs();
      this.sendMatrixUniforms(camera);
      this.sendDefaultUniforms(time);
      this.sendCustomUniforms();
      this.sendTexture();
      
      this.renderer[this.drawMethod](this.primitive, this.numIndices ? this.numIndices : this.numVertices);
      
    }
  }

} );

export { Mesh };
