"use strict";

main();

function main() {

    const sceneThreeJs = {
        sceneGraph: null,
        camera: null,
        renderer: null,
        controls: null
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
    init3DObjects(sceneThreeJs.sceneGraph);

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
    const ground = sceneThreeJs.sceneGraph.getObjectByName("ground");

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
    ground.position.copy(p1);

    // Changement de volume de cub
    const cubeGeometry1 = primitive.Cube(Vector3(0,0,0), 0.25*guiParam.volume);
    const cube1 = new THREE.Mesh(cubeGeometry1,MaterialRGB(1,0,0));
    cube1.name="cube1";
    cube1.castShadow = true;
    //cube.visible = false;
    cube1.visible = true;

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


function init3DObjects(sceneGraph, dataControler) {

    const elementsToAdd = [];
    const textureLoader = new THREE.TextureLoader();

    const groundGeometry = primitive.Quadrangle(Vector3(0,0,0),Vector3(0,0,1),Vector3(1,0,1),Vector3(1,0,0));
    const ground = new THREE.Mesh(groundGeometry,MaterialRGB(1,1,1));



    ground.name="ground";
    elementsToAdd.push(ground);
    sceneGraph.add(ground);

    const cubeGeometry = primitive.Cube(Vector3(0,0,0), 0.01);
    const cube = new THREE.Mesh(cubeGeometry,MaterialRGB(1,0,0));
    cube.name="cube";
    elementsToAdd.push(cube);
    sceneGraph.add(cube);


    const cylinderGeometry = primitive.Cylinder( Vector3(0,0,0), Vector3(0,0,0.5),0.10 );
    const cylinder = new THREE.Mesh( cylinderGeometry,MaterialRGB(0.4,0.9,1) );
    cylinder.name = "cylinder";
    elementsToAdd.push(cylinder);
    //sceneGraph.add(cylinder);
    //cube.add(cylinder);
    //cylinder.add(cube);

    const cylinderGeometry1 = primitive.Cylinder( Vector3(0.22,0,-0.25), Vector3(0.22,0,0.25),0.10 );
    const cylinder1 = new THREE.Mesh( cylinderGeometry1,MaterialRGB(0.4,0.9,1) );
    cylinder1.name = "cylinder1";
    //sceneGraph.add(cylinder1);
    //cube.add(cylinder1);

    const cylinderGeometry2 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    const cylinder2 = new THREE.Mesh( cylinderGeometry2,MaterialRGB(0.4,0.9,1) );
    cylinder2.name = "cylinder2";
    //sceneGraph.add(cylinder2);
    //cube.add(cylinder2);

		const cylinderGeometry3 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    const cylinder3 = new THREE.Mesh( cylinderGeometry3,MaterialRGB(0.4,0.9,1) );
    cylinder3.name = "cylinder3";
    cylinder3.position.set(-0.23,0.18,-0.65);
		//sceneGraph.add(cylinder3);
    //cube.add(cylinder3);

		const cylinderGeometry4 = primitive.Cylinder( Vector3(-0.22,0,-0.25), Vector3(-0.22,0,0.25),0.10 );
    const cylinder4 = new THREE.Mesh( cylinderGeometry4,MaterialRGB(0.4,0.9,1) );
    cylinder4.name = "cylinder4";
    cylinder4.position.set(0.67,0.18,-0.65);
		//sceneGraph.add(cylinder4);
    //cube.add(cylinder4);

		var texture	= THREE.ImageUtils.loadTexture('lensflare0_alpha.png');
		// do the material
		var geometry	= new THREE.PlaneGeometry(1,1)
		var material	= new THREE.MeshBasicMaterial({
			color		: 0x00ffff,
			map		: texture,
			side		: THREE.DoubleSide,
			blending	: THREE.AdditiveBlending,
			opacity		: 5,
			depthWrite	: false,
			transparent	: true
		})
		var fire	= new THREE.Mesh(geometry, material)
		fire.scale.multiplyScalar(0.75)
		fire.position.x = 0;
		fire.position.y = 0;
		//cube.add(fire);
		sceneGraph.add(fire);

    //var geometry = new THREE.TetrahedronGeometry(0.5, 0);
    //var material = new THREE.MeshBasicMaterial({color:0x000000});
    //var tetr = new THREE.Mesh(geometry, material);
    //sceneGraph.add(tetr);

    //const figgeom = primitive.Quadrangle( Vector3(1,1,0), Vector3(0,1,1), Vector3(0,0,0), Vector3(1,1,1) );
    //const fig = new THREE.Mesh( figgeom,MaterialRGB(0.4,0.9,1) );
    //fig.name = "fig";
    //fig.position.set(0.67,0.18,-0.65);
		//sceneGraph.add(fig);
    //cube.add(fig);


		var forward = new THREE.Shape();
		forward.moveTo( -0.13, 0 );
		forward.bezierCurveTo( -0.13,-0.05 , 0.13, -0.05, 0.13, 0 );
		var extrudeSettings = { amount: 0.5, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( forward, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.rotateX(Math.PI/180*30);
		mesh.position.set(0,0.2,0);
		//sceneGraph.add(mesh);
		//cube.add(mesh);

    var backward = new THREE.Shape();
		backward.moveTo( -0.13, 0 );
		backward.bezierCurveTo( -0.13,-0.05 , 0.13, -0.05, 0.13, 0 );
		var extrudeSettings = { amount: 0.5, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( backward, extrudeSettings );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.rotateX(Math.PI/180*30);
		mesh.position.set(0,0.2,-0.6);
		//sceneGraph.add(mesh);
		//cube.add(mesh);

		var up = new THREE.Shape();
		up.moveTo( -0.13, 0 );
		up.bezierCurveTo( -0.13,-0.05 , 0.13, -0.05, 0.13, 0 );
		var extrudeSettings = { amount: 0.3, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up, extrudeSettings );
		var m = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m.position.set(0,0.2,-0.5);
		//sceneGraph.add(m);
		//cube.add(m);

    console.log(sceneGraph);

    var up0 = new THREE.Shape();
    up0.moveTo( -0.135, 0 );
    up0.bezierCurveTo( -0.135, 0.1 , 0.135, 0.1, 0.135, 0 );
    var extrudeSettings = { amount: 0.2, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    var geometry = new THREE.ExtrudeGeometry( up0, extrudeSettings );
    var m3 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
    //m.rotateX(Math.PI/180*30);
    m3.position.set(0,0.17,-0.2);
    //sceneGraph.add(m3);
    //cube.add(m3);

		var up1 = new THREE.Shape();
		up1.moveTo( -0.2, 0 );
		up1.bezierCurveTo( -0.2,-0.05 , 0.2, -0.05, 0.2, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up1, extrudeSettings );
		var m1 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m1.position.set(0,0.23,-0.6);
		sceneGraph.add(m1);
		cube.add(m1);

		var up2 = new THREE.Shape();
		up2.moveTo( -0.6, 0 );
		up2.bezierCurveTo( -0.6, 0.15 , 0.6, 0.15, 0.6, 0 );
		var extrudeSettings = { amount: 0.1, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up2, extrudeSettings );
		var m2 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m2.position.set(0,0.23,-0.65);
		sceneGraph.add(m2);
		cube.add(m2);


		var up3 = new THREE.Shape();
		up3.moveTo( -0.13, 0);
		up3.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
		var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up3, extrudeSettings );
		var m4 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m4.position.set(-0.467,0.23,-0.65);
		sceneGraph.add(m4);
		cube.add(m4);

		var up4 = new THREE.Shape();
		up4.moveTo( -0.13, 0 );
		up4.bezierCurveTo( -0.13, -0.15 , 0.13, -0.15, 0.13, 0 );
		var extrudeSettings = { amount: 0.05, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( up4, extrudeSettings );
		var m5 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		//m.rotateX(Math.PI/180*30);
		m5.position.set(0.467,0.23,-0.65);triangleMesh
		sceneGraph.add(m5);
		cube.add(m5);

		var side1 = new THREE.Shape();
		side1.moveTo( -0.13, 0 );
		side1.bezierCurveTo( -0.13, -0.01 , 0.13, -0.01, 0.13, 0 );
		var extrudeSettings = { amount: 0.4, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( side1, extrudeSettings );
		var m6 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		m6.rotateZ(Math.PI/180*90);
		m6.position.set(0.13,0.07,-0.395);
		//sceneGraph.add(m6);
		//cube.add(m6);

		var side2 = new THREE.Shape();
		side2.moveTo( -0.13, 0 );
		side2.bezierCurveTo( -0.13, +0.01 , 0.13, +0.01, 0.13, 0 );
		var extrudeSettings = { amount: 0.4, bevelEnabled: false }//, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
		var geometry = new THREE.ExtrudeGeometry( side2, extrudeSettings );
		var m7 = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		m7.rotateZ(Math.PI/180*90);
		m7.position.set(-0.13,0.07,-0.395);
		//sceneGraph.add(m7);
		//cube.add(m7);

    var triangleGeometry = new THREE.Geometry();
    triangleGeometry.vertices.push(new THREE.Vector3(-0.09,  -0.2, 0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.15, -0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.2, 0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.09,  -0.2, 0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.15, -0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.2, 0.15, -0.3));
    triangleGeometry.vertices.push(new THREE.Vector3(0.15,0.15,-0.7));
    triangleGeometry.vertices.push(new THREE.Vector3(-0.15,0.15,-0.7));


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

    //var texture1	= THREE.ImageUtils.loadTexture('1.png');

    var triangleMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('lava.jpg'),
      side: THREE.DoubleSide
    });

    var material = new THREE.MeshFaceMaterial(triangleMaterial);

    var triangleMesh = new THREE.Mesh(triangleGeometry, material);
    //triangleMesh.material.map(new THREE.TextureLoader().load('1.png'));
    //triangleMesh.material.needsUpdate = true;
    //triangleMesh.rotateY(Math.PI/180*270)
    triangleMesh.position.set(0, 0.07, 0.14);

    sceneGraph.add(triangleMesh);
    cube.add(triangleMesh);

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
      color:0x808080,
      side:THREE.DoubleSide
    });

    var ailesMesh = new THREE.Mesh(ailesGeom, ailesMat);
    sceneGraph.add(ailesMesh);
    cube.add(ailesMesh);

    }



// Demande le rendu de la scène 3D
function render( sceneThreeJs ) {
    sceneThreeJs.renderer.render(sceneThreeJs.sceneGraph, sceneThreeJs.camera);
}

function animate(sceneThreeJs,guiParam, time) {

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
    //guiParam.landing = false;

    render(sceneThreeJs);
}


// Fonction d'initialisation d'une scène 3D sans objets 3D
//  Création d'un graphe de scène et ajout d'une caméra et d'une lumière.
//  Création d'un moteur de rendu et ajout dans le document HTML
function initEmptyScene(sceneThreeJs) {

    sceneThreeJs.sceneGraph = new THREE.Scene();

    sceneThreeJs.camera = sceneInit.createCamera(-1,0.5,1);
    sceneInit.insertAmbientLight(sceneThreeJs.sceneGraph);
    sceneInit.insertLight(sceneThreeJs.sceneGraph,Vector3(-1,1,1));

    sceneThreeJs.renderer = sceneInit.createRenderer();
    sceneInit.insertRenderInHtml(sceneThreeJs.renderer.domElement);

    sceneThreeJs.controls = new THREE.OrbitControls( sceneThreeJs.camera, sceneThreeJs.renderer.domElement );
    sceneThreeJs.controls.target.set(0.5, 0, 0.5);
    sceneThreeJs.controls.update();
    sceneThreeJs.renderer.setClearColor(0x000000);


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
//function onDocumentMouseDown(event, sceneThreeJs) {
    //event.preventDefault();

//    switch ( event.which ) {
//    	case 1: // left mouse click

//    	 mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//	 mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     	 mouse.unproject( sceneThreeJs.camera );
//     	 addPoint( mouse );
//     	 break;

//    	case 3: // right mouse click
// 	 removeLastPoint();
//         break;
//  }
//}
//function addPoint( coord ) {

//	var positionAttribtue = geometry.getAttribute( 'position' );

  // add point to buffer data
  // we use the current count of drawRange as our index

//  var index = geometry.drawRange.count;

//  positionAttribtue.setXYZ( index, coord.x, coord.y, coord.z );

  // only update the part of the buffer that has actually changed

// 	positionAttribtue.updateRange.offset = positionAttribtue.itemSize * index;
// 	positionAttribtue.updateRange.count =  positionAttribtue.itemSize;
//  positionAttribtue.needsUpdate = true;

  // increase draw count to draw the new segment

// 	geometry.drawRange.count ++;

//}

//function removeLastPoint() {

//	if ( geometry.drawRange.count > 1 ) {

//  	geometry.drawRange.count --;

//  }
//}
