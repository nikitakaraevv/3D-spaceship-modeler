"use strict";


const sceneInit = (function() {

    return {

        // Creating and adding light in the scene graph
        insertLight: function(sceneGraph, p) {
            const spotLight = new THREE.SpotLight(0xffffff, 0.9);
            spotLight.position.copy(p);

            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 2048;
            spotLight.shadow.mapSize.height = 2048;

            sceneGraph.add(spotLight);
        },

        insertAmbientLight: function(sceneGraph) {
            const ambient = new THREE.AmbientLight(0xffffff, 0.1);
            sceneGraph.add(ambient);
        },

        // Creating and adding a camera in the scene graph
        createCamera: function(x, y, z) {
            const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
            camera.position.set(x, y, z);
            camera.lookAt(0, 0, 0);

            return camera;
        },

        // Initializing the rendering engine
        createRenderer: function() {
            const renderer = new THREE.WebGLRenderer({
                antialias: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0xffffff, 1.0);
            renderer.setSize(window.innerWidth, window.innerHeight);

            renderer.shadowMap.enabled = true;
            renderer.shadowMap.Type = THREE.PCFSoftShadowMap;

            return renderer;
        },


        insertRenderInHtml: function(domElement) {
            const baliseHtml = document.querySelector("#AffichageScene3D");
            baliseHtml.appendChild(domElement);
        },

    };

})();
