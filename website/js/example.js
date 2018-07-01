
  var shader = {};
  var lights = [];
  var mesh = {};
  var childMesh = {};
  var rotationSpeed = 0.5;
  var camera = {};

  var assetsLoader = new ORBIS.Loader(); // create an assets loader with its callbacks
  var animation    = new FRAMERAT.Player(animate);

  var renderer;
  var scene;
  var elapsedTime;
  var modal = WEE.Dom.findById('myModal');

  function loadAssets(){
    assetsLoader.launch('./assets.json', './','progressBar', 'progressText').then(
      function(){
        console.log('complete');
        //console.log(assetsLoader.assets);
        init();
        closeModal();
      }
    );
  }

  loadAssets();

  function closeModal() {
    modal.style.display = 'none';
  }

  function init() {

    renderer = new ROOSTR.Renderer('canvas');
    scene = new ROOSTR.Scene(renderer.getContext());

    sun = new ROOSTR.DirectionalLight();
    sun.setPosition(0.34, 0.66, 0.0);
    sun.setDiffuse(1.0, 0.0, 0.0);
    scene.addLight(sun);
    //
    sun2 = new ROOSTR.DirectionalLight();
    sun2.setPosition(-0.34, 0.66, 0.0);
    sun2.setDiffuse(0.0, 0.0, 1.0);
    scene.addLight(sun2);
    
    mesh = new ROOSTR.Mesh( new ROOSTR.VWing(), renderer.getContext() );
    childMesh = new ROOSTR.Mesh( new ROOSTR.Cannon(), renderer.getContext() );

    childMesh.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    childMesh.addCustomUniform('lightDiffuse', 'uniform3fv', scene.getLightsProperty('diffuse'));
    childMesh.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));

    var material = new ROOSTR.Material();
    childMesh.addProgram( assetsLoader.getAsset('flat-shading_vert.glsl').asset.response,
                          assetsLoader.getAsset('flat-shading_frag.glsl').asset.response,
                          material
                      );
    // childMesh.activateBlendMode();
    mesh.addChild(childMesh);
    //
    mesh.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    mesh.addCustomUniform('lightDiffuse', 'uniform3fv', scene.getLightsProperty('diffuse'));
    mesh.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));
    // childMesh2 = new ROOSTR.Mesh( new ROOSTR.Cube(), renderer.getContext() );
    // childMesh2.createProgram( assetsLoader.getAsset('flat-shading_vert.glsl').asset.response,
    //                     assetsLoader.getAsset('flat-shading_frag.glsl').asset.response
    //                   );
    // mesh.addChild(childMesh2);

    //mesh = new ROOSTR.Mesh( new ROOSTR.FullscreenQuad(), renderer.getContext() );
    //compile shader
    mesh.addProgram(  assetsLoader.getAsset('flat-shading_vert.glsl').asset.response,
                      assetsLoader.getAsset('flat-shading_frag.glsl').asset.response,
                      material
                    );
    mesh.addProgram(  assetsLoader.getAsset('emissive_vert.glsl').asset.response,
                      assetsLoader.getAsset('emissive_frag.glsl').asset.response,
                      null
                    );
    scene.addMesh(mesh);
    camera = new ROOSTR.PerspectiveCamera( 45, 0.1, 1000, renderer.getContext() );
    // var viewport = renderer.getContext().getParameter(renderer.getContext().VIEWPORT);
    // var ratio = viewport[2] / Math.max(1, viewport[3]);
    // var distance = 5;
    // camera = new ROOSTR.OrthographicCamera( -distance*ratio, distance*ratio, distance, -distance, 1, 100 );
    camera.setPosition(0.0,0.0,12.0);
    //camera.setViewMatrix();

    render(0);
  	// geometry = new THREE.BoxGeometry( 200, 200, 200 );
  	// material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    //
  	// mesh = new THREE.Mesh( geometry, material );
  	// scene.add( mesh );
    //
  	//renderer = new ROOSTR.WebGLRenderer(scene.context);
    //console.log(renderer);
  	// renderer.setSize( window.innerWidth, window.innerHeight );
    //
  	// document.body.appendChild( renderer.domElement );

    //console.log(scene);

  }

  function animate(){
    renderer.clearFrame();
    render(animation.getTotal());
    //renderer.render(time);
    majTime();
    majFPS();
    animation.requestNewFrame();
  }

  var translate = new TYPE6.Vector3(0.0,-0.56,-2.4525);
  function render(time){
    var rot = rotationSpeed * time;

    childMesh.modelMatrix.identity();
    childMesh.modelMatrix.translate(translate);

    // translateX = -2.5;
    // translateY = 0.0;
    // childMesh2.modelMatrix.identity();
    // childMesh2.modelMatrix.translateTo(translateX,translateY,0.0);

    mesh.modelMatrix.rotateX(rot);
    mesh.rotationMatrix.rotateY(rot);
    mesh.modelMatrix.multiply(mesh.rotationMatrix);
    mesh.rotationMatrix.rotateZ(rot);
    mesh.modelMatrix.multiply(mesh.rotationMatrix);

    // mesh.setCustomUniform('lightPosition', scene.getLightsProperty('position'));
    // mesh.setCustomUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    // mesh.setCustomUniform('lightSpecular', scene.getLightsProperty('specular'));
    //
    // childMesh.setCustomUniform('lightPosition', scene.getLightsProperty('position'));
    // childMesh.setCustomUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    // childMesh.setCustomUniform('lightSpecular', scene.getLightsProperty('specular'));

    scene.render(camera,time);
  }

  function playAnimation(){
    var state = animation.toggle();
    var button = WEE.Dom.findById('play');
    if(state === 'running') {
      button.innerHTML = "<span class='glyphicon glyphicon-pause'></span>";
    }else if (state === 'paused') {
      button.innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    }
  }

  function stopAnimation () {
    animation.stop();
    WEE.Dom.findById('play').innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    majConsole();
    renderer.clearFrame();
  }

  function majTime() {
    WEE.Dom.findById('time').innerHTML = formatTime(TYPE6.Utils.round(animation.getTotal(), 2));
  }

  function majFPS() {
    WEE.Dom.findById('fps').innerHTML = formatFPS(Math.round(animation.getFPS()));
    //WEE.Dom.findById('fps').innerHTML = animation.getFramePerSecond() + ' fps - ' + animation.getFormatedDelta() + ' ms';
  }

  function formatTime(value){
    var zeros = '';
    for (var i = 100 ; i > 1 ; i /= 10) {
      if (value < i) {
        zeros += '0';
      }
    }
    return zeros + value.toFixed(2);
  }

  function formatFPS(value){
    if (value < 10) {
      return '0' + value + ' fps';
    }
    return value + ' fps';
  }
