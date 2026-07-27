import { Cannon } from "../../dist/roostr";

test("has vertices divisible by itemSize (3 components per vertex)", () => {
  const cannon = new Cannon();
  expect(cannon.vertices.length).toBe(102);
  expect(cannon.vertices.length % cannon.itemSize).toBe(0);
});

test("has one normal component for every vertex component", () => {
  const cannon = new Cannon();
  expect(cannon.normals.length).toBe(cannon.vertices.length);
});

test("has indices describing triangles (multiple of 3)", () => {
  const cannon = new Cannon();
  expect(cannon.indices.length).toBe(90);
  expect(cannon.indices.length % 3).toBe(0);
});

test("sets a single submesh spanning all indices", () => {
  const cannon = new Cannon();
  expect(cannon.subMeshes.length).toBe(1);
  expect(cannon.subMeshes[0].start).toBe(0);
  expect(cannon.subMeshes[0].count).toBe(90);
});

test("inherits itemSize 3 and primitive TRIANGLES from BasicMesh", () => {
  const cannon = new Cannon();
  expect(cannon.itemSize).toBe(3);
  expect(cannon.primitive).toBe("TRIANGLES");
});
