
  var shader = {};
  
  var mesh = {};
  var rotationSpeed = 0.5;
  var camera = {};
  
  var assetsLoader = ORBIS.create(updateProgress, animateProgress, loadingComplete, 0, 0); // create an assets loader with its callbacks
  var animation    = FRAMERAT.create(animate);

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

    scene = new ROOSTR.Scene('canvas');
    
    mesh = new ROOSTR.Mesh( new ROOSTR.Cube(), scene.getContext() );
    //compile shader
    mesh.createProgram( assetsLoader.getAsset('flat-shading_vert.glsl').response.data,
                        assetsLoader.getAsset('flat-shading_frag.glsl').response.data
                      );
    
    scene.add(mesh);
    
    camera = new ROOSTR.Camera( 45, 0.1, 1000, scene.getContext() );
    camera.setPosition(TYPE6.Vector3.create(0.0,0.0,5.0));
    camera.setViewMatrix();
  
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
    scene.clearFrame();
    render(animation.getElapsedTime().getSecond());
    //renderer.render(time);
    majConsole();
    animation.newFrame();
  }
  
  function render(time){
    var rot = rotationSpeed * time;
    mesh.modelMatrix.rotateXBy(rot);
    mesh.rotationMatrix.rotateYBy(rot);
    mesh.modelMatrix.multiplyBy(mesh.rotationMatrix);
    mesh.rotationMatrix.rotateZBy(rot);
    mesh.modelMatrix.multiplyBy(mesh.rotationMatrix);
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
    scene.clearFrame();
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
