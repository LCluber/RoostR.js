
  var shader = {};
  var lights = [];
  var mesh = {};
  var rotationSpeed = 0.5;
  var camera = {};
  
  var assetsLoader = ORBIS.create(updateProgress, animateProgress, loadingComplete, 0, 0); // create an assets loader with its callbacks
  var animation    = FRAMERAT.create(animate);

  var renderer;
  var scene;
  var elapsedTime;
  var modal              = findById('myModal'); 
  var progressBar        = findById('progressBar');
  var progressPercentage = findById('progressPercentage');
  var progressFile       = findById('progressFile');
  
  function loadAssets(){
    assetsLoader.launch('assets.json', '/');
  }

  function updateProgress( progress, file ) {
    progressPercentage.innerHTML = progress + '%';
    progressFile.innerHTML       = file.name;
  }

  function animateProgress( percentage ){
    progressBar.value = percentage;
  }
  
  loadAssets();

  function loadingComplete( logs ) {
    console.log(logs);
    init();
    closeModal();
  }
  
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
    
    sun2 = new ROOSTR.DirectionalLight();
    sun2.setPosition(-0.34, 0.66, 0.0);
    sun2.setDiffuse(0.0, 0.0, 1.0);
    scene.addLight(sun2);
    
    mesh = new ROOSTR.Mesh( new ROOSTR.VWing(), renderer.getContext() );
    childMesh = new ROOSTR.Mesh( new ROOSTR.Gun0(), renderer.getContext() );
    
    childMesh.addUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    childMesh.addUniform('lightDiffuse', 'uniform3fv', scene.getLightsProperty('diffuse'));
    childMesh.addUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));
    
    childMesh.addMaterial( assetsLoader.getAsset('flat-shading_vert.glsl').response.data,
                        assetsLoader.getAsset('flat-shading_frag.glsl').response.data
                      );
    //childMesh.activateBlendMode();
    mesh.addChild(childMesh);
  
    mesh.addUniform('lightPosition', 'uniform3fv', scene.getLightsProperty('position'));
    mesh.addUniform('lightDiffuse', 'uniform3fv', scene.getLightsProperty('diffuse'));
    mesh.addUniform('lightSpecular', 'uniform3fv', scene.getLightsProperty('specular'));
    // childMesh2 = new ROOSTR.Mesh( new ROOSTR.Cube(), renderer.getContext() );
    // childMesh2.createProgram( assetsLoader.getAsset('flat-shading_vert.glsl').response.data,
    //                     assetsLoader.getAsset('flat-shading_frag.glsl').response.data
    //                   );
    // mesh.addChild(childMesh2);
    
    //mesh = new ROOSTR.Mesh( new ROOSTR.FullscreenQuad(), renderer.getContext() );
    //compile shader
    mesh.addMaterial( assetsLoader.getAsset('flat-shading_vert.glsl').response.data,
                        assetsLoader.getAsset('flat-shading_frag.glsl').response.data
                      );
    mesh.addMaterial( assetsLoader.getAsset('emissive_vert.glsl').response.data,
                        assetsLoader.getAsset('emissive_frag.glsl').response.data
                      );
    
    scene.addMesh(mesh);
    camera = new ROOSTR.PerspectiveCamera( 45, 0.1, 1000, renderer.getContext() );
    // var viewport = renderer.getContext().getParameter(renderer.getContext().VIEWPORT);
    // var ratio = viewport[2] / Math.max(1, viewport[3]);
    // var distance = 5;
    // camera = new ROOSTR.OrthographicCamera( -distance*ratio, distance*ratio, distance, -distance, 1, 100 );
    camera.setPosition(TYPE6.Vector3.create(0.0,0.0,12.0));
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
  
  function majConsole(){
    majTime();
    majFPS();
  }
  
  function animate(){
    renderer.clearFrame();
    render(animation.getElapsedTime().getSecond());
    //renderer.render(time);
    majConsole();
    animation.newFrame();
  }
  
  function render(time){
    var rot = rotationSpeed * time;
    var translateX = 0.0;
    var translateY = -0.56;
    var translateZ = -2.4525;
    childMesh.modelMatrix.identity();
    childMesh.modelMatrix.translateTo(translateX,translateY,translateZ);
    
    // translateX = -2.5;
    // translateY = 0.0;
    // childMesh2.modelMatrix.identity();
    // childMesh2.modelMatrix.translateTo(translateX,translateY,0.0);
    
    mesh.modelMatrix.rotateXBy(rot);
    mesh.rotationMatrix.rotateYBy(rot);
    mesh.modelMatrix.multiplyBy(mesh.rotationMatrix);
    mesh.rotationMatrix.rotateZBy(rot);
    mesh.modelMatrix.multiplyBy(mesh.rotationMatrix);
    
    mesh.setUniform('lightPosition', scene.getLightsProperty('position'));
    mesh.setUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    mesh.setUniform('lightSpecular', scene.getLightsProperty('specular'));
    
    childMesh.setUniform('lightPosition', scene.getLightsProperty('position'));
    childMesh.setUniform('lightDiffuse', scene.getLightsProperty('diffuse'));
    childMesh.setUniform('lightSpecular', scene.getLightsProperty('specular'));
    
    scene.render(camera,time);
  }
  
  function playAnimation(){
    var state = animation.toggle();
    var button = findById('play');
    if(state === 'running') {
      button.innerHTML = "<span class='glyphicon glyphicon-pause'></span>";
    }else if (state === 'paused') {
      button.innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    }
  }

  function stopAnimation () {
    animation.stop();
    findById('play').innerHTML = "<span class='glyphicon glyphicon-play'></span>";
    majConsole();
    renderer.clearFrame();
  }
  
  function majTime() {
    findById('time').innerHTML = formatTime(animation.getElapsedTime().getSecond());
  }
  
  function majFPS() {
    findById('fps').innerHTML = formatFPS(animation.getFramePerSecond());
    //findById('fps').innerHTML = animation.getFramePerSecond() + ' fps - ' + animation.getFormatedDelta() + ' ms';
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
  
  function findById( id ) {
    return document.getElementById(id);
  }
