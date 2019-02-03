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
        centre: {x: 1, y:1, z:1},
        scale: {x: 0.5, y:0.5, z:0.5},
        engines: [],
        ailes: []
    };

    // Les données associées au picking
    const pickingData = {
        currentKey:null,
        enabled: false,  
        engineCreation: false,         // Mode picking en cours ou désactivé (CTRL enfoncé)
        enableDragAndDrop: false,
        enableScaling: false, // Drag and drop en cours ou désactivé
        selectableObjects: [],    // Les objets selectionnables par picking
        selectedObject: null,     // L'objet actuellement selectionné
        selectedPlane: {p:null,n:null}, // Le plan de la caméra au moment de la selection. Plan donné par une position p, et une normale n.
        currentEnginePoints: [],
        enableRotation: false,
        // Les représentations visuelles associées au picking
        visualRepresentation: {
            sphereSelection:null,    // Une sphère montrant le point d'intersection au moment du picking
            sphereTranslation: null, // Une sphère montrant l'état actuel de la translation
        },
    };

    const drawingData = {
    drawingObjects: [],
    selectedObject: null,
    enableDrawing: false,
    drawing3DPoints:[],
    line: null,
  };


    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs, pickingData, drawingData);

    // *************************** //
    // Creation d'un lanceur de rayon (ray caster) de Three.js pour le calcul de l'intersection entre un objet et un rayon
    // *************************** //
    const raycaster = new THREE.Raycaster();

    // *************************** //
    // Fonction de rappels
    // *************************** //

    // Récupération de la taille de la fenetre en tant que variable à part
    const screenSize = {
        w:sceneThreeJs.renderer.domElement.clientWidth,
        h:sceneThreeJs.renderer.domElement.clientHeight
    };
    // Fonction à appeler lors du clic de la souris: selection d'un objet
    //  (Création d'un wrapper pour y passer les paramètres souhaités)
    const wrapperMouseDown = function(event) { mouseEvents.onMouseDown(event,raycaster,pickingData,screenSize,sceneThreeJs.camera,sceneThreeJs.dessin,sceneThreeJs,drawingData); };
    document.addEventListener( 'mousedown', wrapperMouseDown );

    const wrapperMouseUp = function(event) { mouseEvents.onMouseUp(event,pickingData,sceneThreeJs.dessin,drawingData); };
    document.addEventListener( 'mouseup', wrapperMouseUp );

    // Fonction à appeler lors du déplacement de la souris: translation de l'objet selectionné
    const wrapperMouseMove = function(event) { mouseEvents.onMouseMove(event,raycaster, pickingData, screenSize, sceneThreeJs,drawingData); };
    document.addEventListener( 'mousemove', wrapperMouseMove );

    // Fonction de rappels pour le clavier: activation/désactivation du picking par CTRL
    const wrapperKeyDown = function(event) { onKeyDown(event,pickingData,sceneThreeJs,drawingData); };
    const wrapperKeyUp = function(event) { onKeyUp(event,pickingData,sceneThreeJs,drawingData); };
    document.addEventListener( 'keydown', wrapperKeyDown );
    document.addEventListener( 'keyup', wrapperKeyUp );

    // *************************** //
    // Lancement de l'animation
    // *************************** //
    animationLoop(sceneThreeJs);
}

// Initialise les objets composant la scène 3D
function init3DObjects(sceneThreeJs, pickingData, drawingData) {

    initFrameXYZ(sceneThreeJs.sceneGraph);
    const sceneGraph = sceneThreeJs.sceneGraph;
    const centre = sceneThreeJs.centre;
    sceneThreeJs.sceneGraph.background = new THREE.Color(0x111122);
    // *********************** //
    /// Un objet selectionnable
    // *********************** //
    const cubeGeometry = primitive.Cube(Vector3(centre.x,centre.y,centre.z), 1);
    const cube = new THREE.Mesh(cubeGeometry, MaterialRGB(1,1,1));
    cube.scale.x = sceneThreeJs.scale.x;
    cube.scale.y = sceneThreeJs.scale.y;
    cube.scale.z = sceneThreeJs.scale.z;
    cube.name="cube";
    cube.castShadow = true;
    sceneGraph.add(cube);
    sceneThreeJs.baseObject = cube;
    pickingData.selectableObjects.push(cube); // Ajout du cube en tant qu'élément selectionnable
    //console.log(cube.scale.x);

    // *********************** //
    /// Une sphère montrant la position selectionnée
    // *********************** //
    const sphereSelection = new THREE.Mesh(primitive.Sphere(Vector3(0,0,0),0.015),MaterialRGB(1,0,0) );
    sphereSelection.name = "sphereSelection";
    sphereSelection.visible = false;
    sceneGraph.add(sphereSelection);
    pickingData.visualRepresentation.sphereSelection = sphereSelection;

    // *********************** //
    /// Une sphère montrant la position après translation
    // *********************** //
    const sphereTranslation = new THREE.Mesh(primitive.Sphere(Vector3(0,0,0),0.015),MaterialRGB(0,1,0) );
    sphereTranslation.name = "sphereTranslation";
    sphereTranslation.visible = false;
    sceneGraph.add(sphereTranslation);
    pickingData.visualRepresentation.sphereTranslation = sphereTranslation;



    const planeGeometry = primitive.Quadrangle(new THREE.Vector3(-2,-1,-1),new THREE.Vector3(-2,1,-1),new THREE.Vector3(2,1,-1),new THREE.Vector3(2,-1,-1));
    const materialGround = new THREE.MeshLambertMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry,materialGround);
    plane.name="plane";
    plane.receiveShadow = true;
    drawingData.drawingObjects.push(plane);
    sceneGraph.add(plane);
    
    
   
    



    //Earth
    var geometry   = new THREE.SphereGeometry(4, 32, 32);
    var material  = new THREE.MeshPhongMaterial();

    material.map  = THREE.ImageUtils.loadTexture('images/earthmap1k.jpg');
    material.bumpMap    = THREE.ImageUtils.loadTexture('images/earthbump1k.jpg');
    material.bumpScale = 0.05;
    var earthMesh = new THREE.Mesh(geometry, material);
    earthMesh.position.set( -10, -10, -10 );
    
    sceneGraph.add(earthMesh);

    //Space and stars
    var geometry2  = new THREE.SphereGeometry(20, 32, 32);
    var material2  = new THREE.MeshBasicMaterial();
    material2.map = THREE.ImageUtils.loadTexture('images/milkyway.jpg');
    material.side = THREE.BackSide;
    var mesh  = new THREE.Mesh(geometry2, material2);
  
    sceneGraph.add(mesh);
}


function onKeyDown(event, pickingData, sceneThreeJs,drawingData) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;
    //console.log(pickingData.selectedObject);
    // Relachement de ctrl : activation du mode picking
    console.log(keyCode);
    if ( ctrlPressed ) {
        pickingData.currentKey = "CTRL";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    }
    else if ( keyCode===16 ||  keyCode ===  18) {
        //sceneThreeJs.sceneGraph.remove(drawingData.line);
        //drawingData.line=null;
        drawingData.drawing3DPoints=[]
        if (keyCode===16) pickingData.currentKey = "SHIFT";
        else pickingData.currentKey = "OPTION";
        sceneThreeJs.controls.enabled = false;
        pickingData.engineCreation = true;
        pickingData.currentEnginePoints=[];
    }
    else if ( keyCode === 90  ) {
        pickingData.currentKey = "Z";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    }
    else if( keyCode ===  8) {
        pickingData.currentKey = "DELETE";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
        
    }
    else if( keyCode ===  67) {
        pickingData.currentKey = "C";
        pickingData.enabled = true;
        //sceneThreeJs.controls.enabled = false;
        
    }
    else if ( keyCode === 82  ) {
        pickingData.currentKey = "R";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    }

    

}

function onKeyUp(event, pickingData,sceneThreeJs,drawingData) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;


    // Relachement de ctrl : fin du picking actuel
    if ( ctrlPressed===false && ((pickingData.currentKey==="CTRL") || (pickingData.currentKey==="Z")|| (pickingData.currentKey==="DELETE")|| (pickingData.currentKey==="C")||(pickingData.currentKey==="R"))) {
        pickingData.currentKey = null;
        pickingData.enabled = false;
        pickingData.enableDragAndDrop = false;
        pickingData.enableScaling = false;
        pickingData.enableRotation = false;
        sceneThreeJs.controls.enabled = true;
        pickingData.selectedObject = null;
        pickingData.visualRepresentation.sphereSelection.visible = false;
        pickingData.visualRepresentation.sphereTranslation.visible = false;
    }
    else if (  pickingData.currentKey==="SHIFT") {
        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.engineCreation = false;
        
        if (pickingData.currentEnginePoints.length>2) {
            sceneThreeJs.engines.push(pickingData.currentEnginePoints);
       
            var engineShape = new THREE.Shape( pickingData.currentEnginePoints );//enginePoints

            var extrudeSettings = { amount: 0.2, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.1, bevelThickness: 0.4 };

            var geometry = new THREE.ExtrudeGeometry( engineShape, extrudeSettings );

            var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
            mesh.position.set(0,0,0);
            sceneThreeJs.sceneGraph.add(mesh);
            sceneThreeJs.baseObject.add(mesh);
            pickingData.selectableObjects.push(mesh);
        }
    

    }
    else if ( pickingData.currentKey==="OPTION") {
        
        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.engineCreation = false;
        /*
        if (pickingData.currentEnginePoints.length>2) {
            sceneThreeJs.engines.push(pickingData.currentEnginePoints);
       
            var engineShape = new THREE.Shape( pickingData.currentEnginePoints );//enginePoints

            var extrudeSettings = { amount: 0.2, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.1, bevelThickness: 0.4 };

            var geometry = new THREE.ExtrudeGeometry( engineShape, extrudeSettings );

            var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
            mesh.position.set(0,0,0);
            sceneThreeJs.sceneGraph.add(mesh);
            sceneThreeJs.baseObject.add(mesh);
            pickingData.selectableObjects.push(mesh);
        }
        
        */
        if (pickingData.currentEnginePoints.length>2) {
            console.log('object created')
            sceneThreeJs.ailes.push(pickingData.currentEnginePoints);
       
            const ailesShape = new THREE.Shape( pickingData.currentEnginePoints );//enginePoints


            let randomPoints = [];
            for ( var i = 0; i < pickingData.currentEnginePoints.length; i ++ ) {
                //randomPoints.push( new THREE.Vector3( ( i - 0.5 ) , THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ) ) );
                const point = pickingData.currentEnginePoints[i];
                randomPoints.push(new THREE.Vector3(point.x*2, point.y*2, 0 ));
            }
            const randomSpline =  new THREE.CatmullRomCurve3( randomPoints );

            // Création de la forme extrudée 
            const extrudeSettings = {
                steps: 1,
                bevelEnabled: false,
                extrudePath: randomSpline
            };


            const extrudeGeometry = new THREE.ExtrudeBufferGeometry( ailesShape, extrudeSettings );
            const extrudeObject = new THREE.Mesh( extrudeGeometry, MaterialRGB(0.2,0.2,0.2) ) ;
            extrudeObject.material.side = THREE.DoubleSide; 
            extrudeObject.position.set(0,0,0);
            sceneThreeJs.sceneGraph.add( extrudeObject );
            console.log(extrudeObject);
            sceneThreeJs.baseObject.add(extrudeObject);
            pickingData.selectableObjects.push(extrudeObject);

        }
        
        /*
        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.ailesCreation = false;
        
        if (pickingData.currentAilesPoints.length>2) {
            sceneThreeJs.ailes.push(pickingData.currentAilesPoints);
       
            const ailesShape = new THREE.Shape( pickingData.currentAilesPoints );//enginePoints


            let randomPoints = [];
            for ( var i = 0; i < 5; i ++ ) {
                randomPoints.push( new THREE.Vector3( ( i - 4.5 ) , THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ) ) );
            }
            const randomSpline =  new THREE.CatmullRomCurve3( randomPoints );

            // Création de la forme extrudée 
            const extrudeSettings = {
                steps: 6,
                bevelEnabled: true,
                extrudePath: randomSpline
            };


            const extrudeGeometry = new THREE.ExtrudeBufferGeometry( ailesShape, extrudeSettings );
            const extrudeObject = new THREE.Mesh( extrudeGeometry, MaterialRGB(0.9,0.9,0.9) ) ;
            extrudeObject.material.side = THREE.DoubleSide; 
            sceneThreeJs.sceneGraph.add( extrudeObject );
            
            sceneThreeJs.baseObject.add(extrudeObject);
            pickingData.selectableObjects.push(extrudeObject);

        }
    
        */
    }

}





// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time) {

    const t = time/1000;//time in second
    render(sceneThreeJs);
}







// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(1,1.5,3);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(1,2,2));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );

    window.addEventListener('resize', function(event){onResize(sceneThreeJs);}, false);
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {

    // Fonction JavaScript de demande d'image courante à afficher
    requestAnimationFrame(

        // La fonction (dite de callback) recoit en paramètre le temps courant
        function(timeStamp){
            animate(sceneThreeJs,timeStamp); // appel de notre fonction d'animation
            animationLoop(sceneThreeJs); // relance une nouvelle demande de mise à jour
        }

    );

}

// Fonction appelée lors du redimensionnement de la fenetre
function onResize(sceneThreeJs) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneThreeJs.camera.aspect = width / height;
    sceneThreeJs.camera.updateProjectionMatrix();

    sceneThreeJs.renderer.setSize(width, height);
}

function Vector3(x,y,z) {
    return new THREE.Vector3(x,y,z);
}

function MaterialRGB(r,g,b) {
    const c = new THREE.Color(r,g,b);
    return new THREE.MeshLambertMaterial( {color:c} );
}

// Creation de repères visuels indiquants les axes X,Y,Z entre [-1,1]
function initFrameXYZ( sceneGraph ) {

    const rCylinder = 0.01;
    const rCone = 0.04;
    const alpha = 0.1;

    // Creation des axes
    const axeXGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(1,0,0), rCylinder, rCone, alpha);
    const axeX = new THREE.Mesh(axeXGeometry, MaterialRGB(1,0,0));

    const axeYGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(0,1,0), rCylinder, rCone, alpha);
    const axeY = new THREE.Mesh(axeYGeometry, MaterialRGB(0,1,0));

    const axeZGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(0,0,1), rCylinder, rCone, alpha);
    const axeZ = new THREE.Mesh(axeZGeometry, MaterialRGB(0,0,1));

    axeX.receiveShadow = true;
    axeY.receiveShadow = true;
    axeZ.receiveShadow = true;

    sceneGraph.add(axeX);
    sceneGraph.add(axeY);
    sceneGraph.add(axeZ);

    // Sphère en (0,0,0)
    const rSphere = 0.05;
    const sphereGeometry = primitive.Sphere(Vector3(0,0,0), rSphere);
    const sphere = new THREE.Mesh(sphereGeometry, MaterialRGB(1,1,1));
    sphere.receiveShadow = true;
    sceneGraph.add(sphere);



    // Creation des plans
    const L = 1;
    const planeXYGeometry = primitive.Quadrangle(Vector3(0,0,0), Vector3(L,0,0), Vector3(L,L,0), Vector3(0,L,0));
    const planeXY = new THREE.Mesh(planeXYGeometry, MaterialRGB(1,1,0.7));

    const planeYZGeometry = primitive.Quadrangle(Vector3(0,0,0),Vector3(0,L,0),Vector3(0,L,L),Vector3(0,0,L));
    const planeYZ = new THREE.Mesh(planeYZGeometry,MaterialRGB(0.7,1,1));

    const planeXZGeometry = primitive.Quadrangle(Vector3(0,0,0),Vector3(0,0,L),Vector3(L,0,L),Vector3(L,0,0));
    const planeXZ = new THREE.Mesh(planeXZGeometry,MaterialRGB(1,0.7,1));

    planeXY.receiveShadow = true;
    planeYZ.receiveShadow = true;
    planeXZ.receiveShadow = true;


    //sceneGraph.add(planeXY);
    //sceneGraph.add(planeYZ);
    //sceneGraph.add(planet);

}
