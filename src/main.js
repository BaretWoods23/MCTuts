var renderer, camera, scene, controls, light, cube, geometry, material
var size = 16;
var cubes = new THREE.Object3D();

initialize();
render();
scene.add(cubes);

function initialize(){
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
    renderer.setClearColor(0x555555);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(500,500,500);

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.DirectionalLight(0xffffff, .7);
    light2.position.set(1, 1, 1);
    scene.add(light2);

    geometry = new THREE.BoxGeometry(size, size, size);
    material = new THREE.MeshLambertMaterial({color: 0xf3ff});
    cube = new THREE.Mesh(geometry, material);

    cubes.add(cube);
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
  var vector = new THREE.Vector3((event.clientX/window.innerWidth) * 2 - 1, - (event.clientY/window.innerHeight) * 2 + 1, 0.5);
  vector.unproject(camera);
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

  cubes.children.forEach(function(cube){
    var intersects = raycaster.intersectObject(cube);
    if(intersects.length > 0){
        if(event.button == 2){
            cubes.remove(cube);
        }else{
        var index = Math.floor(intersects[0].faceIndex/2);
        switch (index) {
            case 0: 
                    cubes.add(getNewMesh(cube.position.x+size, cube.position.y, cube.position.z));
                    break;
            case 1: 
                    cubes.add(getNewMesh(cube.position.x-size, cube.position.y, cube.position.z));
                    break;
            case 2: 
                    cubes.add(getNewMesh(cube.position.x, cube.position.y+size, cube.position.z));
                    break;
            case 4: 
                    cubes.add(getNewMesh(cube.position.x, cube.position.y, cube.position.z+size));
                    break;
            case 5: 
                    cubes.add(getNewMesh(cube.position.x, cube.position.y, cube.position.z-size));
                    break;
            }
        }
    }
  });
};

function getNewMesh(x, y, z){
    var color = Math.random()*0xffffff;
    var newMaterial = new THREE.MeshLambertMaterial({color: color})
    var newMesh = new THREE.Mesh(geometry, newMaterial);
    newMesh.position.set(x, y, z);
    return newMesh;
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var theta = .785;
    var zoom = 2;
    var x = camera.position.x;
    var z = camera.position.z;
    if (keyCode == 37 || keyCode == 65) {
        camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
        camera.lookAt(scene.position);
    }else if(keyCode == 39 || keyCode == 68) {
        camera.position.x = x * Math.cos(theta) - z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) + x * Math.sin(theta);
        camera.lookAt(scene.position);
    }else if(keyCode == 38 || keyCode == 87){
        camera.zoom += zoom;
        camera.updateProjectionMatrix();
    }else if((keyCode == 40 || keyCode == 83) && camera.zoom - zoom > 0){
        camera.zoom -= zoom;
        camera.updateProjectionMatrix();
    }
};