/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var renderer, camera, scene, controls, light, mesh, geometry, material;
var size = 16;

initialize();
render();

function initialize() {
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas'), antialias: true });
    renderer.setClearColor(0x555555);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.set(500, 500, 500);

    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    scene = new THREE.Scene();

    light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.DirectionalLight(0xffffff, .7);
    light2.position.set(1, 1, 1);
    scene.add(light2);

    geometry = new THREE.BoxGeometry(size, size, size);
    material = new THREE.MeshLambertMaterial({ color: 0xf3ff });
    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(event.clientX / window.innerWidth * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
        if (event.button == 2) {
            scene.remove(mesh);
        } else {
            var index = Math.floor(intersects[0].faceIndex / 2);
            switch (index) {
                case 0:
                    scene.add(getNewMesh(mesh.position.x + size, 0, 0));
                    break;
                case 1:
                    scene.add(getNewMesh(mesh.position.x - size, 0, 0));
                    break;
                case 2:
                    scene.add(getNewMesh(0, mesh.position.y + size, 0));
                    break;
                case 4:
                    scene.add(getNewMesh(0, 0, mesh.position.z + size));
                    break;
                case 5:
                    scene.add(getNewMesh(0, 0, mesh.position.z - size));
                    break;
            }
        }
    }
}

function getNewMesh(x, y, z) {
    var newMesh = new THREE.Mesh(geometry, material);
    newMesh.position.set(x, y, z);
    return newMesh;
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    var theta = .785;
    var x = camera.position.x;
    var z = camera.position.z;
    if (keyCode == 37) {
        camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
        camera.lookAt(scene.position);
    } else if (keyCode == 39) {
        camera.position.x = x * Math.cos(theta) - z * Math.sin(theta);
        camera.position.z = z * Math.cos(theta) + x * Math.sin(theta);
        camera.lookAt(scene.position);
    } else if (keyCode == 38) {
        camera.zoom += theta;
        camera.updateProjectionMatrix();
    } else if (keyCode == 40) {
        camera.zoom -= theta;
        camera.updateProjectionMatrix();
    }
};

/***/ })
/******/ ]);