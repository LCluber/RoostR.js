
  var shader = {};
  var meshes = {};
  var lights = [];
  // var mesh = {};
  var childMesh = {};
  var rotationSpeed = 0.5;
  var camera = {};

  var assetsLoader = new Orbis.Loader(
    {
      "shaders":{
        "folder": "shaders",
        "files"	: [
          {"name":"flat-shading_vert.glsl"},
          {"name":"flat-shading_frag.glsl"},
          {"name":"emissive_vert.glsl"},
          {"name":"emissive_frag.glsl"}
        ]
      }
    },
    "./",
    "progressBar",
    "progressText"
  );

  var animation = new Framerat.Player(animate);

  var renderer;
  var scene;
  var elapsedTime;
  var modal = Wee.Dom.findById('myModal');

  var cameraDefaultPosition = {
    cube       : new Type6.Vector3(0.0, 0.0, 5.0),
    sphere     : new Type6.Vector3(0.0, 0.0, 4.0),
    vwing      : new Type6.Vector3(0.0, 0.0,12.0)
  };

  function loadAssets(){
    assetsLoader.launch().then(
      function(){
        // console.log('complete');
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

  function appendMeshesList(){
    var select = Wee.Dom.findById("meshes");
    for(var property in meshes ) {
      if(meshes.hasOwnProperty(property)) {
        Wee.Dom.addHTMLElement( select, 'option',{ textContent:property,
                                                   value:property
                                                  }
                              );
      }
    }
  }

  function init() {

    renderer = new Roostr.Renderer('canvas');
    scene = new Roostr.Scene(renderer.getContext());

    sun = new Roostr.DirectionalLight();
    sun.setPosition(new Type6.Vector3(0.34, 0.66, 0.0));
    sun.setDiffuse(new Type6.Vector3(1.0, 0.0, 0.0));
    scene.addLight(sun);
    //
    sun2 = new Roostr.DirectionalLight();
    sun2.setPosition(new Type6.Vector3(-0.34, 0.66, 0.0));
    sun2.setDiffuse(new Type6.Vector3(0.0, 0.0, 1.0));
    scene.addLight(sun2);

    meshes.vwing  = new Roostr.Mesh( new Roostr.VWing(),  renderer.getContext() );
    meshes.cube   = new Roostr.Mesh( new Roostr.Cube(),   renderer.getContext() );
    meshes.sphere = new Roostr.Mesh( new Roostr.Sphere(), renderer.getContext() );

    appendMeshesList();

    childMesh = new Roostr.Mesh( new Roostr.Cannon(), renderer.getContext() );

    childMesh.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    childMesh.addCustomUniform('lightDiffuse', 'uniform3fv', scene.getLightsProperty('diffuse'));
    childMesh.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));

    var material = new Roostr.Material();
    var vertShader = assetsLoader.getAsset('flat-shading_vert.glsl').xhr.response;
    var fragShader = assetsLoader.getAsset('flat-shading_frag.glsl').xhr.response;
    childMesh.addProgram( vertShader, fragShader, material );
    var translate = new Type6.Vector3(0.0,-0.56,-2.4525);
    childMesh.modelMatrix.identity();
    childMesh.modelMatrix.translate(translate);
    // childMesh.activateBlendMode();
    meshes.vwing.addChild(childMesh);

    meshes.vwing.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    meshes.vwing.addCustomUniform('lightDiffuse', 'uniform3fv',  scene.getLightsProperty('diffuse'));
    meshes.vwing.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));

    meshes.cube.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    meshes.cube.addCustomUniform('lightDiffuse', 'uniform3fv',  scene.getLightsProperty('diffuse'));
    meshes.cube.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));

    meshes.sphere.addCustomUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    meshes.sphere.addCustomUniform('lightDiffuse', 'uniform3fv',  scene.getLightsProperty('diffuse'));
    meshes.sphere.addCustomUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));

    //compile shader
    meshes.vwing.addProgram( vertShader, fragShader, material );
    meshes.vwing.addProgram( assetsLoader.getAsset('emissive_vert.glsl').xhr.response,
                      assetsLoader.getAsset('emissive_frag.glsl').xhr.response,
                      null
                    );

    meshes.cube.addProgram( vertShader, fragShader, material );
    meshes.sphere.addProgram( vertShader, fragShader, material );

    //scene.addMesh(meshes.vwing);
    camera = new Roostr.PerspectiveCamera( 45, 0.1, 1000, renderer.getContext() );
    //camera.setPosition(new Type6.Vector3(0.0,0.0,12.0));
    // var viewport = renderer.getContext().getParameter(renderer.getContext().VIEWPORT);
    // var ratio = viewport[2] / Math.max(1, viewport[3]);
    // var distance = 5;
    // camera = new Roostr.OrthographicCamera( -distance*ratio, distance*ratio, distance, -distance, 1, 100 );
    //camera.setViewMatrix();

    loadMesh('vwing');
  	// geometry = new THREE.BoxGeometry( 200, 200, 200 );
  	// material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    //
  	// mesh = new THREE.Mesh( geometry, material );
  	// scene.add( mesh );
    //
  	//renderer = new Roostr.WebGLRenderer(scene.context);
    //console.log(renderer);
  	// renderer.setSize( window.innerWidth, window.innerHeight );
    //
  	// document.body.appendChild( renderer.domElement );

    //console.log(scene);
    //render(0);
  }

  function animate(){
    renderer.clearFrame();
    render(animation.getTotal());
    //renderer.render(time);
    majTime();
    majFPS();
  }

  var translate = new Type6.Vector3(0.0,-0.56,-2.4525);
  function render(time){
    var rot = rotationSpeed * time;
    var meshName = Wee.Dom.findById('meshes').value;
    var mesh = meshes[meshName];
    // childMesh.modelMatrix.identity();
    // childMesh.modelMatrix.translate(translate);

    // translateX = -2.5;
    // translateY = 0.0;
    // childMesh2.modelMatrix.identity();
    // childMesh2.modelMatrix.translateTo(translateX,translateY,0.0);

    mesh.modelMatrix.rotateX(rot);
    mesh.rotationMatrix.rotateY(rot);
    mesh.modelMatrix.multiply(mesh.rotationMatrix);
    mesh.rotationMatrix.rotateZ(rot);
    mesh.modelMatrix.multiply(mesh.rotationMatrix);

    // meshes.vwing.setCustomUniform('lightPosition', scene.getLightsProperty('position'));
    // meshes.vwing.setCustomUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    // meshes.vwing.setCustomUniform('lightSpecular', scene.getLightsProperty('specular'));
    //
    // childMesh.setCustomUniform('lightPosition', scene.getLightsProperty('position'));
    // childMesh.setCustomUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    // childMesh.setCustomUniform('lightSpecular', scene.getLightsProperty('specular'));

    scene.render(camera,time);
  }


  function loadMesh(meshName){
    if(meshes.hasOwnProperty(meshName)){
      stopAnimation();
      scene.clearMeshes();
      for(var property in meshes) {
        if(meshes.hasOwnProperty(property)) {
          if(property === meshName) {
            scene.addMesh(meshes[property]);
            camera.setPosition(cameraDefaultPosition[property]);
          }
        }
      }
      render(0);
    }
  }

  function playAnimation(){
    var state = animation.toggle();
    var button = Wee.Dom.findById('play');
    if(state === 'running') {
      button.innerHTML = "<span class='glyphicon glyphicon-pause'></span>";
    }else if (state === 'paused') {
      button.innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    }
  }

  function stopAnimation () {
    animation.stop();
    Wee.Dom.findById('play').innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    // majConsole();
    renderer.clearFrame();
  }

  function majTime() {
    Wee.Dom.findById('time').innerHTML = formatTime(Type6.Utils.round(animation.getTotal(), 2));
  }

  function majFPS() {
    Wee.Dom.findById('fps').innerHTML = formatFPS(Math.round(animation.getFPS()));
    //Wee.Dom.findById('fps').innerHTML = animation.getFramePerSecond() + ' fps - ' + animation.getFormatedDelta() + ' ms';
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
