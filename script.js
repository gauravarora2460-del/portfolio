const cursor = document.getElementById("cursor");
const progress = document.getElementById("progress");

window.addEventListener("mousemove", (event) => {
  cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progressWidth = (scrollTop / height) * 100;
  progress.style.width = `${progressWidth}%`;
});

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".section").forEach((section) => {
  gsap.from(section, {
    opacity: 0,
    y: 80,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    },
  });
});

gsap.from(".hero-content", {
  opacity: 0,
  y: 60,
  duration: 1,
  ease: "power3.out",
});

gsap.from(".hero-card", {
  opacity: 0,
  y: 40,
  duration: 1,
  delay: 0.2,
  ease: "power3.out",
});

const canvas = document.getElementById("hero-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 10;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x7c5cff, 2, 50);
pointLight.position.set(5, 6, 5);
scene.add(pointLight);

const pointLightTwo = new THREE.PointLight(0x2be7ff, 1.6, 50);
pointLightTwo.position.set(-6, -4, 6);
scene.add(pointLightTwo);

const geometry = new THREE.IcosahedronGeometry(2.8, 2);
const material = new THREE.MeshStandardMaterial({
  color: 0x7c5cff,
  emissive: 0x2be7ff,
  roughness: 0.15,
  metalness: 0.7,
  transparent: true,
  opacity: 0.9,
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

const ringGeometry = new THREE.TorusGeometry(3.8, 0.18, 32, 200);
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0x2be7ff,
  roughness: 0.2,
  metalness: 0.8,
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2.4;
scene.add(ring);

const starGeometry = new THREE.BufferGeometry();
const starCount = 600;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 40;
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.04,
  transparent: true,
  opacity: 0.65,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  orb.rotation.x = elapsed * 0.2;
  orb.rotation.y = elapsed * 0.4;
  ring.rotation.z = elapsed * 0.25;
  stars.rotation.y = elapsed * 0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
