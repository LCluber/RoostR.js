import { Material } from "../dist/roostr";

test("initializes default ambient, diffuse and specular colors", () => {
  const material = new Material();
  expect(material.ambient.toArray()).toEqual([0.5, 0.5, 0.5]);
  expect(material.diffuse.toArray()).toEqual([0.6, 0.6, 0.6]);
  expect(material.specular.toArray()).toEqual([0.8, 0.8, 0.8]);
});

test("initializes default shininess", () => {
  const material = new Material();
  expect(material.shininess).toBe(8.0);
});

test("builds a materialAmbient uniform of type uniform3fv matching ambient", () => {
  const material = new Material();
  expect(material.uniforms.materialAmbient.type).toBe("uniform3fv");
  expect(material.uniforms.materialAmbient.value).toEqual(material.ambient.toArray());
});

test("builds a materialDiffuse uniform of type uniform3fv matching diffuse", () => {
  const material = new Material();
  expect(material.uniforms.materialDiffuse.type).toBe("uniform3fv");
  expect(material.uniforms.materialDiffuse.value).toEqual(material.diffuse.toArray());
});

test("builds a materialSpecular uniform of type uniform3fv matching specular", () => {
  const material = new Material();
  expect(material.uniforms.materialSpecular.type).toBe("uniform3fv");
  expect(material.uniforms.materialSpecular.value).toEqual(material.specular.toArray());
});

test("builds a materialShininess uniform of type uniform1f matching shininess", () => {
  const material = new Material();
  expect(material.uniforms.materialShininess.type).toBe("uniform1f");
  expect(material.uniforms.materialShininess.value).toBe(material.shininess);
});
