import { SpotLight } from "../../dist/roostr";

test("inherits PointLight defaults", () => {
  const light = new SpotLight();
  expect(light.constantAttenuation).toBe(0);
  expect(light.linearAttenuation).toBe(1.0);
  expect(light.quadraticAttenuation).toBe(0);
});

test("overrides type to 'spot'", () => {
  const light = new SpotLight();
  expect(light.type).toBe("spot");
});

test("initializes cutoff, exponent and direction defaults", () => {
  const light = new SpotLight();
  expect(light.cutoff).toBe(180);
  expect(light.exponent).toBe(0);
  expect(light.direction.toArray()).toEqual([1.0, 0.0, 0.0]);
});
