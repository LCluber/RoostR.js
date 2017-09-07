import { SubMesh } from './subMesh';

function CustomMesh(/*mesh*/) {

  this.vertices  = /*mesh.vertices ? this.copyArray(mesh.vertices) :*/ null;
  this.indices   = /*mesh.indices ? this.copyArray(mesh.indices) :*/ null;
  this.normals   = /*mesh.normals ? this.copyArray(mesh.normals) :*/ null;
  this.uvs       = /*mesh.uvs ? this.copyArray(mesh.uvs) :*/ null;
  this.subMeshes = [];
  this.itemSize  = 3;
  this.primitive = 'TRIANGLES';
  // gl.POINTS: Draws a single dot.
  // gl.LINE_STRIP: Draws a straight line to the next vertex.
  // gl.LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
  // gl.LINES: Draws a line between a pair of vertices.
  // gl.TRIANGLE_STRIP
  // gl.TRIANGLE_FAN
  // gl.TRIANGLES: Draws a triangle for a group of three vertices.
  this.primitives = ['POINTS', 'LINE_STRIP', 'LINE_LOOP', 'LINES', 'TRIANGLE_STRIP', 'TRIANGLE_FAN', 'TRIANGLES'];
  
}

Object.assign( CustomMesh.prototype, {
  setVertices : function(array) {
    this.vertices = this.copyArray(array);
  },
  setIndices : function(array) {
    this.indices = this.copyArray(array);
  },
  setNormals : function(array) {
    this.normals = this.copyArray(array);
  },
  setUvs : function(array) {
    this.uvs = this.copyArray(array);
  },
  addSubMeshes : function(array) {
    for(var i = 0 ; i < array.length ; i+=2 ){
      this.addSubMesh( array[i], array[i+1] );
    }
  },
  addSubMesh : function(start, count) {
    this.subMeshes.push(new SubMesh( start, count));
  },
  setItemSize : function(itemSize) {
    this.itemSize = itemSize;
  },
  setPrimitive : function(primitive) {
    for (var i = 0 ; i < this.primitives.length ; i++) {
      if(this.primitives[i] === primitive){
        this.primitive = primitive;
        return true;
      }
    }
    return false;
  },
  
  copyArray : function( array) {
    return array.slice(array);
  }
  
} );

export { CustomMesh };
