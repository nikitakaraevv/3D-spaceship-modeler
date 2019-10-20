"use strict";

// Calculate and return the rotation between two axes v1 and v2
//   Assuming v1 and v2 are normalized:
//    - Rotation axis given by: v1 x v2 / || v1 x v2 ||
//    - Angle of rotation given by: acos( <v1,v2> )
//   Rem: The vectors v1 and v2 are normalized in the function
// v1: departure axis [Vector3]
// v2: departure axis [Vector3]
function RotationBetweenTwoAxes(v1, v2) {
    const v1n = v1.clone().normalize();
    const v2n = v2.clone().normalize();

    const axis = v1n.clone().cross(v2n).normalize();
    const angle = Math.acos(v1n.dot(v2n));

    return new THREE.Matrix4().makeRotationAxis(axis, angle);
}

const primitive = (function() {

    return {

        // p: Center of the cube [Vector3]
        // L: Length of one side of the cube
        Cube: function(p, L) {
            const geometry = new THREE.BoxGeometry(L, L, L);
            geometry.translate(p.x, p.y, p.z);
            return geometry;
        },

        // Cylinder of revolution
        // p0: Starting point (on the axis of the cylinder) [Vector3]
        // p1: Ending point (on the axis of the cylinder) [Vector3]
        // r: Radius around the axis
        Cylinder: function(p0, p1, r) {
            const u = p1.clone().sub(p0); // cylinder axis
            const L = u.length(); // cylinder length
            const geometry = new THREE.CylinderGeometry(r, r, L, 20);

            const u0 = new THREE.Vector3(0, 1, 0); // cylinder axis by default in Three.js
            const R = RotationBetweenTwoAxes(u0, u); // rotation matrix between u0 and u

            geometry.translate(0, L / 2, 0); // translation of the cylinder to place its base at the origin (the default cylinder is centered)
            geometry.applyMatrix(R); // rotation application
            geometry.translate(p0.x, p0.y, p0.z); // translation on the starting point

            return geometry;
        },

        // Circular base
        // p0: starting point in the center of the axis  [Vector3]
        // p1: point of arrival (cone point) [Vector3]
        // r: radius at the base of the cone
        Cone: function(p0, p1, r) {
            const u = p1.clone().sub(p0); // cone axis
            const L = u.length(); // cylinder length
            let geometry = new THREE.ConeGeometry(r, L, 20);

            const u0 = new THREE.Vector3(0, 1, 0); // cone axis by default of Three.js
            const R = RotationBetweenTwoAxes(u0, u); // rotation matrix between u0 and u

            geometry.translate(0, L / 2, 0); // translation of the cone to place its base at the origin (the default cylinder is centered)
            geometry.applyMatrix(R); // rotation application
            geometry.translate(p0.x, p0.y, p0.z) // translation on the starting point

            return geometry;
        },

        // Displayable vector (cylinder ending with a cone)
        // p0: starting point [Vector3]
        // p1: ending point [Vector3]
        // rCylinder: radius of the cylinder
        // rCone: radius at the base of the cone
        // alpha: cone length relative to the size of the vector
        Arrow: function(p0, p1, rCylinder, rCone, alpha) {
            const p01 = p1.clone().sub(p0); // Vector p0 p1
            const L = p01.length(); // Total length of the vector

            // end position of the cylinder:
            // pi = p0 + (1-alpha) (p1-p0)
            const pi = p0.clone().add(p01.clone().multiplyScalar(1 - alpha));

            const geometry = primitive.Cylinder(p0, pi, rCylinder);
            geometry.merge(primitive.Cone(pi, p1, rCone));

            return geometry;
        },

        // Sphere defined by its center and radius
        // p: center [Vector3]
        // r: radius
        Sphere: function(p, r) {
            const geometry = new THREE.SphereGeometry(r, 32, 32);
            geometry.translate(p.x, p.y, p.z);

            return geometry;
        },

        Triangle: function(p0, p1, p2) {

            const n = new THREE.Triangle(p0, p1, p2).normal();
            const vertices = new Float32Array([
                p0.x, p0.y, p0.z,
                p1.x, p1.y, p1.z,
                p2.x, p2.y, p2.z
            ]);
            const normal = new Float32Array([
                n.x, n.y, n.z,
                n.x, n.y, n.z,
                n.x, n.y, n.z,
            ]);
            const uv = new Float32Array([
                0, 0,
                1, 0,
                1, 1
            ]);
            const geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
            return geometry;
        },


        Quadrangle: function(p0, p1, p2, p3) {
            const n1 = new THREE.Triangle(p0, p1, p2).normal();
            const n2 = new THREE.Triangle(p0, p2, p3).normal();
            const vertices = new Float32Array([
                p0.x, p0.y, p0.z,
                p1.x, p1.y, p1.z,
                p2.x, p2.y, p2.z,

                p0.x, p0.y, p0.z,
                p2.x, p2.y, p2.z,
                p3.x, p3.y, p3.z
            ]);
            const normal = new Float32Array([
                n1.x, n1.y, n1.z,
                n1.x, n1.y, n1.z,
                n1.x, n1.y, n1.z,

                n2.x, n2.y, n2.z,
                n2.x, n2.y, n2.z,
                n2.x, n2.y, n2.z
            ]);
            const uv = new Float32Array([
                0, 0,
                1, 0,
                1, 1,

                0, 0,
                1, 1,
                0, 1
            ]);

            const geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(normal, 3));
            geometry.addAttribute('uv', new THREE.BufferAttribute(uv, 2));

            return geometry;
        }


    };

})();
