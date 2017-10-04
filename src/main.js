var renderer, camera, scene, cube, geometry, material;
var size = 16;
var cubes = new THREE.Object3D();
var transparentCube;
var boardWidth = 25;
var boardLength = 25;
var cubeOpacity = 0.5;

initialize();
render();

function initialize(){
    renderer = new THREE.WebGLRenderer({canvas: document.getElementById('myCanvas'), antialias: true});
    renderer.setClearColor(0x555555);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(500,500,500);

    var controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    var light1 = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0xffffff, .8);
    light2.position.set(0, 1, 1);
    scene.add(light2);
    var light3 = new THREE.DirectionalLight(0xffffff, .4);
    light3.position.set(1, 0, 0);
    scene.add(light3);
    var light4 = new THREE.DirectionalLight(0xffffff, .4);
    light4.position.set(0, 0, 1);
    scene.add(light4);

    geometry = new THREE.BoxGeometry(size, size, size);

    createBoard();
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onmousemove, false);
    document.addEventListener("keydown", onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    transparentCube = getNewMesh(0,0,0);
    transparentCube.material.color.setHex(0xAAAAFF);
    transparentCube.material.transparent = true;
    transparentCube.material.opacity = cubeOpacity;
    scene.add(cubes);
    scene.add(transparentCube);
}

function createBoard(){
    for(var i = -boardWidth/2; i < boardWidth/2; i++){
        for(var j = -boardLength/2; j < boardLength/2; j++){
            cubes.add(getNewMesh(size*i, 0, size*j));
        }
    }
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}

function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3((event.clientX/window.innerWidth) * 2 - 1, - (event.clientY/window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var length = cubes.children.length;
    for(var i = length-1; i >= 0; i--){
        var cube = cubes.children[i];
        var x = cube.position.x;
        var y = cube.position.y;
        var z = cube.position.z;
        var intersects = raycaster.intersectObject(cube);
        if(intersects.length > 0){
            if(event.button == 2){
                cubes.remove(cube);
            }else{
                var index = Math.floor(intersects[0].faceIndex/2);
                if(index==0 && !spaceIsOccupied(x+size, y, z)){
                    cubes.add(getNewMesh(x+size, y, z));
                    break;
                }else if(index==1 && !spaceIsOccupied(x-size, y, z)){
                    cubes.add(getNewMesh(x-size, y, z));
                    break;
                }else if(index==2 && !spaceIsOccupied(x, y+size, z)){
                    cubes.add(getNewMesh(x, y+size, z));
                    break;
                }else if(index==4 && !spaceIsOccupied(x, y, z+size)){
                    cubes.add(getNewMesh(x, y, z+size));
                    break;
                }else if(index==5 && !spaceIsOccupied(x, y, z-size)){
                    cubes.add(getNewMesh(x, y, z-size));
                    break;
                }
            }
        }
    }
};

function spaceIsOccupied(x, y, z){
    for(var i = 0; i < cubes.children.length; i++){
        var sameXValues = x == cubes.children[i].position.x;
        var sameYValues = y == cubes.children[i].position.y;
        var sameZValues = z == cubes.children[i].position.z;
        if(sameXValues && sameYValues && sameZValues){
            return true;
        }
    }
    return false;
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

function getNewMesh(x, y, z){
    var color = Math.random()*0xffffff;
    var newMaterial = new THREE.MeshLambertMaterial({color: color})
    var newMesh = new THREE.Mesh(geometry, newMaterial);
    newMesh.position.set(x, y, z);
    return newMesh;
};

function onDocumentKeyDown(event){
    var keyCode = event.which;
    var theta = .3; //.785
    var zoom = 1;
    var x = camera.position.x;
    var z = camera.position.z;
    if (keyCode == 37 || keyCode == 65) {
        camera.position.x = x * Math.cos(theta) - z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) + x * Math.sin(theta);
        camera.lookAt(scene.position);
    }else if(keyCode == 39 || keyCode == 68) {
        camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
        camera.lookAt(scene.position);
    }else if(keyCode == 38 || keyCode == 87 || keyCode == 187){
        camera.zoom += zoom;
        camera.updateProjectionMatrix();
    }else if((keyCode == 40 || keyCode == 83 || keyCode == 189) && camera.zoom - zoom > 0){
        camera.zoom -= zoom;
        camera.updateProjectionMatrix();
    }
};

function onmousemove(event){
    var vector = new THREE.Vector3((event.clientX/window.innerWidth) * 2 - 1, - (event.clientY/window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var length = cubes.children.length;
    for(var i = length-1; i >= 0; i--){
        var cube = cubes.children[i];
        var x = cube.position.x;
        var y = cube.position.y;
        var z = cube.position.z;
        var intersects = raycaster.intersectObject(cube);
        if(intersects.length > 0){
            var index = Math.floor(intersects[0].faceIndex/2);
            transparentCube.material.opacity = cubeOpacity;
            if(index==0 && !spaceIsOccupied(x+size, y, z)){
                transparentCube.position.x = x+size;
                transparentCube.position.y = y;
                transparentCube.position.z = z;
                break;
            }else if(index==1 && !spaceIsOccupied(x-size, y, z)){
                transparentCube.position.x = x-size;
                transparentCube.position.y = y;
                transparentCube.position.z = z;
                break;
            }else if(index==2 && !spaceIsOccupied(x, y+size, z)){
                transparentCube.position.x = x;
                transparentCube.position.y = y+size;
                transparentCube.position.z = z;
                break;
            }else if(index==4 && !spaceIsOccupied(x, y, z+size)){
                transparentCube.position.x = x;
                transparentCube.position.y = y;
                transparentCube.position.z = z+size;
                break;
            }else if(index==5 && !spaceIsOccupied(x, y, z-size)){
                transparentCube.position.x = x;
                transparentCube.position.y = y;
                transparentCube.position.z = z-size;
                break;
            }
        }else{
            transparentCube.material.opacity = 0;
        }
    }
};