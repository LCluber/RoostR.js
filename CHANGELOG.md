Version 0.5.7 (January 04th 2019)
-----------------------------
 * Updated typings for Angular

Version 0.5.6 (December 22th 2019)
-----------------------------
 * Updated dependencies.

Version 0.5.5 (April 04th 2019)
-----------------------------
 * Improved typings.

Version 0.5.4 (December 16th 2018)
-----------------------------
 * Added clearMeshes() method to Scene class.
 * Added clearPrograms() method to Mesh class.
 * setPosition(), setTarget() and setUp() methods in Camera class now uses Vector3 as parameter.
 * setPosition(), setDiffuse() and setSpecular() methods in directionalLight class now uses Vector3 as parameter.

Version 0.5.3 (October 16th 2018)
-----------------------------
 * RoostR.js published on NPM at @lcluber/roostrjs.
 * Updated README.md with NPM installation procedure.

Version 0.5.2 (July 22th 2018)
------------------------------
 * Library exported as ES6 and IIFE modules instead of UMD.
 * ROOSTR namespace becomes Roostr

Version 0.5.1 (July 2nd 2018)
-----------------------------
* Documentation automatically generated in /doc folder
* Typedoc and grunt-typedoc added in devDependencies
* New "typedoc" task in Gruntfile.js
* Typescript upgraded to version 2.9.2

Version 0.5.0 (June 9th 2018)
------------------------------
 * Now written in Typescript. And can be used as a module.

Version 0.4.0 (September 16th 2017)
------------------------------
 * Added material class

Version 0.3.0 (September 10th 2017)
------------------------------
 * Added activateBlendMode() and deactivateBlendMode() to the Mesh class
 * Blend modes are now at material level instead of scene level
 * Added customMesh geometry to create custom shapes easily
 * Added lights classes for a better lights management system

Version 0.2.7 (August 27th 2017)
------------------------------
 * Added multi materials capability to the mesh class

Version 0.2.6 (August 26th 2017)
------------------------------
 * Added a scene graph and the ability to add children to a mesh with mesh.addChild(mesh) method.
 * Added Gun0 geometry.

Version 0.2.5 (August 15th 2017)
------------------------------
 * Ability to send custom uniforms to the shaders using addUniform() and setUniform() methods in the mesh class.

Version 0.2.4 (August 10th 2017)
------------------------------
 * Added Hemisphere geometry.

Version 0.2.3 (July 30th 2017)
------------------------------
 * Added Line geometry to draw lines.

Version 0.2.2 (July 23th 2017)
------------------------------
 * Added Quad geometry to draw quads.
 * Fixed a bug with texture coordinates.
 * Added enableDepthTest(), disableDepthTest(), enableBlendMode() and disableBlendMode() methods in rendererTarget class to facilitate blending modifications along the rendering loop.

Version 0.2.1 (July 14th 2017)
------------------------------
 * New PerspectiveCamera and OrthographicCamera classes to chose different types of projections.
 * New setDepthTest(), setBlendFunction() and setBlendEquation() methods in rendererTarget class to allow different types of blendings.

Version 0.2.0 (July 5th 2017)
------------------------------
 * Updated for open source release on GitHub
 * Code reworked
 * Dedicated website
 * Examples

Version 0.1.0 (July 1st 2014)
-----------------------------
 * initial version
