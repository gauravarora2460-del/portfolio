// 1. Initialize Josh.js for Scroll Animations
const josh = new Josh({
    initClass: "josh-js",
    animClass: "animate__animated",
    offset: 0.15,
    animateInMobile: true,
    onDOMChange: false,
});

// 2. High-End "Liquid Crystal" Three.js Scene
const canvas = document.getElementById('webgl-canvas');

if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#fcfcfc');
    // Subtle fog to blend the crystal into the background at the edges
    scene.fog = new THREE.FogExp2('#fcfcfc', 0.015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ultra-Premium Lighting Setup for Crystal Refraction
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe0e0ff, 2);
    dirLight2.position.set(-10, -10, 10);
    scene.add(dirLight2);
    
    // Add subtle colored point lights for "iridescent" reflections
    const pinkLight = new THREE.PointLight(0xff00ff, 5, 50);
    pinkLight.position.set(5, 5, 5);
    scene.add(pinkLight);
    
    const cyanLight = new THREE.PointLight(0x00ffff, 5, 50);
    cyanLight.position.set(-5, -5, 5);
    scene.add(cyanLight);

    // High-Resolution Icosahedron Geometry
    const geometry = new THREE.IcosahedronGeometry(7, 32);

    // Advanced MeshPhysicalMaterial for the "Rare Liquid Crystal" look
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 1.0, // Glass-like transparency
        thickness: 2.0, // Refraction thickness
        ior: 1.5, // Index of refraction
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        iridescence: 0.3,
        iridescenceIOR: 1.3,
        side: THREE.DoubleSide
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Prepare for vertex deformation
    const positionAttribute = geometry.attributes.position;
    const originalPositions = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        originalPositions.push(
            new THREE.Vector3().fromBufferAttribute(positionAttribute, i)
        );
    }

    const clock = new THREE.Clock();
    
    // Smooth Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
    
    // Scroll Tracking for Parallax
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime() * 0.5;
        
        // Ease mouse targets
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        // Deform vertices to create "Liquid" effect
        for (let i = 0; i < positionAttribute.count; i++) {
            const vertex = originalPositions[i];
            
            // Generate subtle noise based on vertex position and time
            const waveX = Math.sin(vertex.x * 0.5 + time) * 0.3;
            const waveY = Math.cos(vertex.y * 0.5 + time) * 0.3;
            const waveZ = Math.sin(vertex.z * 0.5 + time) * 0.3;
            
            positionAttribute.setXYZ(
                i,
                vertex.x + waveX,
                vertex.y + waveY,
                vertex.z + waveZ
            );
        }
        
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        // Rotate sphere slowly + react to mouse
        sphere.rotation.y = time * 0.2 + (targetX * 0.5);
        sphere.rotation.x = time * 0.1 - (targetY * 0.5);
        
        // Scroll Parallax (move sphere up slightly as you scroll down)
        sphere.position.y = (scrollY * 0.005);
        
        // Camera parallax
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    
    animate();
}
