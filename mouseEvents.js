"use strict";

const mouseEvents = (function() {

  return {

    onMouseDown: function(event,raycaster,pickingData,screenSize,camera,dessin,sceneThreeJs,drawingData) {

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
            if(pickingData.currentKey==="DELETE"){
                sceneThreeJs.sceneGraph.remove(pickingData.selectedObject);
                sceneThreeJs.sceneGraph.remove(sphereSelection);


            }
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
    
        utilsDrawing.find3DPoint(raycaster, camera, x ,y, drawingData,sceneThreeJs.sceneGraph, true);

        drawingData.enableDrawing = true;
    }

    },

    onMouseMove: function(event,raycaster,pickingData, screenSize, sceneThreeJs,drawingData ) {
      const xPixel = event.clientX;
      const yPixel = event.clientY;

      const x =  2*xPixel/screenSize.w-1;
      const y = -2*yPixel/screenSize.h+1;

    if( pickingData.enableDragAndDrop===true && pickingData.engineCreation===false ) {

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

        pickingData.selectedPlane.p.add( translation );

        pickingData.visualRepresentation.sphereTranslation.visible = true;
        pickingData.visualRepresentation.sphereTranslation.position.copy(p);
        

    }

      if (drawingData.enableDrawing == true){
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
