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

(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.ROOSTR = global.ROOSTR || {});
})(this, function(exports) {
    "use strict";
    function findById(id) {
        return document.getElementById(id);
    }
    function RendererTarget(canvasID) {
        this.canvas = findById(canvasID);
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl", {
            alpha: false
        });
        this.context.getExtension("OES_standard_derivatives");
        this.setFrontFace("CW");
        this.enable("CULL_FACE");
        this.setCullFace("BACK");
        this.setDepthFunc("LEQUAL");
        this.enableDepthTest();
        this.setViewport(this.context.drawingBufferWidth, this.context.drawingBufferHeight);
        this.setClearColor(0, 0, 0, 1);
    }
    Object.assign(RendererTarget.prototype, {
        setFrontFace: function(mode) {
            this.context.frontFace(this.context[mode]);
        },
        enable: function(capability) {
            this.context.enable(this.context[capability]);
        },
        disable: function(capability) {
            this.context.disable(this.context[capability]);
        },
        setCullFace: function(mode) {
            this.context.cullFace(this.context[mode]);
        },
        setDepthFunc: function(mode) {
            this.context.depthFunc(this.context[mode]);
        },
        setBlendFunction: function(sourceFactor, destinationFactor) {
            this.context.blendFunc(this.context[sourceFactor], this.context[destinationFactor]);
        },
        setBlendEquation: function(mode) {
            this.context.blendEquation(this.context[mode]);
        },
        setViewport: function(width, height) {
            this.context.viewport(0, 0, width, height);
        },
        setClearColor: function(red, green, blue, alpha) {
            this.context.clearColor(red, green, blue, alpha);
        },
        clearFrame: function() {
            this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        },
        getContext: function() {
            return this.context;
        },
        enableDepthTest: function() {
            this.enable("DEPTH_TEST");
            this.context.depthMask(true);
        },
        disableDepthTest: function() {
            this.disable("DEPTH_TEST");
            this.context.depthMask(false);
        },
        enableBlendMode: function(equation, source, destination) {
            this.setBlendEquation(equation);
            this.setBlendFunction(source, destination);
            this.enable("BLEND");
        },
        disableBlendMode: function() {
            this.disable("BLEND");
        }
    });
    function Scene(canvasID) {
        this.rendererTarget = new RendererTarget(canvasID);
        this.context = this.rendererTarget.getContext();
        this.objects = [];
        this.nbObjects = 0;
    }
    Object.assign(Scene.prototype, {
        add: function(object) {
            this.objects.push(object);
            this.nbObjects++;
        },
        clear: function() {
            this.objects = [];
            this.nbObjects = 0;
        },
        render: function(camera, time) {
            for (var i = 0; i < this.nbObjects; i++) {
                this.objects[i].render(camera, time);
            }
        },
        clearFrame: function() {
            this.rendererTarget.clearFrame();
        },
        getContext: function() {
            return this.rendererTarget.getContext();
        }
    });
    function WebGLRenderer(context) {
        this.context = context;
    }
    Object.assign(WebGLRenderer.prototype, {
        createBuffer: function(target, arrayData, drawMethod) {
            var buffer = this.context.createBuffer();
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
        vertexAttribPointer: function(index, size, type, normalized, stride, offset) {
            this.context.vertexAttribPointer(index, size, this.context[type], normalized, stride, offset);
        },
        sendDefaultUniforms: function(program, time) {
            this.context.uniform1f(program.uTime, time);
        },
        sendTexture: function(program, texture) {
            this.context.activeTexture(this.context.TEXTURE0);
            this.context.bindTexture(this.context.TEXTURE_2D, texture);
            this.context.uniform1i(program.uSampler, 0);
        },
        drawElements: function(program, numItems, time, texture) {
            this.sendDefaultUniforms(program, time);
            if (texture) {
                this.sendTexture(program, texture);
            }
            this.context.drawElements(this.context.TRIANGLES, numItems, this.context.UNSIGNED_SHORT, 0);
        },
        drawArrays: function(program, numItems, time, texture) {
            this.sendDefaultUniforms(program, time);
            if (texture) {
                this.sendTexture(program, texture);
            }
            this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, numItems);
        }
    });
    function Camera(position, target, up) {
        this.viewMatrix = TYPE6.Matrix4x3.create();
        this.projectionMatrix = TYPE6.Matrix4x4.create();
        this.position = position;
        this.target = target;
        this.up = up;
    }
    Object.assign(Camera.prototype, {
        setPosition: function(vector3) {
            this.position.setX(vector3.getX());
            this.position.setY(vector3.getY());
            this.position.setZ(vector3.getZ());
        },
        setTarget: function(vector3) {
            this.target.setX(vector3.getX());
            this.target.setY(vector3.getY());
            this.target.setZ(vector3.getZ());
        },
        setUp: function(vector3) {
            this.up.setX(vector3.getX());
            this.up.setY(vector3.getY());
            this.up.setZ(vector3.getZ());
        },
        setViewMatrix: function() {
            this.viewMatrix.lookAtRH(this.position, this.target, this.up);
        },
        getViewMatrix: function() {
            return this.viewMatrix.toArray();
        },
        getProjectionMatrix: function() {
            return this.projectionMatrix.toArray();
        }
    });
    function PerspectiveCamera(fov, zNear, zFar, context) {
        this.fov = fov;
        this.ratio = 0;
        this.zNear = zNear;
        this.zFar = zFar;
        this.context = context;
        this.camera = new Camera(TYPE6.Vector3.create(), TYPE6.Vector3.create(), TYPE6.Vector3.create(0, 1, 0));
        this.setProjectionMatrix();
    }
    Object.assign(PerspectiveCamera.prototype, {
        setProjectionMatrix: function() {
            var viewport = this.context.getParameter(this.context.VIEWPORT);
            this.ratio = viewport[2] / Math.max(1, viewport[3]);
            this.camera.projectionMatrix.perspective(this.fov, this.ratio, this.zNear, this.zFar);
            this.camera.setViewMatrix();
        },
        setPosition: function(vector3) {
            this.camera.setPosition(vector3);
            this.camera.setViewMatrix();
        },
        setTarget: function(vector3) {
            this.camera.setTarget(vector3);
            this.camera.setViewMatrix();
        },
        setUp: function(vector3) {
            this.camera.setUp(vector3);
            this.camera.setViewMatrix();
        },
        getViewMatrix: function() {
            return this.camera.getViewMatrix();
        },
        getProjectionMatrix: function() {
            return this.camera.getProjectionMatrix();
        }
    });
    function OrthographicCamera(left, right, top, bottom, near, far) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.near = near;
        this.far = far;
        this.camera = new Camera(TYPE6.Vector3.create(), TYPE6.Vector3.create(), TYPE6.Vector3.create(0, 1, 0));
        this.setProjectionMatrix();
    }
    Object.assign(OrthographicCamera.prototype, {
        setProjectionMatrix: function() {
            this.camera.projectionMatrix.orthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
            this.camera.setViewMatrix();
        },
        setPosition: function(vector3) {
            this.camera.setPosition(vector3);
            this.camera.setViewMatrix();
        },
        setTarget: function(vector3) {
            this.camera.setTarget(vector3);
            this.camera.setViewMatrix();
        },
        setUp: function(vector3) {
            this.camera.setUp(vector3);
            this.camera.setViewMatrix();
        },
        getViewMatrix: function() {
            return this.camera.getViewMatrix();
        },
        getProjectionMatrix: function() {
            return this.camera.getProjectionMatrix();
        }
    });
    function createShader(context, str, type) {
        var shader = context.createShader(context[type]);
        context.shaderSource(shader, str);
        context.compileShader(shader);
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
            console.log(str);
            console.log(context.getShaderInfoLog(shader));
        }
        return shader;
    }
    function createProgram(context, vertexShader, fragmentShader) {
        var program = context.createProgram();
        var vshader = createShader(context, vertexShader, "VERTEX_SHADER");
        var fshader = createShader(context, fragmentShader, "FRAGMENT_SHADER");
        context.attachShader(program, vshader);
        context.attachShader(program, fshader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) console.log(context.getProgramInfoLog(program));
        return program;
    }
    function Mesh(mesh, context) {
        this.vertices = mesh.vertices ? mesh.vertices : null;
        this.indices = mesh.indices ? mesh.indices : null;
        this.normals = mesh.normals ? mesh.normals : null;
        this.uvs = mesh.uvs ? mesh.uvs : null;
        this.itemSize = mesh.itemSize ? mesh.itemSize : null;
        this.numIndices = mesh.numIndices ? mesh.numIndices : null;
        this.numVertices = mesh.numVertices ? mesh.numVertices : null;
        this.cameraDefaultPosition = mesh.cameraDefaultPosition ? mesh.cameraDefaultPosition : TYPE6.Vector3.create(0, 0, 0);
        this.context = context;
        this.renderer = new WebGLRenderer(this.context);
        this.WebGLTexture = null;
        this.vertexPositionBuffer = this.renderer.createBuffer("ARRAY_BUFFER", new Float32Array(this.vertices), "STATIC_DRAW");
        this.indexBuffer = this.indices ? this.renderer.createBuffer("ELEMENT_ARRAY_BUFFER", new Uint16Array(this.indices), "STATIC_DRAW") : null;
        this.vertexNormalBuffer = this.normals ? this.renderer.createBuffer("ARRAY_BUFFER", new Float32Array(this.normals), "STATIC_DRAW") : null;
        this.textureCoordBuffer = this.uvs ? this.renderer.createBuffer("ARRAY_BUFFER", new Float32Array(this.uvs), "STATIC_DRAW") : null;
        this.modelMatrix = TYPE6.Matrix4x3.create();
        this.rotationMatrix = TYPE6.Matrix4x3.create();
        this.active = true;
    }
    Object.assign(Mesh.prototype, {
        setActive: function() {
            this.active = true;
        },
        setInactive: function() {
            this.active = false;
        },
        toggleActive: function() {
            this.active = !this.active;
            return this.active;
        },
        isActive: function() {
            return this.active;
        },
        setTexture: function(texture) {
            this.WebGLTexture = texture.WebGLTexture;
        },
        createProgram: function(vertexShader, fragmentShader) {
            this.program = createProgram(this.context, vertexShader, fragmentShader);
            this.program.vertexPositionAttribute = this.context.getAttribLocation(this.program, "aVertexPosition");
            this.context.enableVertexAttribArray(this.program.vertexPositionAttribute);
            if (this.normals) {
                this.program.vertexNormalAttribute = this.context.getAttribLocation(this.program, "aVertexNormal");
                this.context.enableVertexAttribArray(this.program.vertexNormalAttribute);
            }
            this.program.modelMatrixUniform = this.context.getUniformLocation(this.program, "uModelMatrix");
            this.program.viewMatrixUniform = this.context.getUniformLocation(this.program, "uViewMatrix");
            this.program.projectionMatrixUniform = this.context.getUniformLocation(this.program, "uProjectionMatrix");
            if (this.uvs) {
                this.program.textureCoordAttribute = this.context.getAttribLocation(this.program, "aTextureCoord");
                this.context.enableVertexAttribArray(this.program.textureCoordAttribute);
            }
            this.program.uTime = this.context.getUniformLocation(this.program, "uTime");
            this.program.uScreenResolution = this.context.getUniformLocation(this.program, "uScreenResolution");
            if (this.WebGLTexture) {
                this.program.uSampler = this.context.getUniformLocation(this.program, "uSampler");
            }
            this.renderer.useProgram(this.program);
            var viewport = this.context.getParameter(this.context.VIEWPORT);
            this.context.uniform2f(this.program.uScreenResolution, viewport[2], viewport[3]);
        },
        sendMatrixUniforms: function(camera) {
            this.context.uniformMatrix4fv(this.program.modelMatrixUniform, false, this.modelMatrix.toArray());
            this.context.uniformMatrix4fv(this.program.projectionMatrixUniform, false, camera.getProjectionMatrix());
            this.context.uniformMatrix4fv(this.program.viewMatrixUniform, false, camera.getViewMatrix());
        },
        render: function(camera, time) {
            if (this.isActive()) {
                this.renderer.useProgram(this.program);
                if (this.indices) {
                    this.renderer.bindBuffer("ELEMENT_ARRAY_BUFFER", this.indexBuffer);
                }
                this.renderer.bindBuffer("ARRAY_BUFFER", this.vertexPositionBuffer);
                this.renderer.vertexAttribPointer(this.program.vertexPositionAttribute, this.itemSize, "FLOAT", false, 0, 0);
                if (this.normals) {
                    this.renderer.vertexAttribPointer(this.program.vertexNormalAttribute, this.itemSize, "FLOAT", false, 0, 0);
                }
                if (this.uvs) {
                    this.renderer.bindBuffer("ARRAY_BUFFER", this.textureCoordBuffer);
                    this.renderer.vertexAttribPointer(this.program.textureCoordAttribute, 2, "FLOAT", false, 0, 0);
                }
                this.sendMatrixUniforms(camera);
                if (this.indices) {
                    this.renderer.drawElements(this.program, this.numIndices, time, this.WebGLTexture);
                } else {
                    this.renderer.drawArrays(this.program, this.numVertices, time, this.WebGLTexture);
                }
            }
        }
    });
    function FullscreenQuad() {
        this.vertices = [ 1, -1, -1, -1, 1, 1, -1, 1 ];
        this.uvs = [ 1, 0, 0, 0, 1, 1, 0, 1 ];
        this.itemSize = 2;
        this.numVertices = 4;
    }
    Object.assign(FullscreenQuad.prototype, {});
    function Quad(width, height) {
        width = width ? width * .5 : 1;
        height = height ? height * .5 : 1;
        this.vertices = [ width, -height, 0, -width, -height, 0, width, height, 0, -width, height, 0 ];
        this.uvs = [ 1, 0, 0, 0, 1, 1, 0, 1 ];
        this.itemSize = 3;
        this.numVertices = 4;
    }
    Object.assign(Quad.prototype, {});
    function Cube() {
        this.vertices = [ 1, -1, -1, -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, -1, -1, -1, 1, -1 ];
        this.indices = [ 0, 1, 2, 3, 4, 5, 5, 0, 2, 4, 6, 0, 6, 3, 1, 2, 3, 5, 0, 6, 1, 3, 7, 4, 5, 4, 0, 4, 7, 6, 6, 7, 3, 2, 1, 3 ];
        this.normals = [ .5773, -.5773, -.5773, -.5773, -.5773, .5773, .5773, -.5773, .5773, -.5773, .5773, .5773, .5773, .5773, -.5773, .5773, .5773, .5773, -.5773, -.5773, -.5773, -.5773, .5773, -.5773 ];
        this.itemSize = 3;
        this.numIndices = 36;
    }
    Object.assign(Cube.prototype, {});
    function Sphere() {
        this.vertices = [ -.7071, -.7071, 0, -.5449, -.8315, .1084, -.5556, -.8315, 0, -.8315, .5556, 0, -.9061, .3827, .1802, -.9239, .3827, 0, -.3753, -.9239, .0747, -.3827, -.9239, 0, -.9619, .1951, .1913, -.9808, .1951, 0, -.1913, -.9808, .0381, -.1951, -.9808, 0, -.9808, 0, .1951, -1, 0, 0, -.1951, .9808, 0, 0, 1, 0, -.1913, .9808, .0381, 0, -1, 0, -.9619, -.1951, .1913, -.9808, -.1951, 0, -.3753, .9239, .0747, -.3827, .9239, 0, -.9239, -.3827, 0, -.9061, -.3827, .1802, -.5556, .8315, 0, -.5449, .8315, .1084, -.8155, -.5556, .1622, -.8315, -.5556, 0, -.6935, .7071, .1379, -.7071, .7071, 0, -.6935, -.7071, .1379, -.8155, .5556, .1622, -.7682, -.5556, .3182, -.6533, -.7071, .2706, -.7682, .5556, .3182, -.5133, -.8315, .2126, -.8536, .3827, .3536, -.3536, -.9239, .1464, -.9061, .1951, .3753, -.1802, -.9808, .0747, -.9239, 0, .3827, -.1802, .9808, .0747, -.9061, -.1951, .3753, -.3536, .9239, .1464, -.8536, -.3827, .3536, -.5133, .8315, .2126, -.6533, .7071, .2706, -.1622, .9808, .1084, -.1622, -.9808, .1084, -.8155, -.1951, .5449, -.3182, .9239, .2126, -.7682, -.3827, .5133, -.4619, .8315, .3087, -.6913, -.5556, .4619, -.5879, .7071, .3928, -.5879, -.7071, .3928, -.6913, .5556, .4619, -.4619, -.8315, .3087, -.7682, .3827, .5133, -.3182, -.9239, .2126, -.8155, .1951, .5449, -.8315, 0, .5556, -.5879, .5556, .5879, -.3928, -.8315, .3928, -.6533, .3827, .6533, -.2706, -.9239, .2706, -.6935, .1951, .6935, -.1379, -.9808, .1379, -.7071, 0, .7071, -.1379, .9808, .1379, -.6935, -.1951, .6935, -.2706, .9239, .2706, -.6533, -.3827, .6533, -.3928, .8315, .3928, -.5879, -.5556, .5879, -.5, .7071, .5, -.5, -.7071, .5, -.5449, -.1951, .8155, -.2126, .9239, .3182, -.5133, -.3827, .7682, -.3087, .8315, .4619, -.4619, -.5556, .6913, -.3928, .7071, .5879, -.3928, -.7071, .5879, -.4619, .5556, .6913, -.3087, -.8315, .4619, -.5133, .3827, .7682, -.2126, -.9239, .3182, -.5449, .1951, .8155, -.1084, -.9808, .1622, -.5556, 0, .8315, -.1084, .9808, .1622, -.2126, -.8315, .5133, -.3536, .3827, .8536, -.1464, -.9239, .3536, -.3753, .1951, .9061, -.0747, -.9808, .1802, -.3827, 0, .9239, -.0747, .9808, .1802, -.3753, -.1951, .9061, -.1464, .9239, .3536, -.3536, -.3827, .8536, -.2126, .8315, .5133, -.3182, -.5556, .7682, -.2706, .7071, .6533, -.2706, -.7071, .6533, -.3182, .5556, .7682, -.1802, -.3827, .9061, -.1084, .8315, .5449, -.1622, -.5556, .8155, -.1379, .7071, .6935, -.1379, -.7071, .6935, -.1622, .5556, .8155, -.1084, -.8315, .5449, -.1802, .3827, .9061, -.0747, -.9239, .3753, -.1913, .1951, .9619, -.0381, -.9808, .1913, -.1951, 0, .9808, -.0381, .9808, .1913, -.1913, -.1951, .9619, -.0747, .9239, .3753, 0, -.8315, .5556, 0, -.9239, .3827, 0, .3827, .9239, 0, .1951, .9808, 0, -.9808, .1951, 0, 0, 1, 0, .9808, .1951, 0, -.1951, .9808, 0, .9239, .3827, 0, -.3827, .9239, 0, .8315, .5556, 0, -.5556, .8315, 0, .7071, .7071, 0, -.7071, .7071, 0, .5556, .8315, .1084, .8315, .5449, .1802, -.3827, .9061, .1622, -.5556, .8155, .138, .7071, .6935, .138, -.7071, .6935, .1622, .5556, .8155, .1084, -.8315, .5449, .1802, .3827, .9061, .0747, -.9239, .3753, .1913, .1951, .9619, .0381, -.9808, .1913, .1951, 0, .9808, .0381, .9808, .1913, .1913, -.1951, .9619, .0747, .9239, .3753, .3536, .3827, .8536, .3753, .1951, .9061, .0747, -.9808, .1802, .3827, 0, .9239, .0747, .9808, .1802, .3753, -.1951, .9061, .1464, .9239, .3536, .3536, -.3827, .8536, .2126, .8315, .5133, .3182, -.5556, .7682, .2706, .7071, .6533, .2706, -.7071, .6533, .3182, .5556, .7682, .2126, -.8315, .5133, .1464, -.9239, .3536, .5133, -.3827, .7682, .4619, -.5556, .6913, .3928, .7071, .5879, .3928, -.7071, .5879, .4619, .5556, .6913, .3087, -.8315, .4619, .5133, .3827, .7682, .2126, -.9239, .3182, .5449, .1951, .8155, .1084, -.9808, .1622, .5556, 0, .8315, .1084, .9808, .1622, .5449, -.1951, .8155, .2126, .9239, .3182, .3087, .8315, .4619, .2706, -.9239, .2706, .138, -.9808, .1379, .7071, 0, .7071, .138, .9808, .1379, .6935, -.1951, .6935, .2706, .9239, .2706, .6533, -.3827, .6533, .3928, .8315, .3928, .5879, -.5556, .5879, .5, .7071, .5, .5, -.7071, .5, .5879, .5556, .5879, .3928, -.8315, .3928, .6533, .3827, .6533, .6935, .1951, .6935, .4619, .8315, .3087, .5879, .7071, .3928, .5879, -.7071, .3928, .6913, .5556, .4619, .4619, -.8315, .3087, .7682, .3827, .5133, .3182, -.9239, .2126, .8155, .1951, .5449, .1622, -.9808, .1084, .8315, 0, .5556, .1622, .9808, .1084, .8155, -.1951, .5449, .3182, .9239, .2126, .7682, -.3827, .5133, .6913, -.5556, .4619, .9239, 0, .3827, .1802, .9808, .0747, .1802, -.9808, .0747, .9061, -.1951, .3753, .3536, .9239, .1464, .8536, -.3827, .3536, .5133, .8315, .2126, .7682, -.5556, .3182, .6533, .7071, .2706, .6533, -.7071, .2706, .7682, .5556, .3182, .5133, -.8315, .2126, .8536, .3827, .3536, .3536, -.9239, .1464, .9061, .1951, .3753, .6935, -.7071, .1379, .8155, .5556, .1622, .5449, -.8315, .1084, .9061, .3827, .1802, .3753, -.9239, .0747, .9619, .1951, .1913, .1913, -.9808, .0381, .9808, 0, .1951, .1913, .9808, .0381, .9619, -.1951, .1913, .3753, .9239, .0747, .9061, -.3827, .1802, .5449, .8315, .1084, .8155, -.5556, .1622, .6935, .7071, .1379, .1951, -.9808, 0, .9808, -.1951, 0, .3827, .9239, 0, .9239, -.3827, 0, .5556, .8315, 0, .8315, -.5556, 0, .7071, .7071, 0, .7071, -.7071, 0, .8315, .5556, 0, .5556, -.8315, 0, .9239, .3827, 0, .3827, -.9239, 0, .9808, .1951, 0, 1, 0, 0, .1951, .9808, 0, .5449, -.8315, -.1084, .9061, .3827, -.1802, .3753, -.9239, -.0747, .9619, .1951, -.1913, .1913, -.9808, -.0381, .9808, 0, -.1951, .1913, .9808, -.0381, .9619, -.1951, -.1913, .3753, .9239, -.0747, .9061, -.3827, -.1802, .5449, .8315, -.1084, .8155, -.5556, -.1622, .6935, .7071, -.1379, .6935, -.7071, -.1379, .8155, .5556, -.1622, .3536, .9239, -.1464, .8536, -.3827, -.3536, .5133, .8315, -.2126, .7682, -.5556, -.3182, .6533, .7071, -.2706, .6533, -.7071, -.2706, .7682, .5556, -.3182, .5133, -.8315, -.2126, .8536, .3827, -.3536, .3536, -.9239, -.1464, .9061, .1951, -.3753, .1802, -.9808, -.0747, .9239, 0, -.3827, .1802, .9808, -.0747, .9061, -.1951, -.3753, .7682, .3827, -.5133, .3182, -.9239, -.2126, .8155, .1951, -.5449, .1622, -.9808, -.1084, .8315, 0, -.5556, .1622, .9808, -.1084, .8155, -.1951, -.5449, .3182, .9239, -.2126, .7682, -.3827, -.5133, .4619, .8315, -.3087, .6913, -.5556, -.4619, .5879, .7071, -.3928, .5879, -.7071, -.3928, .6913, .5556, -.4619, .4619, -.8315, -.3087, .6533, -.3827, -.6533, .3928, .8315, -.3928, .5879, -.5556, -.5879, .5, .7071, -.5, .5, -.7071, -.5, .5879, .5556, -.5879, .3928, -.8315, -.3928, .6533, .3827, -.6533, .2706, -.9239, -.2706, .6935, .1951, -.6935, .1379, -.9808, -.1379, .7071, 0, -.7071, .138, .9808, -.1379, .6935, -.1951, -.6935, .2706, .9239, -.2706, .3087, -.8315, -.4619, .2126, -.9239, -.3182, .5133, .3827, -.7682, .5449, .1951, -.8155, .1084, -.9808, -.1622, .5556, 0, -.8315, .1084, .9808, -.1622, .5449, -.1951, -.8155, .2126, .9239, -.3182, .5133, -.3827, -.7682, .3087, .8315, -.4619, .4619, -.5556, -.6913, .3928, .7071, -.5879, .3928, -.7071, -.5879, .4619, .5556, -.6913, .2126, .8315, -.5133, .3536, -.3827, -.8536, .3182, -.5556, -.7682, .2706, .7071, -.6533, .2706, -.7071, -.6533, .3182, .5556, -.7682, .2126, -.8315, -.5133, .3536, .3827, -.8536, .1464, -.9239, -.3536, .3753, .1951, -.9061, .0747, -.9808, -.1802, .3827, 0, -.9239, .0747, .9808, -.1802, .3753, -.1951, -.9061, .1464, .9239, -.3536, .1802, .3827, -.9061, .1913, .1951, -.9619, .0381, -.9808, -.1913, .1951, 0, -.9808, .0381, .9808, -.1913, .1913, -.1951, -.9619, .0747, .9239, -.3753, .1802, -.3827, -.9061, .1084, .8315, -.5449, .1622, -.5556, -.8155, .1379, .7071, -.6935, .1379, -.7071, -.6935, .1622, .5556, -.8155, .1084, -.8315, -.5449, .0747, -.9239, -.3753, 0, -.3827, -.9239, 0, -.5556, -.8315, 0, .8315, -.5556, 0, .7071, -.7071, 0, -.7071, -.7071, 0, .5556, -.8315, 0, -.8315, -.5556, 0, .3827, -.9239, 0, -.9239, -.3827, 0, .1951, -.9808, 0, -.9808, -.1951, 0, 0, -1, 0, .9808, -.1951, 0, -.1951, -.9808, 0, .9239, -.3827, -.0381, -.9808, -.1913, -.1951, 0, -.9808, -.0381, .9808, -.1913, -.1913, -.1951, -.9619, -.0747, .9239, -.3753, -.1802, -.3827, -.9061, -.1084, .8315, -.5449, -.1622, -.5556, -.8155, -.1379, .7071, -.6935, -.1379, -.7071, -.6935, -.1622, .5556, -.8155, -.1084, -.8315, -.5449, -.1802, .3827, -.9061, -.0747, -.9239, -.3753, -.1913, .1951, -.9619, -.2706, -.7071, -.6533, -.3182, .5556, -.7682, -.2126, -.8315, -.5133, -.3536, .3827, -.8536, -.1464, -.9239, -.3536, -.3753, .1951, -.9061, -.0747, -.9808, -.1802, -.3827, 0, -.9239, -.0747, .9808, -.1802, -.3753, -.1951, -.9061, -.1464, .9239, -.3536, -.3536, -.3827, -.8536, -.2126, .8315, -.5133, -.3182, -.5556, -.7682, -.2706, .7071, -.6533, -.1084, .9808, -.1622, -.1084, -.9808, -.1622, -.5556, 0, -.8315, -.5449, -.1951, -.8155, -.2126, .9239, -.3182, -.5133, -.3827, -.7682, -.3087, .8315, -.4619, -.4619, -.5556, -.6913, -.3928, .7071, -.5879, -.3928, -.7071, -.5879, -.4619, .5556, -.6913, -.3087, -.8315, -.4619, -.5133, .3827, -.7682, -.2126, -.9239, -.3182, -.5449, .1951, -.8155, -.5, .7071, -.5, -.5879, .5556, -.5879, -.3928, -.8315, -.3928, -.6533, .3827, -.6533, -.2706, -.9239, -.2706, -.6935, .1951, -.6935, -.1379, -.9808, -.1379, -.7071, 0, -.7071, -.1379, .9808, -.1379, -.6935, -.1951, -.6935, -.2706, .9239, -.2706, -.6533, -.3827, -.6533, -.3928, .8315, -.3928, -.5879, -.5556, -.5879, -.5, -.7071, -.5, -.8155, -.1951, -.5449, -.3182, .9239, -.2126, -.7682, -.3827, -.5133, -.4619, .8315, -.3087, -.6913, -.5556, -.4619, -.5879, .7071, -.3928, -.5879, -.7071, -.3928, -.6913, .5556, -.4619, -.4619, -.8315, -.3087, -.7682, .3827, -.5133, -.3182, -.9239, -.2126, -.8155, .1951, -.5449, -.1622, -.9808, -.1084, -.8315, 0, -.5556, -.1622, .9808, -.1084, -.5133, -.8315, -.2126, -.8536, .3827, -.3536, -.3536, -.9239, -.1464, -.9061, .1951, -.3753, -.1802, -.9808, -.0747, -.9239, 0, -.3827, -.1802, .9808, -.0747, -.9061, -.1951, -.3753, -.3536, .9239, -.1464, -.8536, -.3827, -.3536, -.5133, .8315, -.2126, -.7682, -.5556, -.3182, -.6533, .7071, -.2706, -.6533, -.7071, -.2706, -.7682, .5556, -.3182, -.3753, .9239, -.0747, -.9061, -.3827, -.1802, -.5449, .8315, -.1084, -.8155, -.5556, -.1622, -.6935, .7071, -.1379, -.6935, -.7071, -.1379, -.8155, .5556, -.1622, -.5449, -.8315, -.1084, -.9061, .3827, -.1802, -.3753, -.9239, -.0747, -.9619, .1951, -.1913, -.1913, -.9808, -.0381, -.9808, 0, -.1951, -.1913, .9808, -.0381, -.9619, -.1951, -.1913 ];
        this.indices = [ 0, 1, 2, 3, 4, 5, 2, 6, 7, 5, 8, 9, 7, 10, 11, 9, 12, 13, 14, 15, 16, 17, 11, 10, 13, 18, 19, 14, 20, 21, 22, 18, 23, 24, 20, 25, 22, 26, 27, 24, 28, 29, 0, 26, 30, 29, 31, 3, 30, 32, 33, 28, 34, 31, 30, 35, 1, 31, 36, 4, 1, 37, 6, 4, 38, 8, 6, 39, 10, 8, 40, 12, 16, 15, 41, 17, 10, 39, 18, 40, 42, 16, 43, 20, 23, 42, 44, 20, 45, 25, 23, 32, 26, 25, 46, 28, 41, 15, 47, 17, 39, 48, 40, 49, 42, 41, 50, 43, 42, 51, 44, 43, 52, 45, 32, 51, 53, 45, 54, 46, 33, 53, 55, 46, 56, 34, 33, 57, 35, 34, 58, 36, 35, 59, 37, 38, 58, 60, 37, 48, 39, 38, 61, 40, 54, 62, 56, 55, 63, 57, 56, 64, 58, 57, 65, 59, 58, 66, 60, 59, 67, 48, 61, 66, 68, 47, 15, 69, 17, 48, 67, 61, 70, 49, 47, 71, 50, 49, 72, 51, 50, 73, 52, 53, 72, 74, 52, 75, 54, 53, 76, 55, 68, 77, 70, 69, 78, 71, 70, 79, 72, 71, 80, 73, 74, 79, 81, 73, 82, 75, 74, 83, 76, 62, 82, 84, 63, 83, 85, 62, 86, 64, 65, 85, 87, 64, 88, 66, 65, 89, 67, 68, 88, 90, 69, 15, 91, 17, 67, 89, 83, 92, 85, 84, 93, 86, 87, 92, 94, 88, 93, 95, 87, 96, 89, 88, 97, 90, 91, 15, 98, 17, 89, 96, 90, 99, 77, 91, 100, 78, 77, 101, 79, 78, 102, 80, 81, 101, 103, 80, 104, 82, 83, 103, 105, 84, 104, 106, 99, 107, 101, 100, 108, 102, 103, 107, 109, 104, 108, 110, 105, 109, 111, 104, 112, 106, 105, 113, 92, 106, 114, 93, 92, 115, 94, 95, 114, 116, 96, 115, 117, 95, 118, 97, 98, 15, 119, 17, 96, 117, 97, 120, 99, 98, 121, 100, 115, 122, 123, 116, 124, 125, 117, 123, 126, 116, 127, 118, 119, 15, 128, 17, 117, 126, 120, 127, 129, 119, 130, 121, 120, 131, 107, 121, 132, 108, 109, 131, 133, 108, 134, 110, 109, 135, 111, 110, 136, 112, 113, 135, 122, 112, 124, 114, 130, 137, 132, 133, 138, 139, 132, 140, 134, 133, 141, 135, 136, 140, 142, 122, 141, 143, 136, 144, 124, 122, 145, 123, 125, 144, 146, 126, 145, 147, 125, 148, 127, 128, 15, 149, 17, 126, 147, 127, 150, 129, 130, 149, 151, 129, 138, 131, 146, 152, 153, 145, 154, 147, 146, 155, 148, 149, 15, 156, 17, 147, 154, 148, 157, 150, 149, 158, 151, 150, 159, 138, 137, 158, 160, 139, 159, 161, 137, 162, 140, 139, 163, 141, 140, 164, 142, 141, 165, 143, 142, 152, 144, 145, 165, 166, 161, 167, 168, 160, 169, 162, 161, 170, 163, 164, 169, 171, 165, 170, 172, 164, 173, 152, 165, 174, 166, 153, 173, 175, 166, 176, 154, 153, 177, 155, 156, 15, 178, 17, 154, 176, 157, 177, 179, 156, 180, 158, 157, 167, 159, 158, 181, 160, 176, 182, 183, 175, 184, 177, 178, 15, 185, 17, 176, 183, 177, 186, 179, 178, 187, 180, 179, 188, 167, 180, 189, 181, 167, 190, 168, 181, 191, 169, 168, 192, 170, 169, 193, 171, 172, 192, 194, 171, 195, 173, 172, 182, 174, 175, 195, 196, 191, 197, 198, 190, 199, 192, 193, 198, 200, 194, 199, 201, 193, 202, 195, 194, 203, 182, 196, 202, 204, 183, 203, 205, 196, 206, 184, 185, 15, 207, 17, 183, 205, 186, 206, 208, 185, 209, 187, 186, 210, 188, 187, 197, 189, 190, 210, 211, 204, 212, 206, 207, 15, 213, 17, 205, 214, 206, 215, 208, 207, 216, 209, 208, 217, 210, 197, 216, 218, 211, 217, 219, 197, 220, 198, 211, 221, 199, 198, 222, 200, 201, 221, 223, 200, 224, 202, 201, 225, 203, 204, 224, 226, 203, 214, 205, 219, 227, 221, 220, 228, 222, 221, 229, 223, 222, 230, 224, 223, 231, 225, 226, 230, 232, 214, 231, 233, 226, 234, 212, 213, 15, 235, 17, 214, 233, 212, 236, 215, 213, 237, 216, 215, 238, 217, 216, 239, 218, 219, 238, 240, 218, 241, 220, 17, 233, 242, 234, 243, 236, 235, 244, 237, 236, 245, 238, 239, 244, 246, 240, 245, 247, 241, 246, 248, 240, 249, 227, 241, 250, 228, 229, 249, 251, 228, 252, 230, 229, 253, 231, 232, 252, 254, 233, 253, 242, 232, 255, 234, 235, 15, 256, 249, 257, 251, 250, 258, 252, 251, 259, 253, 254, 258, 260, 253, 261, 242, 254, 262, 255, 256, 15, 263, 17, 242, 261, 255, 264, 243, 256, 265, 244, 243, 266, 245, 244, 267, 246, 247, 266, 268, 248, 267, 269, 247, 270, 249, 250, 269, 271, 263, 272, 265, 264, 273, 266, 265, 274, 267, 268, 273, 275, 269, 274, 276, 268, 277, 270, 271, 276, 278, 270, 279, 257, 271, 280, 258, 259, 279, 281, 260, 280, 282, 261, 281, 283, 260, 284, 262, 263, 15, 285, 17, 261, 283, 264, 284, 286, 278, 287, 280, 279, 288, 281, 282, 287, 289, 283, 288, 290, 282, 291, 284, 285, 15, 292, 17, 283, 290, 284, 293, 286, 285, 294, 272, 286, 295, 273, 272, 296, 274, 275, 295, 297, 274, 298, 276, 275, 299, 277, 278, 298, 300, 279, 299, 301, 293, 302, 295, 294, 303, 296, 297, 302, 304, 298, 303, 305, 297, 306, 299, 300, 305, 307, 299, 308, 301, 300, 309, 287, 301, 310, 288, 289, 309, 311, 288, 312, 290, 291, 311, 313, 292, 15, 314, 17, 290, 312, 291, 315, 293, 292, 316, 294, 310, 317, 318, 311, 319, 320, 310, 321, 312, 311, 322, 313, 314, 15, 323, 17, 312, 321, 313, 324, 315, 314, 325, 316, 315, 326, 302, 316, 327, 303, 304, 326, 328, 305, 327, 329, 304, 330, 306, 307, 329, 331, 306, 317, 308, 307, 319, 309, 325, 332, 327, 328, 333, 334, 329, 332, 335, 330, 334, 336, 331, 335, 337, 330, 338, 317, 331, 339, 319, 318, 338, 340, 320, 339, 341, 321, 340, 342, 320, 343, 322, 323, 15, 344, 17, 321, 342, 322, 345, 324, 323, 346, 325, 324, 333, 326, 341, 347, 348, 340, 349, 342, 341, 350, 343, 344, 15, 351, 17, 342, 349, 343, 352, 345, 346, 351, 353, 345, 354, 333, 346, 355, 332, 334, 354, 356, 335, 355, 357, 334, 358, 336, 337, 357, 359, 336, 360, 338, 337, 347, 339, 340, 360, 361, 356, 362, 363, 357, 364, 365, 356, 366, 358, 357, 367, 359, 360, 366, 368, 359, 369, 347, 361, 368, 370, 348, 369, 371, 361, 372, 349, 348, 373, 350, 351, 15, 374, 17, 349, 372, 352, 373, 375, 353, 374, 376, 352, 362, 354, 353, 364, 355, 370, 377, 372, 371, 378, 373, 374, 15, 379, 17, 372, 377, 375, 378, 380, 376, 379, 381, 375, 382, 362, 376, 383, 364, 363, 382, 384, 365, 383, 385, 363, 386, 366, 367, 385, 387, 366, 388, 368, 367, 389, 369, 370, 388, 390, 371, 389, 391, 384, 392, 386, 385, 393, 387, 386, 394, 388, 387, 395, 389, 390, 394, 396, 391, 395, 397, 390, 398, 377, 391, 399, 378, 379, 15, 400, 17, 377, 398, 378, 401, 380, 379, 402, 381, 380, 403, 382, 381, 404, 383, 384, 403, 405, 385, 404, 406, 400, 15, 407, 17, 398, 408, 401, 409, 410, 400, 411, 402, 401, 412, 403, 404, 411, 413, 405, 412, 414, 406, 413, 415, 405, 416, 392, 393, 415, 417, 392, 418, 394, 393, 419, 395, 396, 418, 420, 397, 419, 421, 396, 408, 398, 397, 409, 399, 417, 422, 423, 416, 424, 418, 417, 425, 419, 418, 426, 420, 421, 425, 427, 420, 428, 408, 421, 429, 409, 407, 15, 430, 17, 408, 428, 410, 429, 431, 407, 432, 411, 410, 433, 412, 411, 434, 413, 414, 433, 435, 413, 422, 415, 414, 436, 416, 429, 437, 431, 430, 438, 432, 431, 439, 433, 432, 440, 434, 435, 439, 441, 434, 442, 422, 435, 443, 436, 423, 442, 444, 424, 443, 445, 423, 446, 425, 424, 447, 426, 427, 446, 448, 426, 449, 428, 429, 448, 450, 430, 15, 451, 17, 428, 449, 443, 452, 445, 444, 453, 446, 445, 454, 447, 448, 453, 455, 447, 456, 449, 448, 457, 450, 451, 15, 458, 17, 449, 456, 450, 459, 437, 438, 458, 460, 437, 461, 439, 440, 460, 462, 441, 461, 463, 442, 462, 464, 441, 465, 443, 444, 464, 466, 458, 467, 460, 459, 468, 461, 460, 469, 462, 463, 468, 470, 462, 471, 464, 463, 472, 465, 466, 471, 473, 465, 474, 452, 466, 475, 453, 452, 476, 454, 455, 475, 477, 456, 476, 478, 455, 479, 457, 458, 15, 480, 17, 456, 478, 457, 481, 459, 475, 3, 5, 474, 7, 476, 477, 5, 9, 476, 11, 478, 479, 9, 13, 480, 15, 14, 17, 478, 11, 479, 19, 481, 467, 14, 21, 481, 22, 468, 469, 21, 24, 468, 27, 470, 471, 24, 29, 470, 0, 472, 473, 29, 3, 472, 2, 474, 0, 30, 1, 3, 31, 4, 2, 1, 6, 5, 4, 8, 7, 6, 10, 9, 8, 12, 13, 12, 18, 14, 16, 20, 22, 19, 18, 24, 21, 20, 22, 23, 26, 24, 25, 28, 0, 27, 26, 29, 28, 31, 30, 26, 32, 28, 46, 34, 30, 33, 35, 31, 34, 36, 1, 35, 37, 4, 36, 38, 6, 37, 39, 8, 38, 40, 18, 12, 40, 16, 41, 43, 23, 18, 42, 20, 43, 45, 23, 44, 32, 25, 45, 46, 40, 61, 49, 41, 47, 50, 42, 49, 51, 43, 50, 52, 32, 44, 51, 45, 52, 54, 33, 32, 53, 46, 54, 56, 33, 55, 57, 34, 56, 58, 35, 57, 59, 38, 36, 58, 37, 59, 48, 38, 60, 61, 54, 75, 62, 55, 76, 63, 56, 62, 64, 57, 63, 65, 58, 64, 66, 59, 65, 67, 61, 60, 66, 61, 68, 70, 47, 69, 71, 49, 70, 72, 50, 71, 73, 53, 51, 72, 52, 73, 75, 53, 74, 76, 68, 90, 77, 69, 91, 78, 70, 77, 79, 71, 78, 80, 74, 72, 79, 73, 80, 82, 74, 81, 83, 62, 75, 82, 63, 76, 83, 62, 84, 86, 65, 63, 85, 64, 86, 88, 65, 87, 89, 68, 66, 88, 83, 105, 92, 84, 106, 93, 87, 85, 92, 88, 86, 93, 87, 94, 96, 88, 95, 97, 90, 97, 99, 91, 98, 100, 77, 99, 101, 78, 100, 102, 81, 79, 101, 80, 102, 104, 83, 81, 103, 84, 82, 104, 99, 120, 107, 100, 121, 108, 103, 101, 107, 104, 102, 108, 105, 103, 109, 104, 110, 112, 105, 111, 113, 106, 112, 114, 92, 113, 115, 95, 93, 114, 96, 94, 115, 95, 116, 118, 97, 118, 120, 98, 119, 121, 115, 113, 122, 116, 114, 124, 117, 115, 123, 116, 125, 127, 120, 118, 127, 119, 128, 130, 120, 129, 131, 121, 130, 132, 109, 107, 131, 108, 132, 134, 109, 133, 135, 110, 134, 136, 113, 111, 135, 112, 136, 124, 130, 151, 137, 133, 131, 138, 132, 137, 140, 133, 139, 141, 136, 134, 140, 122, 135, 141, 136, 142, 144, 122, 143, 145, 125, 124, 144, 126, 123, 145, 125, 146, 148, 127, 148, 150, 130, 128, 149, 129, 150, 138, 146, 144, 152, 145, 166, 154, 146, 153, 155, 148, 155, 157, 149, 156, 158, 150, 157, 159, 137, 151, 158, 139, 138, 159, 137, 160, 162, 139, 161, 163, 140, 162, 164, 141, 163, 165, 142, 164, 152, 145, 143, 165, 161, 159, 167, 160, 181, 169, 161, 168, 170, 164, 162, 169, 165, 163, 170, 164, 171, 173, 165, 172, 174, 153, 152, 173, 166, 174, 176, 153, 175, 177, 157, 155, 177, 156, 178, 180, 157, 179, 167, 158, 180, 181, 176, 174, 182, 175, 196, 184, 177, 184, 186, 178, 185, 187, 179, 186, 188, 180, 187, 189, 167, 188, 190, 181, 189, 191, 168, 190, 192, 169, 191, 193, 172, 170, 192, 171, 193, 195, 172, 194, 182, 175, 173, 195, 191, 189, 197, 190, 211, 199, 193, 191, 198, 194, 192, 199, 193, 200, 202, 194, 201, 203, 196, 195, 202, 183, 182, 203, 196, 204, 206, 186, 184, 206, 185, 207, 209, 186, 208, 210, 187, 209, 197, 190, 188, 210, 204, 226, 212, 206, 212, 215, 207, 213, 216, 208, 215, 217, 197, 209, 216, 211, 210, 217, 197, 218, 220, 211, 219, 221, 198, 220, 222, 201, 199, 221, 200, 222, 224, 201, 223, 225, 204, 202, 224, 203, 225, 214, 219, 240, 227, 220, 241, 228, 221, 227, 229, 222, 228, 230, 223, 229, 231, 226, 224, 230, 214, 225, 231, 226, 232, 234, 212, 234, 236, 213, 235, 237, 215, 236, 238, 216, 237, 239, 219, 217, 238, 218, 239, 241, 234, 255, 243, 235, 256, 244, 236, 243, 245, 239, 237, 244, 240, 238, 245, 241, 239, 246, 240, 247, 249, 241, 248, 250, 229, 227, 249, 228, 250, 252, 229, 251, 253, 232, 230, 252, 233, 231, 253, 232, 254, 255, 249, 270, 257, 250, 271, 258, 251, 257, 259, 254, 252, 258, 253, 259, 261, 254, 260, 262, 255, 262, 264, 256, 263, 265, 243, 264, 266, 244, 265, 267, 247, 245, 266, 248, 246, 267, 247, 268, 270, 250, 248, 269, 263, 285, 272, 264, 286, 273, 265, 272, 274, 268, 266, 273, 269, 267, 274, 268, 275, 277, 271, 269, 276, 270, 277, 279, 271, 278, 280, 259, 257, 279, 260, 258, 280, 261, 259, 281, 260, 282, 284, 264, 262, 284, 278, 300, 287, 279, 301, 288, 282, 280, 287, 283, 281, 288, 282, 289, 291, 284, 291, 293, 285, 292, 294, 286, 293, 295, 272, 294, 296, 275, 273, 295, 274, 296, 298, 275, 297, 299, 278, 276, 298, 279, 277, 299, 293, 315, 302, 294, 316, 303, 297, 295, 302, 298, 296, 303, 297, 304, 306, 300, 298, 305, 299, 306, 308, 300, 307, 309, 301, 308, 310, 289, 287, 309, 288, 310, 312, 291, 289, 311, 291, 313, 315, 292, 314, 316, 310, 308, 317, 311, 309, 319, 310, 318, 321, 311, 320, 322, 313, 322, 324, 314, 323, 325, 315, 324, 326, 316, 325, 327, 304, 302, 326, 305, 303, 327, 304, 328, 330, 307, 305, 329, 306, 330, 317, 307, 331, 319, 325, 346, 332, 328, 326, 333, 329, 327, 332, 330, 328, 334, 331, 329, 335, 330, 336, 338, 331, 337, 339, 318, 317, 338, 320, 319, 339, 321, 318, 340, 320, 341, 343, 322, 343, 345, 323, 344, 346, 324, 345, 333, 341, 339, 347, 340, 361, 349, 341, 348, 350, 343, 350, 352, 346, 344, 351, 345, 352, 354, 346, 353, 355, 334, 333, 354, 335, 332, 355, 334, 356, 358, 337, 335, 357, 336, 358, 360, 337, 359, 347, 340, 338, 360, 356, 354, 362, 357, 355, 364, 356, 363, 366, 357, 365, 367, 360, 358, 366, 359, 367, 369, 361, 360, 368, 348, 347, 369, 361, 370, 372, 348, 371, 373, 352, 350, 373, 353, 351, 374, 352, 375, 362, 353, 376, 364, 370, 390, 377, 371, 391, 378, 375, 373, 378, 376, 374, 379, 375, 380, 382, 376, 381, 383, 363, 362, 382, 365, 364, 383, 363, 384, 386, 367, 365, 385, 366, 386, 388, 367, 387, 389, 370, 368, 388, 371, 369, 389, 384, 405, 392, 385, 406, 393, 386, 392, 394, 387, 393, 395, 390, 388, 394, 391, 389, 395, 390, 396, 398, 391, 397, 399, 378, 399, 401, 379, 400, 402, 380, 401, 403, 381, 402, 404, 384, 382, 403, 385, 383, 404, 401, 399, 409, 400, 407, 411, 401, 410, 412, 404, 402, 411, 405, 403, 412, 406, 404, 413, 405, 414, 416, 393, 406, 415, 392, 416, 418, 393, 417, 419, 396, 394, 418, 397, 395, 419, 396, 420, 408, 397, 421, 409, 417, 415, 422, 416, 436, 424, 417, 423, 425, 418, 424, 426, 421, 419, 425, 420, 426, 428, 421, 427, 429, 410, 409, 429, 407, 430, 432, 410, 431, 433, 411, 432, 434, 414, 412, 433, 413, 434, 422, 414, 435, 436, 429, 450, 437, 430, 451, 438, 431, 437, 439, 432, 438, 440, 435, 433, 439, 434, 440, 442, 435, 441, 443, 423, 422, 442, 424, 436, 443, 423, 444, 446, 424, 445, 447, 427, 425, 446, 426, 447, 449, 429, 427, 448, 443, 465, 452, 444, 466, 453, 445, 452, 454, 448, 446, 453, 447, 454, 456, 448, 455, 457, 450, 457, 459, 438, 451, 458, 437, 459, 461, 440, 438, 460, 441, 439, 461, 442, 440, 462, 441, 463, 465, 444, 442, 464, 458, 480, 467, 459, 481, 468, 460, 467, 469, 463, 461, 468, 462, 469, 471, 463, 470, 472, 466, 464, 471, 465, 472, 474, 466, 473, 475, 452, 474, 476, 455, 453, 475, 456, 454, 476, 455, 477, 479, 457, 479, 481, 475, 473, 3, 474, 2, 7, 477, 475, 5, 476, 7, 11, 479, 477, 9, 479, 13, 19, 467, 480, 14, 481, 19, 22, 469, 467, 21, 468, 22, 27, 471, 469, 24, 470, 27, 0, 473, 471, 29, 472, 0, 2 ];
        this.normals = [ -.7101, -.704, 0, -.549, -.8286, .1092, -.5598, -.8286, 0, -.8333, .5528, 0, -.907, .3805, .1804, -.9247, .3805, 0, -.3804, -.9217, .0757, -.3879, -.9217, 0, -.9622, .1939, .1914, -.981, .1939, 0, -.1971, -.9796, .0392, -.201, -.9796, 0, -.9808, 0, .1951, -1, 0, 0, -.201, .9796, 0, 0, 1, 0, -.1971, .9796, .0392, 0, -1, 0, -.9622, -.1939, .1914, -.981, -.1939, 0, -.3804, .9217, .0757, -.3879, .9217, 0, -.9247, -.3805, 0, -.907, -.3805, .1804, -.5598, .8286, 0, -.549, .8286, .1092, -.8173, -.5528, .1626, -.8333, -.5528, 0, -.6965, .704, .1385, -.7101, .704, 0, -.6965, -.704, .1385, -.8173, .5528, .1626, -.7699, -.5528, .3189, -.6561, -.704, .2717, -.7699, .5528, .3189, -.5171, -.8286, .2142, -.8544, .3805, .3539, -.3583, -.9217, .1484, -.9063, .1939, .3754, -.1856, -.9796, .0769, -.9239, 0, .3827, -.1856, .9796, .0769, -.9063, -.1939, .3754, -.3583, .9217, .1484, -.8544, -.3805, .3539, -.5171, .8286, .2142, -.6561, .704, .2717, -.1671, .9796, .1116, -.1671, -.9796, .1116, -.8157, -.1939, .545, -.3225, .9217, .2155, -.7689, -.3805, .5137, -.4654, .8286, .311, -.6929, -.5528, .463, -.5904, .704, .3945, -.5904, -.704, .3945, -.6929, .5528, .463, -.4654, -.8286, .311, -.7689, .3805, .5137, -.3225, -.9217, .2155, -.8157, .1939, .545, -.8314, 0, .5556, -.5893, .5528, .5893, -.3958, -.8286, .3958, -.6539, .3805, .6539, -.2743, -.9217, .2743, -.6937, .1939, .6937, -.1421, -.9796, .1421, -.7071, 0, .7071, -.1421, .9796, .1421, -.6937, -.1939, .6937, -.2743, .9217, .2743, -.6539, -.3805, .6539, -.3958, .8286, .3958, -.5893, -.5528, .5893, -.5021, .704, .5021, -.5021, -.704, .5021, -.545, -.1939, .8157, -.2155, .9217, .3225, -.5137, -.3805, .7689, -.311, .8286, .4654, -.463, -.5528, .6929, -.3945, .704, .5904, -.3945, -.704, .5904, -.463, .5528, .6929, -.311, -.8286, .4654, -.5137, .3805, .7689, -.2155, -.9217, .3225, -.545, .1939, .8157, -.1116, -.9796, .1671, -.5556, 0, .8314, -.1116, .9796, .1671, -.2142, -.8286, .5171, -.3539, .3805, .8544, -.1484, -.9217, .3583, -.3754, .1939, .9063, -.0769, -.9796, .1856, -.3827, 0, .9239, -.0769, .9796, .1856, -.3754, -.1939, .9063, -.1484, .9217, .3583, -.3539, -.3805, .8544, -.2142, .8286, .5171, -.3189, -.5528, .7699, -.2717, .704, .6561, -.2717, -.704, .6561, -.3189, .5528, .7699, -.1804, -.3805, .907, -.1092, .8286, .549, -.1626, -.5528, .8173, -.1385, .704, .6965, -.1385, -.704, .6965, -.1626, .5528, .8173, -.1092, -.8286, .549, -.1804, .3805, .907, -.0757, -.9217, .3804, -.1914, .1939, .9622, -.0392, -.9796, .1971, -.1951, 0, .9808, -.0392, .9796, .1971, -.1914, -.1939, .9622, -.0757, .9217, .3804, 0, -.8286, .5598, 0, -.9217, .3879, 0, .3805, .9247, 0, .1939, .981, 0, -.9796, .201, 0, 0, 1, 0, .9796, .201, 0, -.1939, .981, 0, .9217, .3879, 0, -.3805, .9247, 0, .8286, .5598, 0, -.5528, .8333, 0, .704, .7101, 0, -.704, .7101, 0, .5528, .8333, .1092, .8286, .549, .1804, -.3805, .907, .1626, -.5528, .8173, .1385, .704, .6965, .1385, -.704, .6965, .1626, .5528, .8173, .1092, -.8286, .549, .1804, .3805, .907, .0757, -.9217, .3804, .1914, .1939, .9622, .0392, -.9796, .1971, .1951, 0, .9808, .0392, .9796, .1971, .1914, -.1939, .9622, .0757, .9217, .3804, .3539, .3805, .8544, .3754, .1939, .9063, .0769, -.9796, .1856, .3827, 0, .9239, .0769, .9796, .1856, .3754, -.1939, .9063, .1484, .9217, .3583, .3539, -.3805, .8544, .2142, .8286, .5171, .3189, -.5528, .7699, .2717, .704, .6561, .2717, -.704, .6561, .3189, .5528, .7699, .2142, -.8286, .5171, .1484, -.9217, .3583, .5137, -.3805, .7689, .463, -.5528, .6929, .3945, .704, .5904, .3945, -.704, .5904, .463, .5528, .6929, .311, -.8286, .4654, .5137, .3805, .7689, .2155, -.9217, .3225, .545, .1939, .8157, .1116, -.9796, .1671, .5556, 0, .8314, .1116, .9796, .1671, .545, -.1939, .8157, .2155, .9217, .3225, .311, .8286, .4654, .2743, -.9217, .2743, .1421, -.9796, .1421, .7071, 0, .7071, .1421, .9796, .1421, .6937, -.1939, .6937, .2743, .9217, .2743, .6539, -.3805, .6539, .3958, .8286, .3958, .5893, -.5528, .5893, .5021, .704, .5021, .5021, -.704, .5021, .5893, .5528, .5893, .3958, -.8286, .3958, .6539, .3805, .6539, .6937, .1939, .6937, .4654, .8286, .311, .5904, .704, .3945, .5904, -.704, .3945, .6929, .5528, .463, .4654, -.8286, .311, .7689, .3805, .5137, .3225, -.9217, .2155, .8157, .1939, .545, .1671, -.9796, .1116, .8314, 0, .5556, .1671, .9796, .1116, .8157, -.1939, .545, .3225, .9217, .2155, .7689, -.3805, .5137, .6929, -.5528, .463, .9239, 0, .3827, .1856, .9796, .0769, .1856, -.9796, .0769, .9063, -.1939, .3754, .3583, .9217, .1484, .8544, -.3805, .3539, .5171, .8286, .2142, .7699, -.5528, .3189, .6561, .704, .2717, .6561, -.704, .2717, .7699, .5528, .3189, .5171, -.8286, .2142, .8544, .3805, .3539, .3583, -.9217, .1484, .9063, .1939, .3754, .6965, -.704, .1385, .8173, .5528, .1626, .549, -.8286, .1092, .907, .3805, .1804, .3804, -.9217, .0757, .9622, .1939, .1914, .1971, -.9796, .0392, .9808, 0, .1951, .1971, .9796, .0392, .9622, -.1939, .1914, .3804, .9217, .0757, .907, -.3805, .1804, .549, .8286, .1092, .8173, -.5528, .1626, .6965, .704, .1385, .201, -.9796, 0, .981, -.1939, 0, .3879, .9217, 0, .9247, -.3805, 0, .5598, .8286, 0, .8333, -.5528, 0, .7101, .704, 0, .7101, -.704, 0, .8333, .5528, 0, .5598, -.8286, 0, .9247, .3805, 0, .3879, -.9217, 0, .981, .1939, 0, 1, 0, 0, .201, .9796, 0, .549, -.8286, -.1092, .907, .3805, -.1804, .3804, -.9217, -.0757, .9622, .1939, -.1914, .1971, -.9796, -.0392, .9808, 0, -.1951, .1971, .9796, -.0392, .9622, -.1939, -.1914, .3804, .9217, -.0757, .907, -.3805, -.1804, .549, .8286, -.1092, .8173, -.5528, -.1626, .6965, .704, -.1385, .6965, -.704, -.1385, .8173, .5528, -.1626, .3583, .9217, -.1484, .8544, -.3805, -.3539, .5171, .8286, -.2142, .7699, -.5528, -.3189, .6561, .704, -.2717, .6561, -.704, -.2717, .7699, .5528, -.3189, .5171, -.8286, -.2142, .8544, .3805, -.3539, .3583, -.9217, -.1484, .9063, .1939, -.3754, .1856, -.9796, -.0769, .9239, 0, -.3827, .1856, .9796, -.0769, .9063, -.1939, -.3754, .7689, .3805, -.5137, .3225, -.9217, -.2155, .8157, .1939, -.545, .1671, -.9796, -.1116, .8314, 0, -.5556, .1671, .9796, -.1116, .8157, -.1939, -.545, .3225, .9217, -.2155, .7689, -.3805, -.5137, .4654, .8286, -.311, .6929, -.5528, -.463, .5904, .704, -.3945, .5904, -.704, -.3945, .6929, .5528, -.463, .4654, -.8286, -.311, .6539, -.3805, -.6539, .3958, .8286, -.3958, .5893, -.5528, -.5893, .5021, .704, -.5021, .5021, -.704, -.5021, .5893, .5528, -.5893, .3958, -.8286, -.3958, .6539, .3805, -.6539, .2743, -.9217, -.2743, .6937, .1939, -.6937, .1421, -.9796, -.1421, .7071, 0, -.7071, .1421, .9796, -.1421, .6937, -.1939, -.6937, .2743, .9217, -.2743, .311, -.8286, -.4654, .2155, -.9217, -.3225, .5137, .3805, -.7689, .545, .1939, -.8157, .1116, -.9796, -.1671, .5556, 0, -.8314, .1116, .9796, -.1671, .545, -.1939, -.8157, .2155, .9217, -.3225, .5137, -.3805, -.7689, .311, .8286, -.4654, .463, -.5528, -.6929, .3945, .704, -.5904, .3945, -.704, -.5904, .463, .5528, -.6929, .2142, .8286, -.5171, .3539, -.3805, -.8544, .3189, -.5528, -.7699, .2717, .704, -.6561, .2717, -.704, -.6561, .3189, .5528, -.7699, .2142, -.8286, -.5171, .3539, .3805, -.8544, .1484, -.9217, -.3583, .3754, .1939, -.9063, .0769, -.9796, -.1856, .3827, 0, -.9239, .0769, .9796, -.1856, .3754, -.1939, -.9063, .1484, .9217, -.3583, .1804, .3805, -.907, .1914, .1939, -.9622, .0392, -.9796, -.1971, .1951, 0, -.9808, .0392, .9796, -.1971, .1914, -.1939, -.9622, .0757, .9217, -.3804, .1804, -.3805, -.907, .1092, .8286, -.549, .1626, -.5528, -.8173, .1385, .704, -.6965, .1385, -.704, -.6965, .1626, .5528, -.8173, .1092, -.8286, -.549, .0757, -.9217, -.3804, 0, -.3805, -.9247, 0, -.5528, -.8333, 0, .8286, -.5598, 0, .704, -.7101, 0, -.704, -.7101, 0, .5528, -.8333, 0, -.8286, -.5598, 0, .3805, -.9247, 0, -.9217, -.3879, 0, .1939, -.981, 0, -.9796, -.201, 0, 0, -1, 0, .9796, -.201, 0, -.1939, -.981, 0, .9217, -.3879, -.0392, -.9796, -.1971, -.1951, 0, -.9808, -.0392, .9796, -.1971, -.1914, -.1939, -.9622, -.0757, .9217, -.3804, -.1804, -.3805, -.907, -.1092, .8286, -.549, -.1626, -.5528, -.8173, -.1385, .704, -.6965, -.1385, -.704, -.6965, -.1626, .5528, -.8173, -.1092, -.8286, -.549, -.1804, .3805, -.907, -.0757, -.9217, -.3804, -.1914, .1939, -.9622, -.2717, -.704, -.6561, -.3189, .5528, -.7699, -.2142, -.8286, -.5171, -.3539, .3805, -.8544, -.1484, -.9217, -.3583, -.3754, .1939, -.9063, -.0769, -.9796, -.1856, -.3827, 0, -.9239, -.0769, .9796, -.1856, -.3754, -.1939, -.9063, -.1484, .9217, -.3583, -.3539, -.3805, -.8544, -.2142, .8286, -.5171, -.3189, -.5528, -.7699, -.2717, .704, -.6561, -.1116, .9796, -.1671, -.1116, -.9796, -.1671, -.5556, 0, -.8314, -.545, -.1939, -.8157, -.2155, .9217, -.3225, -.5137, -.3805, -.7689, -.311, .8286, -.4654, -.463, -.5528, -.6929, -.3945, .704, -.5904, -.3945, -.704, -.5904, -.463, .5528, -.6929, -.311, -.8286, -.4654, -.5137, .3805, -.7689, -.2155, -.9217, -.3225, -.545, .1939, -.8157, -.5021, .704, -.5021, -.5893, .5528, -.5893, -.3958, -.8286, -.3958, -.6539, .3805, -.6539, -.2743, -.9217, -.2743, -.6937, .1939, -.6937, -.1421, -.9796, -.1421, -.7071, 0, -.7071, -.1421, .9796, -.1421, -.6937, -.1939, -.6937, -.2743, .9217, -.2743, -.6539, -.3805, -.6539, -.3958, .8286, -.3958, -.5893, -.5528, -.5893, -.5021, -.704, -.5021, -.8157, -.1939, -.545, -.3225, .9217, -.2155, -.7689, -.3805, -.5137, -.4654, .8286, -.311, -.6929, -.5528, -.463, -.5904, .704, -.3945, -.5904, -.704, -.3945, -.6929, .5528, -.463, -.4654, -.8286, -.311, -.7689, .3805, -.5137, -.3225, -.9217, -.2155, -.8157, .1939, -.545, -.1671, -.9796, -.1116, -.8314, 0, -.5556, -.1671, .9796, -.1116, -.5171, -.8286, -.2142, -.8544, .3805, -.3539, -.3583, -.9217, -.1484, -.9063, .1939, -.3754, -.1856, -.9796, -.0769, -.9239, 0, -.3827, -.1856, .9796, -.0769, -.9063, -.1939, -.3754, -.3583, .9217, -.1484, -.8544, -.3805, -.3539, -.5171, .8286, -.2142, -.7699, -.5528, -.3189, -.6561, .704, -.2717, -.6561, -.704, -.2717, -.7699, .5528, -.3189, -.3804, .9217, -.0757, -.907, -.3805, -.1804, -.549, .8286, -.1092, -.8173, -.5528, -.1626, -.6965, .704, -.1385, -.6965, -.704, -.1385, -.8173, .5528, -.1626, -.549, -.8286, -.1092, -.907, .3805, -.1804, -.3804, -.9217, -.0757, -.9622, .1939, -.1914, -.1971, -.9796, -.0392, -.9808, 0, -.1951, -.1971, .9796, -.0392, -.9622, -.1939, -.1914 ];
        this.itemSize = 3;
        this.numIndices = 2880;
    }
    Object.assign(Sphere.prototype, {});
    function VWing() {
        this.vertices = [ 0, 0, -7.3975, 0, -.2707, 0, 1.4678, 0, 0, 0, .5653, 1.8374, 0, 1.4694, 0, 0, -.2707, 0, 0, 1.553, -1.0874, 0, .7405, -5.3869, 2.3189, .251, 0, 1.4678, 0, 0, 1.6633, 2.6, 1.6982, 6.65, -.8596, 3.1485, 2.3189, .251, 0, 1.9333, -.2938, -1.9828, 1.4678, 0, 0, 2.3189, .251, 0, 1.4678, 0, 0, 1.4678, 0, 0, 1.6148, -.4246, -2.7743, 1.9333, -.2938, -1.9828, 1.4678, 0, 0, 1.6148, -.4246, -2.7743, 1.6148, -.4246, -2.7743, 1.9333, -.2938, -1.9828, -1.4678, 0, 0, 0, -.2707, 0, -2.3189, .251, 0, -1.6633, 2.6, 1.6982, -1.4678, 0, 0, -6.65, -.8596, 3.1485, -1.9333, -.2938, -1.9828, -2.3189, .251, 0, -1.4678, 0, 0, -2.3189, .251, 0, -1.4678, 0, 0, -1.4678, 0, 0, -1.6148, -.4246, -2.7743, -1.9333, -.2938, -1.9828, -1.6148, -.4246, -2.7743, -1.4678, 0, 0, -1.6148, -.4246, -2.7743, -1.9333, -.2938, -1.9828 ];
        this.indices = [ 0, 1, 2, 2, 3, 4, 5, 3, 2, 6, 2, 4, 7, 0, 2, 6, 7, 2, 8, 9, 10, 11, 12, 13, 11, 13, 14, 15, 11, 16, 17, 13, 18, 8, 10, 19, 10, 20, 21, 22, 23, 10, 0, 24, 1, 24, 4, 3, 25, 24, 3, 6, 4, 24, 7, 24, 0, 6, 24, 7, 26, 27, 28, 29, 30, 31, 29, 32, 30, 33, 34, 29, 35, 36, 30, 26, 37, 27, 27, 38, 39, 40, 27, 41 ];
        this.normals = [ 0, -.1063, -.9943, 0, -.9819, .1891, .9233, -.2975, .2427, 0, .0714, .9974, 0, .9697, .2443, 0, -.9819, .1891, 0, .9961, -.088, 0, .9478, -.3187, .553, .7911, .2613, -.7402, -.526, .4187, -.0528, .7418, .6686, .7771, -.1425, .6131, .553, .7911, .2613, .8324, -.4718, -.2906, -.7402, -.526, .4187, .553, .7911, .2613, -.7402, -.526, .4187, -.7402, -.526, .4187, -.1135, -.2998, -.9472, .8324, -.4718, -.2906, -.7402, -.526, .4187, -.1135, -.2998, -.9472, -.1135, -.2998, -.9472, .8324, -.4718, -.2906, -.9233, -.2975, .2427, 0, -.9819, .1891, -.553, .7911, .2613, .0528, .7418, .6686, .7402, -.526, .4187, -.7771, -.1425, .6131, -.8324, -.4718, -.2906, -.553, .7911, .2613, .7402, -.526, .4187, -.553, .7911, .2613, .7402, -.526, .4187, .7402, -.526, .4187, .1135, -.2998, -.9472, -.8324, -.4718, -.2906, .1135, -.2998, -.9472, .7402, -.526, .4187, .1135, -.2998, -.9472, -.8324, -.4718, -.2906 ];
        this.itemSize = 3;
        this.numIndices = 84;
    }
    Object.assign(VWing.prototype, {});
    function Texture(context, img) {
        this.img = img;
        this.WebGLTexture = context.createTexture();
        this.create(context);
    }
    Object.assign(Texture.prototype, {
        create: function(context) {
            context.bindTexture(context.TEXTURE_2D, this.WebGLTexture);
            context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
            context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
            context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, this.img);
            context.bindTexture(context.TEXTURE_2D, null);
        }
    });
    function Material() {
        this.ambient = null;
        this.diffuse = null;
        this.specular = null;
        this.shininess = null;
    }
    Object.assign(Material.prototype, {
        setAmbient: function() {},
        setDiffuse: function() {},
        setSpecular: function() {},
        setShininess: function() {},
        getAmbient: function() {
            return this.ambient;
        },
        getDiffuse: function() {
            return this.diffuse;
        },
        getSpecular: function() {
            return this.specular;
        },
        getShininess: function() {
            return this.shininess;
        }
    });
    exports.Scene = Scene;
    exports.WebGLRenderer = WebGLRenderer;
    exports.RendererTarget = RendererTarget;
    exports.PerspectiveCamera = PerspectiveCamera;
    exports.OrthographicCamera = OrthographicCamera;
    exports.Mesh = Mesh;
    exports.FullscreenQuad = FullscreenQuad;
    exports.Quad = Quad;
    exports.Cube = Cube;
    exports.Sphere = Sphere;
    exports.VWing = VWing;
    exports.Texture = Texture;
    exports.Material = Material;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});