"use strict";

const mouseEvents = (function() {

    return {
        onMouseDown: function(event, raycaster, pickingData, screenSize, camera, drawing, sceneThreeJs, drawingData) {

            // Picking
            const xPixel = event.clientX;
            const yPixel = event.clientY;
            const x = 2 * xPixel / screenSize.w - 1;
            const y = -2 * yPixel / screenSize.h + 1;
            if (pickingData.enabled === true && drawing === true) { // Activation if picking and drawing are enabled

                raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

                // Calculation of intercepts between the radius and objects passed in parameters
                const intersects = raycaster.intersectObjects(pickingData.selectableObjects);

                const nbrIntersection = intersects.length;
                if (nbrIntersection > 0) {

                    // Intersections are sorted by distance along the radius. We only consider the first.
                    const intersection = intersects[0];

                    // Backup of picking data
                    pickingData.selectedObject = intersection.object; // selected object
                    pickingData.selectedPlane.p = intersection.point.clone(); // coordinates of the 3D intersection point
                    pickingData.selectedPlane.n = camera.getWorldDirection().clone(); // normal plane of the camera

                    // Display of the selection
                    const sphereSelection = pickingData.visualRepresentation.sphereSelection;
                    sphereSelection.position.copy(pickingData.selectedPlane.p);
                    sphereSelection.visible = true;
                    if (pickingData.currentKey === "DELETE") {
                        sceneThreeJs.sceneGraph.remove(pickingData.selectedObject);
                        sceneThreeJs.sceneGraph.remove(sphereSelection);
                        sceneThreeJs.baseObject.remove(pickingData.selectedObject);
                        pickingData.selectableObjects.remove(pickingData.selectedObject);

                    } else if (pickingData.engineCreation === false) {

                        if (pickingData.currentKey === "CTRL") pickingData.enableDragAndDrop = true;
                        else if (pickingData.currentKey === "Z") pickingData.enableScaling = true;
                        else if (pickingData.currentKey === "R") pickingData.enableRotation = true;
                        else if (pickingData.currentKey === "C") {
                            const selectedObj = pickingData.selectedObject;
                            var copiedObject = selectedObj.clone();
                            console.log('hey');
                            console.log(copiedObject);
                            copiedObject.position.set(0.5, 0.5, 0.5);
                            sceneThreeJs.sceneGraph.add(copiedObject);
                            sceneThreeJs.baseObject.add(copiedObject);
                            pickingData.selectableObjects.push(copiedObject);
                        }

                    }
                }
            }
            if (pickingData.engineCreation === true) {
                pickingData.currentEnginePoints.push(new THREE.Vector2(x, y));
                utilsDrawing.find3DPoint(raycaster, camera, x, y, drawingData, sceneThreeJs.sceneGraph, true);
                drawingData.enableDrawing = true;
            }

        },

        onMouseMove: function(event, raycaster, pickingData, screenSize, sceneThreeJs, drawingData) {
            const xPixel = event.clientX;
            const yPixel = event.clientY;

            const x = 2 * xPixel / screenSize.w - 1;
            const y = -2 * yPixel / screenSize.h + 1;

            // We can move objects only if we are not creating an engine, not scaling, rotating and dragging objects
            if (pickingData.engineCreation === false && (pickingData.enableScaling === true || pickingData.enableDragAndDrop === true || pickingData.enableRotation === true)) {

                // Reverse projection from the 2D point on the screen to a 3D point
                const selectedPoint = Vector3(x, y, 0.5); //value of z after projection
                selectedPoint.unproject(sceneThreeJs.camera);
                // Direction of the ray passing through the selected point
                const p0 = sceneThreeJs.camera.position;
                const d = selectedPoint.clone().sub(p0);

                // Intersection between the 3D ray and the plane of the camera
                const p = pickingData.selectedPlane.p;
                const n = pickingData.selectedPlane.n;
                // tI = <p-p0,n> / <d,n>
                const tI = ((p.clone().sub(p0)).dot(n)) / (d.dot(n));
                // pI = p0 + tI d
                const pI = (d.clone().multiplyScalar(tI)).add(p0); //  intersection point

                const objectCentre = pickingData.selectedObject.position;

                const translation = pI.clone().sub(p);
                if (pickingData.enableDragAndDrop === true) {

                    pickingData.selectedObject.position.x += translation.x;
                    pickingData.selectedObject.position.y += translation.y;
                    pickingData.selectedObject.position.z += translation.z;

                }

                // scaling
                else if (pickingData.enableScaling === true) {
                    const translation = pI.clone().sub(p);
                    if ((Math.abs(translation.x) > Math.abs(translation.y)) && (Math.abs(translation.x) > Math.abs(translation.z))) {
                        var mul = 0.99;
                        if (translation.x > 0) mul = 1.01;
                        pickingData.selectedObject.scale.x *= mul;
                    } else if ((Math.abs(translation.y) > Math.abs(translation.x)) && (Math.abs(translation.y) > Math.abs(translation.z))) {
                        var mul = 0.99;
                        if (translation.y > 0) mul = 1.01;
                        pickingData.selectedObject.scale.y *= mul;
                    } else if ((Math.abs(translation.z) > Math.abs(translation.y)) && (Math.abs(translation.z) > Math.abs(translation.x))) {
                        var mul = 0.99;
                        if (translation.z > 0) mul = 1.01;
                        pickingData.selectedObject.scale.z *= mul;
                    }

                }

                // rotation
                else if (pickingData.enableRotation === true) {
                    const translation = pI.clone().sub(p);
                    if ((Math.abs(translation.x) > Math.abs(translation.y)) && (Math.abs(translation.x) > Math.abs(translation.z))) {
                        var angle = 0;
                        if (translation.x > 0) angle = 0.01;
                        if (translation.x < 0) angle = -0.01;
                        pickingData.selectedObject.rotateX(angle)
                    } else if ((Math.abs(translation.y) > Math.abs(translation.x)) && (Math.abs(translation.y) > Math.abs(translation.z))) {
                        var angle = 0;
                        if (translation.y > 0) angle = 0.01;
                        if (translation.y < 0) angle = -0.01;
                        pickingData.selectedObject.rotateY(angle)
                    } else if ((Math.abs(translation.z) > Math.abs(translation.y)) && (Math.abs(translation.z) > Math.abs(translation.x))) {
                        var angle = 0;
                        if (translation.z > 0) angle = 0.01;
                        if (translation.z < 0) angle = -0.01;
                        pickingData.selectedObject.rotateZ(angle)
                    }
                }
                pickingData.selectedPlane.p.add(translation);

                pickingData.visualRepresentation.sphereTranslation.visible = true;
                pickingData.visualRepresentation.sphereTranslation.position.copy(p);
            }
            if (drawingData.enableDrawing == true) {
                utilsDrawing.find3DPoint(raycaster, sceneThreeJs.camera, x, y, drawingData, sceneThreeJs.sceneGraph, false);
            }


        },


        onMouseUp: function(event, pickingData, sceneThreeJs, drawingData) {
            pickingData.enableDragAndDrop = false;
            pickingData.enableScaling = false;
            drawingData.enableDrawing = false;
            if (drawingData.drawing3DPoints.length > 0) {

                drawingData.selectedObject.updateMatrix();
                const matrice = drawingData.selectedObject.matrix;
                matrice.getInverse(matrice);
                drawingData.line.applyMatrix(matrice);

                sceneThreeJs.sceneGraph.remove(drawingData.line);
                drawingData.selectedObject.add(drawingData.line);
                drawingData.drawing3DPoints = [];
            }

        },

    };
})();
