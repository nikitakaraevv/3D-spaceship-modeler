"use strict";


const spaceshipGeometry = (function() {

    return {

        // Creating and adding light in the scene graph
        createSpaceship: function(sceneThreeJs, pickingData) {
            var triangleGeometry = new THREE.Geometry();
            triangleGeometry.vertices.push(new THREE.Vector3(-0.09, -0.2, 0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(-0.15, -0.15, -0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(-0.2, 0.15, -0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(0.09, -0.2, 0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(0.15, -0.15, -0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(0.2, 0.15, -0.3));
            triangleGeometry.vertices.push(new THREE.Vector3(0.15, 0.15, -0.78));
            triangleGeometry.vertices.push(new THREE.Vector3(-0.15, 0.15, -0.78));


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


            var spaceShip1Texture = new THREE.TextureLoader().load('../images/spaceship1.jpg');
            var spaceShip2Texture = new THREE.TextureLoader().load('../images/spaceship2.jpg');
            var triangleMat = new THREE.MeshBasicMaterial({
                color: 0x353535,
                side: THREE.DoubleSide,
                map: texture
            });

            var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMat);
            triangleMesh.position.set(0.5, 0.5, 0.5);

            triangleMesh.scale.x = sceneThreeJs.scale.x;
            triangleMesh.scale.y = sceneThreeJs.scale.y;
            triangleMesh.scale.z = sceneThreeJs.scale.z;
            triangleMesh.name = "cube";
            triangleMesh.castShadow = true;
            sceneThreeJs.sceneGraph.add(triangleMesh);
            sceneThreeJs.baseObject = triangleMesh;
            pickingData.selectableObjects.push(triangleMesh);




            var mat = new THREE.MeshPhongMaterial()
            mat.map = spaceShip2Texture

            var up1 = new THREE.Shape();
            up1.moveTo(-0.2, 0);
            up1.bezierCurveTo(-0.2, -0.05, 0.2, -0.05, 0.2, 0);
            var extrudeSettings = {
                amount: 0.1,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(up1, extrudeSettings);
            var m1 = new THREE.Mesh(geometry, mat);
            m1.position.set(0, 0.13, -0.77);
            sceneThreeJs.sceneGraph.add(m1);
            pickingData.selectableObjects.push(m1);
            triangleMesh.add(m1);

            var up2 = new THREE.Shape();
            up2.moveTo(-0.6, 0);
            up2.bezierCurveTo(-0.6, 0.15, 0.6, 0.15, 0.6, 0);
            var extrudeSettings = {
                amount: 0.1,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(up2, extrudeSettings);
            var m2 = new THREE.Mesh(geometry, mat);
            m2.position.set(0, 0.13, -0.77);
            sceneThreeJs.sceneGraph.add(m2);
            pickingData.selectableObjects.push(m2);
            triangleMesh.add(m2);


            var up3 = new THREE.Shape();
            up3.moveTo(-0.13, 0);
            up3.bezierCurveTo(-0.13, -0.15, 0.13, -0.15, 0.13, 0);
            var extrudeSettings = {
                amount: 0.05,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(up3, extrudeSettings);
            var m4 = new THREE.Mesh(geometry, mat);
            m4.position.set(-0.467, 0.13, -0.77);
            sceneThreeJs.sceneGraph.add(m4);
            pickingData.selectableObjects.push(m4);
            triangleMesh.add(m4);

            var up4 = new THREE.Shape();
            up4.moveTo(-0.13, 0);
            up4.bezierCurveTo(-0.13, -0.15, 0.13, -0.15, 0.13, 0);
            var extrudeSettings = {
                amount: 0.05,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(up4, extrudeSettings);
            var m5 = new THREE.Mesh(geometry, mat);
            m5.position.set(0.467, 0.13, -0.77);
            sceneThreeJs.sceneGraph.add(m5);
            pickingData.selectableObjects.push(m5);
            triangleMesh.add(m5);


            var ailesGeom = new THREE.Geometry();
            ailesGeom.vertices.push(new THREE.Vector3(-0.65, 0.2, 0)); //0
            ailesGeom.vertices.push(new THREE.Vector3(-0.6, 0.33, -0.2)); //1
            ailesGeom.vertices.push(new THREE.Vector3(-0.4, 0.29, -0.2)); //2
            ailesGeom.vertices.push(new THREE.Vector3(0, 0, 0)); //3
            ailesGeom.vertices.push(new THREE.Vector3(0.4, 0.29, -0.2)); //4
            ailesGeom.vertices.push(new THREE.Vector3(0.6, 0.33, -0.2)); //5
            ailesGeom.vertices.push(new THREE.Vector3(0.65, 0.2, 0)); //6
            ailesGeom.vertices.push(new THREE.Vector3(0.6, 0.27, 0)); //7
            ailesGeom.vertices.push(new THREE.Vector3(0.4, 0.25, 0)); //8
            ailesGeom.vertices.push(new THREE.Vector3(0.3, 0, 0)); //9
            ailesGeom.vertices.push(new THREE.Vector3(-0.3, 0, 0)); //10
            ailesGeom.vertices.push(new THREE.Vector3(-0.4, 0.25, 0)); //11
            ailesGeom.vertices.push(new THREE.Vector3(-0.6, 0.27, 0)); //12
            ailesGeom.vertices.push(new THREE.Vector3(-0.6, 0.27, -0.3)); //13
            ailesGeom.vertices.push(new THREE.Vector3(0.6, 0.27, -0.3)); //14

            ailesGeom.faces.push(new THREE.Face3(0, 1, 12));
            ailesGeom.faces.push(new THREE.Face3(1, 12, 2));
            ailesGeom.faces.push(new THREE.Face3(12, 2, 11));
            ailesGeom.faces.push(new THREE.Face3(11, 2, 3));
            ailesGeom.faces.push(new THREE.Face3(11, 3, 10));
            ailesGeom.faces.push(new THREE.Face3(10, 3, 9));
            ailesGeom.faces.push(new THREE.Face3(3, 4, 9));
            ailesGeom.faces.push(new THREE.Face3(9, 8, 4));
            ailesGeom.faces.push(new THREE.Face3(4, 8, 5));
            ailesGeom.faces.push(new THREE.Face3(8, 5, 7));
            ailesGeom.faces.push(new THREE.Face3(5, 6, 7));
            ailesGeom.faces.push(new THREE.Face3(0, 12, 11));
            ailesGeom.faces.push(new THREE.Face3(6, 7, 8));
            ailesGeom.faces.push(new THREE.Face3(13, 0, 1));
            ailesGeom.faces.push(new THREE.Face3(13, 1, 2));
            ailesGeom.faces.push(new THREE.Face3(13, 2, 11));
            ailesGeom.faces.push(new THREE.Face3(13, 10, 2));
            ailesGeom.faces.push(new THREE.Face3(13, 3, 2));
            ailesGeom.faces.push(new THREE.Face3(10, 11, 13));
            ailesGeom.faces.push(new THREE.Face3(14, 6, 5));
            ailesGeom.faces.push(new THREE.Face3(14, 5, 4));
            ailesGeom.faces.push(new THREE.Face3(14, 4, 8));
            ailesGeom.faces.push(new THREE.Face3(14, 9, 4));
            ailesGeom.faces.push(new THREE.Face3(14, 3, 4));
            ailesGeom.faces.push(new THREE.Face3(9, 8, 14));
            ailesGeom.faces.push(new THREE.Face3(10, 3, 2));
            ailesGeom.faces.push(new THREE.Face3(3, 11, 2));
            ailesGeom.faces.push(new THREE.Face3(13, 10, 3));
            ailesGeom.faces.push(new THREE.Face3(14, 9, 3));



            var ailesMat = new THREE.MeshBasicMaterial({
                color: 0x809999,
                side: THREE.DoubleSide,
                map: spaceShip2Texture
            });

            var ailesMesh = new THREE.Mesh(ailesGeom, ailesMat);
            ailesMesh.position.set(0, 0, -0.2);
            sceneThreeJs.sceneGraph.add(ailesMesh);
            triangleMesh.add(ailesMesh);
            pickingData.selectableObjects.push(ailesMesh);

            var forward = new THREE.Shape();
            forward.moveTo(-0.11, 0);
            forward.bezierCurveTo(-0.11, -0.05, 0.11, -0.05, 0.11, 0);
            var extrudeSettings = {
                amount: 0.45,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(forward, extrudeSettings);
            var mat = new THREE.MeshPhongMaterial();
            var texture = new THREE.TextureLoader().load('../images/glass.jpg');
            mat.map = texture;
            var mesh = new THREE.Mesh(geometry, mat);
            mesh.rotateX(Math.PI / 180 * 30);
            mesh.position.set(0, 0.1, -0.2);
            sceneThreeJs.sceneGraph.add(mesh);
            pickingData.selectableObjects.push(mesh);
            triangleMesh.add(mesh);

            var mat = new THREE.MeshPhongMaterial()
            mat.map = spaceShip1Texture
            var up_no_wings = new THREE.Shape();
            up_no_wings.moveTo(-0.18, 0);
            up_no_wings.bezierCurveTo(-0.18, -0.05, 0.18, -0.05, 0.18, 0);
            var extrudeSettings = {
                amount: 0.1,
                bevelEnabled: false
            }
            var geometry = new THREE.ExtrudeGeometry(up_no_wings, extrudeSettings);
            var m10 = new THREE.Mesh(geometry, mat);
            m10.position.set(0, 0.16, -0.61);
            sceneThreeJs.sceneGraph.add(m10);
            pickingData.selectableObjects.push(m10);
            triangleMesh.add(m10);

            var up_no_wings1 = new THREE.Shape();
            up_no_wings1.moveTo(-0.14, 0);
            up_no_wings1.bezierCurveTo(-0.14, -0.05, 0.14, -0.05, 0.14, 0);
            var extrudeSettings = {
                amount: 0.1,
                bevelEnabled: false
            } //, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            var geometry = new THREE.ExtrudeGeometry(up_no_wings1, extrudeSettings);
            var m11 = new THREE.Mesh(geometry, mat);
            m11.position.set(0, 0.16, -0.49);
            sceneThreeJs.sceneGraph.add(m11);
            pickingData.selectableObjects.push(m11);
            triangleMesh.add(m11);

            var up_no_wings2 = new THREE.Shape();
            up_no_wings2.moveTo(-0.1, 0);
            up_no_wings2.bezierCurveTo(-0.1, -0.05, 0.1, -0.05, 0.1, 0);
            var extrudeSettings = {
                amount: 0.08,
                bevelEnabled: false
            } //, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
            var geometry = new THREE.ExtrudeGeometry(up_no_wings2, extrudeSettings);
            var m12 = new THREE.Mesh(geometry, mat);
            m12.position.set(0, 0.16, -0.37);
            sceneThreeJs.sceneGraph.add(m12);
            pickingData.selectableObjects.push(m12);
            triangleMesh.add(m12);


            var texture = new THREE.TextureLoader().load('../images/lensflare0_alpha.png');
            // do the material
            var geometry = new THREE.PlaneGeometry(1, 1)
            var material = new THREE.MeshBasicMaterial({
                color: 0x000fff,
                map: texture,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                opacity: 10,
                depthWrite: false,
                transparent: true
            })
            var fire1 = new THREE.Mesh(geometry, material)
            fire1.scale.multiplyScalar(0.75)
            fire1.position.x = 0;
            fire1.position.y = 0;
            fire1.position.z = 0;
            fire1.name = 'fire1'
            sceneThreeJs.sceneGraph.add(fire1);

            m4.add(fire1);

            var fire2 = new THREE.Mesh(geometry, material)
            fire2.scale.multiplyScalar(0.75)
            fire2.position.x = 0;
            fire2.position.y = 0;
            fire2.position.z = 0
            fire2.name = 'fire2'
            sceneThreeJs.sceneGraph.add(fire2);

            m5.add(fire2);

            var for_ailes_Geom = new THREE.Geometry();
            for_ailes_Geom.vertices.push(new THREE.Vector3(-0.2, 0, 0)); //0
            for_ailes_Geom.vertices.push(new THREE.Vector3(-0.16, 0.01, 0.2)); //1
            for_ailes_Geom.vertices.push(new THREE.Vector3(-0.1, 0, 0)); //2
            for_ailes_Geom.vertices.push(new THREE.Vector3(-0.16, 0.05, 0)); //3
            for_ailes_Geom.vertices.push(new THREE.Vector3(0, 0.01, 0)); //4
            for_ailes_Geom.vertices.push(new THREE.Vector3(0.1, 0, 0)); //5
            for_ailes_Geom.vertices.push(new THREE.Vector3(0.2, 0, 0)); //6
            for_ailes_Geom.vertices.push(new THREE.Vector3(0.16, 0.01, 0.2)); //7
            for_ailes_Geom.vertices.push(new THREE.Vector3(0.16, 0.05, 0)); //8


            for_ailes_Geom.faces.push(new THREE.Face3(0, 1, 2));
            for_ailes_Geom.faces.push(new THREE.Face3(0, 1, 3));
            for_ailes_Geom.faces.push(new THREE.Face3(1, 2, 3));
            for_ailes_Geom.faces.push(new THREE.Face3(2, 3, 4));
            for_ailes_Geom.faces.push(new THREE.Face3(2, 4, 5));
            for_ailes_Geom.faces.push(new THREE.Face3(4, 5, 8));
            for_ailes_Geom.faces.push(new THREE.Face3(5, 8, 7));
            for_ailes_Geom.faces.push(new THREE.Face3(8, 7, 6));
            for_ailes_Geom.faces.push(new THREE.Face3(5, 6, 7));
            for_ailes_Geom.faces.push(new THREE.Face3(0, 3, 2));
            for_ailes_Geom.faces.push(new THREE.Face3(5, 6, 8));
            for_ailes_Geom.faces.push(new THREE.Face3(3, 2, 5));
            for_ailes_Geom.faces.push(new THREE.Face3(2, 5, 8));
            var for_ailes_Mat = new THREE.MeshBasicMaterial({
                color: 0x809999,
                side: THREE.DoubleSide,
                map: spaceShip2Texture
            });

            var for_ailes_Mesh = new THREE.Mesh(for_ailes_Geom, for_ailes_Mat);
            for_ailes_Mesh.position.set(0, -0.10, 0)

            sceneThreeJs.sceneGraph.add(for_ailes_Mesh);
            pickingData.selectableObjects.push(for_ailes_Mesh);
            triangleMesh.add(for_ailes_Mesh);
        },

    };

})();
