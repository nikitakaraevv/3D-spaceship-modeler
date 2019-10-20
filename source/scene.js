"use strict";





const createMars	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
		map	: THREE.ImageUtils.loadTexture('../images/marsmap1k.jpg'),
		bumpMap	: THREE.ImageUtils.loadTexture('../images/marsbump1k.jpg'),
		bumpScale: 0.05,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	return mesh
}

const createEarth	= function(){
	var geometry	= new THREE.SphereGeometry(0.5, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
		map		: THREE.ImageUtils.loadTexture('../images/earthmap1k.jpg'),
		bumpMap		: THREE.ImageUtils.loadTexture('../images/earthbump1k.jpg'),
		bumpScale	: 0.05,
		specularMap	: THREE.ImageUtils.loadTexture('../images/earthspec1k.jpg'),
		specular	: new THREE.Color('grey'),
	})
	var mesh	= new THREE.Mesh(geometry, material)
	return mesh
}

const createEarthCloud	= function(){
	// create destination canvas
	var canvasResult	= document.createElement('canvas')
	canvasResult.width	= 1024
	canvasResult.height	= 512
	var contextResult	= canvasResult.getContext('2d')

	// load earthcloudmap
	var imageMap	= new Image();
	imageMap.addEventListener("load", function() {

		// create dataMap ImageData for earthcloudmap
		var canvasMap	= document.createElement('canvas')
		canvasMap.width	= imageMap.width
		canvasMap.height= imageMap.height
		var contextMap	= canvasMap.getContext('2d')
		contextMap.drawImage(imageMap, 0, 0)
		var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

		// load earthcloudmaptrans
		var imageTrans	= new Image();
		imageTrans.addEventListener("load", function(){
			// create dataTrans ImageData for earthcloudmaptrans
			var canvasTrans		= document.createElement('canvas')
			canvasTrans.width	= imageTrans.width
			canvasTrans.height	= imageTrans.height
			var contextTrans	= canvasTrans.getContext('2d')
			contextTrans.drawImage(imageTrans, 0, 0)
			var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
			// merge dataMap + dataTrans into dataResult
			var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
			for(var y = 0, offset = 0; y < imageMap.height; y++){
				for(var x = 0; x < imageMap.width; x++, offset += 4){
					dataResult.data[offset+0]	= dataMap.data[offset+0]
					dataResult.data[offset+1]	= dataMap.data[offset+1]
					dataResult.data[offset+2]	= dataMap.data[offset+2]
					dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]
				}
			}
			// update texture with result
			contextResult.putImageData(dataResult,0,0)
			material.map.needsUpdate = true;
		})
		imageTrans.src	= '../images/earthcloudmaptrans.jpg';
	}, false);
	imageMap.src	= '../images/earthcloudmap.jpg';

	var geometry	= new THREE.SphereGeometry(0.51, 32, 32)
	var material	= new THREE.MeshPhongMaterial({
		map		: new THREE.Texture(canvasResult),
		side		: THREE.DoubleSide,
		transparent	: true,
		opacity		: 0.8,
	})
	var mesh	= new THREE.Mesh(geometry, material)
	return mesh
}


main();


function main() {

    const sceneThreeJs = {
        baseObject: null,
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null,
        dessin: true,
        animation : false,
        animationChange: false,
        waiting: Math.PI*7/5,
        lastTime: 0,
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
    /*const cubeGeometry = primitive.Cube(Vector3(centre.x,centre.y,centre.z), 1);
    const cube = new THREE.Mesh(cubeGeometry, MaterialRGB(1,1,1));
    cube.scale.x = sceneThreeJs.scale.x;
    cube.scale.y = sceneThreeJs.scale.y;
    cube.scale.z = sceneThreeJs.scale.z;
    cube.name="cube";
    cube.castShadow = true;
    sceneGraph.add(cube);
    sceneThreeJs.baseObject = cube;
    pickingData.selectableObjects.push(cube); // Ajout du cube en tant qu'élément selectionnable*/
    //console.log(cube.scale.x);



    //FFFFFFFF
     //var combined = new THREE.Geometry()

    //THREE.GeometryUtils.merge(combined, cube)
    //////////////////////////////////////////////////////////////////////////////////////
        var triangleGeometry = new THREE.Geometry();
    triangleGeometry.vertices.push(new THREE.Vector3(-0.09,  -0.2, 0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.15, -0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.2, 0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.09,  -0.2, 0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.15, -0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.2, 0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.15,0.15,-0.78));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.15,0.15,-0.78));


    triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
    triangleGeometry.faces.push(new THREE.Face3(3, 4, 5));
    // Points 1,4,3 and 6 form a rectangle which I'm trying to construct using triangles 0,2,5 and 0,3,5
    triangleGeometry.faces.push(new THREE.Face3(0, 2, 5));
    triangleGeometry.faces.push(new THREE.Face3(0, 3, 5));

    triangleGeometry.faces.push(new THREE.Face3(6, 5, 4));
    triangleGeometry.faces.push(new THREE.Face3(7, 1, 2));

    triangleGeometry.faces.push(new THREE.Face3(6, 7, 4));
    triangleGeometry.faces.push(new THREE.Face3(7, 4, 1));

    triangleGeometry.faces.push(new THREE.Face3(6, 7, 5));
    triangleGeometry.faces.push(new THREE.Face3(7, 2, 5));

    triangleGeometry.faces.push(new THREE.Face3(0, 1, 3));
    triangleGeometry.faces.push(new THREE.Face3(4, 3, 1));

    ////  var texture1  = THREE.ImageUtils.loadTexture('1.png');

    //var material = new THREE.MeshFaceMaterial(triangleMaterial);

    //var triangleMesh = new THREE.Mesh(triangleGeometry, material);
    ////  triangleMesh.material.map(new THREE.TextureLoader().load('1.png'));
    ////  triangleMesh.material.needsUpdate = true;
    ////  triangleMesh.rotateY(Math.PI/180*270)

    var spaceShip1Texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
    var spaceShip2Texture = new THREE.TextureLoader().load('../images/spaceship2.jpg');
    var triangleMat = new THREE.MeshBasicMaterial({
      color:0x353535,
      side:THREE.DoubleSide,
      map:texture
    });

    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMat);
    triangleMesh.position.set(0.5, 0.5, 0.5);

    triangleMesh.scale.x = sceneThreeJs.scale.x;
    triangleMesh.scale.y = sceneThreeJs.scale.y;
    triangleMesh.scale.z = sceneThreeJs.scale.z;
    triangleMesh.name="cube";
    triangleMesh.castShadow = true;
    sceneGraph.add(triangleMesh);
    sceneThreeJs.baseObject = triangleMesh;
    pickingData.selectableObjects.push(triangleMesh);



    /////////////////////////////////////////////////////////////////////////////////////
        var mat = new THREE.MeshPhongMaterial()
        mat.map=spaceShip2Texture

        var up1 = new THREE.Shape();
        up1.moveTo( -0.2, 0 );
        up1.bezierCurveTo( -0.2,-0.05 , 0.2, -0.05, 0.2, 0 );
        var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up1, extrudeSettings );
        var m1 = new THREE.Mesh( geometry, mat);
        //m.rotateX(Math.PI/180*30);
        m1.position.set(0,0.13,-0.77);
        sceneThreeJs.sceneGraph.add(m1);
        pickingData.selectableObjects.push(m1);
        triangleMesh.add(m1);
    //THREE.GeometryUtils.merge(combined, m1)

        var up2 = new THREE.Shape();
        up2.moveTo( -0.6, 0 );
        up2.bezierCurveTo( -0.6, 0.15 , 0.6, 0.15, 0.6, 0 );
        var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up2, extrudeSettings );
        var m2 = new THREE.Mesh( geometry, mat );
        //m.rotateX(Math.PI/180*30);
        m2.position.set(0,0.13,-0.77);
        sceneThreeJs.sceneGraph.add(m2);
        pickingData.selectableObjects.push(m2);
        triangleMesh.add(m2);
    //THREE.GeometryUtils.merge(combined, m2)


        var up3 = new THREE.Shape();
        up3.moveTo( -0.13, 0);
        up3.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
        var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up3, extrudeSettings );
        var m4 = new THREE.Mesh( geometry, mat );
        //m.rotateX(Math.PI/180*30);
        m4.position.set(-0.467,0.13,-0.77);
        sceneThreeJs.sceneGraph.add(m4);
        pickingData.selectableObjects.push(m4);
        triangleMesh.add(m4);
    //THREE.GeometryUtils.merge(combined, m4)

        var up4 = new THREE.Shape();
        up4.moveTo( -0.13, 0 );
        up4.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
        var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up4, extrudeSettings );
        var m5 = new THREE.Mesh( geometry, mat);
        //m.rotateX(Math.PI/180*30);
        m5.position.set(0.467,0.13,-0.77);
        sceneThreeJs.sceneGraph.add(m5);
        pickingData.selectableObjects.push(m5);
        triangleMesh.add(m5);
    //THREE.GeometryUtils.merge(combined, m5)

        // var side1 = new THREE.Shape();
        // side1.moveTo( -0.13, 0 );
        // side1.bezierCurveTo( -0.13, -0.01 , 0.13, -0.01, 0.13, 0 );
        // var extrudeSettings = { amount: 0.4, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        // var geometry = new THREE.ExtrudeGeometry( side1, extrudeSettings );
        // var m6 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
        // m6.rotateZ(Math.PI/180*90);
        // m6.position.set(0.13,0.07,-0.395);
        //sceneThreeJs.sceneGraph.add(m6);
        //cube.add(m6);
    //
        // var side2 = new THREE.Shape();
        // side2.moveTo( -0.13, 0 );
        // side2.bezierCurveTo( -0.13, +0.01 , 0.13, +0.01, 0.13, 0 );
        // var extrudeSettings = { amount: 0.4, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        // var geometry = new THREE.ExtrudeGeometry( side2, extrudeSettings );
        // var m7 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
        // m7.rotateZ(Math.PI/180*90);
        // m7.position.set(-0.13,0.07,-0.395);
        //sceneThreeJs.sceneGraph.add(m7);
        //cube.add(m7);



    //THREE.GeometryUtils.merge(combined, triangleMesh);

    var ailesGeom = new THREE.Geometry();
    ailesGeom.vertices.push(new THREE.Vector3(-0.65,0.2,0));//0
    ailesGeom.vertices.push(new THREE.Vector3(-0.6,0.33,-0.2));//1
    ailesGeom.vertices.push(new THREE.Vector3(-0.4,0.29,-0.2));//2
    ailesGeom.vertices.push(new THREE.Vector3(0,0,0));//3
    ailesGeom.vertices.push(new THREE.Vector3(0.4,0.29,-0.2));//4
    ailesGeom.vertices.push(new THREE.Vector3(0.6,0.33,-0.2));//5
    ailesGeom.vertices.push(new THREE.Vector3(0.65,0.2,0));//6
    ailesGeom.vertices.push(new THREE.Vector3(0.6,0.27,0));//7
    ailesGeom.vertices.push(new THREE.Vector3(0.4,0.25,0));//8
    ailesGeom.vertices.push(new THREE.Vector3(0.3,0,0));//9
    ailesGeom.vertices.push(new THREE.Vector3(-0.3,0,0));//10
    ailesGeom.vertices.push(new THREE.Vector3(-0.4,0.25,0));//11
    ailesGeom.vertices.push(new THREE.Vector3(-0.6,0.27,0));//12
    ailesGeom.vertices.push(new THREE.Vector3(-0.6,0.27,-0.3));//13
    ailesGeom.vertices.push(new THREE.Vector3(0.6,0.27,-0.3));//14

    ailesGeom.faces.push(new THREE.Face3(0,1,12));
    ailesGeom.faces.push(new THREE.Face3(1,12,2));
    ailesGeom.faces.push(new THREE.Face3(12,2,11));
    ailesGeom.faces.push(new THREE.Face3(11,2,3));
    ailesGeom.faces.push(new THREE.Face3(11,3,10));
    ailesGeom.faces.push(new THREE.Face3(10,3,9));
    ailesGeom.faces.push(new THREE.Face3(3,4,9));
    ailesGeom.faces.push(new THREE.Face3(9,8,4));
    ailesGeom.faces.push(new THREE.Face3(4,8,5));
    ailesGeom.faces.push(new THREE.Face3(8,5,7));
    ailesGeom.faces.push(new THREE.Face3(5,6,7));
    ailesGeom.faces.push(new THREE.Face3(0,12,11));
    ailesGeom.faces.push(new THREE.Face3(6,7,8));
    ailesGeom.faces.push(new THREE.Face3(13,0,1));
    ailesGeom.faces.push(new THREE.Face3(13,1,2));
    ailesGeom.faces.push(new THREE.Face3(13,2,11));
    ailesGeom.faces.push(new THREE.Face3(13,10,2));
    ailesGeom.faces.push(new THREE.Face3(13,3,2));
    ailesGeom.faces.push(new THREE.Face3(10,11,13));
    ailesGeom.faces.push(new THREE.Face3(14,6,5));
    ailesGeom.faces.push(new THREE.Face3(14,5,4));
    ailesGeom.faces.push(new THREE.Face3(14,4,8));
    ailesGeom.faces.push(new THREE.Face3(14,9,4));
    ailesGeom.faces.push(new THREE.Face3(14,3,4));
    ailesGeom.faces.push(new THREE.Face3(9,8,14));
    ailesGeom.faces.push(new THREE.Face3(10,3,2));
    ailesGeom.faces.push(new THREE.Face3(3,11,2));
    ailesGeom.faces.push(new THREE.Face3(13,10,3));
    ailesGeom.faces.push(new THREE.Face3(14,9,3));



    var ailesMat = new THREE.MeshBasicMaterial({
      color:0x809999,
      side:THREE.DoubleSide,
      map:spaceShip2Texture
    });

    var ailesMesh = new THREE.Mesh(ailesGeom, ailesMat);
    ailesMesh.position.set(0,0,-0.2);
    sceneThreeJs.sceneGraph.add(ailesMesh);
    triangleMesh.add(ailesMesh);
    pickingData.selectableObjects.push(ailesMesh);
    //THREE.GeometryUtils.merge(combined, ailesMesh)

    var forward = new THREE.Shape();
    forward.moveTo( -0.11, 0 );
    forward.bezierCurveTo( -0.11,-0.05 , 0.11, -0.05, 0.11, 0 );
    var extrudeSettings = { amount: 0.45, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var geometry = new THREE.ExtrudeGeometry( forward, extrudeSettings );
    var mat = new THREE.MeshPhongMaterial();
    var texture = new THREE.TextureLoader().load('../images/glass.jpg');
    mat.map=texture;
    var mesh = new THREE.Mesh( geometry, mat);
    mesh.rotateX(Math.PI/180*30);
    //mesh.rotateZ(Math.PI/180*180);
    mesh.position.set(0,0.1,-0.2);
    sceneThreeJs.sceneGraph.add(mesh);
    pickingData.selectableObjects.push(mesh);
    triangleMesh.add(mesh);
    //THREE.GeometryUtils.merge(combined, mesh);
    var mat = new THREE.MeshPhongMaterial()
    mat.map=spaceShip1Texture
    var up_no_wings = new THREE.Shape();
        up_no_wings.moveTo( -0.18, 0 );
        up_no_wings.bezierCurveTo( -0.18,-0.05 , 0.18, -0.05, 0.18, 0 );
        var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up_no_wings, extrudeSettings );
        var m10 = new THREE.Mesh( geometry, mat );
        //m.rotateX(Math.PI/180*30);
        m10.position.set(0,0.16,-0.61);
        sceneThreeJs.sceneGraph.add(m10);
        pickingData.selectableObjects.push(m10);
        triangleMesh.add(m10);
    //THREE.GeometryUtils.merge(combined, m10)

    var up_no_wings1 = new THREE.Shape();
        up_no_wings1.moveTo( -0.14, 0 );
        up_no_wings1.bezierCurveTo( -0.14,-0.05 , 0.14, -0.05, 0.14, 0 );
        var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up_no_wings1, extrudeSettings );
        var m11 = new THREE.Mesh( geometry, mat );
        //m.rotateX(Math.PI/180*30);
        m11.position.set(0,0.16,-0.49);
        sceneThreeJs.sceneGraph.add(m11);
        pickingData.selectableObjects.push(m11);
        triangleMesh.add(m11);
    //THREE.GeometryUtils.merge(combined, m11)

    var up_no_wings2 = new THREE.Shape();
        up_no_wings2.moveTo( -0.1, 0 );
        up_no_wings2.bezierCurveTo( -0.1,-0.05 , 0.1, -0.05, 0.1, 0 );
        var extrudeSettings = { amount: 0.08, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
        var geometry = new THREE.ExtrudeGeometry( up_no_wings2, extrudeSettings );
        var m12 = new THREE.Mesh( geometry, mat );
        //m.rotateX(Math.PI/180*30);
        m12.position.set(0,0.16,-0.37);
        sceneThreeJs.sceneGraph.add(m12);
        pickingData.selectableObjects.push(m12);
        triangleMesh.add(m12);
    //THREE.GeometryUtils.merge(combined, m12)


    var texture = new THREE.TextureLoader().load('../images/lensflare0_alpha.png');
    // do the material
    var geometry    = new THREE.PlaneGeometry(1,1)
    var material    = new THREE.MeshBasicMaterial({
      color     : 0x000fff,
      map       : texture,
      side      : THREE.DoubleSide,
      blending  : THREE.AdditiveBlending,
      opacity       : 10,
      depthWrite    : false,
      transparent   : true
    })
    var fire1   = new THREE.Mesh(geometry, material)
    fire1.scale.multiplyScalar(0.75)
    fire1.position.x = 0;
    fire1.position.y = 0;
    fire1.position.z = 0;
    fire1.name='fire1'
    sceneThreeJs.sceneGraph.add(fire1);

    m4.add(fire1);

    var fire2   = new THREE.Mesh(geometry, material)
    fire2.scale.multiplyScalar(0.75)
    fire2.position.x = 0;
    fire2.position.y = 0;
    fire2.position.z = 0
    fire2.name='fire2'
    sceneThreeJs.sceneGraph.add(fire2);

    m5.add(fire2);

    var for_ailes_Geom = new THREE.Geometry();
    for_ailes_Geom.vertices.push(new THREE.Vector3(-0.2,0,0));//0
    for_ailes_Geom.vertices.push(new THREE.Vector3(-0.16,0.01,0.2));//1
    for_ailes_Geom.vertices.push(new THREE.Vector3(-0.1,0,0));//2
    for_ailes_Geom.vertices.push(new THREE.Vector3(-0.16,0.05,0));//3
    for_ailes_Geom.vertices.push(new THREE.Vector3(0,0.01,0));//4
    for_ailes_Geom.vertices.push(new THREE.Vector3(0.1,0,0));//5
    for_ailes_Geom.vertices.push(new THREE.Vector3(0.2,0,0));//6
    for_ailes_Geom.vertices.push(new THREE.Vector3(0.16,0.01,0.2));//7
    for_ailes_Geom.vertices.push(new THREE.Vector3(0.16,0.05,0));//8


    for_ailes_Geom.faces.push(new THREE.Face3(0,1,2));
    for_ailes_Geom.faces.push(new THREE.Face3(0,1,3));
    for_ailes_Geom.faces.push(new THREE.Face3(1,2,3));
    for_ailes_Geom.faces.push(new THREE.Face3(2,3,4));
    for_ailes_Geom.faces.push(new THREE.Face3(2,4,5));
    for_ailes_Geom.faces.push(new THREE.Face3(4,5,8));
    for_ailes_Geom.faces.push(new THREE.Face3(5,8,7));
    for_ailes_Geom.faces.push(new THREE.Face3(8,7,6));
    for_ailes_Geom.faces.push(new THREE.Face3(5,6,7));
    for_ailes_Geom.faces.push(new THREE.Face3(0,3,2));
    for_ailes_Geom.faces.push(new THREE.Face3(5,6,8));
    for_ailes_Geom.faces.push(new THREE.Face3(3,2,5));
    for_ailes_Geom.faces.push(new THREE.Face3(2,5,8));
    var for_ailes_Mat = new THREE.MeshBasicMaterial({
      color:0x809999,
      side:THREE.DoubleSide,
      map:spaceShip2Texture
    });

    var for_ailes_Mesh = new THREE.Mesh(for_ailes_Geom, for_ailes_Mat);
    for_ailes_Mesh.position.set(0,-0.10,0)
    sceneThreeJs.sceneGraph.add(for_ailes_Mesh);
    pickingData.selectableObjects.push(for_ailes_Mesh);
    triangleMesh.add(for_ailes_Mesh);
    //THREE.GeometryUtils.merge(combined, for_ailes_Mesh)




    // *********************** //
    /// Une sphère montrant la position selectionnée
    // *********************** //
    const sphereSelection = new THREE.Mesh(primitive.Sphere(Vector3(0,0,0),0.005),MaterialRGB(1,0,0) );
    sphereSelection.name = "sphereSelection";
    sphereSelection.visible = false;
    sceneGraph.add(sphereSelection);
    pickingData.visualRepresentation.sphereSelection = sphereSelection;

    // *********************** //
    /// Une sphère montrant la position après translation
    // *********************** //
    const sphereTranslation = new THREE.Mesh(primitive.Sphere(Vector3(0,0,0),0.005),MaterialRGB(0,1,0) );
    sphereTranslation.name = "sphereTranslation";
    sphereTranslation.visible = false;
    sceneGraph.add(sphereTranslation);
    pickingData.visualRepresentation.sphereTranslation = sphereTranslation;



    const planeGeometry = primitive.Quadrangle(new THREE.Vector3(-1.5,-0.5,-0.5),new THREE.Vector3(-1.5,1.5,-0.5),new THREE.Vector3(2.5,1.5,-0.5),new THREE.Vector3(2.5,-0.5,-0.5));
    const materialGround = new THREE.MeshLambertMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide });
    var planeTexture = new THREE.TextureLoader().load('../images/CommandsMirror.png');
    materialGround.map = planeTexture;
    const plane = new THREE.Mesh(planeGeometry,materialGround);
    plane.name="plane";
    plane.receiveShadow = true;
    drawingData.drawingObjects.push(plane);
    sceneGraph.add(plane);




    //Earth

    var earthMesh    = createEarth();
    sceneGraph.add(earthMesh)
    earthMesh.scale.x= earthMesh.scale.x*10;
    earthMesh.scale.y= earthMesh.scale.y*10;
    earthMesh.scale.z= earthMesh.scale.z*10;
    var cloudMesh    = createEarthCloud();
    sceneGraph.add(cloudMesh)
    earthMesh.name="earth";
    cloudMesh.name="earthCloud";
    earthMesh.position.set( -20, 0, 0 );
    earthMesh.add(cloudMesh)


    var marsMesh    = createMars();
    sceneGraph.add(marsMesh)
    marsMesh.scale.x= marsMesh.scale.x*10;
    marsMesh.scale.y= marsMesh.scale.y*10;
    marsMesh.scale.z= marsMesh.scale.z*10;
    marsMesh.position.set( 20, 0, 0 );
    marsMesh.name="mars";








    var geometry  = new THREE.SphereGeometry(180, 64, 64)
    // create the material, using a texture of startfield
    var material  = new THREE.MeshBasicMaterial()
    material.map   = new THREE.TextureLoader().load('../images/galaxy_starfield.png')
    material.side  = THREE.BackSide
    // create the mesh based on geometry and material
    var mesh  = new THREE.Mesh(geometry, material)
    sceneGraph.add(mesh)
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
    else if ( keyCode === 27  ) {
        const plane = sceneThreeJs.sceneGraph.getObjectByName("plane");
        if (sceneThreeJs.animation === false) {
            sceneThreeJs.animation = true;
            sceneThreeJs.sceneGraph.remove(plane);
            //sceneThreeJs.animationChange =true;
        }
        else {
            //sceneThreeJs.sceneGraph.add(plane);
            sceneThreeJs.animation = false;
            //sceneThreeJs.animationChange =true;
        }
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
            const mat = new MaterialRGB(0.5,0.5,0.5);
            var texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
            mat.map = texture;

            var mesh = new THREE.Mesh( geometry, mat);
            //mesh.position.set(0,0,0);

            var texture = new THREE.TextureLoader().load('../images/lensflare0_alpha.png');
            // do the material
            var fireGeometry    = new THREE.PlaneGeometry(1,1)
            var material    = new THREE.MeshBasicMaterial({
                    color     : 0x000fff,
                    map       : texture,
                    side      : THREE.DoubleSide,
                    blending  : THREE.AdditiveBlending,
                    opacity       : 10,
                    depthWrite    : false,
                    transparent   : true
            })
            var fire   = new THREE.Mesh(fireGeometry, material)





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


    }
    else if ( pickingData.currentKey==="OPTION") {

        pickingData.currentKey = null;
        sceneThreeJs.controls.enabled = true;
        pickingData.engineCreation = false;
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

            const mat = new MaterialRGB(0.2,0.2,0.2);
            const texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
            mat.map = texture;
            const extrudeGeometry = new THREE.ExtrudeBufferGeometry( ailesShape, extrudeSettings );
            const extrudeObject = new THREE.Mesh( extrudeGeometry,  mat) ;
            extrudeObject.material.side = THREE.DoubleSide;
            extrudeObject.position.set(0,0,0);
            sceneThreeJs.sceneGraph.add( extrudeObject );
            console.log(extrudeObject);
            sceneThreeJs.baseObject.add(extrudeObject);
            pickingData.selectableObjects.push(extrudeObject);

        }


    }

}





// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs, time, lastTime) {
    const triangleMesh = sceneThreeJs.sceneGraph.getObjectByName("cube");
    const t = time/1000;//time in second



    const earth = sceneThreeJs.sceneGraph.getObjectByName("earth");
    const earthCloud = sceneThreeJs.sceneGraph.getObjectByName("earthCloud");
    earth.rotation.y = 1/32 * t
    earthCloud.rotation.y  =1/29 * t
    const mars = sceneThreeJs.sceneGraph.getObjectByName("mars");
    mars.rotation.y = 1/20 * t

    if (sceneThreeJs.animation){

        /*
        console.log(sceneThreeJs.lastTime)
        const triangleMesh = sceneThreeJs.sceneGraph.getObjectByName("cube");
        triangleMesh.position.set( 9*Math.cos((t-sceneThreeJs.waiting)/3)-10,-10, 9*Math.sin((t-sceneThreeJs.waiting)/3)-10);
        triangleMesh.setRotationFromAxisAngle(Vector3(0,1,0), -(t-sceneThreeJs.waiting)/3)
        //sceneThreeJs.camera.position.set(7*Math.cos(t)-14,-3, 7*Math.sin(t)-14)
        triangleMesh.add(sceneThreeJs.camera)
        */


        const arg=(t-sceneThreeJs.waiting)/5
        const triangleMesh = sceneThreeJs.sceneGraph.getObjectByName("cube");
        const fire1 = sceneThreeJs.sceneGraph.getObjectByName("fire1");
        const fire2 = sceneThreeJs.sceneGraph.getObjectByName("fire2");
        console.log(fire1)
        const mul = 100
        fire1.scale.x=Math.sin(mul*arg)+0.1;
        fire1.scale.y=Math.sin(mul*arg)+0.1;
        fire1.scale.z=Math.sin(mul*arg)+0.1;
        fire2.scale.x=Math.sin(mul*arg)+0.1;
        fire2.scale.y=Math.sin(mul*arg)+0.1;
        fire2.scale.z=Math.sin(mul*arg)+0.1;




        //triangleMesh.position.set( (10*Math.sqrt(2)*Math.cos(arg))/Math.pow((Math.sin(arg),2)+1),0, (1*Math.sqrt(2)*Math.sin(arg)*Math.cos(arg))/Math.pow((Math.sin(arg),2)+1));
        //triangleMesh.setRotationFromAxisAngle(Vector3(0,1,0), -arg)
        triangleMesh.position.set( 21*(Math.sqrt(2)*Math.cos(arg))/(Math.pow(Math.sin(arg),2)+1),0, 21*(Math.sqrt(2)*Math.sin(arg)*Math.cos(arg))/(Math.pow(Math.sin(arg),2)+1));
        //sceneThreeJs.camera.position.set(10*(Math.sqrt(2)*Math.cos(arg))/(Math.pow(Math.sin(arg),2)+1),0, 10*(Math.sqrt(2)*Math.sin(arg)*Math.cos(arg))/(Math.pow(Math.sin(arg),2)+1))
        triangleMesh.add(sceneThreeJs.camera)
        const rotationX = -21*(Math.sin(arg)*(Math.pow(Math.sin(arg),2)+2*Math.pow(Math.cos(arg),2)+1))/Math.pow((Math.pow(Math.sin(arg),2)+1),2)
        const rotationZ = -21*((Math.pow(Math.sin(arg),4)+Math.pow(Math.sin(arg),2)+Math.pow(Math.cos(arg),2)*(Math.pow(Math.sin(arg),2)-1)))/Math.pow((Math.pow(Math.sin(arg),2)+1),2)
        //triangleMesh.rotation.x=rotationX
        //triangleMesh.rotation.z=rotationX
        const v = new THREE.Vector3(1,0,0)
        if (rotationZ>0) triangleMesh.rotation.y=-v.angleTo(new THREE.Vector3(rotationX,0,rotationZ))+Math.PI/2
        else triangleMesh.rotation.y=v.angleTo(new THREE.Vector3(rotationX,0,rotationZ))+Math.PI/2
        console.log(triangleMesh.rotation.y)
    }
    else {
        sceneThreeJs.waiting+=t-sceneThreeJs.lastTime
        //console.log(t-sceneThreeJs.waiting)
    }
    sceneThreeJs.lastTime = t
    render(sceneThreeJs);


}







// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(1.4,1.4,1.4);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(1,2,2));
    var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );

    var textureLoader = new THREE.TextureLoader();

    var textureFlare0 = textureLoader.load( "../images/lensflare0_alpha.png" );

    var light = new THREE.PointLight( 0xffffff, 1, 20 );
    light.position.set(-60,-20,-40)
    //sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(-60,20,-40));
    //sceneThreeJs.sceneGraph.add( light );
    var flareColor = new THREE.Color( 0xffffff );

    var lensFlare = new THREE.LensFlare( textureFlare0, 100, 0.0, THREE.AdditiveBlending, flareColor );
    lensFlare.add( textureFlare0, 500, 0.0, THREE.AdditiveBlending );
    lensFlare.position.copy( light.position );
    sceneThreeJs.sceneGraph.add( lensFlare );

    sceneThreeJs.renderer =new THREE.WebGLRenderer( { antialias: true, alpha: true } );//sceneInit.createRenderer();
    sceneThreeJs.renderer.setSize( 1680, 1250 );
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera );

    window.addEventListener('resize', function(event){onResize(sceneThreeJs);}, false);
}

// Fonction de gestion d'animation
function animationLoop(sceneThreeJs) {
    //const getTime = typeof performance === 'function' ? performance.now : Date.now;
    //let sceneThreeJs.lastTimestamp = 0
    //console.log(getTime())
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

    const rCylinder = 0.005;
    const rCone = 0.01;
    const alpha = 0.1;

    // Creation des axes
    const axeXGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(0.1,0,0), rCylinder, rCone, alpha);
    const axeX = new THREE.Mesh(axeXGeometry, MaterialRGB(1,0,0));

    const axeYGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(0,0.1,0), rCylinder, rCone, alpha);
    const axeY = new THREE.Mesh(axeYGeometry, MaterialRGB(0,1,0));

    const axeZGeometry = primitive.Arrow(Vector3(0,0,0), Vector3(0,0,0.1), rCylinder, rCone, alpha);
    const axeZ = new THREE.Mesh(axeZGeometry, MaterialRGB(0,0,1));

    axeX.receiveShadow = true;
    axeY.receiveShadow = true;
    axeZ.receiveShadow = true;

    //sceneGraph.add(axeX);
    //sceneGraph.add(axeY);
    //sceneGraph.add(axeZ);

    // Sphère en (0,0,0)
    const rSphere = 0.01;
    const sphereGeometry = primitive.Sphere(Vector3(0,0,0), rSphere);
    const sphere = new THREE.Mesh(sphereGeometry, MaterialRGB(1,1,1));
    sphere.receiveShadow = true;
    //sceneGraph.add(sphere);



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
