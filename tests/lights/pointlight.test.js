import { PointLight } from "../../dist/roostr";

test("inherits DirectionalLight defaults", () => {
  const light = new PointLight();
  expect(light.position.x).toBe(0);
  expect(light.diffuse.toArray()).toEqual([0.6, 0.6, 0.6]);
  expect(light.specular.toArray()).toEqual([0.8, 0.8, 0.8]);
});

test("overrides type to 'point'", () => {
  const light = new PointLight();
  expect(light.type).toBe("point");
});

test("initializes attenuation defaults", () => {
  const light = new PointLight();
  expect(light.constantAttenuation).toBe(0);
  expect(light.linearAttenuation).toBe(1.0);
  expect(light.quadraticAttenuation).toBe(0);
});
