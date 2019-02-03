"use strict";

const mouseEvents = (function() {

  return {

    onMouseDown: function(event,raycaster,pickingData,screenSize,camera,dessin,sceneThreeJs,drawingData) {

  // Gestion du picking
            const xPixel = event.clientX;
            const yPixel = event.clientY;

            const x =  2*xPixel/screenSize.w-1;
            const y = -2*yPixel/screenSize.h+1;
        if( pickingData.enabled===true && dessin===true ) { // activation si la touche CTRL est enfoncée

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
                if(pickingData.currentKey==="DELETE"){
                    sceneThreeJs.sceneGraph.remove(pickingData.selectedObject);
                    sceneThreeJs.sceneGraph.remove(sphereSelection);
                    sceneThreeJs.baseObject.remove(pickingData.selectedObject);
                    pickingData.selectableObjects.remove(pickingData.selectedObject);

                }
                else if (pickingData.engineCreation===false){

                    if (pickingData.currentKey==="CTRL") pickingData.enableDragAndDrop = true;
                    else if ( pickingData.currentKey==="Z") pickingData.enableScaling = true;
                    else if (pickingData.currentKey==="R") pickingData.enableRotation = true;
                    else if (pickingData.currentKey==="C"){
                        const selectedObj = pickingData.selectedObject;
                        var copiedObject = selectedObj.clone();
                        console.log('hey');
                        console.log(copiedObject);
                        copiedObject.position.set(0.5,0.5,0.5);
                        sceneThreeJs.sceneGraph.add(copiedObject);
                        sceneThreeJs.baseObject.add(copiedObject);
                        pickingData.selectableObjects.push(copiedObject);
                    }

                }
            }
        }
            if(pickingData.engineCreation===true) {
                console.log('YEAH');
                
                pickingData.currentEnginePoints.push( new THREE.Vector2 (x,  y));
                console.log(pickingData.currentEnginePoints);
            
                utilsDrawing.find3DPoint(raycaster, camera, x ,y, drawingData,sceneThreeJs.sceneGraph, true);

                drawingData.enableDrawing = true;
            }
        
    },

    onMouseMove: function(event,raycaster,pickingData, screenSize, sceneThreeJs,drawingData ) {
            const xPixel = event.clientX;
            const yPixel = event.clientY;

            const x =  2*xPixel/screenSize.w-1;
            const y = -2*yPixel/screenSize.h+1;
      if (pickingData.engineCreation===false && (pickingData.enableScaling===true || pickingData.enableDragAndDrop===true || pickingData.enableRotation===true)){

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
            if( pickingData.enableDragAndDrop===true) {
                console.log(translation.x )
                pickingData.selectedObject.position.x+= translation.x ;
                pickingData.selectedObject.position.y+= translation.y ;
                pickingData.selectedObject.position.z+= translation.z ;
                

            }
            else if( pickingData.enableScaling===true) {
                const translation = pI.clone().sub( p );
                if ((Math.abs(translation.x)>Math.abs(translation.y))&&(Math.abs(translation.x)>Math.abs(translation.z))) {
                    console.log("x");
                    var mul = 0.99;

                    if (translation.x > 0) mul = 1.01;
                    pickingData.selectedObject.scale.x*=mul;

                }
                else if ((Math.abs(translation.y)>Math.abs(translation.x))&&(Math.abs(translation.y)>Math.abs(translation.z))){
                    console.log("y");
                    var mul = 0.99;

                    if (translation.y > 0)mul = 1.01;
                    pickingData.selectedObject.scale.y*=mul;
                }
                else if ((Math.abs(translation.z)>Math.abs(translation.y))&&(Math.abs(translation.z)>Math.abs(translation.x))){
                    console.log("z");
                    var mul = 0.99;

                    if (translation.z > 0)  mul = 1.01;
                    pickingData.selectedObject.scale.z*=mul;
                }
            
            }
            else if( pickingData.enableRotation===true) {
                const translation = pI.clone().sub( p );
                if ((Math.abs(translation.x)>Math.abs(translation.y))&&(Math.abs(translation.x)>Math.abs(translation.z))) {
                    console.log("x");
                    var angle=0;

                    if (translation.x > 0) angle = 0.01;
                    if (translation.x < 0) angle = -0.01;
                    
                    pickingData.selectedObject.rotateX(angle)

                }
                else if ((Math.abs(translation.y)>Math.abs(translation.x))&&(Math.abs(translation.y)>Math.abs(translation.z))){
                    console.log("y");
                    var angle=0;

                    if (translation.y > 0) angle = 0.01;
                    if (translation.y < 0) angle = -0.01;
                    pickingData.selectedObject.rotateY(angle)
                }
                else if ((Math.abs(translation.z)>Math.abs(translation.y))&&(Math.abs(translation.z)>Math.abs(translation.x))){
                    console.log("z");
                    var angle=0;

                    if (translation.z > 0) angle = 0.01;
                    if (translation.z < 0) angle = -0.01;
                    pickingData.selectedObject.rotateZ(angle)
                }
            }
            pickingData.selectedPlane.p.add( translation );

            pickingData.visualRepresentation.sphereTranslation.visible = true;
             pickingData.visualRepresentation.sphereTranslation.position.copy(p);
        }
        if (drawingData.enableDrawing == true){
            
            console.log('DRAW')
            utilsDrawing.find3DPoint(raycaster, sceneThreeJs.camera, x ,y, drawingData,sceneThreeJs.sceneGraph, false);
        }
        

    },


    onMouseUp: function(event,pickingData,sceneThreeJs,drawingData) {
        pickingData.enableDragAndDrop = false;
        pickingData.enableScaling = false;
        drawingData.enableDrawing = false;
        if (drawingData.drawing3DPoints.length > 0){

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
