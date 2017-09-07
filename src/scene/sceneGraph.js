
/**
 * Module dependencies.
 * @api private
 */


function SceneGraph(  ) {
  
  this.model = [ TYPE6.Matrix4x3.create() ]; //model matrices
  this.model[0].identity();
  this.nbModel = this.model.length;
  this.modelStackTop = 0;
  
}

Object.assign( SceneGraph.prototype, {

  pushModelMatrix : function(modelMatrix){
    this.modelStackTop++;
    if (this.modelStackTop === this.nbModel) {
      this.model.push(TYPE6.Matrix4x3.create());
      this.nbModel++;
    }
    this.model[this.modelStackTop].copy(modelMatrix);
  },
  
  popModelMatrix : function(){
    this.modelStackTop--;
  },

  getWorldMatrix : function(){
    return this.model[this.modelStackTop];
  }

} );

export { SceneGraph };
