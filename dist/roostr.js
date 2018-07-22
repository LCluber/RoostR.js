/** MIT License
* 
* Copyright (c) 2015 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://roostrjs.lcluber.com
*/

import { Matrix4x3, Matrix4x4, Vector3 } from 'type6js';
import { Dom, String } from 'weejs';
import { Logger } from 'mouettejs';

class SceneRenderer {
    constructor(context) {
        this.context = context;
        this.defaultSettings();
    }
    defaultSettings() {
        this.setDepthFunc('LEQUAL');
        this.enableDepthTest();
        this.disableBlendMode();
    }
    enable(capability) {
        this.context.enable(this.context[capability]);
    }
    disable(capability) {
        this.context.disable(this.context[capability]);
    }
    setDepthFunc(mode) {
        this.context.depthFunc(this.context[mode]);
    }
    setBlendFunction(sourceFactor, destinationFactor) {
        this.context.blendFunc(this.context[sourceFactor], this.context[destinationFactor]);
    }
    setBlendEquation(mode) {
        this.context.blendEquation(this.context[mode]);
    }
    enableDepthTest() {
        this.enable('DEPTH_TEST');
        this.context.depthMask(true);
    }
    disableDepthTest() {
        this.disable('DEPTH_TEST');
        this.context.depthMask(false);
    }
    enableBlendMode(equation, source, destination) {
        this.setBlendEquation(equation);
        this.setBlendFunction(source, destination);
        this.enable('BLEND');
    }
    disableBlendMode() {
        this.disable('BLEND');
    }
    getParameter(parameterName) {
        return this.context.getParameter(parameterName);
    }
}

class SceneGraph {
    constructor(context) {
        this.model = [new Matrix4x3()];
        this.model[0].identity();
        this.nbModel = this.model.length;
        this.modelStackTop = 0;
    }
    pushModelMatrix(modelMatrix) {
        this.modelStackTop++;
        if (this.modelStackTop === this.nbModel) {
            this.model.push(new Matrix4x3());
            this.nbModel++;
        }
        this.model[this.modelStackTop].copy(modelMatrix);
    }
    popModelMatrix() {
        this.modelStackTop--;
    }
    getWorldMatrix() {
        return this.model[this.modelStackTop];
    }
}

class Lights {
    constructor() {
        this.directionals = [];
        this.points = [];
        this.spots = [];
        this.nbDirectionals = 0;
        this.nbPoints = 0;
        this.nbSpots = 0;
        this.flatArrays = {
            position: [],
            diffuse: [],
            specular: [],
            constantAttenuation: [],
            linearAttenuation: [],
            quadraticAttenuation: [],
            cutoff: [],
            exponent: [],
            direction: [],
            type: []
        };
        this.types = ['spots', 'points', 'directionals'];
        this.nbTypes = 3;
    }
    addLight(light) {
        let type = light.type;
        this[type + 's'].push(light);
        this['nb' + String.ucfirst(type) + 's']++;
    }
    ClearFlatArrays() {
        for (var property in this.flatArrays) {
            if (this.flatArrays.hasOwnProperty(property)) {
                this.flatArrays[property].length = 0;
            }
        }
    }
    flatten() {
        this.ClearFlatArrays();
        for (var i = 0; i < this.nbTypes; i++) {
            var type = this.types[i];
            for (var j = 0; j < this['nb' + String.ucfirst(type)]; j++) {
                for (var property in this.flatArrays) {
                    if (this[type][j].hasOwnProperty(property) && this.flatArrays.hasOwnProperty(property)) {
                        var lightProperty = this[type][j][property];
                        var flatArraysProperty = this.flatArrays[property];
                        if (typeof lightProperty.toArray === 'function') {
                            flatArraysProperty.push.apply(flatArraysProperty, lightProperty.toArray());
                        }
                        else {
                            flatArraysProperty.push(lightProperty);
                        }
                    }
                }
            }
        }
        return this.flatArrays;
    }
    getFlatArray(property) {
        if (this.flatArrays.hasOwnProperty(property)) {
            return this.flatArrays[property];
        }
    }
}

class Scene {
    constructor(context) {
        this.meshes = [];
        this.nbMeshes = 0;
        this.lights = new Lights();
        this.context = context;
        this.renderer = new SceneRenderer(this.context);
        this.graph = new SceneGraph(context);
    }
    addMesh(mesh) {
        this.meshes.push(mesh);
        this.nbMeshes++;
    }
    addLight(light) {
        this.lights.addLight(light);
    }
    getLightsProperty(property) {
        return this.lights.getFlatArray(property);
    }
    enableBlendMode(equation, source, destination) {
        this.renderer.enableBlendMode(equation, source, destination);
    }
    disableBlendMode() {
        this.renderer.disableBlendMode();
    }
    getRendererBlendMode() {
        return this.renderer.getParameter(this.context.BLEND);
    }
    render(camera, time) {
        this.computeWorldMatrices();
        this.lights.flatten();
        this.disableBlendMode();
        for (let mesh of this.meshes) {
            mesh.render(camera.getProjectionMatrix(), camera.getViewMatrix(), this.lights.flatten(), time, false);
        }
        this.renderBlended(camera, time);
    }
    computeWorldMatrices() {
        for (let mesh of this.meshes) {
            mesh.computeWorldMatrix(this.graph);
        }
    }
    renderBlended(camera, time) {
        this.enableBlendMode('FUNC_ADD', 'SRC_ALPHA', 'ONE');
        for (let mesh of this.meshes) {
            mesh.render(camera.getProjectionMatrix(), camera.getViewMatrix(), this.lights.flatten(), time, true);
        }
    }
}

class Renderer {
    constructor(canvasID) {
        this.canvas = Dom.findById(canvasID);
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl", { alpha: false });
        this.defaultSettings();
    }
    defaultSettings() {
        this.context.getExtension('OES_standard_derivatives');
        this.setFrontFace('CW');
        this.enable('CULL_FACE');
        this.setCullFace('BACK');
        this.setViewport(this.context.drawingBufferWidth, this.context.drawingBufferHeight);
        this.setClearColor(0.0, 0.0, 0.0, 1.0);
    }
    setFrontFace(mode) {
        this.context.frontFace(this.context[mode]);
    }
    enable(capability) {
        this.context.enable(this.context[capability]);
    }
    disable(capability) {
        this.context.disable(this.context[capability]);
    }
    setCullFace(mode) {
        this.context.cullFace(this.context[mode]);
    }
    setViewport(width, height) {
        this.context.viewport(0, 0, width, height);
    }
    setClearColor(red, green, blue, alpha) {
        this.context.clearColor(red, green, blue, alpha);
    }
    clearFrame() {
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
    getContext() {
        return this.context;
    }
}

class Camera {
    constructor(position, target, up) {
        this.viewMatrix = new Matrix4x3();
        this.projectionMatrix = new Matrix4x4();
        this.position = position;
        this.target = target;
        this.up = up;
    }
    setViewMatrix() {
        this.viewMatrix.lookAtRH(this.position, this.target, this.up);
    }
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.setViewMatrix();
    }
    setTarget(x, y, z) {
        this.target.set(x, y, z);
        this.setViewMatrix();
    }
    setUp(x, y, z) {
        this.up.set(x, y, z);
        this.setViewMatrix();
    }
    getViewMatrix() {
        return this.viewMatrix.toArray();
    }
    getProjectionMatrix() {
        return this.projectionMatrix.toArray();
    }
}

class PerspectiveCamera extends Camera {
    constructor(fov, zNear, zFar, context) {
        super(new Vector3(), new Vector3(), new Vector3(0.0, 1.0, 0.0));
        this.fov = fov;
        this.ratio = 0;
        this.zNear = zNear;
        this.zFar = zFar;
        this.setProjectionMatrix(context.getParameter(context.VIEWPORT));
        super.setViewMatrix();
    }
    setProjectionMatrix(viewport) {
        this.ratio = viewport[2] / Math.max(1, viewport[3]);
        this.projectionMatrix.perspective(this.fov, this.ratio, this.zNear, this.zFar);
    }
}

class OrthographicCamera extends Camera {
    constructor(left, right, top, bottom, near, far) {
        super(new Vector3(), new Vector3(), new Vector3(0.0, 1.0, 0.0));
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.setProjectionMatrix();
        super.setViewMatrix();
    }
    setProjectionMatrix() {
        this.projectionMatrix.orthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
    }
}

class Shader {
    static create(context, str, type) {
        let shader = context.createShader(context[type]);
        context.shaderSource(shader, str);
        context.compileShader(shader);
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            Logger.error('shader creation failed : ' + context.getShaderInfoLog(shader));
        }
        return shader;
    }
}

class Program {
    static create(context, vertexShader, fragmentShader) {
        let program = context.createProgram();
        let vshader = Shader.create(context, vertexShader, 'VERTEX_SHADER');
        let fshader = Shader.create(context, fragmentShader, 'FRAGMENT_SHADER');
        context.attachShader(program, vshader);
        context.attachShader(program, fshader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            Logger.error('program creation failed : ' + context.getProgramInfoLog(program));
        }
        return program;
    }
}

class Texture {
    static create(img, context) {
        let webGLTexture = context.createTexture();
        context.bindTexture(context.TEXTURE_2D, WebGLTexture);
        context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, img);
        context.bindTexture(context.TEXTURE_2D, null);
        return webGLTexture;
    }
}

class Uniform {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class MeshRenderer {
    constructor(context) {
        this.context = context;
        this.defaultSettings();
    }
    defaultSettings() {
    }
    createBuffer(target, size, drawMethod) {
        let buffer = this.context.createBuffer();
        this.context.bindBuffer(this.context[target], buffer);
        this.context.bufferData(this.context[target], size, this.context[drawMethod]);
        return buffer;
    }
    useProgram(program) {
        this.context.useProgram(program);
    }
    bindBuffer(target, buffer) {
        this.context.bindBuffer(this.context[target], buffer);
    }
    vertexAttribPointer(index, size, type, normalized, stride, offset) {
        this.context.vertexAttribPointer(index, size, this.context[type], normalized, stride, offset);
    }
    drawElements(primitive, subMesh) {
        this.context.drawElements(this.context[primitive], subMesh.count, this.context.UNSIGNED_SHORT, subMesh.start * 2);
    }
    drawArrays(primitive, subMesh) {
        this.context.drawArrays(this.context[primitive], 0, subMesh.count);
    }
}

var eDrawMethod;
(function (eDrawMethod) {
    eDrawMethod["drawElements"] = "drawElements";
    eDrawMethod["drawArrays"] = "drawArrays";
})(eDrawMethod || (eDrawMethod = {}));

class Mesh {
    constructor(mesh, context) {
        this.vertices = mesh.vertices ? mesh.vertices : null;
        this.indices = mesh.indices ? mesh.indices : null;
        this.normals = mesh.normals ? mesh.normals : null;
        this.uvs = mesh.uvs ? mesh.uvs : null;
        this.itemSize = mesh.itemSize ? mesh.itemSize : null;
        this.subMeshes = mesh.subMeshes;
        this.nbSubMeshes = this.subMeshes.length;
        this.primitive = mesh.primitive ? mesh.primitive : null;
        this.customUniforms = {};
        this.context = context;
        this.renderer = new MeshRenderer(this.context);
        this.WebGLTexture = null;
        this.vertexBuffer = this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.vertices), 'STATIC_DRAW');
        this.indexBuffer = this.indices ? this.renderer.createBuffer('ELEMENT_ARRAY_BUFFER', new Uint16Array(this.indices), 'STATIC_DRAW') : null;
        this.normalBuffer = this.normals ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.normals), 'STATIC_DRAW') : null;
        this.texCoordBuffer = this.uvs ? this.renderer.createBuffer('ARRAY_BUFFER', new Float32Array(this.uvs), 'STATIC_DRAW') : null;
        this.modelMatrix = new Matrix4x3();
        this.rotationMatrix = new Matrix4x3();
        this.worldMatrix = new Matrix4x3();
        this.worldMatrix.identity();
        this.active = true;
        this.drawMethod = this.indices ? eDrawMethod.drawElements : eDrawMethod.drawArrays;
        this.programs = [];
        this.nbPrograms = 0;
        this.materials = [];
        this.children = [];
        this.blendMode = false;
        this.zOrder = 0;
    }
    setActive() {
        this.active = true;
    }
    setInactive() {
        this.active = false;
    }
    toggleActive() {
        this.active = !this.active;
        return this.active;
    }
    isActive() {
        return this.active;
    }
    addChild(mesh) {
        this.children.push(mesh);
    }
    addProgram(vertexShader, fragmentShader, material) {
        if (this.nbPrograms < this.nbSubMeshes) {
            this.programs.push(Program.create(this.context, vertexShader, fragmentShader));
            this.addMaterial(material);
            this.createProgram();
            return true;
        }
        return false;
    }
    addMaterial(material) {
        if (material && this.materials.length < this.nbSubMeshes) {
            this.materials.push(material);
            let materialUniforms = material.uniforms;
            for (let property in materialUniforms) {
                if (materialUniforms.hasOwnProperty(property)) {
                    this.addProgramUniform(property);
                }
            }
            return true;
        }
        return false;
    }
    setWorldMatrix(worldMatrix) {
        this.worldMatrix.copy(worldMatrix).multiply(this.modelMatrix);
    }
    setTexture(img) {
        this.WebGLTexture = Texture.create(img, this.context);
    }
    addCustomUniform(name, type, value) {
        if (!this.customUniforms.hasOwnProperty(name)) {
            this.customUniforms[name] = new Uniform(type, value);
        }
    }
    setCustomUniform(name, value) {
        if (this.customUniforms.hasOwnProperty(name)) {
            this.customUniforms[name].value = value;
        }
    }
    createProgram() {
        let program = this.programs[this.nbPrograms];
        this.addProgramAttribute('vertexPosition');
        if (this.normals) {
            this.addProgramAttribute('vertexNormal');
        }
        if (this.uvs && this.WebGLTexture) {
            this.addProgramAttribute('textureCoord');
        }
        this.addProgramUniform('modelMatrix');
        this.addProgramUniform('viewMatrix');
        this.addProgramUniform('projectionMatrix');
        this.addProgramUniform('time');
        this.addProgramUniform('screenResolution');
        for (let property in this.customUniforms) {
            if (this.customUniforms.hasOwnProperty(property)) {
                this.addProgramUniform(property);
            }
        }
        if (this.WebGLTexture) {
            this.addProgramUniform('sampler');
        }
        this.renderer.useProgram(program);
        let viewport = this.context.getParameter(this.context.VIEWPORT);
        this.context.uniform2f(program.screenResolution, viewport[2], viewport[3]);
        this.nbPrograms++;
    }
    addProgramAttribute(name) {
        this.programs[this.nbPrograms][name] = this.context.getAttribLocation(this.programs[this.nbPrograms], 'a' + String.ucfirst(name));
        this.context.enableVertexAttribArray(this.programs[this.nbPrograms][name]);
    }
    addProgramUniform(name) {
        this.programs[this.nbPrograms][name] = this.context.getUniformLocation(this.programs[this.nbPrograms], 'u' + String.ucfirst(name));
    }
    activateBlendMode() {
        this.blendMode = true;
    }
    deactivateBlendMode() {
        this.blendMode = false;
    }
    computeWorldMatrix(graph) {
        this.setWorldMatrix(graph.getWorldMatrix());
        graph.pushModelMatrix(this.worldMatrix);
        for (let child of this.children) {
            child.computeWorldMatrix(graph);
        }
        graph.popModelMatrix();
    }
    render(projectionMatrix, viewMatrix, lights, time, blendMode) {
        if (this.isActive()) {
            let program = null;
            for (let i = 0; i < this.nbSubMeshes; i++) {
                if (this.blendMode === blendMode) {
                    if (this.programs[i]) {
                        program = this.programs[i];
                    }
                    else {
                        program = this.programs[this.nbPrograms - 1];
                    }
                    this.renderer.useProgram(program);
                    if (this.materials[i]) {
                        let materialUniforms = this.materials[i].uniforms;
                        for (let property in materialUniforms) {
                            if (materialUniforms.hasOwnProperty(property)) {
                                let uniform = materialUniforms[property];
                                this.context[uniform.type](program[property], uniform.value);
                            }
                        }
                    }
                    if (this.indices) {
                        this.renderer.bindBuffer('ELEMENT_ARRAY_BUFFER', this.indexBuffer);
                    }
                    this.renderer.bindBuffer('ARRAY_BUFFER', this.vertexBuffer);
                    this.renderer.vertexAttribPointer(program.vertexPosition, this.itemSize, 'FLOAT', false, 0, 0);
                    if (this.normals) {
                        this.renderer.vertexAttribPointer(program.vertexNormal, this.itemSize, 'FLOAT', false, 0, 0);
                    }
                    if (this.uvs && this.WebGLTexture) {
                        this.renderer.bindBuffer('ARRAY_BUFFER', this.texCoordBuffer);
                        this.renderer.vertexAttribPointer(program.textureCoord, 2, 'FLOAT', false, 0, 0);
                    }
                    if (this.WebGLTexture) {
                        this.context.activeTexture(this.context.TEXTURE0);
                        this.context.bindTexture(this.context.TEXTURE_2D, this.WebGLTexture);
                        this.context.uniform1i(program.sampler, 0);
                    }
                    this.context.uniformMatrix4fv(program.modelMatrix, false, this.worldMatrix.toArray());
                    this.context.uniformMatrix4fv(program.projectionMatrix, false, projectionMatrix);
                    this.context.uniformMatrix4fv(program.viewMatrix, false, viewMatrix);
                    this.context.uniform1f(program.time, time);
                    for (let property in this.customUniforms) {
                        if (this.customUniforms.hasOwnProperty(property)) {
                            let uniform = this.customUniforms[property];
                            this.context[uniform.type](program[property], uniform.value);
                        }
                    }
                    this.renderer[this.drawMethod](this.primitive, this.subMeshes[i]);
                }
            }
            for (let child of this.children) {
                child.render(projectionMatrix, viewMatrix, lights, time, blendMode);
            }
        }
    }
}

class SubMesh {
    constructor(start, count) {
        this.start = start;
        this.count = count;
    }
}

class Line {
    constructor(vertices, thickness) {
        this.thickness = thickness ? thickness * 0.5 : 1.0;
        this.vertices = vertices;
        this.itemSize = 3;
        this.subMeshes = [
            new SubMesh(0, vertices.length / this.itemSize)
        ];
        this.primitive = 'LINE_STRIP';
    }
}

class FullscreenQuad {
    constructor() {
        this.vertices = [1.0, -1.0,
            -1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0
        ];
        this.uvs = [1.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        this.subMeshes = [
            new SubMesh(0, 4)
        ];
        this.itemSize = 2;
        this.primitive = 'TRIANGLE_STRIP';
    }
}

class Quad {
    constructor(width, height) {
        width = width ? width * 0.5 : 1.0;
        height = height ? height * 0.5 : 1.0;
        this.vertices = [width, -height, 0.0,
            -width, -height, 0.0,
            width, height, 0.0,
            -width, height, 0.0
        ];
        this.uvs = [1.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        this.subMeshes = [
            new SubMesh(0, 4)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLE_STRIP';
    }
}

class MultiQuad {
    constructor(width, height, quantity) {
        width = width ? width * 0.5 : 1.0;
        height = height ? height * 0.5 : 1.0;
        this.quad = {
            vertices: new Float32Array([width, -height, 0.0,
                -width, height, 0.0,
                -width, -height, 0.0,
                width, height, 0.0
            ]),
            indices: new Int32Array([0, 1, 2,
                0, 3, 1
            ]),
            uvs: new Float32Array([1.0, 0.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 1.0
            ])
        };
        this.vertices = [];
        this.indices = [];
        this.uvs = [];
        this.subMeshes = [
            new SubMesh(0, 4)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLE';
    }
    createQuads(length) {
        for (var i = 0; i < length; i++) {
            this.vertices.push.apply(this.vertices, this.quad.vertices);
            this.indices.push.apply(this.indices, this.createIndices(i));
            this.uvs.push.apply(this.uvs, this.quad.uvs);
        }
    }
    createIndices(quadIndex) {
        var indices = [];
        for (var i = 0; i < 6; i++) {
            indices.push(this.quad.indices[i] + quadIndex * 4);
        }
        return indices;
    }
}

class Cube {
    constructor(size) {
        size = size ? size * 0.5 : 1.0;
        this.vertices = [size, -size, -size,
            -size, -size, size,
            size, -size, size,
            -size, size, size,
            size, size, -size,
            size, size, size,
            -size, -size, -size,
            -size, size, -size
        ];
        this.indices = [0, 1, 2, 3, 4, 5,
            5, 0, 2, 4, 6, 0,
            6, 3, 1, 2, 3, 5,
            0, 6, 1, 3, 7, 4,
            5, 4, 0, 4, 7, 6,
            6, 7, 3, 2, 1, 3
        ];
        this.normals = [0.5773, -0.5773, -0.5773,
            -0.5773, -0.5773, 0.5773,
            0.5773, -0.5773, 0.5773,
            -0.5773, 0.5773, 0.5773,
            0.5773, 0.5773, -0.5773,
            0.5773, 0.5773, 0.5773,
            -0.5773, -0.5773, -0.5773,
            -0.5773, 0.5773, -0.5773
        ];
        this.subMeshes = [
            new SubMesh(0, 36)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
    }
}

class Sphere {
    constructor() {
        this.vertices = [-0.7071, -0.7071, 0, -0.5449, -0.8315, 0.1084, -0.5556, -0.8315, 0, -0.8315, 0.5556, 0, -0.9061, 0.3827, 0.1802, -0.9239, 0.3827, 0, -0.3753, -0.9239, 0.0747, -0.3827, -0.9239, 0, -0.9619, 0.1951, 0.1913, -0.9808, 0.1951, 0, -0.1913, -0.9808, 0.0381, -0.1951, -0.9808, 0, -0.9808, 0, 0.1951, -1, 0, 0, -0.1951, 0.9808, 0, 0, 1, 0, -0.1913, 0.9808, 0.0381, 0, -1, 0, -0.9619, -0.1951, 0.1913, -0.9808, -0.1951, 0, -0.3753, 0.9239, 0.0747, -0.3827, 0.9239, 0, -0.9239, -0.3827, 0, -0.9061, -0.3827, 0.1802, -0.5556, 0.8315, 0, -0.5449, 0.8315, 0.1084, -0.8155, -0.5556, 0.1622, -0.8315, -0.5556, 0, -0.6935, 0.7071, 0.1379, -0.7071, 0.7071, 0, -0.6935, -0.7071, 0.1379, -0.8155, 0.5556, 0.1622, -0.7682, -0.5556, 0.3182, -0.6533, -0.7071, 0.2706, -0.7682, 0.5556, 0.3182, -0.5133, -0.8315, 0.2126, -0.8536, 0.3827, 0.3536, -0.3536, -0.9239, 0.1464, -0.9061, 0.1951, 0.3753, -0.1802, -0.9808, 0.0747, -0.9239, 0, 0.3827, -0.1802, 0.9808, 0.0747, -0.9061, -0.1951, 0.3753, -0.3536, 0.9239, 0.1464, -0.8536, -0.3827, 0.3536, -0.5133, 0.8315, 0.2126, -0.6533, 0.7071, 0.2706, -0.1622, 0.9808, 0.1084, -0.1622, -0.9808, 0.1084, -0.8155, -0.1951, 0.5449, -0.3182, 0.9239, 0.2126, -0.7682, -0.3827, 0.5133, -0.4619, 0.8315, 0.3087, -0.6913, -0.5556, 0.4619, -0.5879, 0.7071, 0.3928, -0.5879, -0.7071, 0.3928, -0.6913, 0.5556, 0.4619, -0.4619, -0.8315, 0.3087, -0.7682, 0.3827, 0.5133, -0.3182, -0.9239, 0.2126, -0.8155, 0.1951, 0.5449, -0.8315, 0, 0.5556, -0.5879, 0.5556, 0.5879, -0.3928, -0.8315, 0.3928, -0.6533, 0.3827, 0.6533, -0.2706, -0.9239, 0.2706, -0.6935, 0.1951, 0.6935, -0.1379, -0.9808, 0.1379, -0.7071, 0, 0.7071, -0.1379, 0.9808, 0.1379, -0.6935, -0.1951, 0.6935, -0.2706, 0.9239, 0.2706, -0.6533, -0.3827, 0.6533, -0.3928, 0.8315, 0.3928, -0.5879, -0.5556, 0.5879, -0.5, 0.7071, 0.5, -0.5, -0.7071, 0.5, -0.5449, -0.1951, 0.8155, -0.2126, 0.9239, 0.3182, -0.5133, -0.3827, 0.7682, -0.3087, 0.8315, 0.4619, -0.4619, -0.5556, 0.6913, -0.3928, 0.7071, 0.5879, -0.3928, -0.7071, 0.5879, -0.4619, 0.5556, 0.6913, -0.3087, -0.8315, 0.4619, -0.5133, 0.3827, 0.7682, -0.2126, -0.9239, 0.3182, -0.5449, 0.1951, 0.8155, -0.1084, -0.9808, 0.1622, -0.5556, 0, 0.8315, -0.1084, 0.9808, 0.1622, -0.2126, -0.8315, 0.5133, -0.3536, 0.3827, 0.8536, -0.1464, -0.9239, 0.3536, -0.3753, 0.1951, 0.9061, -0.0747, -0.9808, 0.1802, -0.3827, 0, 0.9239, -0.0747, 0.9808, 0.1802, -0.3753, -0.1951, 0.9061, -0.1464, 0.9239, 0.3536, -0.3536, -0.3827, 0.8536, -0.2126, 0.8315, 0.5133, -0.3182, -0.5556, 0.7682, -0.2706, 0.7071, 0.6533, -0.2706, -0.7071, 0.6533, -0.3182, 0.5556, 0.7682, -0.1802, -0.3827, 0.9061, -0.1084, 0.8315, 0.5449, -0.1622, -0.5556, 0.8155, -0.1379, 0.7071, 0.6935, -0.1379, -0.7071, 0.6935, -0.1622, 0.5556, 0.8155, -0.1084, -0.8315, 0.5449, -0.1802, 0.3827, 0.9061, -0.0747, -0.9239, 0.3753, -0.1913, 0.1951, 0.9619, -0.0381, -0.9808, 0.1913, -0.1951, 0, 0.9808, -0.0381, 0.9808, 0.1913, -0.1913, -0.1951, 0.9619, -0.0747, 0.9239, 0.3753, 0, -0.8315, 0.5556, 0, -0.9239, 0.3827, 0, 0.3827, 0.9239, 0, 0.1951, 0.9808, 0, -0.9808, 0.1951, 0, 0, 1, 0, 0.9808, 0.1951, 0, -0.1951, 0.9808, 0, 0.9239, 0.3827, 0, -0.3827, 0.9239, 0, 0.8315, 0.5556, 0, -0.5556, 0.8315, 0, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, 0.5556, 0.8315, 0.1084, 0.8315, 0.5449, 0.1802, -0.3827, 0.9061, 0.1622, -0.5556, 0.8155, 0.138, 0.7071, 0.6935, 0.138, -0.7071, 0.6935, 0.1622, 0.5556, 0.8155, 0.1084, -0.8315, 0.5449, 0.1802, 0.3827, 0.9061, 0.0747, -0.9239, 0.3753, 0.1913, 0.1951, 0.9619, 0.0381, -0.9808, 0.1913, 0.1951, 0, 0.9808, 0.0381, 0.9808, 0.1913, 0.1913, -0.1951, 0.9619, 0.0747, 0.9239, 0.3753, 0.3536, 0.3827, 0.8536, 0.3753, 0.1951, 0.9061, 0.0747, -0.9808, 0.1802, 0.3827, 0, 0.9239, 0.0747, 0.9808, 0.1802, 0.3753, -0.1951, 0.9061, 0.1464, 0.9239, 0.3536, 0.3536, -0.3827, 0.8536, 0.2126, 0.8315, 0.5133, 0.3182, -0.5556, 0.7682, 0.2706, 0.7071, 0.6533, 0.2706, -0.7071, 0.6533, 0.3182, 0.5556, 0.7682, 0.2126, -0.8315, 0.5133, 0.1464, -0.9239, 0.3536, 0.5133, -0.3827, 0.7682, 0.4619, -0.5556, 0.6913, 0.3928, 0.7071, 0.5879, 0.3928, -0.7071, 0.5879, 0.4619, 0.5556, 0.6913, 0.3087, -0.8315, 0.4619, 0.5133, 0.3827, 0.7682, 0.2126, -0.9239, 0.3182, 0.5449, 0.1951, 0.8155, 0.1084, -0.9808, 0.1622, 0.5556, 0, 0.8315, 0.1084, 0.9808, 0.1622, 0.5449, -0.1951, 0.8155, 0.2126, 0.9239, 0.3182, 0.3087, 0.8315, 0.4619, 0.2706, -0.9239, 0.2706, 0.138, -0.9808, 0.1379, 0.7071, 0, 0.7071, 0.138, 0.9808, 0.1379, 0.6935, -0.1951, 0.6935, 0.2706, 0.9239, 0.2706, 0.6533, -0.3827, 0.6533, 0.3928, 0.8315, 0.3928, 0.5879, -0.5556, 0.5879, 0.5, 0.7071, 0.5, 0.5, -0.7071, 0.5, 0.5879, 0.5556, 0.5879, 0.3928, -0.8315, 0.3928, 0.6533, 0.3827, 0.6533, 0.6935, 0.1951, 0.6935, 0.4619, 0.8315, 0.3087, 0.5879, 0.7071, 0.3928, 0.5879, -0.7071, 0.3928, 0.6913, 0.5556, 0.4619, 0.4619, -0.8315, 0.3087, 0.7682, 0.3827, 0.5133, 0.3182, -0.9239, 0.2126, 0.8155, 0.1951, 0.5449, 0.1622, -0.9808, 0.1084, 0.8315, 0, 0.5556, 0.1622, 0.9808, 0.1084, 0.8155, -0.1951, 0.5449, 0.3182, 0.9239, 0.2126, 0.7682, -0.3827, 0.5133, 0.6913, -0.5556, 0.4619, 0.9239, 0, 0.3827, 0.1802, 0.9808, 0.0747, 0.1802, -0.9808, 0.0747, 0.9061, -0.1951, 0.3753, 0.3536, 0.9239, 0.1464, 0.8536, -0.3827, 0.3536, 0.5133, 0.8315, 0.2126, 0.7682, -0.5556, 0.3182, 0.6533, 0.7071, 0.2706, 0.6533, -0.7071, 0.2706, 0.7682, 0.5556, 0.3182, 0.5133, -0.8315, 0.2126, 0.8536, 0.3827, 0.3536, 0.3536, -0.9239, 0.1464, 0.9061, 0.1951, 0.3753, 0.6935, -0.7071, 0.1379, 0.8155, 0.5556, 0.1622, 0.5449, -0.8315, 0.1084, 0.9061, 0.3827, 0.1802, 0.3753, -0.9239, 0.0747, 0.9619, 0.1951, 0.1913, 0.1913, -0.9808, 0.0381, 0.9808, 0, 0.1951, 0.1913, 0.9808, 0.0381, 0.9619, -0.1951, 0.1913, 0.3753, 0.9239, 0.0747, 0.9061, -0.3827, 0.1802, 0.5449, 0.8315, 0.1084, 0.8155, -0.5556, 0.1622, 0.6935, 0.7071, 0.1379, 0.1951, -0.9808, 0, 0.9808, -0.1951, 0, 0.3827, 0.9239, 0, 0.9239, -0.3827, 0, 0.5556, 0.8315, 0, 0.8315, -0.5556, 0, 0.7071, 0.7071, 0, 0.7071, -0.7071, 0, 0.8315, 0.5556, 0, 0.5556, -0.8315, 0, 0.9239, 0.3827, 0, 0.3827, -0.9239, 0, 0.9808, 0.1951, 0, 1, 0, 0, 0.1951, 0.9808, 0, 0.5449, -0.8315, -0.1084, 0.9061, 0.3827, -0.1802, 0.3753, -0.9239, -0.0747, 0.9619, 0.1951, -0.1913, 0.1913, -0.9808, -0.0381, 0.9808, 0, -0.1951, 0.1913, 0.9808, -0.0381, 0.9619, -0.1951, -0.1913, 0.3753, 0.9239, -0.0747, 0.9061, -0.3827, -0.1802, 0.5449, 0.8315, -0.1084, 0.8155, -0.5556, -0.1622, 0.6935, 0.7071, -0.1379, 0.6935, -0.7071, -0.1379, 0.8155, 0.5556, -0.1622, 0.3536, 0.9239, -0.1464, 0.8536, -0.3827, -0.3536, 0.5133, 0.8315, -0.2126, 0.7682, -0.5556, -0.3182, 0.6533, 0.7071, -0.2706, 0.6533, -0.7071, -0.2706, 0.7682, 0.5556, -0.3182, 0.5133, -0.8315, -0.2126, 0.8536, 0.3827, -0.3536, 0.3536, -0.9239, -0.1464, 0.9061, 0.1951, -0.3753, 0.1802, -0.9808, -0.0747, 0.9239, 0, -0.3827, 0.1802, 0.9808, -0.0747, 0.9061, -0.1951, -0.3753, 0.7682, 0.3827, -0.5133, 0.3182, -0.9239, -0.2126, 0.8155, 0.1951, -0.5449, 0.1622, -0.9808, -0.1084, 0.8315, 0, -0.5556, 0.1622, 0.9808, -0.1084, 0.8155, -0.1951, -0.5449, 0.3182, 0.9239, -0.2126, 0.7682, -0.3827, -0.5133, 0.4619, 0.8315, -0.3087, 0.6913, -0.5556, -0.4619, 0.5879, 0.7071, -0.3928, 0.5879, -0.7071, -0.3928, 0.6913, 0.5556, -0.4619, 0.4619, -0.8315, -0.3087, 0.6533, -0.3827, -0.6533, 0.3928, 0.8315, -0.3928, 0.5879, -0.5556, -0.5879, 0.5, 0.7071, -0.5, 0.5, -0.7071, -0.5, 0.5879, 0.5556, -0.5879, 0.3928, -0.8315, -0.3928, 0.6533, 0.3827, -0.6533, 0.2706, -0.9239, -0.2706, 0.6935, 0.1951, -0.6935, 0.1379, -0.9808, -0.1379, 0.7071, 0, -0.7071, 0.138, 0.9808, -0.1379, 0.6935, -0.1951, -0.6935, 0.2706, 0.9239, -0.2706, 0.3087, -0.8315, -0.4619, 0.2126, -0.9239, -0.3182, 0.5133, 0.3827, -0.7682, 0.5449, 0.1951, -0.8155, 0.1084, -0.9808, -0.1622, 0.5556, 0, -0.8315, 0.1084, 0.9808, -0.1622, 0.5449, -0.1951, -0.8155, 0.2126, 0.9239, -0.3182, 0.5133, -0.3827, -0.7682, 0.3087, 0.8315, -0.4619, 0.4619, -0.5556, -0.6913, 0.3928, 0.7071, -0.5879, 0.3928, -0.7071, -0.5879, 0.4619, 0.5556, -0.6913, 0.2126, 0.8315, -0.5133, 0.3536, -0.3827, -0.8536, 0.3182, -0.5556, -0.7682, 0.2706, 0.7071, -0.6533, 0.2706, -0.7071, -0.6533, 0.3182, 0.5556, -0.7682, 0.2126, -0.8315, -0.5133, 0.3536, 0.3827, -0.8536, 0.1464, -0.9239, -0.3536, 0.3753, 0.1951, -0.9061, 0.0747, -0.9808, -0.1802, 0.3827, 0, -0.9239, 0.0747, 0.9808, -0.1802, 0.3753, -0.1951, -0.9061, 0.1464, 0.9239, -0.3536, 0.1802, 0.3827, -0.9061, 0.1913, 0.1951, -0.9619, 0.0381, -0.9808, -0.1913, 0.1951, 0, -0.9808, 0.0381, 0.9808, -0.1913, 0.1913, -0.1951, -0.9619, 0.0747, 0.9239, -0.3753, 0.1802, -0.3827, -0.9061, 0.1084, 0.8315, -0.5449, 0.1622, -0.5556, -0.8155, 0.1379, 0.7071, -0.6935, 0.1379, -0.7071, -0.6935, 0.1622, 0.5556, -0.8155, 0.1084, -0.8315, -0.5449, 0.0747, -0.9239, -0.3753, 0, -0.3827, -0.9239, 0, -0.5556, -0.8315, 0, 0.8315, -0.5556, 0, 0.7071, -0.7071, 0, -0.7071, -0.7071, 0, 0.5556, -0.8315, 0, -0.8315, -0.5556, 0, 0.3827, -0.9239, 0, -0.9239, -0.3827, 0, 0.1951, -0.9808, 0, -0.9808, -0.1951, 0, 0, -1, 0, 0.9808, -0.1951, 0, -0.1951, -0.9808, 0, 0.9239, -0.3827, -0.0381, -0.9808, -0.1913, -0.1951, 0, -0.9808, -0.0381, 0.9808, -0.1913, -0.1913, -0.1951, -0.9619, -0.0747, 0.9239, -0.3753, -0.1802, -0.3827, -0.9061, -0.1084, 0.8315, -0.5449, -0.1622, -0.5556, -0.8155, -0.1379, 0.7071, -0.6935, -0.1379, -0.7071, -0.6935, -0.1622, 0.5556, -0.8155, -0.1084, -0.8315, -0.5449, -0.1802, 0.3827, -0.9061, -0.0747, -0.9239, -0.3753, -0.1913, 0.1951, -0.9619, -0.2706, -0.7071, -0.6533, -0.3182, 0.5556, -0.7682, -0.2126, -0.8315, -0.5133, -0.3536, 0.3827, -0.8536, -0.1464, -0.9239, -0.3536, -0.3753, 0.1951, -0.9061, -0.0747, -0.9808, -0.1802, -0.3827, 0, -0.9239, -0.0747, 0.9808, -0.1802, -0.3753, -0.1951, -0.9061, -0.1464, 0.9239, -0.3536, -0.3536, -0.3827, -0.8536, -0.2126, 0.8315, -0.5133, -0.3182, -0.5556, -0.7682, -0.2706, 0.7071, -0.6533, -0.1084, 0.9808, -0.1622, -0.1084, -0.9808, -0.1622, -0.5556, 0, -0.8315, -0.5449, -0.1951, -0.8155, -0.2126, 0.9239, -0.3182, -0.5133, -0.3827, -0.7682, -0.3087, 0.8315, -0.4619, -0.4619, -0.5556, -0.6913, -0.3928, 0.7071, -0.5879, -0.3928, -0.7071, -0.5879, -0.4619, 0.5556, -0.6913, -0.3087, -0.8315, -0.4619, -0.5133, 0.3827, -0.7682, -0.2126, -0.9239, -0.3182, -0.5449, 0.1951, -0.8155, -0.5, 0.7071, -0.5, -0.5879, 0.5556, -0.5879, -0.3928, -0.8315, -0.3928, -0.6533, 0.3827, -0.6533, -0.2706, -0.9239, -0.2706, -0.6935, 0.1951, -0.6935, -0.1379, -0.9808, -0.1379, -0.7071, 0, -0.7071, -0.1379, 0.9808, -0.1379, -0.6935, -0.1951, -0.6935, -0.2706, 0.9239, -0.2706, -0.6533, -0.3827, -0.6533, -0.3928, 0.8315, -0.3928, -0.5879, -0.5556, -0.5879, -0.5, -0.7071, -0.5, -0.8155, -0.1951, -0.5449, -0.3182, 0.9239, -0.2126, -0.7682, -0.3827, -0.5133, -0.4619, 0.8315, -0.3087, -0.6913, -0.5556, -0.4619, -0.5879, 0.7071, -0.3928, -0.5879, -0.7071, -0.3928, -0.6913, 0.5556, -0.4619, -0.4619, -0.8315, -0.3087, -0.7682, 0.3827, -0.5133, -0.3182, -0.9239, -0.2126, -0.8155, 0.1951, -0.5449, -0.1622, -0.9808, -0.1084, -0.8315, 0, -0.5556, -0.1622, 0.9808, -0.1084, -0.5133, -0.8315, -0.2126, -0.8536, 0.3827, -0.3536, -0.3536, -0.9239, -0.1464, -0.9061, 0.1951, -0.3753, -0.1802, -0.9808, -0.0747, -0.9239, 0, -0.3827, -0.1802, 0.9808, -0.0747, -0.9061, -0.1951, -0.3753, -0.3536, 0.9239, -0.1464, -0.8536, -0.3827, -0.3536, -0.5133, 0.8315, -0.2126, -0.7682, -0.5556, -0.3182, -0.6533, 0.7071, -0.2706, -0.6533, -0.7071, -0.2706, -0.7682, 0.5556, -0.3182, -0.3753, 0.9239, -0.0747, -0.9061, -0.3827, -0.1802, -0.5449, 0.8315, -0.1084, -0.8155, -0.5556, -0.1622, -0.6935, 0.7071, -0.1379, -0.6935, -0.7071, -0.1379, -0.8155, 0.5556, -0.1622, -0.5449, -0.8315, -0.1084, -0.9061, 0.3827, -0.1802, -0.3753, -0.9239, -0.0747, -0.9619, 0.1951, -0.1913, -0.1913, -0.9808, -0.0381, -0.9808, 0, -0.1951, -0.1913, 0.9808, -0.0381, -0.9619, -0.1951, -0.1913
        ];
        this.indices = [0, 1, 2, 3, 4, 5, 2, 6, 7, 5, 8, 9, 7, 10, 11, 9, 12, 13, 14, 15, 16, 17, 11, 10, 13, 18, 19, 14, 20, 21, 22, 18, 23, 24, 20, 25, 22, 26, 27, 24, 28, 29, 0, 26, 30, 29, 31, 3, 30, 32, 33, 28, 34, 31, 30, 35, 1, 31, 36, 4, 1, 37, 6, 4, 38, 8, 6, 39, 10, 8, 40, 12, 16, 15, 41, 17, 10, 39, 18, 40, 42, 16, 43, 20, 23, 42, 44, 20, 45, 25, 23, 32, 26, 25, 46, 28, 41, 15, 47, 17, 39, 48, 40, 49, 42, 41, 50, 43, 42, 51, 44, 43, 52, 45, 32, 51, 53, 45, 54, 46, 33, 53, 55, 46, 56, 34, 33, 57, 35, 34, 58, 36, 35, 59, 37, 38, 58, 60, 37, 48, 39, 38, 61, 40, 54, 62, 56, 55, 63, 57, 56, 64, 58, 57, 65, 59, 58, 66, 60, 59, 67, 48, 61, 66, 68, 47, 15, 69, 17, 48, 67, 61, 70, 49, 47, 71, 50, 49, 72, 51, 50, 73, 52, 53, 72, 74, 52, 75, 54, 53, 76, 55, 68, 77, 70, 69, 78, 71, 70, 79, 72, 71, 80, 73, 74, 79, 81, 73, 82, 75, 74, 83, 76, 62, 82, 84, 63, 83, 85, 62, 86, 64, 65, 85, 87, 64, 88, 66, 65, 89, 67, 68, 88, 90, 69, 15, 91, 17, 67, 89, 83, 92, 85, 84, 93, 86, 87, 92, 94, 88, 93, 95, 87, 96, 89, 88, 97, 90, 91, 15, 98, 17, 89, 96, 90, 99, 77, 91, 100, 78, 77, 101, 79, 78, 102, 80, 81, 101, 103, 80, 104, 82, 83, 103, 105, 84, 104, 106, 99, 107, 101, 100, 108, 102, 103, 107, 109, 104, 108, 110, 105, 109, 111, 104, 112, 106, 105, 113, 92, 106, 114, 93, 92, 115, 94, 95, 114, 116, 96, 115, 117, 95, 118, 97, 98, 15, 119, 17, 96, 117, 97, 120, 99, 98, 121, 100, 115, 122, 123, 116, 124, 125, 117, 123, 126, 116, 127, 118, 119, 15, 128, 17, 117, 126, 120, 127, 129, 119, 130, 121, 120, 131, 107, 121, 132, 108, 109, 131, 133, 108, 134, 110, 109, 135, 111, 110, 136, 112, 113, 135, 122, 112, 124, 114, 130, 137, 132, 133, 138, 139, 132, 140, 134, 133, 141, 135, 136, 140, 142, 122, 141, 143, 136, 144, 124, 122, 145, 123, 125, 144, 146, 126, 145, 147, 125, 148, 127, 128, 15, 149, 17, 126, 147, 127, 150, 129, 130, 149, 151, 129, 138, 131, 146, 152, 153, 145, 154, 147, 146, 155, 148, 149, 15, 156, 17, 147, 154, 148, 157, 150, 149, 158, 151, 150, 159, 138, 137, 158, 160, 139, 159, 161, 137, 162, 140, 139, 163, 141, 140, 164, 142, 141, 165, 143, 142, 152, 144, 145, 165, 166, 161, 167, 168, 160, 169, 162, 161, 170, 163, 164, 169, 171, 165, 170, 172, 164, 173, 152, 165, 174, 166, 153, 173, 175, 166, 176, 154, 153, 177, 155, 156, 15, 178, 17, 154, 176, 157, 177, 179, 156, 180, 158, 157, 167, 159, 158, 181, 160, 176, 182, 183, 175, 184, 177, 178, 15, 185, 17, 176, 183, 177, 186, 179, 178, 187, 180, 179, 188, 167, 180, 189, 181, 167, 190, 168, 181, 191, 169, 168, 192, 170, 169, 193, 171, 172, 192, 194, 171, 195, 173, 172, 182, 174, 175, 195, 196, 191, 197, 198, 190, 199, 192, 193, 198, 200, 194, 199, 201, 193, 202, 195, 194, 203, 182, 196, 202, 204, 183, 203, 205, 196, 206, 184, 185, 15, 207, 17, 183, 205, 186, 206, 208, 185, 209, 187, 186, 210, 188, 187, 197, 189, 190, 210, 211, 204, 212, 206, 207, 15, 213, 17, 205, 214, 206, 215, 208, 207, 216, 209, 208, 217, 210, 197, 216, 218, 211, 217, 219, 197, 220, 198, 211, 221, 199, 198, 222, 200, 201, 221, 223, 200, 224, 202, 201, 225, 203, 204, 224, 226, 203, 214, 205, 219, 227, 221, 220, 228, 222, 221, 229, 223, 222, 230, 224, 223, 231, 225, 226, 230, 232, 214, 231, 233, 226, 234, 212, 213, 15, 235, 17, 214, 233, 212, 236, 215, 213, 237, 216, 215, 238, 217, 216, 239, 218, 219, 238, 240, 218, 241, 220, 17, 233, 242, 234, 243, 236, 235, 244, 237, 236, 245, 238, 239, 244, 246, 240, 245, 247, 241, 246, 248, 240, 249, 227, 241, 250, 228, 229, 249, 251, 228, 252, 230, 229, 253, 231, 232, 252, 254, 233, 253, 242, 232, 255, 234, 235, 15, 256, 249, 257, 251, 250, 258, 252, 251, 259, 253, 254, 258, 260, 253, 261, 242, 254, 262, 255, 256, 15, 263, 17, 242, 261, 255, 264, 243, 256, 265, 244, 243, 266, 245, 244, 267, 246, 247, 266, 268, 248, 267, 269, 247, 270, 249, 250, 269, 271, 263, 272, 265, 264, 273, 266, 265, 274, 267, 268, 273, 275, 269, 274, 276, 268, 277, 270, 271, 276, 278, 270, 279, 257, 271, 280, 258, 259, 279, 281, 260, 280, 282, 261, 281, 283, 260, 284, 262, 263, 15, 285, 17, 261, 283, 264, 284, 286, 278, 287, 280, 279, 288, 281, 282, 287, 289, 283, 288, 290, 282, 291, 284, 285, 15, 292, 17, 283, 290, 284, 293, 286, 285, 294, 272, 286, 295, 273, 272, 296, 274, 275, 295, 297, 274, 298, 276, 275, 299, 277, 278, 298, 300, 279, 299, 301, 293, 302, 295, 294, 303, 296, 297, 302, 304, 298, 303, 305, 297, 306, 299, 300, 305, 307, 299, 308, 301, 300, 309, 287, 301, 310, 288, 289, 309, 311, 288, 312, 290, 291, 311, 313, 292, 15, 314, 17, 290, 312, 291, 315, 293, 292, 316, 294, 310, 317, 318, 311, 319, 320, 310, 321, 312, 311, 322, 313, 314, 15, 323, 17, 312, 321, 313, 324, 315, 314, 325, 316, 315, 326, 302, 316, 327, 303, 304, 326, 328, 305, 327, 329, 304, 330, 306, 307, 329, 331, 306, 317, 308, 307, 319, 309, 325, 332, 327, 328, 333, 334, 329, 332, 335, 330, 334, 336, 331, 335, 337, 330, 338, 317, 331, 339, 319, 318, 338, 340, 320, 339, 341, 321, 340, 342, 320, 343, 322, 323, 15, 344, 17, 321, 342, 322, 345, 324, 323, 346, 325, 324, 333, 326, 341, 347, 348, 340, 349, 342, 341, 350, 343, 344, 15, 351, 17, 342, 349, 343, 352, 345, 346, 351, 353, 345, 354, 333, 346, 355, 332, 334, 354, 356, 335, 355, 357, 334, 358, 336, 337, 357, 359, 336, 360, 338, 337, 347, 339, 340, 360, 361, 356, 362, 363, 357, 364, 365, 356, 366, 358, 357, 367, 359, 360, 366, 368, 359, 369, 347, 361, 368, 370, 348, 369, 371, 361, 372, 349, 348, 373, 350, 351, 15, 374, 17, 349, 372, 352, 373, 375, 353, 374, 376, 352, 362, 354, 353, 364, 355, 370, 377, 372, 371, 378, 373, 374, 15, 379, 17, 372, 377, 375, 378, 380, 376, 379, 381, 375, 382, 362, 376, 383, 364, 363, 382, 384, 365, 383, 385, 363, 386, 366, 367, 385, 387, 366, 388, 368, 367, 389, 369, 370, 388, 390, 371, 389, 391, 384, 392, 386, 385, 393, 387, 386, 394, 388, 387, 395, 389, 390, 394, 396, 391, 395, 397, 390, 398, 377, 391, 399, 378, 379, 15, 400, 17, 377, 398, 378, 401, 380, 379, 402, 381, 380, 403, 382, 381, 404, 383, 384, 403, 405, 385, 404, 406, 400, 15, 407, 17, 398, 408, 401, 409, 410, 400, 411, 402, 401, 412, 403, 404, 411, 413, 405, 412, 414, 406, 413, 415, 405, 416, 392, 393, 415, 417, 392, 418, 394, 393, 419, 395, 396, 418, 420, 397, 419, 421, 396, 408, 398, 397, 409, 399, 417, 422, 423, 416, 424, 418, 417, 425, 419, 418, 426, 420, 421, 425, 427, 420, 428, 408, 421, 429, 409, 407, 15, 430, 17, 408, 428, 410, 429, 431, 407, 432, 411, 410, 433, 412, 411, 434, 413, 414, 433, 435, 413, 422, 415, 414, 436, 416, 429, 437, 431, 430, 438, 432, 431, 439, 433, 432, 440, 434, 435, 439, 441, 434, 442, 422, 435, 443, 436, 423, 442, 444, 424, 443, 445, 423, 446, 425, 424, 447, 426, 427, 446, 448, 426, 449, 428, 429, 448, 450, 430, 15, 451, 17, 428, 449, 443, 452, 445, 444, 453, 446, 445, 454, 447, 448, 453, 455, 447, 456, 449, 448, 457, 450, 451, 15, 458, 17, 449, 456, 450, 459, 437, 438, 458, 460, 437, 461, 439, 440, 460, 462, 441, 461, 463, 442, 462, 464, 441, 465, 443, 444, 464, 466, 458, 467, 460, 459, 468, 461, 460, 469, 462, 463, 468, 470, 462, 471, 464, 463, 472, 465, 466, 471, 473, 465, 474, 452, 466, 475, 453, 452, 476, 454, 455, 475, 477, 456, 476, 478, 455, 479, 457, 458, 15, 480, 17, 456, 478, 457, 481, 459, 475, 3, 5, 474, 7, 476, 477, 5, 9, 476, 11, 478, 479, 9, 13, 480, 15, 14, 17, 478, 11, 479, 19, 481, 467, 14, 21, 481, 22, 468, 469, 21, 24, 468, 27, 470, 471, 24, 29, 470, 0, 472, 473, 29, 3, 472, 2, 474, 0, 30, 1, 3, 31, 4, 2, 1, 6, 5, 4, 8, 7, 6, 10, 9, 8, 12, 13, 12, 18, 14, 16, 20, 22, 19, 18, 24, 21, 20, 22, 23, 26, 24, 25, 28, 0, 27, 26, 29, 28, 31, 30, 26, 32, 28, 46, 34, 30, 33, 35, 31, 34, 36, 1, 35, 37, 4, 36, 38, 6, 37, 39, 8, 38, 40, 18, 12, 40, 16, 41, 43, 23, 18, 42, 20, 43, 45, 23, 44, 32, 25, 45, 46, 40, 61, 49, 41, 47, 50, 42, 49, 51, 43, 50, 52, 32, 44, 51, 45, 52, 54, 33, 32, 53, 46, 54, 56, 33, 55, 57, 34, 56, 58, 35, 57, 59, 38, 36, 58, 37, 59, 48, 38, 60, 61, 54, 75, 62, 55, 76, 63, 56, 62, 64, 57, 63, 65, 58, 64, 66, 59, 65, 67, 61, 60, 66, 61, 68, 70, 47, 69, 71, 49, 70, 72, 50, 71, 73, 53, 51, 72, 52, 73, 75, 53, 74, 76, 68, 90, 77, 69, 91, 78, 70, 77, 79, 71, 78, 80, 74, 72, 79, 73, 80, 82, 74, 81, 83, 62, 75, 82, 63, 76, 83, 62, 84, 86, 65, 63, 85, 64, 86, 88, 65, 87, 89, 68, 66, 88, 83, 105, 92, 84, 106, 93, 87, 85, 92, 88, 86, 93, 87, 94, 96, 88, 95, 97, 90, 97, 99, 91, 98, 100, 77, 99, 101, 78, 100, 102, 81, 79, 101, 80, 102, 104, 83, 81, 103, 84, 82, 104, 99, 120, 107, 100, 121, 108, 103, 101, 107, 104, 102, 108, 105, 103, 109, 104, 110, 112, 105, 111, 113, 106, 112, 114, 92, 113, 115, 95, 93, 114, 96, 94, 115, 95, 116, 118, 97, 118, 120, 98, 119, 121, 115, 113, 122, 116, 114, 124, 117, 115, 123, 116, 125, 127, 120, 118, 127, 119, 128, 130, 120, 129, 131, 121, 130, 132, 109, 107, 131, 108, 132, 134, 109, 133, 135, 110, 134, 136, 113, 111, 135, 112, 136, 124, 130, 151, 137, 133, 131, 138, 132, 137, 140, 133, 139, 141, 136, 134, 140, 122, 135, 141, 136, 142, 144, 122, 143, 145, 125, 124, 144, 126, 123, 145, 125, 146, 148, 127, 148, 150, 130, 128, 149, 129, 150, 138, 146, 144, 152, 145, 166, 154, 146, 153, 155, 148, 155, 157, 149, 156, 158, 150, 157, 159, 137, 151, 158, 139, 138, 159, 137, 160, 162, 139, 161, 163, 140, 162, 164, 141, 163, 165, 142, 164, 152, 145, 143, 165, 161, 159, 167, 160, 181, 169, 161, 168, 170, 164, 162, 169, 165, 163, 170, 164, 171, 173, 165, 172, 174, 153, 152, 173, 166, 174, 176, 153, 175, 177, 157, 155, 177, 156, 178, 180, 157, 179, 167, 158, 180, 181, 176, 174, 182, 175, 196, 184, 177, 184, 186, 178, 185, 187, 179, 186, 188, 180, 187, 189, 167, 188, 190, 181, 189, 191, 168, 190, 192, 169, 191, 193, 172, 170, 192, 171, 193, 195, 172, 194, 182, 175, 173, 195, 191, 189, 197, 190, 211, 199, 193, 191, 198, 194, 192, 199, 193, 200, 202, 194, 201, 203, 196, 195, 202, 183, 182, 203, 196, 204, 206, 186, 184, 206, 185, 207, 209, 186, 208, 210, 187, 209, 197, 190, 188, 210, 204, 226, 212, 206, 212, 215, 207, 213, 216, 208, 215, 217, 197, 209, 216, 211, 210, 217, 197, 218, 220, 211, 219, 221, 198, 220, 222, 201, 199, 221, 200, 222, 224, 201, 223, 225, 204, 202, 224, 203, 225, 214, 219, 240, 227, 220, 241, 228, 221, 227, 229, 222, 228, 230, 223, 229, 231, 226, 224, 230, 214, 225, 231, 226, 232, 234, 212, 234, 236, 213, 235, 237, 215, 236, 238, 216, 237, 239, 219, 217, 238, 218, 239, 241, 234, 255, 243, 235, 256, 244, 236, 243, 245, 239, 237, 244, 240, 238, 245, 241, 239, 246, 240, 247, 249, 241, 248, 250, 229, 227, 249, 228, 250, 252, 229, 251, 253, 232, 230, 252, 233, 231, 253, 232, 254, 255, 249, 270, 257, 250, 271, 258, 251, 257, 259, 254, 252, 258, 253, 259, 261, 254, 260, 262, 255, 262, 264, 256, 263, 265, 243, 264, 266, 244, 265, 267, 247, 245, 266, 248, 246, 267, 247, 268, 270, 250, 248, 269, 263, 285, 272, 264, 286, 273, 265, 272, 274, 268, 266, 273, 269, 267, 274, 268, 275, 277, 271, 269, 276, 270, 277, 279, 271, 278, 280, 259, 257, 279, 260, 258, 280, 261, 259, 281, 260, 282, 284, 264, 262, 284, 278, 300, 287, 279, 301, 288, 282, 280, 287, 283, 281, 288, 282, 289, 291, 284, 291, 293, 285, 292, 294, 286, 293, 295, 272, 294, 296, 275, 273, 295, 274, 296, 298, 275, 297, 299, 278, 276, 298, 279, 277, 299, 293, 315, 302, 294, 316, 303, 297, 295, 302, 298, 296, 303, 297, 304, 306, 300, 298, 305, 299, 306, 308, 300, 307, 309, 301, 308, 310, 289, 287, 309, 288, 310, 312, 291, 289, 311, 291, 313, 315, 292, 314, 316, 310, 308, 317, 311, 309, 319, 310, 318, 321, 311, 320, 322, 313, 322, 324, 314, 323, 325, 315, 324, 326, 316, 325, 327, 304, 302, 326, 305, 303, 327, 304, 328, 330, 307, 305, 329, 306, 330, 317, 307, 331, 319, 325, 346, 332, 328, 326, 333, 329, 327, 332, 330, 328, 334, 331, 329, 335, 330, 336, 338, 331, 337, 339, 318, 317, 338, 320, 319, 339, 321, 318, 340, 320, 341, 343, 322, 343, 345, 323, 344, 346, 324, 345, 333, 341, 339, 347, 340, 361, 349, 341, 348, 350, 343, 350, 352, 346, 344, 351, 345, 352, 354, 346, 353, 355, 334, 333, 354, 335, 332, 355, 334, 356, 358, 337, 335, 357, 336, 358, 360, 337, 359, 347, 340, 338, 360, 356, 354, 362, 357, 355, 364, 356, 363, 366, 357, 365, 367, 360, 358, 366, 359, 367, 369, 361, 360, 368, 348, 347, 369, 361, 370, 372, 348, 371, 373, 352, 350, 373, 353, 351, 374, 352, 375, 362, 353, 376, 364, 370, 390, 377, 371, 391, 378, 375, 373, 378, 376, 374, 379, 375, 380, 382, 376, 381, 383, 363, 362, 382, 365, 364, 383, 363, 384, 386, 367, 365, 385, 366, 386, 388, 367, 387, 389, 370, 368, 388, 371, 369, 389, 384, 405, 392, 385, 406, 393, 386, 392, 394, 387, 393, 395, 390, 388, 394, 391, 389, 395, 390, 396, 398, 391, 397, 399, 378, 399, 401, 379, 400, 402, 380, 401, 403, 381, 402, 404, 384, 382, 403, 385, 383, 404, 401, 399, 409, 400, 407, 411, 401, 410, 412, 404, 402, 411, 405, 403, 412, 406, 404, 413, 405, 414, 416, 393, 406, 415, 392, 416, 418, 393, 417, 419, 396, 394, 418, 397, 395, 419, 396, 420, 408, 397, 421, 409, 417, 415, 422, 416, 436, 424, 417, 423, 425, 418, 424, 426, 421, 419, 425, 420, 426, 428, 421, 427, 429, 410, 409, 429, 407, 430, 432, 410, 431, 433, 411, 432, 434, 414, 412, 433, 413, 434, 422, 414, 435, 436, 429, 450, 437, 430, 451, 438, 431, 437, 439, 432, 438, 440, 435, 433, 439, 434, 440, 442, 435, 441, 443, 423, 422, 442, 424, 436, 443, 423, 444, 446, 424, 445, 447, 427, 425, 446, 426, 447, 449, 429, 427, 448, 443, 465, 452, 444, 466, 453, 445, 452, 454, 448, 446, 453, 447, 454, 456, 448, 455, 457, 450, 457, 459, 438, 451, 458, 437, 459, 461, 440, 438, 460, 441, 439, 461, 442, 440, 462, 441, 463, 465, 444, 442, 464, 458, 480, 467, 459, 481, 468, 460, 467, 469, 463, 461, 468, 462, 469, 471, 463, 470, 472, 466, 464, 471, 465, 472, 474, 466, 473, 475, 452, 474, 476, 455, 453, 475, 456, 454, 476, 455, 477, 479, 457, 479, 481, 475, 473, 3, 474, 2, 7, 477, 475, 5, 476, 7, 11, 479, 477, 9, 479, 13, 19, 467, 480, 14, 481, 19, 22, 469, 467, 21, 468, 22, 27, 471, 469, 24, 470, 27, 0, 473, 471, 29, 472, 0, 2
        ];
        this.normals = [-0.7101, -0.704, 0, -0.549, -0.8286, 0.1092, -0.5598, -0.8286, 0, -0.8333, 0.5528, 0, -0.907, 0.3805, 0.1804, -0.9247, 0.3805, 0, -0.3804, -0.9217, 0.0757, -0.3879, -0.9217, 0, -0.9622, 0.1939, 0.1914, -0.981, 0.1939, 0, -0.1971, -0.9796, 0.0392, -0.201, -0.9796, 0, -0.9808, 0, 0.1951, -1, 0, 0, -0.201, 0.9796, 0, 0, 1, 0, -0.1971, 0.9796, 0.0392, 0, -1, 0, -0.9622, -0.1939, 0.1914, -0.981, -0.1939, 0, -0.3804, 0.9217, 0.0757, -0.3879, 0.9217, 0, -0.9247, -0.3805, 0, -0.907, -0.3805, 0.1804, -0.5598, 0.8286, 0, -0.549, 0.8286, 0.1092, -0.8173, -0.5528, 0.1626, -0.8333, -0.5528, 0, -0.6965, 0.704, 0.1385, -0.7101, 0.704, 0, -0.6965, -0.704, 0.1385, -0.8173, 0.5528, 0.1626, -0.7699, -0.5528, 0.3189, -0.6561, -0.704, 0.2717, -0.7699, 0.5528, 0.3189, -0.5171, -0.8286, 0.2142, -0.8544, 0.3805, 0.3539, -0.3583, -0.9217, 0.1484, -0.9063, 0.1939, 0.3754, -0.1856, -0.9796, 0.0769, -0.9239, 0, 0.3827, -0.1856, 0.9796, 0.0769, -0.9063, -0.1939, 0.3754, -0.3583, 0.9217, 0.1484, -0.8544, -0.3805, 0.3539, -0.5171, 0.8286, 0.2142, -0.6561, 0.704, 0.2717, -0.1671, 0.9796, 0.1116, -0.1671, -0.9796, 0.1116, -0.8157, -0.1939, 0.545, -0.3225, 0.9217, 0.2155, -0.7689, -0.3805, 0.5137, -0.4654, 0.8286, 0.311, -0.6929, -0.5528, 0.463, -0.5904, 0.704, 0.3945, -0.5904, -0.704, 0.3945, -0.6929, 0.5528, 0.463, -0.4654, -0.8286, 0.311, -0.7689, 0.3805, 0.5137, -0.3225, -0.9217, 0.2155, -0.8157, 0.1939, 0.545, -0.8314, 0, 0.5556, -0.5893, 0.5528, 0.5893, -0.3958, -0.8286, 0.3958, -0.6539, 0.3805, 0.6539, -0.2743, -0.9217, 0.2743, -0.6937, 0.1939, 0.6937, -0.1421, -0.9796, 0.1421, -0.7071, 0, 0.7071, -0.1421, 0.9796, 0.1421, -0.6937, -0.1939, 0.6937, -0.2743, 0.9217, 0.2743, -0.6539, -0.3805, 0.6539, -0.3958, 0.8286, 0.3958, -0.5893, -0.5528, 0.5893, -0.5021, 0.704, 0.5021, -0.5021, -0.704, 0.5021, -0.545, -0.1939, 0.8157, -0.2155, 0.9217, 0.3225, -0.5137, -0.3805, 0.7689, -0.311, 0.8286, 0.4654, -0.463, -0.5528, 0.6929, -0.3945, 0.704, 0.5904, -0.3945, -0.704, 0.5904, -0.463, 0.5528, 0.6929, -0.311, -0.8286, 0.4654, -0.5137, 0.3805, 0.7689, -0.2155, -0.9217, 0.3225, -0.545, 0.1939, 0.8157, -0.1116, -0.9796, 0.1671, -0.5556, 0, 0.8314, -0.1116, 0.9796, 0.1671, -0.2142, -0.8286, 0.5171, -0.3539, 0.3805, 0.8544, -0.1484, -0.9217, 0.3583, -0.3754, 0.1939, 0.9063, -0.0769, -0.9796, 0.1856, -0.3827, 0, 0.9239, -0.0769, 0.9796, 0.1856, -0.3754, -0.1939, 0.9063, -0.1484, 0.9217, 0.3583, -0.3539, -0.3805, 0.8544, -0.2142, 0.8286, 0.5171, -0.3189, -0.5528, 0.7699, -0.2717, 0.704, 0.6561, -0.2717, -0.704, 0.6561, -0.3189, 0.5528, 0.7699, -0.1804, -0.3805, 0.907, -0.1092, 0.8286, 0.549, -0.1626, -0.5528, 0.8173, -0.1385, 0.704, 0.6965, -0.1385, -0.704, 0.6965, -0.1626, 0.5528, 0.8173, -0.1092, -0.8286, 0.549, -0.1804, 0.3805, 0.907, -0.0757, -0.9217, 0.3804, -0.1914, 0.1939, 0.9622, -0.0392, -0.9796, 0.1971, -0.1951, 0, 0.9808, -0.0392, 0.9796, 0.1971, -0.1914, -0.1939, 0.9622, -0.0757, 0.9217, 0.3804, 0, -0.8286, 0.5598, 0, -0.9217, 0.3879, 0, 0.3805, 0.9247, 0, 0.1939, 0.981, 0, -0.9796, 0.201, 0, 0, 1, 0, 0.9796, 0.201, 0, -0.1939, 0.981, 0, 0.9217, 0.3879, 0, -0.3805, 0.9247, 0, 0.8286, 0.5598, 0, -0.5528, 0.8333, 0, 0.704, 0.7101, 0, -0.704, 0.7101, 0, 0.5528, 0.8333, 0.1092, 0.8286, 0.549, 0.1804, -0.3805, 0.907, 0.1626, -0.5528, 0.8173, 0.1385, 0.704, 0.6965, 0.1385, -0.704, 0.6965, 0.1626, 0.5528, 0.8173, 0.1092, -0.8286, 0.549, 0.1804, 0.3805, 0.907, 0.0757, -0.9217, 0.3804, 0.1914, 0.1939, 0.9622, 0.0392, -0.9796, 0.1971, 0.1951, 0, 0.9808, 0.0392, 0.9796, 0.1971, 0.1914, -0.1939, 0.9622, 0.0757, 0.9217, 0.3804, 0.3539, 0.3805, 0.8544, 0.3754, 0.1939, 0.9063, 0.0769, -0.9796, 0.1856, 0.3827, 0, 0.9239, 0.0769, 0.9796, 0.1856, 0.3754, -0.1939, 0.9063, 0.1484, 0.9217, 0.3583, 0.3539, -0.3805, 0.8544, 0.2142, 0.8286, 0.5171, 0.3189, -0.5528, 0.7699, 0.2717, 0.704, 0.6561, 0.2717, -0.704, 0.6561, 0.3189, 0.5528, 0.7699, 0.2142, -0.8286, 0.5171, 0.1484, -0.9217, 0.3583, 0.5137, -0.3805, 0.7689, 0.463, -0.5528, 0.6929, 0.3945, 0.704, 0.5904, 0.3945, -0.704, 0.5904, 0.463, 0.5528, 0.6929, 0.311, -0.8286, 0.4654, 0.5137, 0.3805, 0.7689, 0.2155, -0.9217, 0.3225, 0.545, 0.1939, 0.8157, 0.1116, -0.9796, 0.1671, 0.5556, 0, 0.8314, 0.1116, 0.9796, 0.1671, 0.545, -0.1939, 0.8157, 0.2155, 0.9217, 0.3225, 0.311, 0.8286, 0.4654, 0.2743, -0.9217, 0.2743, 0.1421, -0.9796, 0.1421, 0.7071, 0, 0.7071, 0.1421, 0.9796, 0.1421, 0.6937, -0.1939, 0.6937, 0.2743, 0.9217, 0.2743, 0.6539, -0.3805, 0.6539, 0.3958, 0.8286, 0.3958, 0.5893, -0.5528, 0.5893, 0.5021, 0.704, 0.5021, 0.5021, -0.704, 0.5021, 0.5893, 0.5528, 0.5893, 0.3958, -0.8286, 0.3958, 0.6539, 0.3805, 0.6539, 0.6937, 0.1939, 0.6937, 0.4654, 0.8286, 0.311, 0.5904, 0.704, 0.3945, 0.5904, -0.704, 0.3945, 0.6929, 0.5528, 0.463, 0.4654, -0.8286, 0.311, 0.7689, 0.3805, 0.5137, 0.3225, -0.9217, 0.2155, 0.8157, 0.1939, 0.545, 0.1671, -0.9796, 0.1116, 0.8314, 0, 0.5556, 0.1671, 0.9796, 0.1116, 0.8157, -0.1939, 0.545, 0.3225, 0.9217, 0.2155, 0.7689, -0.3805, 0.5137, 0.6929, -0.5528, 0.463, 0.9239, 0, 0.3827, 0.1856, 0.9796, 0.0769, 0.1856, -0.9796, 0.0769, 0.9063, -0.1939, 0.3754, 0.3583, 0.9217, 0.1484, 0.8544, -0.3805, 0.3539, 0.5171, 0.8286, 0.2142, 0.7699, -0.5528, 0.3189, 0.6561, 0.704, 0.2717, 0.6561, -0.704, 0.2717, 0.7699, 0.5528, 0.3189, 0.5171, -0.8286, 0.2142, 0.8544, 0.3805, 0.3539, 0.3583, -0.9217, 0.1484, 0.9063, 0.1939, 0.3754, 0.6965, -0.704, 0.1385, 0.8173, 0.5528, 0.1626, 0.549, -0.8286, 0.1092, 0.907, 0.3805, 0.1804, 0.3804, -0.9217, 0.0757, 0.9622, 0.1939, 0.1914, 0.1971, -0.9796, 0.0392, 0.9808, 0, 0.1951, 0.1971, 0.9796, 0.0392, 0.9622, -0.1939, 0.1914, 0.3804, 0.9217, 0.0757, 0.907, -0.3805, 0.1804, 0.549, 0.8286, 0.1092, 0.8173, -0.5528, 0.1626, 0.6965, 0.704, 0.1385, 0.201, -0.9796, 0, 0.981, -0.1939, 0, 0.3879, 0.9217, 0, 0.9247, -0.3805, 0, 0.5598, 0.8286, 0, 0.8333, -0.5528, 0, 0.7101, 0.704, 0, 0.7101, -0.704, 0, 0.8333, 0.5528, 0, 0.5598, -0.8286, 0, 0.9247, 0.3805, 0, 0.3879, -0.9217, 0, 0.981, 0.1939, 0, 1, 0, 0, 0.201, 0.9796, 0, 0.549, -0.8286, -0.1092, 0.907, 0.3805, -0.1804, 0.3804, -0.9217, -0.0757, 0.9622, 0.1939, -0.1914, 0.1971, -0.9796, -0.0392, 0.9808, 0, -0.1951, 0.1971, 0.9796, -0.0392, 0.9622, -0.1939, -0.1914, 0.3804, 0.9217, -0.0757, 0.907, -0.3805, -0.1804, 0.549, 0.8286, -0.1092, 0.8173, -0.5528, -0.1626, 0.6965, 0.704, -0.1385, 0.6965, -0.704, -0.1385, 0.8173, 0.5528, -0.1626, 0.3583, 0.9217, -0.1484, 0.8544, -0.3805, -0.3539, 0.5171, 0.8286, -0.2142, 0.7699, -0.5528, -0.3189, 0.6561, 0.704, -0.2717, 0.6561, -0.704, -0.2717, 0.7699, 0.5528, -0.3189, 0.5171, -0.8286, -0.2142, 0.8544, 0.3805, -0.3539, 0.3583, -0.9217, -0.1484, 0.9063, 0.1939, -0.3754, 0.1856, -0.9796, -0.0769, 0.9239, 0, -0.3827, 0.1856, 0.9796, -0.0769, 0.9063, -0.1939, -0.3754, 0.7689, 0.3805, -0.5137, 0.3225, -0.9217, -0.2155, 0.8157, 0.1939, -0.545, 0.1671, -0.9796, -0.1116, 0.8314, 0, -0.5556, 0.1671, 0.9796, -0.1116, 0.8157, -0.1939, -0.545, 0.3225, 0.9217, -0.2155, 0.7689, -0.3805, -0.5137, 0.4654, 0.8286, -0.311, 0.6929, -0.5528, -0.463, 0.5904, 0.704, -0.3945, 0.5904, -0.704, -0.3945, 0.6929, 0.5528, -0.463, 0.4654, -0.8286, -0.311, 0.6539, -0.3805, -0.6539, 0.3958, 0.8286, -0.3958, 0.5893, -0.5528, -0.5893, 0.5021, 0.704, -0.5021, 0.5021, -0.704, -0.5021, 0.5893, 0.5528, -0.5893, 0.3958, -0.8286, -0.3958, 0.6539, 0.3805, -0.6539, 0.2743, -0.9217, -0.2743, 0.6937, 0.1939, -0.6937, 0.1421, -0.9796, -0.1421, 0.7071, 0, -0.7071, 0.1421, 0.9796, -0.1421, 0.6937, -0.1939, -0.6937, 0.2743, 0.9217, -0.2743, 0.311, -0.8286, -0.4654, 0.2155, -0.9217, -0.3225, 0.5137, 0.3805, -0.7689, 0.545, 0.1939, -0.8157, 0.1116, -0.9796, -0.1671, 0.5556, 0, -0.8314, 0.1116, 0.9796, -0.1671, 0.545, -0.1939, -0.8157, 0.2155, 0.9217, -0.3225, 0.5137, -0.3805, -0.7689, 0.311, 0.8286, -0.4654, 0.463, -0.5528, -0.6929, 0.3945, 0.704, -0.5904, 0.3945, -0.704, -0.5904, 0.463, 0.5528, -0.6929, 0.2142, 0.8286, -0.5171, 0.3539, -0.3805, -0.8544, 0.3189, -0.5528, -0.7699, 0.2717, 0.704, -0.6561, 0.2717, -0.704, -0.6561, 0.3189, 0.5528, -0.7699, 0.2142, -0.8286, -0.5171, 0.3539, 0.3805, -0.8544, 0.1484, -0.9217, -0.3583, 0.3754, 0.1939, -0.9063, 0.0769, -0.9796, -0.1856, 0.3827, 0, -0.9239, 0.0769, 0.9796, -0.1856, 0.3754, -0.1939, -0.9063, 0.1484, 0.9217, -0.3583, 0.1804, 0.3805, -0.907, 0.1914, 0.1939, -0.9622, 0.0392, -0.9796, -0.1971, 0.1951, 0, -0.9808, 0.0392, 0.9796, -0.1971, 0.1914, -0.1939, -0.9622, 0.0757, 0.9217, -0.3804, 0.1804, -0.3805, -0.907, 0.1092, 0.8286, -0.549, 0.1626, -0.5528, -0.8173, 0.1385, 0.704, -0.6965, 0.1385, -0.704, -0.6965, 0.1626, 0.5528, -0.8173, 0.1092, -0.8286, -0.549, 0.0757, -0.9217, -0.3804, 0, -0.3805, -0.9247, 0, -0.5528, -0.8333, 0, 0.8286, -0.5598, 0, 0.704, -0.7101, 0, -0.704, -0.7101, 0, 0.5528, -0.8333, 0, -0.8286, -0.5598, 0, 0.3805, -0.9247, 0, -0.9217, -0.3879, 0, 0.1939, -0.981, 0, -0.9796, -0.201, 0, 0, -1, 0, 0.9796, -0.201, 0, -0.1939, -0.981, 0, 0.9217, -0.3879, -0.0392, -0.9796, -0.1971, -0.1951, 0, -0.9808, -0.0392, 0.9796, -0.1971, -0.1914, -0.1939, -0.9622, -0.0757, 0.9217, -0.3804, -0.1804, -0.3805, -0.907, -0.1092, 0.8286, -0.549, -0.1626, -0.5528, -0.8173, -0.1385, 0.704, -0.6965, -0.1385, -0.704, -0.6965, -0.1626, 0.5528, -0.8173, -0.1092, -0.8286, -0.549, -0.1804, 0.3805, -0.907, -0.0757, -0.9217, -0.3804, -0.1914, 0.1939, -0.9622, -0.2717, -0.704, -0.6561, -0.3189, 0.5528, -0.7699, -0.2142, -0.8286, -0.5171, -0.3539, 0.3805, -0.8544, -0.1484, -0.9217, -0.3583, -0.3754, 0.1939, -0.9063, -0.0769, -0.9796, -0.1856, -0.3827, 0, -0.9239, -0.0769, 0.9796, -0.1856, -0.3754, -0.1939, -0.9063, -0.1484, 0.9217, -0.3583, -0.3539, -0.3805, -0.8544, -0.2142, 0.8286, -0.5171, -0.3189, -0.5528, -0.7699, -0.2717, 0.704, -0.6561, -0.1116, 0.9796, -0.1671, -0.1116, -0.9796, -0.1671, -0.5556, 0, -0.8314, -0.545, -0.1939, -0.8157, -0.2155, 0.9217, -0.3225, -0.5137, -0.3805, -0.7689, -0.311, 0.8286, -0.4654, -0.463, -0.5528, -0.6929, -0.3945, 0.704, -0.5904, -0.3945, -0.704, -0.5904, -0.463, 0.5528, -0.6929, -0.311, -0.8286, -0.4654, -0.5137, 0.3805, -0.7689, -0.2155, -0.9217, -0.3225, -0.545, 0.1939, -0.8157, -0.5021, 0.704, -0.5021, -0.5893, 0.5528, -0.5893, -0.3958, -0.8286, -0.3958, -0.6539, 0.3805, -0.6539, -0.2743, -0.9217, -0.2743, -0.6937, 0.1939, -0.6937, -0.1421, -0.9796, -0.1421, -0.7071, 0, -0.7071, -0.1421, 0.9796, -0.1421, -0.6937, -0.1939, -0.6937, -0.2743, 0.9217, -0.2743, -0.6539, -0.3805, -0.6539, -0.3958, 0.8286, -0.3958, -0.5893, -0.5528, -0.5893, -0.5021, -0.704, -0.5021, -0.8157, -0.1939, -0.545, -0.3225, 0.9217, -0.2155, -0.7689, -0.3805, -0.5137, -0.4654, 0.8286, -0.311, -0.6929, -0.5528, -0.463, -0.5904, 0.704, -0.3945, -0.5904, -0.704, -0.3945, -0.6929, 0.5528, -0.463, -0.4654, -0.8286, -0.311, -0.7689, 0.3805, -0.5137, -0.3225, -0.9217, -0.2155, -0.8157, 0.1939, -0.545, -0.1671, -0.9796, -0.1116, -0.8314, 0, -0.5556, -0.1671, 0.9796, -0.1116, -0.5171, -0.8286, -0.2142, -0.8544, 0.3805, -0.3539, -0.3583, -0.9217, -0.1484, -0.9063, 0.1939, -0.3754, -0.1856, -0.9796, -0.0769, -0.9239, 0, -0.3827, -0.1856, 0.9796, -0.0769, -0.9063, -0.1939, -0.3754, -0.3583, 0.9217, -0.1484, -0.8544, -0.3805, -0.3539, -0.5171, 0.8286, -0.2142, -0.7699, -0.5528, -0.3189, -0.6561, 0.704, -0.2717, -0.6561, -0.704, -0.2717, -0.7699, 0.5528, -0.3189, -0.3804, 0.9217, -0.0757, -0.907, -0.3805, -0.1804, -0.549, 0.8286, -0.1092, -0.8173, -0.5528, -0.1626, -0.6965, 0.704, -0.1385, -0.6965, -0.704, -0.1385, -0.8173, 0.5528, -0.1626, -0.549, -0.8286, -0.1092, -0.907, 0.3805, -0.1804, -0.3804, -0.9217, -0.0757, -0.9622, 0.1939, -0.1914, -0.1971, -0.9796, -0.0392, -0.9808, 0, -0.1951, -0.1971, 0.9796, -0.0392, -0.9622, -0.1939, -0.1914
        ];
        this.subMeshes = [
            new SubMesh(0, 2880)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
    }
}

class Hemisphere {
    constructor() {
        this.vertices = [-0.5556, -0.8315, 0, -0.3753, -0.9239, 0.0747, -0.3827, -0.9239, 0, -0.9239, 0.3827, 0, -0.9619, 0.1951, 0.1913, -0.9808, 0.1951, 0, -0.1913, -0.9808, 0.0381, -0.1951, -0.9808, 0, -0.9808, 0, 0.1951, -1, 0, 0, -0.1951, 0.9808, 0, 0, 1, 0, -0.1913, 0.9808, 0.0381, 0, -1, 0, -0.9619, -0.1951, 0.1913, -0.9808, -0.1951, 0, -0.3753, 0.9239, 0.0747, -0.3827, 0.9239, 0, -0.9239, -0.3827, 0, -0.9061, -0.3827, 0.1802, -0.5556, 0.8315, 0, -0.5449, 0.8315, 0.1084, -0.8155, -0.5556, 0.1622, -0.8315, -0.5556, 0, -0.6935, 0.7071, 0.1379, -0.7071, 0.7071, 0, -0.7071, -0.7071, 0, -0.6935, -0.7071, 0.1379, -0.8155, 0.5556, 0.1622, -0.8315, 0.5556, 0, -0.5449, -0.8315, 0.1084, -0.9061, 0.3827, 0.1802, -0.5133, -0.8315, 0.2126, -0.8536, 0.3827, 0.3536, -0.3536, -0.9239, 0.1464, -0.9061, 0.1951, 0.3753, -0.1802, -0.9808, 0.0747, -0.9239, 0, 0.3827, -0.1802, 0.9808, 0.0747, -0.9061, -0.1951, 0.3753, -0.3536, 0.9239, 0.1464, -0.8536, -0.3827, 0.3536, -0.5133, 0.8315, 0.2126, -0.7682, -0.5556, 0.3182, -0.6533, 0.7071, 0.2706, -0.6533, -0.7071, 0.2706, -0.7682, 0.5556, 0.3182, -0.3182, 0.9239, 0.2126, -0.7682, -0.3827, 0.5133, -0.4619, 0.8315, 0.3087, -0.6913, -0.5556, 0.4619, -0.5879, 0.7071, 0.3928, -0.5879, -0.7071, 0.3928, -0.6913, 0.5556, 0.4619, -0.4619, -0.8315, 0.3087, -0.7682, 0.3827, 0.5133, -0.3182, -0.9239, 0.2126, -0.8155, 0.1951, 0.5449, -0.1622, -0.9808, 0.1084, -0.8315, 0, 0.5556, -0.1622, 0.9808, 0.1084, -0.8155, -0.1951, 0.5449, -0.6533, 0.3827, 0.6533, -0.2706, -0.9239, 0.2706, -0.6935, 0.1951, 0.6935, -0.1379, -0.9808, 0.1379, -0.7071, 0, 0.7071, -0.1379, 0.9808, 0.1379, -0.6935, -0.1951, 0.6935, -0.2706, 0.9239, 0.2706, -0.6533, -0.3827, 0.6533, -0.3928, 0.8315, 0.3928, -0.5879, -0.5556, 0.5879, -0.5, 0.7071, 0.5, -0.5, -0.7071, 0.5, -0.5879, 0.5556, 0.5879, -0.3928, -0.8315, 0.3928, -0.5133, -0.3827, 0.7682, -0.3087, 0.8315, 0.4619, -0.4619, -0.5556, 0.6913, -0.3928, 0.7071, 0.5879, -0.3928, -0.7071, 0.5879, -0.4619, 0.5556, 0.6913, -0.3087, -0.8315, 0.4619, -0.5133, 0.3827, 0.7682, -0.2126, -0.9239, 0.3182, -0.5449, 0.1951, 0.8155, -0.1084, -0.9808, 0.1622, -0.5556, 0, 0.8315, -0.1084, 0.9808, 0.1622, -0.5449, -0.1951, 0.8155, -0.2126, 0.9239, 0.3182, -0.2126, -0.8315, 0.5133, -0.1464, -0.9239, 0.3536, -0.3536, 0.3827, 0.8536, -0.3753, 0.1951, 0.9061, -0.0747, -0.9808, 0.1802, -0.3827, 0, 0.9239, -0.0747, 0.9808, 0.1802, -0.3753, -0.1951, 0.9061, -0.1464, 0.9239, 0.3536, -0.3536, -0.3827, 0.8536, -0.2126, 0.8315, 0.5133, -0.3182, -0.5556, 0.7682, -0.2706, 0.7071, 0.6533, -0.2706, -0.7071, 0.6533, -0.3182, 0.5556, 0.7682, -0.1802, -0.3827, 0.9061, -0.1622, -0.5556, 0.8155, -0.1084, 0.8315, 0.5449, -0.1379, 0.7071, 0.6935, -0.1379, -0.7071, 0.6935, -0.1622, 0.5556, 0.8155, -0.1084, -0.8315, 0.5449, -0.1802, 0.3827, 0.9061, -0.0747, -0.9239, 0.3753, -0.1913, 0.1951, 0.9619, -0.0381, -0.9808, 0.1913, -0.1951, 0, 0.9808, -0.0381, 0.9808, 0.1913, -0.1913, -0.1951, 0.9619, -0.0747, 0.9239, 0.3753, 0, -0.9239, 0.3827, 0, -0.9808, 0.1951, 0, 0, 1, 0, 0.9808, 0.1951, 0, -0.1951, 0.9808, 0, 0.9239, 0.3827, 0, -0.3827, 0.9239, 0, 0.8315, 0.5556, 0, -0.5556, 0.8315, 0, 0.7071, 0.7071, 0, -0.7071, 0.7071, 0, 0.5556, 0.8315, 0, -0.8315, 0.5556, 0, 0.3827, 0.9239, 0, 0.1951, 0.9808, 0.138, 0.7071, 0.6935, 0.138, -0.7071, 0.6935, 0.1622, 0.5556, 0.8155, 0.1084, -0.8315, 0.5449, 0.1802, 0.3827, 0.9061, 0.0747, -0.9239, 0.3753, 0.1913, 0.1951, 0.9619, 0.0381, -0.9808, 0.1913, 0.1951, 0, 0.9808, 0.0381, 0.9808, 0.1913, 0.1913, -0.1951, 0.9619, 0.0747, 0.9239, 0.3753, 0.1802, -0.3827, 0.9061, 0.1084, 0.8315, 0.5449, 0.1622, -0.5556, 0.8155, 0.3827, 0, 0.9239, 0.0747, 0.9808, 0.1802, 0.0747, -0.9808, 0.1802, 0.3753, -0.1951, 0.9061, 0.1464, 0.9239, 0.3536, 0.3536, -0.3827, 0.8536, 0.2126, 0.8315, 0.5133, 0.3182, -0.5556, 0.7682, 0.2706, 0.7071, 0.6533, 0.2706, -0.7071, 0.6533, 0.3182, 0.5556, 0.7682, 0.2126, -0.8315, 0.5133, 0.3536, 0.3827, 0.8536, 0.1464, -0.9239, 0.3536, 0.3753, 0.1951, 0.9061, 0.3928, -0.7071, 0.5879, 0.3928, 0.7071, 0.5879, 0.4619, 0.5556, 0.6913, 0.3087, -0.8315, 0.4619, 0.5133, 0.3827, 0.7682, 0.2126, -0.9239, 0.3182, 0.5449, 0.1951, 0.8155, 0.1084, -0.9808, 0.1622, 0.5556, 0, 0.8315, 0.1084, 0.9808, 0.1622, 0.5449, -0.1951, 0.8155, 0.2126, 0.9239, 0.3182, 0.5133, -0.3827, 0.7682, 0.3087, 0.8315, 0.4619, 0.4619, -0.5556, 0.6913, 0.138, 0.9808, 0.1379, 0.138, -0.9808, 0.1379, 0.6935, -0.1951, 0.6935, 0.2706, 0.9239, 0.2706, 0.6533, -0.3827, 0.6533, 0.3928, 0.8315, 0.3928, 0.5879, -0.5556, 0.5879, 0.5, 0.7071, 0.5, 0.5, -0.7071, 0.5, 0.5879, 0.5556, 0.5879, 0.3928, -0.8315, 0.3928, 0.6533, 0.3827, 0.6533, 0.2706, -0.9239, 0.2706, 0.6935, 0.1951, 0.6935, 0.7071, 0, 0.7071, 0.5879, 0.7071, 0.3928, 0.6913, 0.5556, 0.4619, 0.5879, -0.7071, 0.3928, 0.4619, -0.8315, 0.3087, 0.7682, 0.3827, 0.5133, 0.3182, -0.9239, 0.2126, 0.8155, 0.1951, 0.5449, 0.1622, -0.9808, 0.1084, 0.8315, 0, 0.5556, 0.1622, 0.9808, 0.1084, 0.8155, -0.1951, 0.5449, 0.3182, 0.9239, 0.2126, 0.7682, -0.3827, 0.5133, 0.4619, 0.8315, 0.3087, 0.6913, -0.5556, 0.4619, 0.9061, -0.1951, 0.3753, 0.3536, 0.9239, 0.1464, 0.8536, -0.3827, 0.3536, 0.5133, 0.8315, 0.2126, 0.7682, -0.5556, 0.3182, 0.6533, 0.7071, 0.2706, 0.6533, -0.7071, 0.2706, 0.7682, 0.5556, 0.3182, 0.5133, -0.8315, 0.2126, 0.8536, 0.3827, 0.3536, 0.3536, -0.9239, 0.1464, 0.9061, 0.1951, 0.3753, 0.1802, -0.9808, 0.0747, 0.9239, 0, 0.3827, 0.1802, 0.9808, 0.0747, 0.5449, -0.8315, 0.1084, 0.9061, 0.3827, 0.1802, 0.3753, -0.9239, 0.0747, 0.9619, 0.1951, 0.1913, 0.1913, -0.9808, 0.0381, 0.9808, 0, 0.1951, 0.1913, 0.9808, 0.0381, 0.9619, -0.1951, 0.1913, 0.3753, 0.9239, 0.0747, 0.9061, -0.3827, 0.1802, 0.5449, 0.8315, 0.1084, 0.8155, -0.5556, 0.1622, 0.6935, 0.7071, 0.1379, 0.6935, -0.7071, 0.1379, 0.8155, 0.5556, 0.1622, 0.9239, -0.3827, 0, 0.3827, 0.9239, 0, 0.5556, 0.8315, 0, 0.8315, -0.5556, 0, 0.7071, 0.7071, 0, 0.7071, -0.7071, 0, 0.8315, 0.5556, 0, 0.5556, -0.8315, 0, 0.9239, 0.3827, 0, 0.3827, -0.9239, 0, 0.9808, 0.1951, 0, 0.1951, -0.9808, 0, 1, 0, 0, 0.1951, 0.9808, 0, 0.9808, -0.1951, 0
        ];
        this.indices = [0, 1, 2, 3, 4, 5, 2, 6, 7, 5, 8, 9, 10, 11, 12, 13, 7, 6, 9, 14, 15, 10, 16, 17, 18, 14, 19, 20, 16, 21, 18, 22, 23, 20, 24, 25, 26, 22, 27, 25, 28, 29, 26, 30, 0, 29, 31, 3, 27, 32, 30, 28, 33, 31, 30, 34, 1, 31, 35, 4, 1, 36, 6, 4, 37, 8, 12, 11, 38, 13, 6, 36, 14, 37, 39, 12, 40, 16, 19, 39, 41, 16, 42, 21, 19, 43, 22, 21, 44, 24, 27, 43, 45, 24, 46, 28, 38, 47, 40, 39, 48, 41, 40, 49, 42, 43, 48, 50, 42, 51, 44, 45, 50, 52, 44, 53, 46, 45, 54, 32, 46, 55, 33, 32, 56, 34, 35, 55, 57, 34, 58, 36, 35, 59, 37, 38, 11, 60, 13, 36, 58, 37, 61, 39, 53, 62, 55, 54, 63, 56, 55, 64, 57, 56, 65, 58, 59, 64, 66, 60, 11, 67, 13, 58, 65, 59, 68, 61, 60, 69, 47, 61, 70, 48, 47, 71, 49, 50, 70, 72, 49, 73, 51, 50, 74, 52, 51, 75, 53, 52, 76, 54, 68, 77, 70, 69, 78, 71, 72, 77, 79, 71, 80, 73, 72, 81, 74, 75, 80, 82, 76, 81, 83, 75, 84, 62, 63, 83, 85, 62, 86, 64, 63, 87, 65, 66, 86, 88, 67, 11, 89, 13, 65, 87, 66, 90, 68, 67, 91, 69, 85, 92, 93, 86, 94, 95, 85, 96, 87, 86, 97, 88, 89, 11, 98, 13, 87, 96, 88, 99, 90, 89, 100, 91, 90, 101, 77, 91, 102, 78, 79, 101, 103, 78, 104, 80, 81, 103, 105, 82, 104, 106, 81, 92, 83, 82, 94, 84, 103, 107, 108, 104, 109, 110, 105, 108, 111, 104, 112, 106, 105, 113, 92, 106, 114, 94, 92, 115, 93, 95, 114, 116, 96, 115, 117, 95, 118, 97, 98, 11, 119, 13, 96, 117, 97, 120, 99, 98, 121, 100, 99, 107, 101, 100, 109, 102, 117, 122, 123, 116, 124, 118, 119, 11, 125, 13, 117, 123, 120, 124, 126, 119, 127, 121, 120, 128, 107, 121, 129, 109, 108, 128, 130, 109, 131, 110, 108, 132, 111, 110, 133, 112, 113, 132, 134, 112, 135, 114, 115, 134, 122, 116, 135, 136, 129, 137, 131, 130, 138, 132, 133, 137, 139, 134, 138, 140, 133, 141, 135, 134, 142, 122, 136, 141, 143, 123, 142, 144, 136, 145, 124, 125, 11, 146, 13, 123, 144, 124, 147, 126, 127, 146, 148, 126, 149, 128, 127, 150, 129, 130, 149, 151, 143, 152, 145, 146, 11, 153, 13, 144, 154, 145, 155, 147, 146, 156, 148, 147, 157, 149, 150, 156, 158, 151, 157, 159, 150, 160, 137, 151, 161, 138, 137, 162, 139, 138, 163, 140, 139, 164, 141, 142, 163, 165, 143, 164, 166, 142, 154, 144, 159, 167, 161, 162, 168, 169, 163, 167, 170, 162, 171, 164, 163, 172, 165, 166, 171, 173, 165, 174, 154, 166, 175, 152, 153, 11, 176, 13, 154, 174, 155, 175, 177, 153, 178, 156, 155, 179, 157, 156, 180, 158, 159, 179, 181, 158, 168, 160, 176, 11, 182, 13, 174, 183, 175, 184, 177, 176, 185, 178, 177, 186, 179, 178, 187, 180, 179, 188, 181, 180, 189, 168, 181, 190, 167, 168, 191, 169, 170, 190, 192, 169, 193, 171, 170, 194, 172, 173, 193, 195, 174, 194, 183, 173, 196, 175, 191, 197, 198, 192, 199, 200, 191, 201, 193, 192, 202, 194, 195, 201, 203, 183, 202, 204, 195, 205, 196, 182, 11, 206, 13, 183, 204, 184, 205, 207, 182, 208, 185, 184, 209, 186, 185, 210, 187, 188, 209, 211, 189, 210, 197, 188, 199, 190, 205, 212, 207, 206, 213, 208, 207, 214, 209, 210, 213, 215, 211, 214, 216, 210, 217, 197, 211, 218, 199, 197, 219, 198, 200, 218, 220, 198, 221, 201, 200, 222, 202, 203, 221, 223, 202, 224, 204, 203, 225, 205, 206, 11, 226, 13, 204, 224, 218, 227, 220, 219, 228, 221, 220, 229, 222, 223, 228, 230, 224, 229, 231, 223, 232, 225, 226, 11, 233, 13, 224, 231, 225, 234, 212, 226, 235, 213, 212, 236, 214, 213, 237, 215, 216, 236, 238, 215, 239, 217, 216, 240, 218, 217, 241, 219, 234, 242, 236, 237, 243, 244, 238, 242, 245, 239, 244, 246, 238, 247, 240, 239, 248, 241, 227, 247, 249, 241, 250, 228, 227, 251, 229, 230, 250, 252, 231, 251, 253, 230, 254, 232, 233, 11, 255, 13, 231, 253, 232, 256, 234, 233, 243, 235, 0, 30, 1, 3, 31, 4, 2, 1, 6, 5, 4, 8, 9, 8, 14, 10, 12, 16, 18, 15, 14, 20, 17, 16, 18, 19, 22, 20, 21, 24, 26, 23, 22, 25, 24, 28, 26, 27, 30, 29, 28, 31, 27, 45, 32, 28, 46, 33, 30, 32, 34, 31, 33, 35, 1, 34, 36, 4, 35, 37, 14, 8, 37, 12, 38, 40, 19, 14, 39, 16, 40, 42, 19, 41, 43, 21, 42, 44, 27, 22, 43, 24, 44, 46, 38, 60, 47, 39, 61, 48, 40, 47, 49, 43, 41, 48, 42, 49, 51, 45, 43, 50, 44, 51, 53, 45, 52, 54, 46, 53, 55, 32, 54, 56, 35, 33, 55, 34, 56, 58, 35, 57, 59, 37, 59, 61, 53, 75, 62, 54, 76, 63, 55, 62, 64, 56, 63, 65, 59, 57, 64, 59, 66, 68, 60, 67, 69, 61, 68, 70, 47, 69, 71, 50, 48, 70, 49, 71, 73, 50, 72, 74, 51, 73, 75, 52, 74, 76, 68, 90, 77, 69, 91, 78, 72, 70, 77, 71, 78, 80, 72, 79, 81, 75, 73, 80, 76, 74, 81, 75, 82, 84, 63, 76, 83, 62, 84, 86, 63, 85, 87, 66, 64, 86, 66, 88, 90, 67, 89, 91, 85, 83, 92, 86, 84, 94, 85, 93, 96, 86, 95, 97, 88, 97, 99, 89, 98, 100, 90, 99, 101, 91, 100, 102, 79, 77, 101, 78, 102, 104, 81, 79, 103, 82, 80, 104, 81, 105, 92, 82, 106, 94, 103, 101, 107, 104, 102, 109, 105, 103, 108, 104, 110, 112, 105, 111, 113, 106, 112, 114, 92, 113, 115, 95, 94, 114, 96, 93, 115, 95, 116, 118, 97, 118, 120, 98, 119, 121, 99, 120, 107, 100, 121, 109, 117, 115, 122, 116, 136, 124, 120, 118, 124, 119, 125, 127, 120, 126, 128, 121, 127, 129, 108, 107, 128, 109, 129, 131, 108, 130, 132, 110, 131, 133, 113, 111, 132, 112, 133, 135, 115, 113, 134, 116, 114, 135, 129, 150, 137, 130, 151, 138, 133, 131, 137, 134, 132, 138, 133, 139, 141, 134, 140, 142, 136, 135, 141, 123, 122, 142, 136, 143, 145, 124, 145, 147, 127, 125, 146, 126, 147, 149, 127, 148, 150, 130, 128, 149, 143, 166, 152, 145, 152, 155, 146, 153, 156, 147, 155, 157, 150, 148, 156, 151, 149, 157, 150, 158, 160, 151, 159, 161, 137, 160, 162, 138, 161, 163, 139, 162, 164, 142, 140, 163, 143, 141, 164, 142, 165, 154, 159, 181, 167, 162, 160, 168, 163, 161, 167, 162, 169, 171, 163, 170, 172, 166, 164, 171, 165, 172, 174, 166, 173, 175, 155, 152, 175, 153, 176, 178, 155, 177, 179, 156, 178, 180, 159, 157, 179, 158, 180, 168, 175, 196, 184, 176, 182, 185, 177, 184, 186, 178, 185, 187, 179, 186, 188, 180, 187, 189, 181, 188, 190, 168, 189, 191, 170, 167, 190, 169, 191, 193, 170, 192, 194, 173, 171, 193, 174, 172, 194, 173, 195, 196, 191, 189, 197, 192, 190, 199, 191, 198, 201, 192, 200, 202, 195, 193, 201, 183, 194, 202, 195, 203, 205, 184, 196, 205, 182, 206, 208, 184, 207, 209, 185, 208, 210, 188, 186, 209, 189, 187, 210, 188, 211, 199, 205, 225, 212, 206, 226, 213, 207, 212, 214, 210, 208, 213, 211, 209, 214, 210, 215, 217, 211, 216, 218, 197, 217, 219, 200, 199, 218, 198, 219, 221, 200, 220, 222, 203, 201, 221, 202, 222, 224, 203, 223, 225, 218, 240, 227, 219, 241, 228, 220, 227, 229, 223, 221, 228, 224, 222, 229, 223, 230, 232, 225, 232, 234, 226, 233, 235, 212, 234, 236, 213, 235, 237, 216, 214, 236, 215, 237, 239, 216, 238, 240, 217, 239, 241, 234, 256, 242, 237, 235, 243, 238, 236, 242, 239, 237, 244, 238, 245, 247, 239, 246, 248, 227, 240, 247, 241, 248, 250, 227, 249, 251, 230, 228, 250, 231, 229, 251, 230, 252, 254, 232, 254, 256, 233, 255, 243
        ];
        this.normals = [-0.5589, -0.8274, 0.055, -0.3804, -0.9217, 0.0757, -0.3876, -0.921, 0.0381, -0.9209, 0.3789, 0.0907, -0.9622, 0.1939, 0.1914, -0.9764, 0.193, 0.0962, -0.1971, -0.9796, 0.0392, -0.2009, -0.9794, 0.0198, -0.9808, 0, 0.1951, -0.9952, 0, 0.098, -0.2009, 0.9794, 0.0198, 0, 0.998, 0.063, -0.1971, 0.9796, 0.0392, 0, -0.998, 0.063, -0.9622, -0.1939, 0.1914, -0.9764, -0.193, 0.0962, -0.3804, 0.9217, 0.0757, -0.3876, 0.921, 0.0381, -0.9209, -0.3789, 0.0907, -0.907, -0.3805, 0.1804, -0.5589, 0.8274, 0.055, -0.549, 0.8286, 0.1092, -0.8173, -0.5528, 0.1626, -0.8305, -0.5509, 0.0818, -0.6965, 0.704, 0.1385, -0.7084, 0.7023, 0.0698, -0.7084, -0.7023, 0.0698, -0.6965, -0.704, 0.1385, -0.8173, 0.5528, 0.1626, -0.8305, 0.5509, 0.0818, -0.549, -0.8286, 0.1092, -0.907, 0.3805, 0.1804, -0.5171, -0.8286, 0.2142, -0.8544, 0.3805, 0.3539, -0.3583, -0.9217, 0.1484, -0.9063, 0.1939, 0.3754, -0.1856, -0.9796, 0.0769, -0.9239, 0, 0.3827, -0.1856, 0.9796, 0.0769, -0.9063, -0.1939, 0.3754, -0.3583, 0.9217, 0.1484, -0.8544, -0.3805, 0.3539, -0.5171, 0.8286, 0.2142, -0.7699, -0.5528, 0.3189, -0.6561, 0.704, 0.2717, -0.6561, -0.704, 0.2717, -0.7699, 0.5528, 0.3189, -0.3225, 0.9217, 0.2155, -0.7689, -0.3805, 0.5137, -0.4654, 0.8286, 0.311, -0.6929, -0.5528, 0.463, -0.5904, 0.704, 0.3945, -0.5904, -0.704, 0.3945, -0.6929, 0.5528, 0.463, -0.4654, -0.8286, 0.311, -0.7689, 0.3805, 0.5137, -0.3225, -0.9217, 0.2155, -0.8157, 0.1939, 0.545, -0.1671, -0.9796, 0.1116, -0.8314, 0, 0.5556, -0.1671, 0.9796, 0.1116, -0.8157, -0.1939, 0.545, -0.6539, 0.3805, 0.6539, -0.2743, -0.9217, 0.2743, -0.6937, 0.1939, 0.6937, -0.1421, -0.9796, 0.1421, -0.7071, 0, 0.7071, -0.1421, 0.9796, 0.1421, -0.6937, -0.1939, 0.6937, -0.2743, 0.9217, 0.2743, -0.6539, -0.3805, 0.6539, -0.3958, 0.8286, 0.3958, -0.5893, -0.5528, 0.5893, -0.5021, 0.704, 0.5021, -0.5021, -0.704, 0.5021, -0.5893, 0.5528, 0.5893, -0.3958, -0.8286, 0.3958, -0.5137, -0.3805, 0.7689, -0.311, 0.8286, 0.4654, -0.463, -0.5528, 0.6929, -0.3945, 0.704, 0.5904, -0.3945, -0.704, 0.5904, -0.463, 0.5528, 0.6929, -0.311, -0.8286, 0.4654, -0.5137, 0.3805, 0.7689, -0.2155, -0.9217, 0.3225, -0.545, 0.1939, 0.8157, -0.1116, -0.9796, 0.1671, -0.5556, 0, 0.8314, -0.1116, 0.9796, 0.1671, -0.545, -0.1939, 0.8157, -0.2155, 0.9217, 0.3225, -0.2142, -0.8286, 0.5171, -0.1484, -0.9217, 0.3583, -0.3539, 0.3805, 0.8544, -0.3754, 0.1939, 0.9063, -0.0769, -0.9796, 0.1856, -0.3827, 0, 0.9239, -0.0769, 0.9796, 0.1856, -0.3754, -0.1939, 0.9063, -0.1484, 0.9217, 0.3583, -0.3539, -0.3805, 0.8544, -0.2142, 0.8286, 0.5171, -0.3189, -0.5528, 0.7699, -0.2717, 0.704, 0.6561, -0.2717, -0.704, 0.6561, -0.3189, 0.5528, 0.7699, -0.1804, -0.3805, 0.907, -0.1626, -0.5528, 0.8173, -0.1092, 0.8286, 0.549, -0.1385, 0.704, 0.6965, -0.1385, -0.704, 0.6965, -0.1626, 0.5528, 0.8173, -0.1092, -0.8286, 0.549, -0.1804, 0.3805, 0.907, -0.0757, -0.9217, 0.3804, -0.1914, 0.1939, 0.9622, -0.0392, -0.9796, 0.1971, -0.1951, 0, 0.9808, -0.0392, 0.9796, 0.1971, -0.1914, -0.1939, 0.9622, -0.0757, 0.9217, 0.3804, 0, -0.9217, 0.3879, 0, -0.9796, 0.201, 0, 0, 1, 0, 0.9796, 0.201, 0, -0.1939, 0.981, 0, 0.9217, 0.3879, 0, -0.3805, 0.9247, 0, 0.8286, 0.5598, 0, -0.5528, 0.8333, 0, 0.704, 0.7101, 0, -0.704, 0.7101, 0, 0.5528, 0.8333, 0, -0.8286, 0.5598, 0, 0.3805, 0.9247, 0, 0.1939, 0.981, 0.1385, 0.704, 0.6965, 0.1385, -0.704, 0.6965, 0.1626, 0.5528, 0.8173, 0.1092, -0.8286, 0.549, 0.1804, 0.3805, 0.907, 0.0757, -0.9217, 0.3804, 0.1914, 0.1939, 0.9622, 0.0392, -0.9796, 0.1971, 0.1951, 0, 0.9808, 0.0392, 0.9796, 0.1971, 0.1914, -0.1939, 0.9622, 0.0757, 0.9217, 0.3804, 0.1804, -0.3805, 0.907, 0.1092, 0.8286, 0.549, 0.1626, -0.5528, 0.8173, 0.3827, 0, 0.9239, 0.0769, 0.9796, 0.1856, 0.0769, -0.9796, 0.1856, 0.3754, -0.1939, 0.9063, 0.1484, 0.9217, 0.3583, 0.3539, -0.3805, 0.8544, 0.2142, 0.8286, 0.5171, 0.3189, -0.5528, 0.7699, 0.2717, 0.704, 0.6561, 0.2717, -0.704, 0.6561, 0.3189, 0.5528, 0.7699, 0.2142, -0.8286, 0.5171, 0.3539, 0.3805, 0.8544, 0.1484, -0.9217, 0.3583, 0.3754, 0.1939, 0.9063, 0.3945, -0.704, 0.5904, 0.3945, 0.704, 0.5904, 0.463, 0.5528, 0.6929, 0.311, -0.8286, 0.4654, 0.5137, 0.3805, 0.7689, 0.2155, -0.9217, 0.3225, 0.545, 0.1939, 0.8157, 0.1116, -0.9796, 0.1671, 0.5556, 0, 0.8314, 0.1116, 0.9796, 0.1671, 0.545, -0.1939, 0.8157, 0.2155, 0.9217, 0.3225, 0.5137, -0.3805, 0.7689, 0.311, 0.8286, 0.4654, 0.463, -0.5528, 0.6929, 0.1421, 0.9796, 0.1421, 0.1421, -0.9796, 0.1421, 0.6937, -0.1939, 0.6937, 0.2743, 0.9217, 0.2743, 0.6539, -0.3805, 0.6539, 0.3958, 0.8286, 0.3958, 0.5893, -0.5528, 0.5893, 0.5021, 0.704, 0.5021, 0.5021, -0.704, 0.5021, 0.5893, 0.5528, 0.5893, 0.3958, -0.8286, 0.3958, 0.6539, 0.3805, 0.6539, 0.2743, -0.9217, 0.2743, 0.6937, 0.1939, 0.6937, 0.7071, 0, 0.7071, 0.5904, 0.704, 0.3945, 0.6929, 0.5528, 0.463, 0.5904, -0.704, 0.3945, 0.4654, -0.8286, 0.311, 0.7689, 0.3805, 0.5137, 0.3225, -0.9217, 0.2155, 0.8157, 0.1939, 0.545, 0.1671, -0.9796, 0.1116, 0.8314, 0, 0.5556, 0.1671, 0.9796, 0.1116, 0.8157, -0.1939, 0.545, 0.3225, 0.9217, 0.2155, 0.7689, -0.3805, 0.5137, 0.4654, 0.8286, 0.311, 0.6929, -0.5528, 0.463, 0.9063, -0.1939, 0.3754, 0.3583, 0.9217, 0.1484, 0.8544, -0.3805, 0.3539, 0.5171, 0.8286, 0.2142, 0.7699, -0.5528, 0.3189, 0.6561, 0.704, 0.2717, 0.6561, -0.704, 0.2717, 0.7699, 0.5528, 0.3189, 0.5171, -0.8286, 0.2142, 0.8544, 0.3805, 0.3539, 0.3583, -0.9217, 0.1484, 0.9063, 0.1939, 0.3754, 0.1856, -0.9796, 0.0769, 0.9239, 0, 0.3827, 0.1856, 0.9796, 0.0769, 0.549, -0.8286, 0.1092, 0.907, 0.3805, 0.1804, 0.3804, -0.9217, 0.0757, 0.9622, 0.1939, 0.1914, 0.1971, -0.9796, 0.0392, 0.9808, 0, 0.1951, 0.1971, 0.9796, 0.0392, 0.9622, -0.1939, 0.1914, 0.3804, 0.9217, 0.0757, 0.907, -0.3805, 0.1804, 0.549, 0.8286, 0.1092, 0.8173, -0.5528, 0.1626, 0.6965, 0.704, 0.1385, 0.6965, -0.704, 0.1385, 0.8173, 0.5528, 0.1626, 0.9209, -0.3789, 0.0907, 0.3876, 0.921, 0.0381, 0.5589, 0.8274, 0.055, 0.8305, -0.5509, 0.0818, 0.7084, 0.7023, 0.0698, 0.7084, -0.7023, 0.0698, 0.8305, 0.5509, 0.0818, 0.5589, -0.8274, 0.055, 0.9209, 0.3789, 0.0907, 0.3876, -0.921, 0.0381, 0.9764, 0.193, 0.0962, 0.2009, -0.9794, 0.0198, 0.9952, 0, 0.098, 0.2009, 0.9794, 0.0198, 0.9764, -0.193, 0.0962
        ];
        this.subMeshes = [
            new SubMesh(0, 1440)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
    }
}

class VWing {
    constructor() {
        this.vertices = [0, 0, -7.3975, 0, -0.2707, 0, 1.4678, 0, 0, 0, 0.5653, 1.8374, 0, 1.4694, 0, 0, 1.553, -1.0874, 0, 0.7405, -5.3869, 2.3189, 0.251, 0, 1.4678, 0, 0, 1.6633, 2.6, 1.6982, 6.65, -0.8596, 3.1485, 2.3189, 0.251, 0, 1.9333, -0.2938, -1.9828, 1.4678, 0, 0, 2.3189, 0.251, 0, 1.4678, 0, 0, 1.4678, 0, 0, 1.6148, -0.4246, -2.7743, 1.9333, -0.2938, -1.9828, 1.4678, 0, 0, 1.6148, -0.4246, -2.7743, 1.6148, -0.4246, -2.7743, 1.9333, -0.2938, -1.9828, -1.4678, 0, 0, -2.3189, 0.251, 0, -1.6633, 2.6, 1.6982, -1.4678, 0, 0, -6.65, -0.8596, 3.1485, -1.9333, -0.2938, -1.9828, -2.3189, 0.251, 0, -1.4678, 0, 0, -2.3189, 0.251, 0, -1.4678, 0, 0, -1.4678, 0, 0, -1.6148, -0.4246, -2.7743, -1.9333, -0.2938, -1.9828, -1.6148, -0.4246, -2.7743, -1.4678, 0, 0, -1.6148, -0.4246, -2.7743, -1.9333, -0.2938, -1.9828, 0, -0.2707, 0, 0, 0.5653, 1.8374, 1.4678, 0, 0, 0, -0.2707, 0, -1.4678, 0, 0
        ];
        this.indices = [0, 1, 2, 2, 3, 4, 5, 2, 4, 6, 0, 2, 5, 6, 2, 7, 8, 9, 10, 11, 12, 10, 12, 13, 14, 10, 15, 16, 12, 17, 7, 9, 18, 9, 19, 20, 21, 22, 9, 0, 23, 1, 23, 4, 3, 5, 4, 23, 6, 23, 0, 5, 23, 6, 24, 25, 26, 27, 28, 29, 27, 30, 28, 31, 32, 27, 33, 34, 28, 24, 35, 25, 25, 36, 37, 38, 25, 39, 40, 41, 42, 43, 44, 41
        ];
        this.normals = [0, -0.1063, -0.9943, 0, -0.9819, 0.1891, 0.9233, -0.2975, 0.2427, 0, 0.0714, 0.9974, 0, 0.9697, 0.2443, 0, 0.9961, -0.088, 0, 0.9478, -0.3187, 0.553, 0.7911, 0.2613, -0.7402, -0.526, 0.4187, -0.0528, 0.7418, 0.6686, 0.7771, -0.1425, 0.6131, 0.553, 0.7911, 0.2613, 0.8324, -0.4718, -0.2906, -0.7402, -0.526, 0.4187, 0.553, 0.7911, 0.2613, -0.7402, -0.526, 0.4187, -0.7402, -0.526, 0.4187, -0.1135, -0.2998, -0.9472, 0.8324, -0.4718, -0.2906, -0.7402, -0.526, 0.4187, -0.1135, -0.2998, -0.9472, -0.1135, -0.2998, -0.9472, 0.8324, -0.4718, -0.2906, -0.9233, -0.2975, 0.2427, -0.553, 0.7911, 0.2613, 0.0528, 0.7418, 0.6686, 0.7402, -0.526, 0.4187, -0.7771, -0.1425, 0.6131, -0.8324, -0.4718, -0.2906, -0.553, 0.7911, 0.2613, 0.7402, -0.526, 0.4187, -0.553, 0.7911, 0.2613, 0.7402, -0.526, 0.4187, 0.7402, -0.526, 0.4187, 0.1135, -0.2998, -0.9472, -0.8324, -0.4718, -0.2906, 0.1135, -0.2998, -0.9472, 0.7402, -0.526, 0.4187, 0.1135, -0.2998, -0.9472, -0.8324, -0.4718, -0.2906, 0, -0.9819, 0.1891, 0, 0.0714, 0.9974, 0.9233, -0.2975, 0.2427, 0, -0.9819, 0.1891, -0.9233, -0.2975, 0.2427
        ];
        this.subMeshes = [
            new SubMesh(0, 78),
            new SubMesh(78, 6)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
    }
}

class Cannon {
    constructor() {
        this.vertices = [0, -0.4, 0.1885, 0.7, 0, -0.9849, 0, -0.4, -0.9849, 0, 0.4, -0.9849, 0.7, 0, 0.4525, 0, 0.4, 0.9293, 0, 0, -0.8408, 0, 0.4, -0.9849, 0, 0, 1.9525, 0, 0.4, 0.9293, 0.7, 0, 0.4525, 0, 0, -0.8408, 0, 0.3, -1.1203, 0.6, 0, -1.1203, 0, 0.11, -2.8486, 0.2351, 0, -3.0108, 0, -0.11, -3.0108, 0, -0.3, -1.1203, 0, 0, -0.8408, 0.7, 0, 0.4525, 0, -0.4, 0.1885, -0.7, 0, -0.9849, -0.7, 0, 0.4525, 0, 0.4, -0.9849, -0.7, 0, 0.4525, 0, 0.4, 0.9293, 0, 0, -0.8408, -0.6, 0, -1.1203, -0.2351, 0, -3.0108, 0, 0, -0.8408, -0.7, 0, 0.4525, 0, -0.4, 0.1885, 0.7, 0, 0.4525, -0.7, 0, 0.4525
        ];
        this.indices = [0, 1, 2, 3, 4, 5, 1, 6, 2, 1, 7, 6, 8, 9, 10, 11, 12, 13, 14, 13, 12, 15, 14, 16, 13, 17, 18, 19, 20, 8, 17, 13, 15, 15, 16, 17, 21, 0, 2, 22, 3, 5, 21, 2, 6, 21, 6, 23, 8, 24, 25, 26, 27, 12, 27, 14, 12, 28, 16, 14, 27, 29, 17, 30, 8, 31, 17, 28, 27, 28, 17, 16, 0, 32, 1, 3, 1, 4, 14, 15, 13, 21, 33, 0, 22, 21, 3, 27, 28, 14
        ];
        this.normals = [0, -0.9962, 0.0863, 0.7964, 0, -0.6047, 0, -0.7073, -0.7069, 0, 0.7073, -0.7069, 0.9834, -0.0314, 0.1787, 0, 0.973, 0.231, 0, 0, -1, 0, 0.7073, -0.7069, 0, -0.0518, 0.9987, 0, 0.973, 0.231, 0.9834, -0.0314, 0.1787, 0, 0, -1, 0, 0.9499, 0.3124, 0.9369, 0.0022, 0.3496, 0, 0.9436, -0.3311, 0.6731, 0.0686, -0.7363, 0, -0.5683, -0.8228, 0, -0.948, 0.3182, 0, 0, -1, 0.9834, -0.0314, 0.1787, 0, -0.9962, 0.0863, -0.7964, 0, -0.6047, -0.9834, -0.0314, 0.1787, 0, 0.7073, -0.7069, -0.9834, -0.0314, 0.1787, 0, 0.973, 0.231, 0, 0, -1, -0.9369, 0.0022, 0.3496, -0.6731, 0.0686, -0.7363, 0, 0, -1, -0.9834, -0.0314, 0.1787, 0, -0.9962, 0.0863, 0.9834, -0.0314, 0.1787, -0.9834, -0.0314, 0.1787
        ];
        this.subMeshes = [
            new SubMesh(0, 90)
        ];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
    }
}

class CustomMesh {
    constructor() {
        this.vertices = null;
        this.indices = null;
        this.normals = null;
        this.uvs = null;
        this.subMeshes = [];
        this.itemSize = 3;
        this.primitive = 'TRIANGLES';
        this.primitives = ['POINTS', 'LINE_STRIP', 'LINE_LOOP', 'LINES', 'TRIANGLE_STRIP', 'TRIANGLE_FAN', 'TRIANGLES'];
    }
    setVertices(array) {
        this.vertices = array.slice(0);
    }
    setIndices(array) {
        this.indices = array.slice(0);
    }
    setNormals(array) {
        this.normals = array.slice(0);
    }
    setUvs(array) {
        this.uvs = array.slice(0);
    }
    addSubMeshes(array) {
        for (var i = 0; i < array.length; i += 2) {
            this.addSubMesh(array[i], array[i + 1]);
        }
    }
    addSubMesh(start, count) {
        this.subMeshes.push(new SubMesh(start, count));
    }
    setItemSize(itemSize) {
        this.itemSize = itemSize;
    }
    setPrimitive(primitive) {
        for (var i = 0; i < this.primitives.length; i++) {
            if (this.primitives[i] === primitive) {
                this.primitive = primitive;
                return true;
            }
        }
        return false;
    }
}

class DirectionalLight {
    constructor() {
        this.position = new Vector3();
        this.diffuse = new Vector3(0.6, 0.6, 0.6);
        this.specular = new Vector3(0.8, 0.8, 0.8);
        this.type = 'directional';
    }
    setPosition(x, y, z) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }
    setDiffuse(x, y, z) {
        this.diffuse.x = x;
        this.diffuse.y = y;
        this.diffuse.z = z;
    }
    setSpecular(x, y, z) {
        this.specular.x = x;
        this.specular.y = y;
        this.specular.z = z;
    }
}

class PointLight extends DirectionalLight {
    constructor() {
        super();
        this.constantAttenuation = 0;
        this.linearAttenuation = 1.0;
        this.quadraticAttenuation = 0;
        this.type = 'point';
    }
    setConstantAttenuation() {
    }
    setLinearAttenuation() {
    }
    setQuadraticAttenuation() {
    }
}

class SpotLight extends PointLight {
    constructor() {
        super();
        this.cutoff = 180;
        this.exponent = 0;
        this.direction = new Vector3(1.0, 0.0, 0.0);
        this.type = 'spot';
    }
    setCutoff() {
    }
    setExponent() {
    }
    setDirection() {
    }
}

class Material {
    constructor() {
        this.ambient = new Vector3(0.5, 0.5, 0.5);
        this.diffuse = new Vector3(0.6, 0.6, 0.6);
        this.specular = new Vector3(0.8, 0.8, 0.8);
        this.shininess = 8.0;
        this.uniforms = {
            materialAmbient: new Uniform('uniform3fv', this.ambient.toArray()),
            materialDiffuse: new Uniform('uniform3fv', this.diffuse.toArray()),
            materialSpecular: new Uniform('uniform3fv', this.specular.toArray()),
            materialShininess: new Uniform('uniform1f', this.shininess)
        };
    }
}

export { Scene, Renderer, PerspectiveCamera, OrthographicCamera, Mesh, Line, FullscreenQuad, Quad, MultiQuad, Cube, Sphere, Hemisphere, VWing, Cannon, CustomMesh, Texture, DirectionalLight, PointLight, SpotLight, Material };
