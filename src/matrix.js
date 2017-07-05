
/**
 * Module dependencies.
 * @api private
 */

import { Matrix4x3 }    from './maths/matrix4x3';

/*function DAGNode(ch) {
	this.matrices = new ROOSTR.WorldMatrices();
	this.children = ch ? ch : [];
	this.nb = this.children.length;
}

DAGNode.prototype = {
	draw : function(meshId) {
		ROOSTR.GlobalMatrices.pushModelMatrix().multiply(this.matrices.translate);
		if(meshId!==null)
			ROOSTR.Meshes.list.list[meshId].draw();
		for (var i = 0 ; i < this.nb ; i++)
			this.children[i].editAndDraw();

		ROOSTR.GlobalMatrices.popModelMatrix();
	}
};*/

// ROOSTR.WorldMatrices = function (){
// 	//this.list=new List('materials');
// 	this.scale      =   new ROOSTR.Matrix4();
// 	
// 	//this.rotate=new Matrix().zero();
// 	this.rotateX    =   new ROOSTR.Matrix4();
// 	this.rotateY    =   new ROOSTR.Matrix4();
// 	this.rotateZ    =   new ROOSTR.Matrix4();
// 		
// 	this.translate  = new ROOSTR.Matrix4();
// 	
// }
// ROOSTR.WorldMatrices.prototype={
// 	/*Add:function(name,specularColor,specularPower,nbIndices,diffuseTextureName){
// 		this.list.add(new Material(name,specularColor,specularPower,nbIndices,diffuseTextureName));
// 	},*/
// 	Set: function(s,r,p){
// 		this.scale.scale(s);
// 		this.translate.translate(p);
// 		
//         this.rotateX.rotateX(r.x);
// 		this.rotateY.rotateY(r.y);
// 		this.rotateZ.rotateZ(r.z);
// 		
// 		this.rotateX.multiply(this.rotateY);
// 		//console.log(this.rotateX);
// 		this.rotateZ.multiply(this.rotateX);//yawPitchRoll
// 		
// 		this.rotateZ.multiply(this.scale);
// 		this.translate.multiply(this.rotateZ);
// 	}
// };

function GlobalMatrix (fov, ratio, left, right, top, bottom){
  this.fov = fov;
  
  this.model = [ new Matrix4x3() ]; //model matrices
  this.nbModel = this.model.length;
  //this.view = new ROOSTR.Matrix4(); //view matrix
  
  //this.projection = new ROOSTR.Matrix4().perspective(this.fov,ratio,1,3600); //projection matrix
  //this.orthographic = new ROOSTR.Matrix4().orthographic(left, right, top, bottom,1,3600); //projection matrix
  //this.projectionForGM = new ROOSTR.Matrix4().perspective(45,1,1,1000);
  this.modelStackTop = 0;
}

Object.assign( GlobalMatrix.prototype, {

  // pushModelMatrix : function(){
  //   var parent = this.GetModelMatrix();
  //   this.modelStackTop++;
  //   if (this.modelStackTop == this.nbModel) {
  //       this.model[this.nbModel] = new ROOSTR.Matrix4();
  //       this.nbModel++;
  //   }
  //   var top = this.GetModelMatrix();
  //   
  //   top.copy(parent);
  //   return top;
  // },
	// popModelMatrix : function(){
	// 	this.modelStackTop--;
	// },
	
  GetModelMatrix : function(){
		return this.model[this.modelStackTop].get();
	},
  
  GetViewMatrix : function(){
		return this.view;
	},
  GetProjectionMatrix : function(){
		return this.projection;
	},
  GetOrthographicMatrix : function(){
		return this.orthographic;
	},
  SetViewMatrix : function(cam){
        this.view.lookAtRH(
            cam.position,
            cam.target,
            cam.up
        );
    },
  SetProjectionMatrix : function(ratio){
		this.projection = new ROOSTR.Matrix4().perspective(this.fov,ratio,1,3600);
	},
  SetOrthographicMatrix : function(left, right, top, bottom){
    this.orthographic = new ROOSTR.Matrix4().orthographic(left, right, top, bottom,0,1024);
  },
  SetFOV : function(fov){
    this.fov = fov;
  }/*,
	getProjectionMatrix : function(){
		return this.projection;	
	}*/
});

/*globalGLMatrixState = {
        modelMatrix : [ new Matrix(), new Matrix() ],
		nbModelMatrix : modelMatrix.length,
		viewMatrix : new Matrix(),
		//ROOSTR.C.viewportWidth / ROOSTR.C.viewportHeight
        projectionMatrix : new Matrix().perspective(45,992/558,1,2000),
        modelStackTop : 0
};

function modelMatrix() {
        return globalGLMatrixState.modelMatrix[globalGLMatrixState.modelStackTop];
}

function projectionMatrix() {
        return globalGLMatrixState.projectionMatrix;
}

function viewMatrix() {
        return globalGLMatrixState.viewMatrix;
}

function pushModelMatrix() {
        globalGLMatrixState.modelStackTop++;
 
        var top = globalGLMatrixState.modelMatrix[globalGLMatrixState.modelStackTop];
        var parent = globalGLMatrixState.modelMatrix[globalGLMatrixState.modelStackTop-1];

		top.copy(parent)
        return top;
}

function popModelMatrix() {
        globalGLMatrixState.modelStackTop--;
}*/


export { globalMatrix };
