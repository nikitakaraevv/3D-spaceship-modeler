"use strict";


main();


function main() {

    const sceneThreeJs = {
        baseObject: null,
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null,
        dessin: true,
        animation: false,
        animationChange: false,
        waiting: Math.PI * 7 / 5,
        lastTime: 0,
        centre: {
            x: 1,
            y: 1,
            z: 1
        },
        scale: {
            x: 0.5,
            y: 0.5,
            z: 0.5
        },
        engines: [],
        ailes: []
    };

    // The data associated with picking
    const pickingData = {
        currentKey: null,
        enabled: false,
        engineCreation: false,
        enableDragAndDrop: false,
        enableScaling: false,
        selectableObjects: [], // Selectable objects by picking
        selectedObject: null, // The currently selected object
        selectedPlane: {
            p: null,
            n: null
        }, // The shot of the camera at the moment of selection. Plan given by a position p, and a normal n.
        currentEnginePoints: [],
        enableRotation: false,
        // Visual representations associated with picking
        visualRepresentation: {
            sphereSelection: null, // A sphere showing the point of intersection when picking
            sphereTranslation: null, // A sphere showing the current state of translation
        },
    };

    const drawingData = {
        drawingObjects: [],
        selectedObject: null,
        enableDrawing: false,
        drawing3DPoints: [],
        line: null,
    };


    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs, pickingData, drawingData);

    // *************************** //
    // Creation of a Three.js radius caster for calculating the intersection of an object and a radius
    // *************************** //
    const raycaster = new THREE.Raycaster();

    // Retrieving the size of the window as a variable apart
    const screenSize = {
        w: sceneThreeJs.renderer.domElement.clientWidth,
        h: sceneThreeJs.renderer.domElement.clientHeight
    };
    // Function to call at the click of the mouse: selection of an object
    //  (Creating a wrapper to pass the desired parameters)
    const wrapperMouseDown = function(event) {
        mouseEvents.onMouseDown(event, raycaster, pickingData, screenSize, sceneThreeJs.camera, sceneThreeJs.dessin, sceneThreeJs, drawingData);
    };
    document.addEventListener('mousedown', wrapperMouseDown);

    const wrapperMouseUp = function(event) {
        mouseEvents.onMouseUp(event, pickingData, sceneThreeJs.dessin, drawingData);
    };
    document.addEventListener('mouseup', wrapperMouseUp);

    // Function to call when moving the mouse: translation of the selected object
    const wrapperMouseMove = function(event) {
        mouseEvents.onMouseMove(event, raycaster, pickingData, screenSize, sceneThreeJs, drawingData);
    };
    document.addEventListener('mousemove', wrapperMouseMove);


    const wrapperKeyDown = function(event) {
        onKeyDown(event, pickingData, sceneThreeJs, drawingData);
    };
    const wrapperKeyUp = function(event) {
        onKeyUp(event, pickingData, sceneThreeJs, drawingData);
    };
    document.addEventListener('keydown', wrapperKeyDown);
    document.addEventListener('keyup', wrapperKeyUp);

    // *************************** //
    // Launch of the animation
    // *************************** //
    animationLoop(sceneThreeJs);
}

// Initializes the objects composing the 3D scene
function init3DObjects(sceneThreeJs, pickingData, drawingData) {

    initFrameXYZ(sceneThreeJs.sceneGraph);
    const sceneGraph = sceneThreeJs.sceneGraph;
    const centre = sceneThreeJs.centre;
    sceneThreeJs.sceneGraph.background = new THREE.Color(0x111122);

    // *************************** //
    // Creation of the initial spaceship geometry
    // *************************** //

    spaceshipGeometry.createSpaceship(sceneThreeJs, pickingData);


    // *********************** //
    /// A sphere showing the selected position
    // *********************** //
    const sphereSelection = new THREE.Mesh(primitive.Sphere(Vector3(0, 0, 0), 0.005), MaterialRGB(1, 0, 0));
    sphereSelection.name = "sphereSelection";
    sphereSelection.visible = false;
    sceneGraph.add(sphereSelection);
    pickingData.visualRepresentation.sphereSelection = sphereSelection;

    // *********************** //
    /// A sphere showing the position after translation
    // *********************** //
    const sphereTranslation = new THREE.Mesh(primitive.Sphere(Vector3(0, 0, 0), 0.005), MaterialRGB(0, 1, 0));
    sphereTranslation.name = "sphereTranslation";
    sphereTranslation.visible = false;
    sceneGraph.add(sphereTranslation);
    pickingData.visualRepresentation.sphereTranslation = sphereTranslation;



    const planeGeometry = primitive.Quadrangle(new THREE.Vector3(-1.5, -0.5, -0.5), new THREE.Vector3(-1.5, 1.5, -0.5), new THREE.Vector3(2.5, 1.5, -0.5), new THREE.Vector3(2.5, -0.5, -0.5));
    const materialGround = new THREE.MeshLambertMaterial({
        color: 0xC0C0C0,
        side: THREE.DoubleSide
    });
    var planeTexture = new THREE.TextureLoader().load('../images/CommandsMirror.png');
    materialGround.map = planeTexture;
    const plane = new THREE.Mesh(planeGeometry, materialGround);
    plane.name = "plane";
    plane.receiveShadow = true;
    drawingData.drawingObjects.push(plane);
    sceneGraph.add(plane);


    // Earth

    var earthMesh = planets.createEarth();
    sceneGraph.add(earthMesh)
    earthMesh.scale.x = earthMesh.scale.x * 10;
    earthMesh.scale.y = earthMesh.scale.y * 10;
    earthMesh.scale.z = earthMesh.scale.z * 10;
    var cloudMesh = planets.createEarthCloud();
    sceneGraph.add(cloudMesh)
    earthMesh.name = "earth";
    cloudMesh.name = "earthCloud";
    earthMesh.position.set(-20, 0, 0);
    earthMesh.add(cloudMesh)

    // Mars
    var marsMesh = planets.createMars();
    sceneGraph.add(marsMesh)
    marsMesh.scale.x = marsMesh.scale.x * 10;
    marsMesh.scale.y = marsMesh.scale.y * 10;
    marsMesh.scale.z = marsMesh.scale.z * 10;
    marsMesh.position.set(20, 0, 0);
    marsMesh.name = "mars";




    var geometry = new THREE.SphereGeometry(180, 64, 64)
    // create the material, using a texture of startfield
    var material = new THREE.MeshBasicMaterial()
    material.map = new THREE.TextureLoader().load('../images/galaxy_starfield.png')
    material.side = THREE.BackSide
    // create the mesh based on geometry and material
    var mesh = new THREE.Mesh(geometry, material)
    sceneGraph.add(mesh)
}


function onKeyDown(event, pickingData, sceneThreeJs, drawingData) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;
    // Relachement de ctrl : activation du mode picking
    if (ctrlPressed) {
        pickingData.currentKey = "CTRL";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    } else if (keyCode === 16 || keyCode === 18) {
        //sceneThreeJs.sceneGraph.remove(drawingData.line);
        //drawingData.line=null;
        drawingData.drawing3DPoints = []
        if (keyCode === 16) pickingData.currentKey = "SHIFT";
        else pickingData.currentKey = "OPTION";
        sceneThreeJs.controls.enabled = false;
        pickingData.engineCreation = true;
        pickingData.currentEnginePoints = [];
    } else if (keyCode === 90) {
        pickingData.currentKey = "Z";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    } else if (keyCode === 8) {
        pickingData.currentKey = "DELETE";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;

    } else if (keyCode === 67) {
        pickingData.currentKey = "C";
        pickingData.enabled = true;
        //sceneThreeJs.controls.enabled = false;

    } else if (keyCode === 82) {
        pickingData.currentKey = "R";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    } else if (keyCode === 27) {
        const plane = sceneThreeJs.sceneGraph.getObjectByName("plane");
        if (sceneThreeJs.animation === false) {
            sceneThreeJs.animation = true;
            sceneThreeJs.sceneGraph.remove(plane);
        } else {
            sceneThreeJs.animation = false;
        }
    }




}

function onKeyUp(event, pickingData, sceneThreeJs, drawingData) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;

    if (ctrlPressed === false && ((pickingData.currentKey === "CTRL") || (pickingData.currentKey === "Z") || (pickingData.currentKey === "DELETE") || (pickingData.currentKey === "C") || (pickingData.currentKey === "R"))) {
        pickingData.currentKey = null;
        pickingData.enabled = false;
        pickingData.enableDragAndDrop = false;
        pickingData.enableScaling = false;
        pickingData.enableRotation = false;
        sceneThreeJs.controls.enabled = true;
        pickingData.selectedObject = null;
        pickingData.visualRepresentation.sphereSelection.visible = false;
        pickingData.visualRepresentation.sphereTranslation.visible = false;
    } else if (pickingData.currentKey === "SHIFT") {
        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.engineCreation = false;

        if (pickingData.currentEnginePoints.length > 2) {
            sceneThreeJs.engines.push(pickingData.currentEnginePoints);

            var engineShape = new THREE.Shape(pickingData.currentEnginePoints); //enginePoints

            var extrudeSettings = {
                amount: 0.2,
                bevelEnabled: true,
                bevelSegments: 5,
                steps: 1,
                bevelSize: 0.1,
                bevelThickness: 0.4
            };

            var geometry = new THREE.ExtrudeGeometry(engineShape, extrudeSettings);
            const mat = new MaterialRGB(0.5, 0.5, 0.5);
            var texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
            mat.map = texture;

            var mesh = new THREE.Mesh(geometry, mat);

            var texture = new THREE.TextureLoader().load('../images/lensflare0_alpha.png');
            // do the material
            var fireGeometry = new THREE.PlaneGeometry(1, 1)
            var material = new THREE.MeshBasicMaterial({
                color: 0x000fff,
                map: texture,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                opacity: 10,
                depthWrite: false,
                transparent: true
            })
            var fire = new THREE.Mesh(fireGeometry, material)




            sceneThreeJs.sceneGraph.add(fire);
            sceneThreeJs.sceneGraph.add(mesh);
            fire.scale.multiplyScalar(0.75)

            mesh.add(fire);


            sceneThreeJs.baseObject.add(mesh);
            fire.position.x = mesh.position.x;
            fire.position.y = mesh.position.y;
            fire.position.z = mesh.position.z;
            pickingData.selectableObjects.push(mesh);
            pickingData.selectableObjects.push(fire);
        }


    } else if (pickingData.currentKey === "OPTION") {

        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.engineCreation = false;
        if (pickingData.currentEnginePoints.length > 2) {
            console.log('object created')
            sceneThreeJs.ailes.push(pickingData.currentEnginePoints);

            const ailesShape = new THREE.Shape(pickingData.currentEnginePoints); //enginePoints


            let randomPoints = [];
            for (var i = 0; i < pickingData.currentEnginePoints.length; i++) {
                const point = pickingData.currentEnginePoints[i];
                randomPoints.push(new THREE.Vector3(point.x * 2, point.y * 2, 0));
            }
            const randomSpline = new THREE.CatmullRomCurve3(randomPoints);

            const extrudeSettings = {
                steps: 1,
                bevelEnabled: false,
                extrudePath: randomSpline
            };

            const mat = new MaterialRGB(0.2, 0.2, 0.2);
            const texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
            mat.map = texture;
            const extrudeGeometry = new THREE.ExtrudeBufferGeometry(ailesShape, extrudeSettings);
            const extrudeObject = new THREE.Mesh(extrudeGeometry, mat);
            extrudeObject.material.side = THREE.DoubleSide;
            extrudeObject.position.set(0, 0, 0);
            sceneThreeJs.sceneGraph.add(extrudeObject);
            sceneThreeJs.baseObject.add(extrudeObject);
            pickingData.selectableObjects.push(extrudeObject);

        }


    }

}




function render(sceneThreeJs) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time, lastTime) {
    const triangleMesh = sceneThreeJs.sceneGraph.getObjectByName("cube");
    const t = time / 1000; //time in seconds



    const earth = sceneThreeJs.sceneGraph.getObjectByName("earth");
    const earthCloud = sceneThreeJs.sceneGraph.getObjectByName("earthCloud");
    earth.rotation.y = 1 / 32 * t
    earthCloud.rotation.y = 1 / 29 * t
    const mars = sceneThreeJs.sceneGraph.getObjectByName("mars");
    mars.rotation.y = 1 / 20 * t

    if (sceneThreeJs.animation) {

        const arg = (t - sceneThreeJs.waiting) / 5
        const triangleMesh = sceneThreeJs.sceneGraph.getObjectByName("cube");
        const fire1 = sceneThreeJs.sceneGraph.getObjectByName("fire1");
        const fire2 = sceneThreeJs.sceneGraph.getObjectByName("fire2");
        console.log(fire1)
        const mul = 100
        fire1.scale.x = Math.sin(mul * arg) + 0.1;
        fire1.scale.y = Math.sin(mul * arg) + 0.1;
        fire1.scale.z = Math.sin(mul * arg) + 0.1;
        fire2.scale.x = Math.sin(mul * arg) + 0.1;
        fire2.scale.y = Math.sin(mul * arg) + 0.1;
        fire2.scale.z = Math.sin(mul * arg) + 0.1;

        triangleMesh.position.set(21 * (Math.sqrt(2) * Math.cos(arg)) / (Math.pow(Math.sin(arg), 2) + 1), 0, 21 * (Math.sqrt(2) * Math.sin(arg) * Math.cos(arg)) / (Math.pow(Math.sin(arg), 2) + 1));
        triangleMesh.add(sceneThreeJs.camera)
        const rotationX = -21 * (Math.sin(arg) * (Math.pow(Math.sin(arg), 2) + 2 * Math.pow(Math.cos(arg), 2) + 1)) / Math.pow((Math.pow(Math.sin(arg), 2) + 1), 2)
        const rotationZ = -21 * ((Math.pow(Math.sin(arg), 4) + Math.pow(Math.sin(arg), 2) + Math.pow(Math.cos(arg), 2) * (Math.pow(Math.sin(arg), 2) - 1))) / Math.pow((Math.pow(Math.sin(arg), 2) + 1), 2)
        const v = new THREE.Vector3(1, 0, 0)
        if (rotationZ > 0) triangleMesh.rotation.y = -v.angleTo(new THREE.Vector3(rotationX, 0, rotationZ)) + Math.PI / 2
        else triangleMesh.rotation.y = v.angleTo(new THREE.Vector3(rotationX, 0, rotationZ)) + Math.PI / 2
    } else {
        sceneThreeJs.waiting += t - sceneThreeJs.lastTime
    }
    sceneThreeJs.lastTime = t
    render(sceneThreeJs);


}




// Initialization function of a 3D scene without 3D objects
// Creation of a scene graph and adding a camera and a light.
// Creating a rendering engine and adding it to the HTML document

function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(1.4, 1.4, 1.4);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph, Vector3(1, 2, 2));
    var light = new THREE.PointLight(0xffffff, 1.5, 2000);

    var textureLoader = new THREE.TextureLoader();

    var textureFlare0 = textureLoader.load("../images/lensflare0_alpha.png");

    var light = new THREE.PointLight(0xffffff, 1, 20);
    light.position.set(-60, -20, -40)
    var flareColor = new THREE.Color(0xffffff);

    var lensFlare = new THREE.LensFlare(textureFlare0, 100, 0.0, THREE.AdditiveBlending, flareColor);
    lensFlare.add(textureFlare0, 500, 0.0, THREE.AdditiveBlending);
    lensFlare.position.copy(light.position);
    sceneThreeJs.sceneGraph.add(lensFlare);

    sceneThreeJs.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    sceneThreeJs.renderer.setSize(1680, 1250);
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls(sceneThreeJs.camera);

    window.addEventListener('resize', function(event) {
        onResize(sceneThreeJs);
    }, false);
}

// Animation management function
function animationLoop(sceneThreeJs) {

    requestAnimationFrame(

        // The function (called callback) receives as parameter the current time
        function(timeStamp) {

            animate(sceneThreeJs, timeStamp); // call our animation function
            animationLoop(sceneThreeJs); // relaunch a new update request
        }

    );

}

// Function called when resizing the window
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
}

function Vector3(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

function MaterialRGB(r, g, b) {
    const c = new THREE.Color(r, g, b);
    return new THREE.MeshLambertMaterial({
        color: c
    });
}

// Creation of visual references indicating the X, Y, Z axes between [-1,1]
function initFrameXYZ(sceneGraph) {

    const rCylinder = 0.005;
    const rCone = 0.01;
    const alpha = 0.1;

    // Creation des axes
    const axeXGeometry = primitive.Arrow(Vector3(0, 0, 0), Vector3(0.1, 0, 0), rCylinder, rCone, alpha);
    const axeX = new THREE.Mesh(axeXGeometry, MaterialRGB(1, 0, 0));

    const axeYGeometry = primitive.Arrow(Vector3(0, 0, 0), Vector3(0, 0.1, 0), rCylinder, rCone, alpha);
    const axeY = new THREE.Mesh(axeYGeometry, MaterialRGB(0, 1, 0));

    const axeZGeometry = primitive.Arrow(Vector3(0, 0, 0), Vector3(0, 0, 0.1), rCylinder, rCone, alpha);
    const axeZ = new THREE.Mesh(axeZGeometry, MaterialRGB(0, 0, 1));

    axeX.receiveShadow = true;
    axeY.receiveShadow = true;
    axeZ.receiveShadow = true;

    const rSphere = 0.01;
    const sphereGeometry = primitive.Sphere(Vector3(0, 0, 0), rSphere);
    const sphere = new THREE.Mesh(sphereGeometry, MaterialRGB(1, 1, 1));
    sphere.receiveShadow = true;


}
