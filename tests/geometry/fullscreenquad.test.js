import { FullscreenQuad } from "../../dist/roostr";

test("creates a FullscreenQuad spanning normalized device coordinates", () => {
  const quad = new FullscreenQuad();
  expect(quad.vertices).toEqual([
    1.0, -1.0,
    -1.0, -1.0,
    1.0, 1.0,
    -1.0, 1.0,
  ]);
});

test("sets the expected uvs", () => {
  const quad = new FullscreenQuad();
  expect(quad.uvs).toEqual([
    1.0, 0.0,
    0.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ]);
});

test("sets a single submesh spanning all 4 vertices", () => {
  const quad = new FullscreenQuad();
  expect(quad.subMeshes.length).toBe(1);
  expect(quad.subMeshes[0].start).toBe(0);
  expect(quad.subMeshes[0].count).toBe(4);
});

test("sets itemSize to 2 (2D vertices)", () => {
  const quad = new FullscreenQuad();
  expect(quad.itemSize).toBe(2);
});

test("sets primitive to TRIANGLE_STRIP", () => {
  const quad = new FullscreenQuad();
  expect(quad.primitive).toBe("TRIANGLE_STRIP");
});
