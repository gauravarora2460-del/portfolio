const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

const setupHeroScene = () => {
  const canvas = document.getElementById("hero-canvas");
  const heroSection = document.querySelector(".hero");
  if (!canvas || !heroSection || typeof THREE === "undefined") {
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, 0, 17);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x7c5cff, 2.2, 180);
  pointLight.position.set(8, 4, 14);
  scene.add(pointLight);

  const rimLight = new THREE.PointLight(0x27d3ff, 1.8, 160);
  rimLight.position.set(-9, -5, 10);
  scene.add(rimLight);

  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const knotGeo = new THREE.TorusKnotGeometry(3.9, 1.1, 220, 48);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x7c5cff,
    metalness: 0.76,
    roughness: 0.15,
    emissive: 0x22123a,
    emissiveIntensity: 0.9
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  heroGroup.add(knotMesh);

  const wireGeo = new THREE.IcosahedronGeometry(6.2, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x27d3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  heroGroup.add(wireMesh);

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1800;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 90;
    starPositions[i3 + 1] = (Math.random() - 0.5) * 90;
    starPositions[i3 + 2] = (Math.random() - 0.5) * 90;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.075,
    transparent: true,
    opacity: 0.95
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  const mouse = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onPointerMove = (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    target.x = y * 0.7;
    target.y = x * 1.2;
  };

  window.addEventListener("pointermove", onPointerMove);

  const setSize = () => {
    const width = heroSection.clientWidth;
    const height = heroSection.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  setSize();
  window.addEventListener("resize", setSize);

  const clock = new THREE.Clock();
  const renderLoop = () => {
    const elapsed = clock.getElapsedTime();
    mouse.x += (target.x - mouse.x) * 0.045;
    mouse.y += (target.y - mouse.y) * 0.045;

    knotMesh.rotation.x += 0.0035;
    knotMesh.rotation.y += 0.0047;
    knotMesh.position.y = Math.sin(elapsed * 0.75) * 0.58;

    wireMesh.rotation.x -= 0.0016;
    wireMesh.rotation.y += 0.0022;

    heroGroup.rotation.x = mouse.x;
    heroGroup.rotation.y = mouse.y;
    stars.rotation.y = elapsed * 0.017;
    stars.rotation.x = elapsed * 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  };

  renderLoop();
};

const setupTiltCards = () => {
  const cards = document.querySelectorAll(".tilt-card");
  if (!cards.length || !window.matchMedia("(hover: hover)").matches) {
    return;
  }

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateY = ((x - cx) / cx) * 8;
      const rotateX = -((y - cy) / cy) * 8;

      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
};

const setupCarousel = () => {
  const cards = Array.from(document.querySelectorAll(".carousel-card"));
  const track = document.getElementById("carousel-track");
  const prev = document.getElementById("carousel-prev");
  const next = document.getElementById("carousel-next");

  if (!cards.length || !track || !prev || !next) {
    return;
  }

  let angle = 0;
  let radius = 420;
  let timer;
  const step = 360 / cards.length;

  const setRadius = () => {
    radius = window.innerWidth < 768 ? 235 : 420;
  };

  const placeCards = () => {
    cards.forEach((card, index) => {
      const theta = angle + index * step;
      const normalized = ((theta % 360) + 360) % 360;
      const opacity = normalized > 90 && normalized < 270 ? 0.35 : 1;

      card.style.opacity = String(opacity);
      card.style.transform = `translate(-50%, -50%) rotateY(${theta}deg) translateZ(${radius}px)`;
    });
  };

  const rotate = (direction) => {
    angle += direction * step;
    placeCards();
  };

  const startAutoRotate = () => {
    timer = setInterval(() => rotate(-1), 2600);
  };

  const stopAutoRotate = () => clearInterval(timer);

  prev.addEventListener("click", () => rotate(1));
  next.addEventListener("click", () => rotate(-1));
  track.addEventListener("mouseenter", stopAutoRotate);
  track.addEventListener("mouseleave", startAutoRotate);

  window.addEventListener("resize", () => {
    setRadius();
    placeCards();
  });

  setRadius();
  placeCards();
  startAutoRotate();
};

setupHeroScene();
setupTiltCards();
setupCarousel();
