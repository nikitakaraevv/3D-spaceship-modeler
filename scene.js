"use strict";


main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null,
        dessin: true,
        centre: {x: 1, y:1, z:1},
        scale: {x: 0.5, y:0.5, z:0.5},
        engines: []
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
        // Les représentations visuelles associées au picking
        visualRepresentation: {
            sphereSelection:null,    // Une sphère montrant le point d'intersection au moment du picking
            sphereTranslation: null, // Une sphère montrant l'état actuel de la translation
        },
    }


    initEmptyScene(sceneThreeJs);
    init3DObjects(sceneThreeJs, pickingData,);

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
    const wrapperMouseDown = function(event) { onMouseDown(event,raycaster,pickingData,screenSize,sceneThreeJs.camera,sceneThreeJs.dessin,sceneThreeJs); };
    document.addEventListener( 'mousedown', wrapperMouseDown );

    const wrapperMouseUp = function(event) { onMouseUp(event,pickingData,sceneThreeJs.dessin); };
    document.addEventListener( 'mouseup', wrapperMouseUp );

    // Fonction à appeler lors du déplacement de la souris: translation de l'objet selectionné
    const wrapperMouseMove = function(event) { onMouseMove(event, pickingData, screenSize, sceneThreeJs) };
    document.addEventListener( 'mousemove', wrapperMouseMove );

    // Fonction de rappels pour le clavier: activation/désactivation du picking par CTRL
    const wrapperKeyDown = function(event) { onKeyDown(event,pickingData,sceneThreeJs); };
    const wrapperKeyUp = function(event) { onKeyUp(event,pickingData,sceneThreeJs); };
    document.addEventListener( 'keydown', wrapperKeyDown );
    document.addEventListener( 'keyup', wrapperKeyUp );

    // *************************** //
    // Lancement de l'animation
    // *************************** //
    animationLoop(sceneThreeJs);
}

// Initialise les objets composant la scène 3D
function init3DObjects(sceneThreeJs, pickingData) {

    initFrameXYZ(sceneThreeJs.sceneGraph);
    const sceneGraph = sceneThreeJs.sceneGraph;
    const centre = sceneThreeJs.centre;
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



    
    /*enginePoints=[];
    enginePoints.push( new THREE.Vector2 (   1,  0.1 ) );
    enginePoints.push( new THREE.Vector2 (  1,  0.2 ) );
    enginePoints.push( new THREE.Vector2 (  1.1,  0.3 ) );
    enginePoints.push( new THREE.Vector2 (  1.2,  0.3 ) );
    enginePoints.push( new THREE.Vector2 (  1.3,  0.2 ) );
    enginePoints.push( new THREE.Vector2 (  1.3,  0.1 ) );
    enginePoints.push( new THREE.Vector2 (  1.2,  0 ) );
     enginePoints.push( new THREE.Vector2 (  1.1,  0 ) );
     enginePoints.push( new THREE.Vector2 (   1,  0.1 ) );
     sceneThreeJs.engines.push(enginePoints);
     */
    for(let i = 0; i < sceneThreeJs.engines.length; i++){
        var enginePoints = [];
        for(let j = 0; j < sceneThreeJs.engines[i].length; j++){
            enginePoints.push(sceneThreeJs.engines[i][j]);
        }
        
        var starShape = new THREE.Shape( enginePoints );//enginePoints

        var extrudeSettings = { amount: 0.2, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.1, bevelThickness: 0.4 };

        var geometry = new THREE.ExtrudeGeometry( starShape, extrudeSettings );

        var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
        mesh.position.set(0,0,0);
        sceneGraph.add(mesh);
    
    }


    /*var curve = new THREE.CubicBezierCurve(
    enginePoints[0],
    enginePoints[1],
    enginePoints[2],
    enginePoints[0]
    );
    */
    //var points = curve.getPoints( 5 );
    //var geometry = new THREE.BufferGeometry().setFromPoints( points );

    //var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    var curveObject = new THREE.Line( geometry, material );
    sceneGraph.add(curveObject);
    
    var starShape = new THREE.Shape( enginePoints );//enginePoints

    var extrudeSettings = { amount: 0.2, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.1, bevelThickness: 0.4 };

    var geometry = new THREE.ExtrudeGeometry( starShape, extrudeSettings );

    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.position.set(0,0,0);
    sceneGraph.add(mesh);
    
    // add a wireframe to model
    
   
    



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


function onKeyDown(event, pickingData, sceneThreeJs) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;
    // Relachement de ctrl : activation du mode picking
    if ( ctrlPressed ) {
        pickingData.currentKey = "CTRL";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    }
    else if ( shiftPressed ) {
        pickingData.currentKey = "SHIFT";
        sceneThreeJs.controls.enabled = false;
        pickingData.engineCreation = true;
        pickingData.currentEnginePoints=[];
    }
    else if ( keyCode === 90  ) {
        pickingData.currentKey = "Z";
        pickingData.enabled = true;
        sceneThreeJs.controls.enabled = false;
    }

}

function onKeyUp(event, pickingData,sceneThreeJs) {

    const ctrlPressed = event.ctrlKey;
    const shiftPressed = event.shiftKey;
    const keyCode = event.which;


    // Relachement de ctrl : fin du picking actuel
    if ( ctrlPressed===false && ((pickingData.currentKey==="CTRL") || (pickingData.currentKey==="Z"))) {
        pickingData.currentKey = null;
        pickingData.enabled = false;
        pickingData.enableDragAndDrop = false;
        pickingData.enableScaling = false;
        sceneThreeJs.controls.enabled = true;
        pickingData.selectedObject = null;
        pickingData.visualRepresentation.sphereSelection.visible = false;
        pickingData.visualRepresentation.sphereTranslation.visible = false;
    }
    if ( shiftPressed===false  && pickingData.currentKey==="SHIFT") {
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
            pickingData.selectableObjects.push(mesh);
        }
    

    }

}



function onMouseDown(event,raycaster,pickingData,screenSize,camera,dessin,sceneThreeJs) {

	// Gestion du picking
    if( pickingData.enabled===true && dessin===true ) { // activation si la touche CTRL est enfoncée
        // Coordonnées du clic de souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Calcul d'un rayon passant par le point (x,y)
        //  c.a.d la direction formé par les points p de l'espace tels que leurs projections sur l'écran par la caméra courante soit (x,y).
        raycaster.setFromCamera(new THREE.Vector2(x,y),camera);

        // Calcul des interections entre le rayon et les objets passés en paramètres
        const intersects = raycaster.intersectObjects( pickingData.selectableObjects );

        const nbrIntersection = intersects.length;
        if( nbrIntersection>0 ) {

            // Les intersections sont classés par distance le long du rayon. On ne considère que la première.
            const intersection = intersects[0];

            // Sauvegarde des données du picking
            pickingData.selectedObject = intersection.object; // objet selectionné
            pickingData.selectedPlane.p = intersection.point.clone(); // coordonnées du point d'intersection 3D
            pickingData.selectedPlane.n = camera.getWorldDirection().clone(); // normale du plan de la caméra

            // Affichage de la selection
            const sphereSelection = pickingData.visualRepresentation.sphereSelection;
            sphereSelection.position.copy( pickingData.selectedPlane.p );
            sphereSelection.visible = true;
            if (pickingData.engineCreation===false && pickingData.currentKey==="CTRL"){
                pickingData.enableDragAndDrop = true;
            }
            else if (pickingData.engineCreation===false && pickingData.currentKey==="Z"){
                pickingData.enableScaling = true;
            }

        }
    }
    if(pickingData.engineCreation===true) {
        const xPixel = event.clientX;
        const yPixel = event.clientY;
        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;
        console.log(pickingData.currentEnginePoints);
        pickingData.currentEnginePoints.push( new THREE.Vector2 (x,  y));
    

    }

}


function onMouseUp(event,pickingData) {
    pickingData.enableDragAndDrop = false;
    pickingData.enableScaling = false;
}

function onMouseMove( event, pickingData, screenSize, sceneThreeJs ) {
    
	// Gestion du drag & drop
    /*if( pickingData.enableDragAndDrop===true) {

		// Coordonnées de la position de la souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Projection inverse passant du point 2D sur l'écran à un point 3D
        const selectedPoint = Vector3(x, y, 0.5  );//valeur de z après projection
        selectedPoint.unproject( camera );

        // Direction du rayon passant par le point selectionné
        const p0 = camera.position;
        const d = selectedPoint.clone().sub( p0 );

        // Intersection entre le rayon 3D et le plan de la camera
        const p = pickingData.selectedPlane.p;
        const n = pickingData.selectedPlane.n;
        // tI = <p-p0,n> / <d,n>
        const tI = ( (p.clone().sub(p0)).dot(n) ) / ( d.dot(n) );
        // pI = p0 + tI d
        const pI = (d.clone().multiplyScalar(tI)).add(p0); // le point d'intersection

        // Translation à appliquer
        console.log(pI);
        
        const translation = pI.clone().sub( p );
          
        // Translation de l'objet et de la représentation visuelle
        pickingData.selectedObject.translateX( translation.x );
        pickingData.selectedObject.translateY( translation.y );
        pickingData.selectedObject.translateZ( translation.z );

        pickingData.selectedPlane.p.add( translation );

        pickingData.visualRepresentation.sphereTranslation.visible = true;
        pickingData.visualRepresentation.sphereTranslation.position.copy(p);
        

    }*/
    if( pickingData.enableDragAndDrop===true && pickingData.engineCreation===false ) {

        // Coordonnées de la position de la souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Projection inverse passant du point 2D sur l'écran à un point 3D
        const selectedPoint = Vector3(x, y, 0.5  );//valeur de z après projection
        selectedPoint.unproject( sceneThreeJs.camera );

        // Direction du rayon passant par le point selectionné
        const p0 = sceneThreeJs.camera.position;
        const d = selectedPoint.clone().sub( p0 );
        
        // Intersection entre le rayon 3D et le plan de la camera
        const p = pickingData.selectedPlane.p;
        const n = pickingData.selectedPlane.n;
        // tI = <p-p0,n> / <d,n>
        const tI = ( (p.clone().sub(p0)).dot(n) ) / ( d.dot(n) );
        // pI = p0 + tI d
        const pI = (d.clone().multiplyScalar(tI)).add(p0); // le point d'intersection
        
        const objectCentre = pickingData.selectedObject.position;
        
        const translation = pI.clone().sub( p );
        
        pickingData.selectedObject.translateX( translation.x );
        pickingData.selectedObject.translateY( translation.y );
        pickingData.selectedObject.translateZ( translation.z );

        pickingData.selectedPlane.p.add( translation );

        pickingData.visualRepresentation.sphereTranslation.visible = true;
        pickingData.visualRepresentation.sphereTranslation.position.copy(p);
        

    }
    else if( pickingData.enableScaling===true && pickingData.engineCreation===false ) {

        // Coordonnées de la position de la souris
        const xPixel = event.clientX;
        const yPixel = event.clientY;

        const x =  2*xPixel/screenSize.w-1;
        const y = -2*yPixel/screenSize.h+1;

        // Projection inverse passant du point 2D sur l'écran à un point 3D
        const selectedPoint = Vector3(x, y, 0.5  );//valeur de z après projection
        selectedPoint.unproject( sceneThreeJs.camera );

        // Direction du rayon passant par le point selectionné
        const p0 = sceneThreeJs.camera.position;
        const d = selectedPoint.clone().sub( p0 );
        
        // Intersection entre le rayon 3D et le plan de la camera
        const p = pickingData.selectedPlane.p;
        const n = pickingData.selectedPlane.n;
        // tI = <p-p0,n> / <d,n>
        const tI = ( (p.clone().sub(p0)).dot(n) ) / ( d.dot(n) );
        // pI = p0 + tI d
        const pI = (d.clone().multiplyScalar(tI)).add(p0); // le point d'intersection
        //console.log(pickingData.selectedObject.position);
        //console.log(pI);
        //const centre = sceneThreeJs.centre;
        const objectCentre = pickingData.selectedObject.position;
        //console.log(p);
        //console.log(pI);
        //console.log(objectCentre);
        const translation = pI.clone().sub( p );
        if ((Math.abs(translation.x)>Math.abs(translation.y))&&(Math.abs(translation.x)>Math.abs(translation.z))) {
            console.log("x");
            var mul = 0.99;

            if (translation.x > 0){
                mul = 1.01;
            }
            pickingData.selectedObject.scale.x*=mul;

        }
        else if ((Math.abs(translation.y)>Math.abs(translation.x))&&(Math.abs(translation.y)>Math.abs(translation.z))){
            console.log("y");
            var mul = 0.99;

            if (translation.y > 0){
                mul = 1.01;
            }
            pickingData.selectedObject.scale.y*=mul;
        }
        else if ((Math.abs(translation.z)>Math.abs(translation.y))&&(Math.abs(translation.z)>Math.abs(translation.x))){
            console.log("z");
            var mul = 0.99;

            if (translation.z > 0){
                mul = 1.01;
            }
            pickingData.selectedObject.scale.z*=mul;
        }
        //console.log(Math.abs(Math.abs(p.z*sceneThreeJs.scale.z*sceneThreeJs.mult-(objectCentre.z+centre.z))-sceneThreeJs.scale.z/2.0));
        //console.log(pickingData.selectedObject);
        // Translation à appliquer
        //console.log(pI);
        //console.log(pickingData.selectedObject);
        
        //console.log(pI);
        //console.log(translation);
        //if(pI.x> 1.0 || pI.y>1.0 || pI.z>1.0 || pI.x< 0 || pI.y<0 || pI.z<0){
        //    translation.x = 0
        //    translation.y = 0
        //    translation.z = 0
        //}
        // Translation de l'objet et de la représentation visuelle
        //pickingData.selectedObject.translateX( translation.x );
        //pickingData.selectedObject.translateY( translation.y );
        //pickingData.selectedObject.translateZ( translation.z );

        pickingData.selectedPlane.p.add( translation );

        pickingData.visualRepresentation.sphereTranslation.visible = true;
        //pickingData.visualRepresentation.sphereTranslation.position.copy(p);
        

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
