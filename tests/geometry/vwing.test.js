import { VWing } from "../../dist/roostr";

test("has vertices divisible by itemSize (3 components per vertex)", () => {
  const vwing = new VWing();
  expect(vwing.vertices.length).toBe(135);
  expect(vwing.vertices.length % vwing.itemSize).toBe(0);
});

test("has one normal component for every vertex component", () => {
  const vwing = new VWing();
  expect(vwing.normals.length).toBe(vwing.vertices.length);
});

test("has indices describing triangles (multiple of 3)", () => {
  const vwing = new VWing();
  expect(vwing.indices.length).toBe(84);
  expect(vwing.indices.length % 3).toBe(0);
});

test("defines two submeshes (hull + gun)", () => {
  const vwing = new VWing();
  expect(vwing.subMeshes.length).toBe(2);
  expect(vwing.subMeshes[0].start).toBe(0);
  expect(vwing.subMeshes[0].count).toBe(78);
  expect(vwing.subMeshes[1].start).toBe(78);
  expect(vwing.subMeshes[1].count).toBe(6);
});

test("inherits itemSize 3 and primitive TRIANGLES from BasicMesh", () => {
  const vwing = new VWing();
  expect(vwing.itemSize).toBe(3);
  expect(vwing.primitive).toBe("TRIANGLES");
});
