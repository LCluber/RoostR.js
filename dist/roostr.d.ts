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
import { Vector3, Matrix4x3, Matrix4x4 } from '@lcluber/type6js';
export declare class Camera {
    viewMatrix: Matrix4x3;
    projectionMatrix: Matrix4x4;
    position: Vector3;
    target: Vector3;
    up: Vector3;
    constructor(position: Vector3, target: Vector3, up: Vector3);
    protected setViewMatrix(): void;
    protected setPosition(vector3: Vector3): void;
    protected setTarget(vector3: Vector3): void;
    protected setUp(vector3: Vector3): void;
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
    constructor(fov: number, zNear: number, zFar: number, context: WebGLRenderingContext);
    setProjectionMatrix(viewport: Int32Array): void;
}


export declare class BasicMesh implements IGeometry {
    vertices: number[] | null;
    indices: number[] | null;
    normals: number[] | null;
    subMeshes: SubMesh[];
    itemSize: number;
    primitive: string;
    constructor();
}

export declare class Cannon extends BasicMesh {
    constructor();
}

export declare class Cube extends BasicMesh {
    constructor(size: number);
}

export declare class CustomMesh {
    vertices: Float32Array | null;
    indices: Int32Array | null;
    normals: Float32Array | null;
    uvs: Float32Array | null;
    subMeshes: SubMesh[];
    itemSize: number;
    primitive: string;
    primitives: string[];
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

export declare class FullscreenQuad extends BasicMesh {
    uvs: number[];
    constructor();
}

export declare class Hemisphere extends BasicMesh {
    constructor();
}

export declare class Line {
    vertices: number[];
    thickness: number;
    subMeshes: SubMesh[];
    itemSize: number;
    primitive: string;
    constructor(vertices: number[], thickness: number);
}

export interface IQuad {
    vertices: Float32Array;
    indices: Int32Array;
    uvs: Float32Array;
}
export declare class MultiQuad extends BasicMesh {
    uvs: number[];
    quad: IQuad;
    constructor(width: number, height: number);
    createQuads(length: number): void;
    private createIndices;
}


export declare class Quad extends BasicMesh {
    vertices: number[];
    uvs: number[];
    subMeshes: SubMesh[];
    itemSize: number;
    primitive: string;
    constructor(width: number, height: number);
}

export declare class Sphere extends BasicMesh {
    constructor();
}
export declare class SubMesh {
    start: number;
    count: number;
    constructor(start: number, count: number);
}

export declare class VWing extends BasicMesh {
    constructor();
}



export interface IGeometry {
    vertices: number[] | null;
    indices: number[] | null;
    normals: number[] | null;
    subMeshes: SubMesh[];
    itemSize: number | null;
    primitive: string | null;
    uvs?: number[] | null;
    nbSubMeshes?: number;
    quad?: {
        vertices: number[] | null;
        indices: number[] | null;
        uvs?: number[] | null;
    };
}
export interface IMesh extends IGeometry {
    customUniforms?: ICustomUniforms;
    context?: WebGLRenderingContext;
    renderer?: MeshRenderer;
    WebGLTexture?: WebGLTexture | null;
    vertexBuffer?: WebGLBuffer | null;
    indexBuffer?: WebGLBuffer | null;
    normalBuffer?: WebGLBuffer | null;
    texCoordBuffer?: WebGLBuffer | null;
    modelMatrix?: Matrix4x3;
    rotationMatrix?: Matrix4x3;
    worldMatrix?: Matrix4x3;
    active?: boolean;
    drawMethod?: eDrawMethod;
    programs?: IProgram[];
    nbPrograms?: number;
    materials?: Material[];
    children?: IMesh[];
    blendMode?: boolean;
    zOrder?: number;
}
export interface ICustomUniforms {
    [key: string]: Uniform;
}
export interface IMaterialUniforms {
    materialAmbient: Uniform;
    materialDiffuse: Uniform;
    materialSpecular: Uniform;
    materialShininess: Uniform;
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
export interface IFlatLights {
    position: number[];
    diffuse: number[];
    specular: number[];
    constantAttenuation: number[];
    linearAttenuation: number[];
    quadraticAttenuation: number[];
    cutoff: number[];
    exponent: number[];
    direction: number[];
    type: number[];
}

export declare class DirectionalLight {
    position: Vector3;
    diffuse: Vector3;
    specular: Vector3;
    type: Light;
    constructor();
    setPosition(vector3: Vector3): void;
    setDiffuse(vector3: Vector3): void;
    setSpecular(vector3: Vector3): void;
}

export declare class PointLight extends DirectionalLight {
    constantAttenuation: number;
    linearAttenuation: number;
    quadraticAttenuation: number;
    constructor();
    setConstantAttenuation(): void;
    setLinearAttenuation(): void;
    setQuadraticAttenuation(): void;
}

export declare class SpotLight extends PointLight {
    cutoff: number;
    exponent: number;
    direction: Vector3;
    constructor();
    setCutoff(): void;
    setExponent(): void;
    setDirection(): void;
}

export declare class Material {
    ambient: Vector3;
    diffuse: Vector3;
    specular: Vector3;
    shininess: number;
    uniforms: IMaterialUniforms;
    constructor();
}



export declare enum eDrawMethod {
    drawElements = "drawElements",
    drawArrays = "drawArrays"
}
export declare class Mesh implements IMesh {
    vertices: number[] | null;
    indices: number[] | null;
    normals: number[] | null;
    uvs: number[] | null;
    itemSize: number | null;
    subMeshes: SubMesh[];
    nbSubMeshes: number;
    primitive: string | null;
    customUniforms: ICustomUniforms;
    context: WebGLRenderingContext;
    renderer: MeshRenderer;
    WebGLTexture: WebGLTexture | null;
    vertexBuffer: WebGLBuffer | null;
    indexBuffer: WebGLBuffer | null;
    normalBuffer: WebGLBuffer | null;
    texCoordBuffer: WebGLBuffer | null;
    modelMatrix: Matrix4x3;
    rotationMatrix: Matrix4x3;
    worldMatrix: Matrix4x3;
    active: boolean;
    drawMethod: eDrawMethod;
    programs: IProgram[];
    nbPrograms: number;
    materials: Material[];
    children: Mesh[];
    blendMode: boolean;
    zOrder: number;
    constructor(mesh: IMesh, context: WebGLRenderingContext);
    setActive(): void;
    setInactive(): void;
    toggleActive(): boolean;
    isActive(): boolean;
    addChild(mesh: Mesh): void;
    addProgram(vertexShader: string, fragmentShader: string, material: Material): boolean;
    clearPrograms(): void;
    addMaterial(material: Material): boolean;
    setWorldMatrix(worldMatrix: Matrix4x3): void;
    setTexture(img: HTMLImageElement): void;
    addCustomUniform(name: string, type: string, value: number | Array<number>): void;
    setCustomUniform(name: string, value: number | number[]): void;
    private createProgram;
    private addProgramAttribute;
    private addProgramUniform;
    activateBlendMode(): void;
    deactivateBlendMode(): void;
    computeWorldMatrix(graph: SceneGraph): void;
    render(projectionMatrix: Float32Array, viewMatrix: Float32Array, lights: IFlatLights, time: number, blendMode: boolean): void;
    private ucfirst;
}
export declare class Program {
    static create(context: WebGLRenderingContext, vertexShader: string, fragmentShader: string): WebGLProgram | null;
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
    getContext(): WebGLRenderingContext | null;
    private findById;
}

export declare class MeshRenderer {
    context: WebGLRenderingContext;
    constructor(context: WebGLRenderingContext);
    defaultSettings(): void;
    createBuffer(target: string, size: ArrayBuffer | ArrayBufferView | null, drawMethod: string): WebGLBuffer | null;
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
























export declare class Lights {
    directionals: DirectionalLight[];
    points: PointLight[];
    spots: SpotLight[];
    nbDirectionals: number;
    nbPoints: number;
    nbSpots: number;
    flatArrays: IFlatLights;
    types: string[];
    nbTypes: number;
    constructor();
    private ucfirst;
    addLight(light: DirectionalLight | PointLight | SpotLight): void;
    private ClearFlatArrays;
    flatten(): IFlatLights;
    getFlatArray(property: string): any;
}






export declare class Scene {
    meshes: Mesh[];
    nbMeshes: number;
    lights: Lights;
    private context;
    private renderer;
    private graph;
    constructor(context: WebGLRenderingContext);
    addMesh(mesh: Mesh): void;
    addLight(light: DirectionalLight | PointLight | SpotLight): void;
    clearMeshes(): void;
    getLightsProperty(property: string): number[];
    enableBlendMode(equation: string, source: string, destination: string): void;
    disableBlendMode(): void;
    getRendererBlendMode(): GLenum | Float32Array | GLint | WebGLBuffer | GLboolean | GLboolean[] | GLfloat | WebGLFramebuffer | Int32Array | GLuint | WebGLTexture;
    render(camera: Camera, time: number): void;
    private computeWorldMatrices;
    private renderBlended;
}

export declare class SceneGraph {
    model: Array<Matrix4x3>;
    nbModel: number;
    modelStackTop: number;
    constructor();
    pushModelMatrix(modelMatrix: Matrix4x3): void;
    popModelMatrix(): void;
    getWorldMatrix(): Matrix4x3;
}
export declare type ShaderType = 'VERTEX_SHADER' | 'FRAGMENT_SHADER';
export declare class Shader {
    static create(context: WebGLRenderingContext, str: string, type: ShaderType): WebGLShader | null;
}
export declare class Texture {
    static create(img: HTMLImageElement, context: WebGLRenderingContext): WebGLTexture | null;
}
export declare type Light = 'directional' | 'point' | 'spot';
export declare class Uniform {
    type: string;
    value: number | number[];
    constructor(type: string, value: number | number[]);
}
