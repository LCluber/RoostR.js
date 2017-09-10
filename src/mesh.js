import { ucfirst }       from './utils';
import { createProgram } from './program';
import { Uniform }       from './uniform';
import { MeshRenderer }  from './renderer/mesh';

function Mesh( mesh, context ) {

  this.vertices    = mesh.vertices ? mesh.vertices : null;
  this.indices     = mesh.indices ? mesh.indices : null;
  this.normals     = mesh.normals ? mesh.normals : null;
  this.uvs         = mesh.uvs ? mesh.uvs : null;
  this.itemSize    = mesh.itemSize ? mesh.itemSize : null;
  this.subMeshes   = mesh.subMeshes;
  this.nbSubMeshes = this.subMeshes.length;
  
  this.primitive   = mesh.primitive ? mesh.primitive : null;
  
  this.customUniforms = {};
  
  this.context = context;
  
  this.renderer = new MeshRenderer(this.context);
  
  this.WebGLTexture = null;
  
  this.vertexPositionBuffer = this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.vertices), 'STATIC_DRAW');
  this.indexBuffer          = this.indices ? this.renderer.createBuffer('ELEMENT_ARRAY_BUFFER', new Uint16Array(this.indices), 'STATIC_DRAW') : null;
  this.vertexNormalBuffer   = this.normals ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.normals), 'STATIC_DRAW') : null;
  this.textureCoordBuffer   = this.uvs ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.uvs), 'STATIC_DRAW') : null;

  this.modelMatrix    = TYPE6.Matrix4x3.create();
  this.rotationMatrix = TYPE6.Matrix4x3.create();
  this.worldMatrix    = TYPE6.Matrix4x3.create();
  
  this.worldMatrix.identity();
  //this.rotationMatrix.identity();
  
  this.active = true;
  
  this.drawMethod = this.indices ? 'drawElements' : 'drawArrays';
  
  this.materials = [];
  this.nbMaterials = 0;
  
  this.children = [];
  this.nbChildren = 0;
  
  this.blendMode = false;
  
  this.zOrder = 0;

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

  addChild: function(mesh){
    this.children.push(mesh);
    this.nbChildren ++;
  },
  
  addMaterial : function(vertexShader, fragmentShader){
    if(this.nbMaterials < this.nbSubMeshes){
      this.materials.push(createProgram( this.context, vertexShader, fragmentShader ));
      this.createProgram();
      this.nbMaterials ++;
      return true;
    }
    return false;
  },
  
  setWorldMatrix : function(worldMatrix){
    this.worldMatrix.copy(worldMatrix);
    this.worldMatrix.multiplyBy(this.modelMatrix);
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

  createProgram: function(/*vertexShader, fragmentShader*/) {
    //this.program = createProgram( this.context, vertexShader, fragmentShader );
    var program = this.materials[this.nbMaterials];
    this.createPositionsProgram();
    this.createNormalsProgram();
    this.createUvsProgram();
    this.createMatrixUniformsProgram();
    this.createDefaultUniformsProgram();
    this.createCustomUniformsProgram();
    this.createTextureProgram();
    
    this.renderer.useProgram(program);//use program before adding static uniforms
    
    this.sendScreenResolution(program);
    
  },
  
  addProgramAttribute: function(name){
    //var attribute = name + 'Attribute'; 
    this.materials[this.nbMaterials][name] = this.context.getAttribLocation(this.materials[this.nbMaterials], 'a' + ucfirst(name));
    this.context.enableVertexAttribArray(this.materials[this.nbMaterials][name]);
  },
  
  addProgramUniform: function(name){
    //var attribute = name + 'Uniform'; 
    this.materials[this.nbMaterials][name] = this.context.getUniformLocation(this.materials[this.nbMaterials], 'u' + ucfirst(name));
  },
  
  sendScreenResolution: function(program){
    var viewport = this.context.getParameter(this.context.VIEWPORT);
    this.context.uniform2f(program.screenResolution, viewport[2], viewport[3]);
  },
  
  sendMatrixUniforms: function(program, camera) {
    this.context.uniformMatrix4fv(program.modelMatrix,      false, this.worldMatrix.toArray());
    this.context.uniformMatrix4fv(program.projectionMatrix, false, camera.getProjectionMatrix());
    this.context.uniformMatrix4fv(program.viewMatrix,       false, camera.getViewMatrix());
  },
  
  sendCustomUniforms: function(program) {
    for (var property in this.customUniforms) {
      if (this.customUniforms.hasOwnProperty(property)) {
        var uniform = this.customUniforms[property];
        this.context[uniform.type](program[property], uniform.value);
      }
    }
  },
  
  sendDefaultUniforms: function(program, time){
    this.context.uniform1f(program.time, time);
  },
  
  sendTexture: function(program){
    if(this.WebGLTexture){
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D, this.WebGLTexture);
      this.context.uniform1i(program.sampler, 0);
    }
  },
  
  sendUvs: function(program){
    if (this.uvs && this.WebGLTexture) {
      this.renderer.bindBuffer('ARRAY_BUFFER', this.textureCoordBuffer );
      this.renderer.vertexAttribPointer(program.textureCoord, 2, 'FLOAT', false, 0, 0);
    }
  },
  
  sendNormals: function(program){
    if (this.normals) {
      this.renderer.vertexAttribPointer(program.vertexNormal, this.itemSize, 'FLOAT', false, 0, 0);
    }
  },
  
  sendPositions: function(program){
    if(this.indices) {
      this.renderer.bindBuffer('ELEMENT_ARRAY_BUFFER', this.indexBuffer);
    }
    this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexPositionBuffer);
    this.renderer.vertexAttribPointer(program.vertexPosition, this.itemSize, 'FLOAT', false, 0, 0);
  },
  
  activateBlendMode:function(){
    this.blendMode = true;
  },
 
  deactivateBlendMode:function(){
    this.blendMode = false;
  },
 
 
  computeWorldMatrix: function(graph){
    //if(this.isActive()) {
      this.setWorldMatrix(graph.getWorldMatrix());
      graph.pushModelMatrix(this.worldMatrix);
      
      for ( var i = 0 ; i < this.nbChildren ; i++ ) {
        var child = this.children[i];
        child.computeWorldMatrix(graph);
      }
    
      graph.popModelMatrix();
    //}
  },
  
  render: function( camera, lights, time, blendMode ){
    if(this.isActive()) {

      var program = null;
      for(var i = 0 ; i < this.nbSubMeshes ; i++) {
        if(this.blendMode === blendMode){
          if (this.materials[i]){
            program = this.materials[i];
          }else{
            program = this.materials[this.nbMaterials - 1];
          }
          
          this.renderer.useProgram(program);
          
          this.sendPositions(program);
          this.sendNormals(program);
          this.sendUvs(program);
          this.sendMatrixUniforms(program, camera);
          this.sendDefaultUniforms(program, time);
          this.sendCustomUniforms(program);
          this.sendTexture(program);
          
          this.renderer[this.drawMethod](this.primitive, this.subMeshes[i]); 
        } 
      }
      
      for ( var j = 0 ; j < this.nbChildren ; j++ ) {
        var child = this.children[j];
        child.render(camera, lights, time, blendMode);
      }
    
    }
  }

} );

export { Mesh };
