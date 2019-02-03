"use strict";

main();

function main() {



    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null
        //,        mirrorCubeCamera: null,        mirrorCube: null

    };

    // Les paramètres de l'interface graphique
    const guiParam = {
        //primitiveType: "cube", // Le nom de la primitive à afficher
        x:0, y:0, z:0, // La translation à appliquer sur la primitive
	       hauteur: 0,
	        volume: 4, //addition de parametre volume
	         landing: false,
    };






    initEmptyScene(sceneThreeJs);

    init3DObjects(sceneThreeJs);

    initGui(guiParam, sceneThreeJs); // Initialisation de l'interface
    updatedGui(guiParam, sceneThreeJs); //Initialisation de la visualisation en cohérence avec l'interface

    AnimationLoop(sceneThreeJs,guiParam);
}


// Met à jour les paramètres de la scène en fonction des valeurs de l'interface
function updatedGui(guiParam,sceneThreeJs) {
    const p0 = Vector3(0.5,0.125,0.5); // position initiale du centre de la primitive
    const p10 = Vector3(0,0,0);
    var volumm = 0.25;

    // Récupération de la primitive à afficher
    //const sphere = sceneThreeJs.sceneGraph.getObjectByName("sphere");
    const cube = sceneThreeJs.sceneGraph.getObjectByName("cube");
    //const ground = sceneThreeJs.sceneGraph.getObjectByName("ground");

    var x0 = 0.25; //besoin de mettre des sizes vraies
    var y0 = 0.25;
    var z0 = 0.25;
    let visibleShape = cube;
    console.log(cube);

    // Application de la translation à affecter sur la primitive
    const translation = Vector3(guiParam.x/10, guiParam.y/10, guiParam.z/10);
    const p = p0.clone().add(translation);
    visibleShape.position.copy(p);
    visibleShape.scale.x = x0 * (guiParam.volume);
    //visibleShape.scale.y = y0 * (guiParam.volume);
    //visibleShape.scale.z = z0 * (guiParam.volume);
    //THREE.Mesh.scale.set()

    // Changement dhauteur du plan
    const translation2 = Vector3(0,guiParam.hauteur/10,0);
    const p1 = p10.clone().add(translation2);
    //ground.position.copy(p1);

    // Changement de volume de cub
    const cubeGeometry1 = primitive.Cube(Vector3(0,0,0), 0.25*guiParam.volume);
    const cube1 = new THREE.Mesh(cubeGeometry1,MaterialRGB(1,0,0));
    cube1.name="cube1";
    cube1.castShadow = true;
    //cube.visible = false;
    cube1.visible = true;

    //EXPERIMENTS WITH mirrorCubeCamera

    //console.log(guiParam.volume);
    //volumm = volumm * guiParam.volume;

    //const cubeGeometry1 = primitive.Cube(Vector3(0,0,0), volumm);
    //const cube1 = new THREE.Mesh(cubeGeometry1,MaterialRGB(1,0,0));
    //cube1.name = "cube";
    //cube1.castShadow = true;
    //sceneThreeJs.sceneGraph.add(cube1);

    // Changement de couleur
    console.log(cube)
}

function initGui(guiParam,sceneThreeJs) {

    // *************************** //
    // Fonctions pour l'interface
    // *************************** //

    // Actions des boutons 'Cube' et 'Sphere' de l'interface (mis sous forme de fonction)
    const drawPrimitiveType = {
        Cube: function(){ guiParam.primitiveType = "cube";  },
        Sphere: function() { guiParam.primitiveType = "sphere";  },
    };

    // Fonction de rappel pour la mise à jour de la scène appelé à chaque action sur un élément de l'interface
    //  Rem. updateFunc sert uniquement de "wrapper" sans paramètres à la fonction updatedGui qui prend 2 paramètres.
    const updateFunc = function() { updatedGui(guiParam,sceneThreeJs); };


    // *************************** //
    // Creation de l'interface
    // *************************** //
    const gui = new dat.GUI();

    //gui.add( drawPrimitiveType, "Cube").onFinishChange(updateFunc);  // Bouton cube
    //gui.add( drawPrimitiveType, "Sphere").onFinishChange(updateFunc);// Bouton sphere

    // Paramètres de translations
    gui.add( guiParam,"x",-5,5 ).onChange(updateFunc);
    gui.add( guiParam,"y", 0,6 ).onChange(updateFunc);
    gui.add( guiParam,"z",-5,5 ).onChange(updateFunc);
    gui.add( guiParam, "hauteur", -10,10).onChange(updateFunc);
    gui.add( guiParam, "volume", 0,10).onChange(updateFunc);
    gui.add( guiParam, "landing", false).onChange(updateFunc);


            //addition de parametre de volume
    //var palette = {
//	color1: [0, 128, 255]
//    }
//    gui.addColor(guiParam,"palette", 'color1').onChange(updateFunc);
    //gui.addColor(palette, 'color2').onChange(updateFunc);
}

function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}

// Initialise les objets composant la scène 3D


function init3DObjects(sceneThreeJs, dataControler) {

    const elementsToAdd = [];
    const textureLoader = new THREE.TextureLoader();

    //const groundGeometry = primitive.Quadrangle(Vector3(0,0,0),Vector3(0,0,1),Vector3(1,0,1),Vector3(1,0,0));
    //const ground = new THREE.Mesh(groundGeometry,MaterialRGB(1,1,1));




    //ground.name="ground";
    //elementsToAdd.push(ground);
    //sceneThreeJs.sceneGraph.add(ground);



    /////////////////////////////////////////////////////////////////////////////////////
    //var mirrorCube, mirrorCubeCamera;
    //EXPERIMENTS WITH mirrorCube
    // var cubeGeom = new THREE.CubeGeometry(100, 100, 10, 1, 1, 1);
    // sceneThreeJs.mirrorCubeCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
    // console.log(THREE.CubeCamera)
    // // mirrorCubeCamera.renderTarget.minFilter = THREE.LinearMipMapLinearFilter;
    // sceneThreeJs.sceneGraph.add( sceneThreeJs.mirrorCubeCamera );
    // var mirrorCubeMaterial = new THREE.MeshBasicMaterial( { envMap: sceneThreeJs.mirrorCubeCamera.renderTarget } );
    // sceneThreeJs.mirrorCube = new THREE.Mesh( cubeGeom, mirrorCubeMaterial );
    // sceneThreeJs.mirrorCube.position.set(-75,50,0);
    // //sceneThreeJs.mirrorCubeCamera.position = sceneThreeJs.mirrorCube.position;
    // sceneThreeJs.mirrorCubeCamera = {position: sceneThreeJs.mirrorCube.position}
    // sceneThreeJs.sceneGraph.add(sceneThreeJs.mirrorCube);
    ////////////////////////////////////////////////////////////////////////////////////
    // const cylinderGeometry = primitive.Cylinder( Vector3(0,0,0), Vector3(0,0,0.5),0.10 );
    // const cylinder = new THREE.Mesh( cylinderGeometry,MaterialRGB(0.4,0.9,1) );
    // cylinder.name = "cylinder";
    // elementsToAdd.push(cylinder);
    //sceneThreeJs.sceneGraph.add(cylinder)
    //cube.add(cylinder);
    //cylinder.add(cube);

    // const cylinderGeometry1 = primitive.Cylinder( Vector3(0.22,0,-0.25), Vector3(0.22,0,0.25),0.10 );
    // const cylinder1 = new THREE.Mesh( cylinderGeometry1,MaterialRGB(0.4,0.9,1) );
    // cylinder1.name = "cylinder1";
    //sceneThreeJs.sceneGraph.add(cylinder1);
    //cube.add(cylinder1);

    // const cylinderGeometry2 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    // const cylinder2 = new THREE.Mesh( cylinderGeometry2,MaterialRGB(0.4,0.9,1) );
    // cylinder2.name = "cylinder2";
    //sceneThreeJs.sceneGraph.add(cylinder2);
    //cube.add(cylinder2);

		// const cylinderGeometry3 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    // const cylinder3 = new THREE.Mesh( cylinderGeometry3,MaterialRGB(0.4,0.9,1) );
    // cylinder3.name = "cylinder3";
    // cylinder3.position.set(-0.23,0.18,-0.65);
		//sceneThreeJs.sceneGraph.add(cylinder3);
    //cube.add(cylinder3);

		// const cylinderGeometry4 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    // const cylinder4 = new THREE.Mesh( cylinderGeometry4,MaterialRGB(0.4,0.9,1) );
    // cylinder4.name = "cylinder4";
    // cylinder4.position.set(0.67,0.18,-0.65);
		//sceneThreeJs.sceneGraph.add(cylinder4);
    //cube.add(cylinder4);


    //var geometry = new THREE.TetrahedronGeometry(0.5, 0);
    //var material = new THREE.MeshBasicMaterial({color:0x000000});
    //var tetr = new THREE.Mesh(geometry, material);
    //sceneThreeJs.sceneGraph.add(tetr);

    //const figgeom = primitive.Quadrangle( Vector3(1,1,0), Vector3(0,1,1), Vector3(0,0,0), Vector3(1,1,1) );
    //const fig = new THREE.Mesh( figgeom,MaterialRGB(0.4,0.9,1) );
    //fig.name = "fig";
    //fig.position.set(0.67,0.18,-0.65);
		//sceneThreeJs.sceneGraph.add(fig);
    //cube.add(fig);



    // var backward = new THREE.Shape();
		// backward.moveTo( -0.13, 0 );
		// backward.bezierCurveTo( -0.13,-0.05 , 0.13, -0.05, 0.13, 0 );
		// var extrudeSettings = { amount: 0.5, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		// var geometry = new THREE.ExtrudeGeometry( backward, extrudeSettings );
		// var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		// mesh.rotateX(Math.PI/180*30);
		// mesh.position.set(0,0.2,-0.6);
		//sceneThreeJs.sceneGraph.add(mesh);
		//cube.add(mesh);

		// var up = new THREE.Shape();
		// up.moveTo( -0.13, 0 );
		// up.bezierCurveTo( -0.13,-0.05 , 0.13, -0.05, 0.13, 0 );
		// var extrudeSettings = { amount: 0.3, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		// var geometry = new THREE.ExtrudeGeometry( up, extrudeSettings );
		// var m = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		//m.position.set(0,0.2,-0.5);
		//sceneThreeJs.sceneGraph.add(m);
		//cube.add(m);

    //console.log(sceneThreeJs.sceneGraph);

    // var up0 = new THREE.Shape();
    // up0.moveTo( -0.135, 0 );
    // up0.bezierCurveTo( -0.135, 0.1 , 0.135, 0.1, 0.135, 0 );
    // var extrudeSettings = { amount: 0.2, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    // var geometry = new THREE.ExtrudeGeometry( up0, extrudeSettings );
    // var m3 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    //m.rotateX(Math.PI/180*30);
    //m3.position.set(0,0.17,-0.2);
    //sceneThreeJs.sceneGraph.add(m3);
    //cube.add(m3);
    var combined = new THREE.Geometry()

    const cubeGeometry = primitive.Cube(Vector3(0,0,0), 0.01);
    const cube = new THREE.Mesh(cubeGeometry,MaterialRGB(1,0,0));
    cube.name="cube";
    elementsToAdd.push(cube);
    sceneThreeJs.sceneGraph.add(cube);
    THREE.GeometryUtils.merge(combined, cube)
    //////////////////////////////////////////////////////////////////////////////////////


    var texture	= THREE.ImageUtils.loadTexture('lensflare0_alpha.png');
    // do the material
    var geometry	= new THREE.PlaneGeometry(1,1)
    var material	= new THREE.MeshBasicMaterial({
      color		: 0x000fff,
      map		: texture,
      side		: THREE.DoubleSide,
      blending	: THREE.AdditiveBlending,
      opacity		: 10,
      depthWrite	: false,
      transparent	: true
    })
    var fire1	= new THREE.Mesh(geometry, material)
    fire1.scale.multiplyScalar(0.75)
    fire1.position.x = -0.5;
    fire1.position.y = 0.2;
    fire1.position.z = -0.67
    sceneThreeJs.sceneGraph.add(fire1);
    cube.add(fire1);

    var fire2	= new THREE.Mesh(geometry, material)
    fire2.scale.multiplyScalar(0.75)
    fire2.position.x = 0.5;
    fire2.position.y = 0.2;
    fire2.position.z = -0.67
    sceneThreeJs.sceneGraph.add(fire2);
    cube.add(fire2);
    /////////////////////////////////////////////////////////////////////////////////////


		var up1 = new THREE.Shape();
		up1.moveTo( -0.2, 0 );
		up1.bezierCurveTo( -0.2,-0.05 , 0.2, -0.05, 0.2, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up1, extrudeSettings );
		var m1 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m1.position.set(0,0.23,-0.6);
		sceneThreeJs.sceneGraph.add(m1);
		cube.add(m1);
    THREE.GeometryUtils.merge(combined, m1)

		var up2 = new THREE.Shape();
		up2.moveTo( -0.6, 0 );
		up2.bezierCurveTo( -0.6, 0.15 , 0.6, 0.15, 0.6, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up2, extrudeSettings );
		var m2 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m2.position.set(0,0.23,-0.65);
		sceneThreeJs.sceneGraph.add(m2);
		cube.add(m2);
    THREE.GeometryUtils.merge(combined, m2)


		var up3 = new THREE.Shape();
		up3.moveTo( -0.13, 0);
		up3.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
		var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up3, extrudeSettings );
		var m4 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m4.position.set(-0.467,0.23,-0.65);
		sceneThreeJs.sceneGraph.add(m4);
		cube.add(m4);
    THREE.GeometryUtils.merge(combined, m4)

		var up4 = new THREE.Shape();
		up4.moveTo( -0.13, 0 );
		up4.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
		var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up4, extrudeSettings );
		var m5 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m5.position.set(0.467,0.23,-0.65);triangleMesh
		sceneThreeJs.sceneGraph.add(m5);
		cube.add(m5);
    THREE.GeometryUtils.merge(combined, m5)

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

    ////  var texture1	= THREE.ImageUtils.loadTexture('1.png');

    //var triangleMaterial = new THREE.MeshBasicMaterial({
    //  map: new THREE.TextureLoader().load('lava.jpg'),
    //  side: THREE.DoubleSide
    //});

    //var material = new THREE.MeshFaceMaterial(triangleMaterial);

    //var triangleMesh = new THREE.Mesh(triangleGeometry, material);
    ////  triangleMesh.material.map(new THREE.TextureLoader().load('1.png'));
    ////  triangleMesh.material.needsUpdate = true;
    ////  triangleMesh.rotateY(Math.PI/180*270)


    var triangleMat = new THREE.MeshBasicMaterial({
      color:0x808080,
      side:THREE.DoubleSide
    });

    var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMat);
    triangleMesh.position.set(0, 0.07, 0.14);

    sceneThreeJs.sceneGraph.add(triangleMesh);
    cube.add(triangleMesh);
    THREE.GeometryUtils.merge(combined, triangleMesh);

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
      side:THREE.DoubleSide
    });

    var ailesMesh = new THREE.Mesh(ailesGeom, ailesMat);
    sceneThreeJs.sceneGraph.add(ailesMesh);
    cube.add(ailesMesh);
    THREE.GeometryUtils.merge(combined, ailesMesh)

    var forward = new THREE.Shape();
    forward.moveTo( -0.11, 0 );
    forward.bezierCurveTo( -0.11,-0.05 , 0.11, -0.05, 0.11, 0 );
    var extrudeSettings = { amount: 0.45, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var geometry = new THREE.ExtrudeGeometry( forward, extrudeSettings );
    var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    mesh.rotateX(Math.PI/180*30);
    //mesh.rotateZ(Math.PI/180*180);
    mesh.position.set(0,0.2,-0.1);
    sceneThreeJs.sceneGraph.add(mesh);
    cube.add(mesh);
    THREE.GeometryUtils.merge(combined, mesh);

    var up_no_wings = new THREE.Shape();
		up_no_wings.moveTo( -0.18, 0 );
		up_no_wings.bezierCurveTo( -0.18,-0.05 , 0.18, -0.05, 0.18, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up_no_wings, extrudeSettings );
		var m10 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m10.position.set(0,0.23,-0.48);
		sceneThreeJs.sceneGraph.add(m10);
		cube.add(m10);
    THREE.GeometryUtils.merge(combined, m10)

    var up_no_wings1 = new THREE.Shape();
		up_no_wings1.moveTo( -0.14, 0 );
		up_no_wings1.bezierCurveTo( -0.14,-0.05 , 0.14, -0.05, 0.14, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up_no_wings1, extrudeSettings );
		var m11 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m11.position.set(0,0.23,-0.36);
		sceneThreeJs.sceneGraph.add(m11);
		cube.add(m11);
    THREE.GeometryUtils.merge(combined, m11)

    var up_no_wings2 = new THREE.Shape();
		up_no_wings2.moveTo( -0.1, 0 );
		up_no_wings2.bezierCurveTo( -0.1,-0.05 , 0.1, -0.05, 0.1, 0 );
		var extrudeSettings = { amount: 0.08, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up_no_wings2, extrudeSettings );
		var m12 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m12.position.set(0,0.23,-0.24);
		sceneThreeJs.sceneGraph.add(m12);
		cube.add(m12);
    THREE.GeometryUtils.merge(combined, m12)

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
      side:THREE.DoubleSide
    });

    var for_ailes_Mesh = new THREE.Mesh(for_ailes_Geom, for_ailes_Mat);
    for_ailes_Mesh.position.set(0,-0.10,0.25)
    sceneThreeJs.sceneGraph.add(for_ailes_Mesh);
    cube.add(for_ailes_Mesh);
    THREE.GeometryUtils.merge(combined, for_ailes_Mesh)
    var mesh = new THREE.Mesh(combined, new THREE.MeshBasicMaterial({color: 0xff0000}))
    sceneThreeJs.sceneGraph.add(mesh);



    var exporter = new THREE.OBJExporter();
    var obj1 = exporter.parse(mesh);
    download(obj1, "11.obj", Object);
    function download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
  }
}



// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    ////////////////////////////////////////////////////////////////////////////
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);//Space background is a large sphere
    // var spacetex = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/96252/space.jpg");
    // var spacesphereGeo = new THREE.SphereGeometry(20,20,20);
    // var spacesphereMat = new THREE.MeshPhongMaterial();
    // spacesphereMat.map = spacetex;
    //
    // var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);
    //
    // //spacesphere needs to be double sided as the camera is within the spacesphere
    // spacesphere.material.side = THREE.DoubleSide;
    //
    // spacesphere.material.map.wrapS = THREE.RepeatWrapping;
    // spacesphere.material.map.wrapT = THREE.RepeatWrapping;
    // spacesphere.material.map.repeat.set( 5, 3);
    //
    // sceneThreeJs.sceneGraph.add(spacesphere);
    //
    // //create two spotlights to illuminate the scene
    // var spotLight = new THREE.SpotLight( 0xffffff );
    // spotLight.position.set( -40, 60, -10 );
    // spotLight.intensity = 2;
    // sceneThreeJs.sceneGraph.add( spotLight );
    //
    // var spotLight2 = new THREE.SpotLight( 0x5192e9 );
    // spotLight2.position.set( 40, -60, 30 );
    // spotLight2.intensity = 1.5;
    // sceneThreeJs.sceneGraph.add( spotLight2 );
    //////////////////////////////////////////////////////
    // sceneThreeJs.mirrorCube.visible = false;
    // //sceneThreeJs.mirrorCubeCamera.updateCubeMap( render, sceneThreeJs.sceneGraph );
    // console.log(sceneThreeJs.mirrorCubeCamera)
    // var obj = sceneThreeJs.mirrorCubeCamera.updateCubeMap(render, sceneThreeJs.sceneGraph);
    // sceneThreeJs.mirrorCubeCamera = obj;
    // //sceneThreeJs.mirrorCubeCamera = {updateCubeMap: }
    // sceneThreeJs.mirrorCube.visible = true;
}

function animate(sceneThreeJs,guiParam, time) {

    const cube = sceneThreeJs.sceneGraph.getObjectByName("cube");
    const cylinder1 = sceneThreeJs.sceneGraph.getObjectByName("cylinder1");
    const cylinder2 = sceneThreeJs.sceneGraph.getObjectByName("cylinder2");
		const cylinder3 = sceneThreeJs.sceneGraph.getObjectByName("cylinder3");
    const cylinder4 = sceneThreeJs.sceneGraph.getObjectByName("cylinder4");
    const t = time/1000; // temps en seconde

    if (guiParam.landing)
    {
        console.log(t);
    	if (Math.cos(Math.PI*t) >= 0.01){
				cylinder1.setRotationFromAxisAngle(Vector3(1,0,0), Math.PI*t);
        cylinder2.setRotationFromAxisAngle(Vector3(1,0,0), Math.PI*t);
				cylinder4.setRotationFromAxisAngle(Vector3(1,0,0), Math.PI*t);
        cylinder3.setRotationFromAxisAngle(Vector3(1,0,0), Math.PI*t);
       	console.log("im here");
				console.log(t);
        }
    }
    //IT WORKS JUST UNCOMMENTE IT
    //cube.position.set( 2*Math.cos(t),0, 2*Math.sin(t));
    //cube.setRotationFromAxisAngle(Vector3(0,1,0), -t)


    render(sceneThreeJs);
}


// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    var texture = new THREE.TextureLoader().load( "space.jpg" );
    sceneThreeJs.sceneGraph.background = texture

    sceneThreeJs.camera = sceneInit.createCamera(-1,0.5,1);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(-1,1,1));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera, sceneThreeJs.renderer.domElement );
    sceneThreeJs.controls.target.set(0.5, 0, 0.5);
    sceneThreeJs.controls.update();

    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);

    //sceneThreeJs.renderer.setClearColor(0x000000);

    window.addEventListener('resize', function(event){onResize(sceneThreeJs);}, false);
}

// Fonction de gestion d'animation
function AnimationLoop(sceneThreeJs,guiParam) {

    // Fonction JavaScript de demande d'image courante à afficher
    requestAnimationFrame(

        // La fonction (dite de callback) recoit en paramètre le temps courant
        function(timeStamp){
            animate(sceneThreeJs,guiParam,timeStamp); // appel de notre fonction d'animation
            AnimationLoop(sceneThreeJs,guiParam); // relance une nouvelle demande de mise à jour
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
