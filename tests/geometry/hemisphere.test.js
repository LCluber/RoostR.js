import { Hemisphere } from "../../dist/roostr";

test("has vertices divisible by itemSize (3 components per vertex)", () => {
  const hemisphere = new Hemisphere();
  expect(hemisphere.vertices.length).toBe(771);
  expect(hemisphere.vertices.length % hemisphere.itemSize).toBe(0);
});

test("has one normal component for every vertex component", () => {
  const hemisphere = new Hemisphere();
  expect(hemisphere.normals.length).toBe(hemisphere.vertices.length);
});

test("has indices describing triangles (multiple of 3)", () => {
  const hemisphere = new Hemisphere();
  expect(hemisphere.indices.length).toBe(1440);
  expect(hemisphere.indices.length % 3).toBe(0);
});

test("sets a single submesh spanning all indices", () => {
  const hemisphere = new Hemisphere();
  expect(hemisphere.subMeshes.length).toBe(1);
  expect(hemisphere.subMeshes[0].start).toBe(0);
  expect(hemisphere.subMeshes[0].count).toBe(1440);
});

test("inherits itemSize 3 and primitive TRIANGLES from BasicMesh", () => {
  const hemisphere = new Hemisphere();
  expect(hemisphere.itemSize).toBe(3);
  expect(hemisphere.primitive).toBe("TRIANGLES");
});
