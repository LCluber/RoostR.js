import { createProgram } from './program';
import { WebGLRenderer } from './renderers/webgl';

function Mesh( mesh, context ) {

  this.vertices    = mesh.vertices ? mesh.vertices : null;
  this.indices     = mesh.indices ? mesh.indices : null;
  this.normals     = mesh.normals ? mesh.normals : null;
  this.uvs         = mesh.uvs ? mesh.uvs : null;
  this.itemSize    = mesh.itemSize ? mesh.itemSize : null;
  this.numIndices  = mesh.numIndices ? mesh.numIndices : null;
  this.numVertices = mesh.numVertices ? mesh.numVertices : null;
  
  this.primitive = mesh.primitive ? mesh.primitive : null;
  
  //this.cameraDefaultPosition = mesh.cameraDefaultPosition ? mesh.cameraDefaultPosition : TYPE6.Vector3.create(0.0,0.0,0.0);
  
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

  createProgram: function(vertexShader, fragmentShader) {
    this.program = createProgram( this.context, vertexShader, fragmentShader );
    
    this.program.vertexPositionAttribute = this.context.getAttribLocation(this.program, 'aVertexPosition');
    this.context.enableVertexAttribArray(this.program.vertexPositionAttribute);
    
    if (this.normals) {
      this.program.vertexNormalAttribute = this.context.getAttribLocation(this.program, 'aVertexNormal');
      this.context.enableVertexAttribArray(this.program.vertexNormalAttribute);
    }
    
    this.program.modelMatrixUniform = this.context.getUniformLocation(this.program, 'uModelMatrix');
    this.program.viewMatrixUniform = this.context.getUniformLocation(this.program, 'uViewMatrix');
    this.program.projectionMatrixUniform = this.context.getUniformLocation(this.program, 'uProjectionMatrix');
    
    if (this.uvs) {
      this.program.textureCoordAttribute = this.context.getAttribLocation(this.program, 'aTextureCoord');
      this.context.enableVertexAttribArray(this.program.textureCoordAttribute);
    }
    
    this.program.uTime = this.context.getUniformLocation(this.program, 'uTime');
    this.program.uScreenResolution = this.context.getUniformLocation(this.program, 'uScreenResolution');
    
    if (this.WebGLTexture) {
      this.program.uSampler = this.context.getUniformLocation(this.program, 'uSampler');
    }
    
    this.renderer.useProgram(this.program);//use program before adding static uniforms
    
    var viewport = this.context.getParameter(this.context.VIEWPORT);
    this.context.uniform2f(this.program.uScreenResolution, viewport[2], viewport[3]);
    
  },
  
  sendMatrixUniforms: function(camera) {
    this.context.uniformMatrix4fv(this.program.modelMatrixUniform, false, this.modelMatrix.toArray());
    this.context.uniformMatrix4fv(this.program.projectionMatrixUniform, false, camera.getProjectionMatrix());
    this.context.uniformMatrix4fv(this.program.viewMatrixUniform, false, camera.getViewMatrix());
  },
  
  render: function( camera, time ){
    if(this.isActive()){
      this.renderer.useProgram(this.program);
      
      if(this.indices){
        this.renderer.bindBuffer('ELEMENT_ARRAY_BUFFER', this.indexBuffer);
      }
      
      this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexPositionBuffer);
      this.renderer.vertexAttribPointer(this.program.vertexPositionAttribute, this.itemSize, 'FLOAT', false, 0, 0);
      
      if (this.normals) {
        this.renderer.vertexAttribPointer(this.program.vertexNormalAttribute, this.itemSize, 'FLOAT', false, 0, 0);
      }
      
      if (this.uvs) {
        this.renderer.bindBuffer("ARRAY_BUFFER", this.textureCoordBuffer );
        this.renderer.vertexAttribPointer(this.program.textureCoordAttribute, 2, 'FLOAT', false, 0, 0);
      }
      
      this.sendMatrixUniforms(camera);
      
      this.renderer[this.drawMethod](this.primitive, this.program, this.numIndices ? this.numIndices : this.numVertices, time, this.WebGLTexture);
      
    }
  }

} );

export { Mesh };
