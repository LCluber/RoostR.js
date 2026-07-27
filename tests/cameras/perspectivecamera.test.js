import { PerspectiveCamera } from "../../dist/roostr";
import { createMockContext } from "../helpers/webgl-mock";

test("initializes position, target and up vectors", () => {
  const context = createMockContext();
  const camera = new PerspectiveCamera(45, 0.1, 1000, context);
  expect(camera.position.toArray()).toEqual([0, 0, 0]);
  expect(camera.target.toArray()).toEqual([0, 0, 0]);
  expect(camera.up.toArray()).toEqual([0, 1, 0]);
});

test("stores fov, zNear and zFar", () => {
  const context = createMockContext();
  const camera = new PerspectiveCamera(60, 1, 500, context);
  expect(camera.fov).toBe(60);
  expect(camera.zNear).toBe(1);
  expect(camera.zFar).toBe(500);
});

test("derives the aspect ratio from the context viewport", () => {
  const context = createMockContext({ viewport: [0, 0, 1280, 640] });
  const camera = new PerspectiveCamera(45, 0.1, 1000, context);
  expect(camera.ratio).toBe(2);
});

test("falls back to a viewport height of at least 1 to avoid dividing by zero", () => {
  const context = createMockContext({ viewport: [0, 0, 1280, 0] });
  const camera = new PerspectiveCamera(45, 0.1, 1000, context);
  expect(camera.ratio).toBe(1280);
});

test("computes a 4x4 projection matrix on construction", () => {
  const context = createMockContext();
  const camera = new PerspectiveCamera(45, 0.1, 1000, context);
  const projection = camera.getProjectionMatrix();
  expect(projection).toBeInstanceOf(Float32Array);
  expect(projection.length).toBe(16);
});

test("setProjectionMatrix recomputes the ratio and projection matrix from a new viewport", () => {
  const context = createMockContext();
  const camera = new PerspectiveCamera(45, 0.1, 1000, context);
  camera.setProjectionMatrix(new Int32Array([0, 0, 640, 480]));
  expect(camera.ratio).toBeCloseTo(640 / 480);
});
