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

export declare class Camera {
    viewMatrix: TYPE6.Matrix4x3;
    projectionMatrix: TYPE6.Matrix4x4;
    position: TYPE6.Vector3;
    target: TYPE6.Vector3;
    up: TYPE6.Vector3;
    constructor(position: TYPE6.Vector3, target: TYPE6.Vector3, up: TYPE6.Vector3);
    setViewMatrix(): void;
    setPosition(x: number, y: number, z: number): void;
    setTarget(x: number, y: number, z: number): void;
    setUp(x: number, y: number, z: number): void;
    getViewMatrix(): Float32Array;
    getProjectionMatrix(): Float32Array;
}

export declare class OrthographicCamera extends Camera {
    left: number;
    right: number;
    top: number;
    bottom: number;
    near: number;
    far: number;
    constructor(left: number, right: number, top: number, bottom: number, near: number, far: number);
    setProjectionMatrix(): void;
}

export declare class PerspectiveCamera extends Camera {
    fov: number;
    ratio: number;
    zNear: number;
    zFar: number;
    context: WebGLRenderingContext;
    constructor(fov: number, zNear: number, zFar: number, context: WebGLRenderingContext);
    setProjectionMatrix(): void;
}

export declare class Cannon {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor();
}

export declare class Cube {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor(size: number);
}

export declare class CustomMesh {
    vertices: Float32Array;
    indices: Int32Array;
    normals: Float32Array;
    uvs: Float32Array;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    primitives: Array<string>;
    constructor();
    setVertices(array: Float32Array): void;
    setIndices(array: Int32Array): void;
    setNormals(array: Float32Array): void;
    setUvs(array: Float32Array): void;
    addSubMeshes(array: Float32Array): void;
    addSubMesh(start: number, count: number): void;
    setItemSize(itemSize: number): void;
    setPrimitive(primitive: string): boolean;
}

export declare class FullscreenQuad {
    vertices: Array<number>;
    uvs: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor();
}

export declare class Hemisphere {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor();
}

export declare class Line {
    vertices: Array<number>;
    thickness: number;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor(vertices: Array<number>, thickness: number);
}

export interface IQuad {
    vertices: Float32Array;
    indices: Int32Array;
    uvs: Float32Array;
}
export declare class MultiQuad {
    vertices: Array<number>;
    indices: Array<number>;
    uvs: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    quad: IQuad;
    constructor(width: number, height: number, quantity: number);
    private createQuads(length);
    private createIndices(quadIndex);
}

export declare class Quad {
    vertices: Array<number>;
    uvs: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor(width: number, height: number);
}

export declare class Sphere {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor();
}
export declare class SubMesh {
    start: number;
    count: number;
    constructor(start: number, count: number);
}

export declare class VWing {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    subMeshes: Array<SubMesh>;
    itemSize: number;
    nbSubMeshes: number;
    primitive: string;
    constructor();
}

export declare type Light = 'directional' | 'point' | 'spot';
export declare class DirectionalLight {
    position: TYPE6.Vector3;
    diffuse: TYPE6.Vector3;
    specular: TYPE6.Vector3;
    type: Light;
    constructor();
    setPosition(x: number, y: number, z: number): void;
    setDiffuse(x: number, y: number, z: number): void;
    setSpecular(x: number, y: number, z: number): void;
    getPosition(): TYPE6.Vector3;
    getDiffuse(): TYPE6.Vector3;
    getSpecular(): TYPE6.Vector3;
}

export declare class PointLight extends DirectionalLight {
    constantAttenuation: number;
    linearAttenuation: number;
    quadraticAttenuation: number;
    constructor();
    setConstantAttenuation(): void;
    setLinearAttenuation(): void;
    setQuadraticAttenuation(): void;
    getConstantAttenuation(): number;
    getLinearAttenuation(): number;
    getQuadraticAttenuation(): number;
}


export declare class SpotLight extends PointLight {
    cutoff: number;
    exponent: number;
    direction: TYPE6.Vector3;
    constructor();
    setCutoff(): void;
    setExponent(): void;
    setDirection(): void;
    getCutoff(): number;
    getExponent(): number;
    getDirection(): TYPE6.Vector3;
}


export interface IMaterialUniforms {
    materialAmbient: Uniform;
    materialDiffuse: Uniform;
    materialSpecular: Uniform;
    materialShininess: Uniform;
}
export declare class Material {
    ambient: TYPE6.Vector3;
    diffuse: TYPE6.Vector3;
    specular: TYPE6.Vector3;
    shininess: number;
    uniforms: IMaterialUniforms;
    constructor();
}






export declare enum eDrawMethod {
    drawElements = "drawElements",
    drawArrays = "drawArrays",
}
export interface IProgram extends WebGLProgram {
    vertexNormal: GLint;
    vertexPosition: GLint;
    textureCoord: GLint;
    sampler: WebGLUniformLocation;
    modelMatrix: WebGLUniformLocation;
    projectionMatrix: WebGLUniformLocation;
    viewMatrix: WebGLUniformLocation;
    time: WebGLUniformLocation;
    screenResolution: WebGLUniformLocation;
}
export declare class Mesh {
    vertices: Array<number>;
    indices: Array<number>;
    normals: Array<number>;
    uvs: Array<number>;
    itemSize: number;
    subMeshes: Array<SubMesh>;
    nbSubMeshes: number;
    primitive: string;
    customUniforms: object;
    context: WebGLRenderingContext;
    renderer: MeshRenderer;
    WebGLTexture: WebGLTexture;
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    normalBuffer: WebGLBuffer;
    texCoordBuffer: WebGLBuffer;
    modelMatrix: TYPE6.Matrix4x3;
    rotationMatrix: TYPE6.Matrix4x3;
    worldMatrix: TYPE6.Matrix4x3;
    active: boolean;
    drawMethod: eDrawMethod;
    programs: Array<IProgram>;
    nbPrograms: number;
    materials: Array<Material>;
    children: Array<Mesh>;
    blendMode: boolean;
    zOrder: number;
    constructor(mesh: Mesh, context: WebGLRenderingContext);
    setActive(): void;
    setInactive(): void;
    toggleActive(): boolean;
    isActive(): boolean;
    addChild(mesh: Mesh): void;
    addProgram(vertexShader: string, fragmentShader: string, material: Material): boolean;
    addMaterial(material: Material): boolean;
    setWorldMatrix(worldMatrix: TYPE6.Matrix4x3): void;
    setTexture(img: HTMLImageElement): void;
    addCustomUniform(name: string, type: string, value: number | Array<number>): void;
    setCustomUniform(name: string, value: string): void;
    private createProgram();
    private addProgramAttribute(name);
    private addProgramUniform(name);
    activateBlendMode(): void;
    deactivateBlendMode(): void;
    computeWorldMatrix(graph: SceneGraph): void;
    render(projectionMatrix: Float32Array, viewMatrix: Float32Array, lights: IFlatLights, time: number, blendMode: boolean): void;
}
export declare class Program {
    static create(context: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram;
}
export declare class Renderer {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    constructor(canvasID: string);
    defaultSettings(): void;
    setFrontFace(mode: string): void;
    enable(capability: string): void;
    disable(capability: string): void;
    setCullFace(mode: string): void;
    setViewport(width: number, height: number): void;
    setClearColor(red: number, green: number, blue: number, alpha: number): void;
    clearFrame(): void;
    getContext(): WebGLRenderingContext;
}

export declare class MeshRenderer {
    context: WebGLRenderingContext;
    constructor(context: WebGLRenderingContext);
    defaultSettings(): void;
    createBuffer(target: string, size: number | ArrayBufferView | ArrayBuffer, drawMethod: string): WebGLBuffer;
    useProgram(program: WebGLProgram): void;
    bindBuffer(target: string, buffer: WebGLBuffer): void;
    vertexAttribPointer(index: number, size: number, type: string, normalized: boolean, stride: number, offset: number): void;
    drawElements(primitive: string, subMesh: SubMesh): void;
    drawArrays(primitive: string, subMesh: SubMesh): void;
}
export declare class SceneRenderer {
    context: WebGLRenderingContext;
    constructor(context: WebGLRenderingContext);
    defaultSettings(): void;
    enable(capability: string): void;
    disable(capability: string): void;
    setDepthFunc(mode: string): void;
    setBlendFunction(sourceFactor: string, destinationFactor: string): void;
    setBlendEquation(mode: string): void;
    enableDepthTest(): void;
    disableDepthTest(): void;
    enableBlendMode(equation: string, source: string, destination: string): void;
    disableBlendMode(): void;
    getParameter(parameterName: GLenum): GLenum | Float32Array | GLint | WebGLBuffer | GLboolean | Array<GLboolean> | GLfloat | WebGLFramebuffer | Int32Array | GLuint | WebGLTexture;
}























export declare type Light = DirectionalLight | PointLight | SpotLight;
export interface IFlatLights {
    position: Array<number>;
    diffuse: Array<number>;
    specular: Array<number>;
    constantAttenuation: Array<number>;
    linearAttenuation: Array<number>;
    quadraticAttenuation: Array<number>;
    cutoff: Array<number>;
    exponent: Array<number>;
    direction: Array<number>;
    type: Array<number>;
}
export declare class Lights {
    directionals: Array<DirectionalLight>;
    points: Array<PointLight>;
    spots: Array<SpotLight>;
    nbDirectionals: number;
    nbPoints: number;
    nbSpots: number;
    flatArrays: IFlatLights;
    types: Array<string>;
    nbTypes: number;
    constructor();
    addLight(light: Light): void;
    private ClearFlatArrays();
    flatten(): IFlatLights;
    getFlatArray(property: string): any;
}






export declare type Light = DirectionalLight | PointLight | SpotLight;
export declare class Scene {
    meshes: Array<Mesh>;
    nbMeshes: number;
    lights: Lights;
    private context;
    private renderer;
    private graph;
    constructor(context: WebGLRenderingContext);
    addMesh(mesh: Mesh): void;
    addLight(light: Light): void;
    getLightsProperty(property: string): Array<number>;
    enableBlendMode(equation: string, source: string, destination: string): void;
    disableBlendMode(): void;
    getRendererBlendMode(): GLenum | Float32Array | GLint | WebGLBuffer | GLboolean | Array<GLboolean> | GLfloat | WebGLFramebuffer | Int32Array | GLuint | WebGLTexture;
    render(camera: Camera, time: number): void;
    private computeWorldMatrices();
    private renderBlended(camera, time);
}

export declare class SceneGraph {
    model: Array<TYPE6.Matrix4x3>;
    nbModel: number;
    modelStackTop: number;
    constructor(context: WebGLRenderingContext);
    pushModelMatrix(modelMatrix: TYPE6.Matrix4x3): void;
    popModelMatrix(): void;
    getWorldMatrix(): TYPE6.Matrix4x3;
}
export declare type ShaderType = 'VERTEX_SHADER' | 'FRAGMENT_SHADER';
export declare class Shader {
    static create(context: WebGLRenderingContext, str: string, type: ShaderType): WebGLShader;
}
export declare class Texture {
    static create(img: HTMLImageElement, context: WebGLRenderingContext): WebGLTexture;
}
export declare class Uniform {
    type: string;
    value: number | Array<number>;
    constructor(type: string, value: number | Array<number>);
}
