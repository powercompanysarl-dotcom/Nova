import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const canvas = document.getElementById('nv-3d');
const stage = document.getElementById('nv-stage');
if (canvas && stage) {
  boot();
}

function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

function boot() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.style.display = 'none';
    return;
  }
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x05080f, 0.03);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(6, 2.6, 7);

  // ---- Lights ----
  scene.add(new THREE.AmbientLight(0x88aaff, 0.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(5, 8, 6);
  scene.add(key);
  const neon1 = new THREE.PointLight(0x38e8a0, 60, 30, 2); neon1.position.set(-6, 3, 4); scene.add(neon1);
  const neon2 = new THREE.PointLight(0x4d8dff, 60, 30, 2); neon2.position.set(6, 2, -4); scene.add(neon2);
  const neon3 = new THREE.PointLight(0xff3d8b, 40, 30, 2); neon3.position.set(0, 4, -8); scene.add(neon3);

  // ---- Floor (reflective showroom) ----
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x05070d, metalness: 1, roughness: 0.12 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  const grid = new THREE.GridHelper(120, 120, 0x38e8a0, 0x12305a);
  grid.position.y = 0.001;
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  scene.add(grid);

  // ---- Particles ----
  const pCount = 700;
  const pGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 60;
    pos[i * 3 + 1] = Math.random() * 25;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x9fd8ff, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false
  }));
  scene.add(particles);

  // ---- Car ----
  const car = buildCar();
  scene.add(car);

  // ---- Postprocessing (bloom) ----
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.5, 0.82);
  composer.addPass(bloom);

  // ---- Mouse parallax ----
  let mx = 0, my = 0;
  window.addEventListener('pointermove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  // ---- Scroll progress ----
  function getProgress() {
    const r = stage.getBoundingClientRect();
    const total = stage.offsetHeight - window.innerHeight;
    return THREE.MathUtils.clamp(-r.top / total, 0, 1);
  }

  const captions = Array.from(document.querySelectorAll('.nv-caption'));
  const camPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  let curP = 0;

  function journey(p) {
    if (p < 0.30) {
      const t = p / 0.30;
      const ang = -0.55 + t * 0.85;
      const r = 7.6 - t * 1.6;
      camPos.set(Math.sin(ang) * r, 2.7 - t * 0.7, Math.cos(ang) * r);
      camTarget.set(0, 0.85, 0);
    } else if (p < 0.62) {
      const t = ease((p - 0.30) / 0.32);
      camPos.lerpVectors(new THREE.Vector3(Math.sin(0.30) * 6, 2.0, Math.cos(0.30) * 6), new THREE.Vector3(0, 1.28, 2.7), t);
      camTarget.lerpVectors(new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(0, 1.0, 0.5), t);
    } else {
      const t = ease((p - 0.62) / 0.38);
      camPos.lerpVectors(new THREE.Vector3(0, 1.28, 2.7), new THREE.Vector3(0, 1.12, 0.05), t);
      camTarget.lerpVectors(new THREE.Vector3(0, 1.0, 0.5), new THREE.Vector3(0, 0.95, 1.4), t);
    }
  }

  function updateCaptions(p) {
    const idx = p < 0.30 ? 0 : p < 0.62 ? 1 : 2;
    captions.forEach((c, i) => { c.style.opacity = i === idx ? '1' : '0'; });
  }

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    composer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    const tp = getProgress();
    curP += (tp - curP) * 0.08;
    journey(curP);

    camera.position.lerp(camPos, 0.12);
    const tgt = camTarget.clone();
    tgt.x += mx * 0.6; tgt.y += -my * 0.4;
    camera.lookAt(tgt);

    car.rotation.y += dt * 0.05 * (1 - curP);
    particles.rotation.y += dt * 0.02;
    neon1.position.x = Math.sin(clock.elapsedTime * 0.6) * 6;
    neon2.position.z = Math.cos(clock.elapsedTime * 0.5) * 6;

    updateCaptions(curP);
    composer.render();
  }
  loop();
}

function buildCar() {
  const g = new THREE.Group();
  const blue = new THREE.MeshStandardMaterial({ color: 0x0b2c7a, metalness: 0.95, roughness: 0.22, envMapIntensity: 1.6 });
  const black = new THREE.MeshStandardMaterial({ color: 0x070a12, metalness: 0.9, roughness: 0.35 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x10243f, metalness: 0, roughness: 0.05, transmission: 0.9, transparent: true, opacity: 0.5, ior: 1.4 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xcfe3ff, metalness: 1, roughness: 0.08 });
  const glowC = new THREE.MeshStandardMaterial({ color: 0x9ffdf0, emissive: 0x38e8a0, emissiveIntensity: 4 });
  const glowR = new THREE.MeshStandardMaterial({ color: 0xff9bbf, emissive: 0xff2e6e, emissiveIntensity: 4 });

  // lower body (wide, low)
  const lower = new THREE.Mesh(rounded(4.4, 0.55, 2.0, 0.18), blue);
  lower.position.y = 0.62;
  g.add(lower);

  // hood / nose slope (front toward +z)
  const nose = new THREE.Mesh(rounded(3.0, 0.32, 1.85, 0.14), blue);
  nose.position.set(0, 0.82, 0.9);
  g.add(nose);

  // cabin
  const cabin = new THREE.Mesh(rounded(2.0, 0.5, 1.6, 0.2), black);
  cabin.position.set(0, 1.05, -0.2);
  g.add(cabin);

  // greenhouse glass
  const wind = new THREE.Mesh(rounded(1.8, 0.42, 1.5, 0.16), glass);
  wind.position.set(0, 1.12, 0.05);
  g.add(wind);

  // center spine (Bugatti two-tone line)
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 2.0), black);
  spine.position.set(0, 0.95, -0.2);
  g.add(spine);

  // horseshoe grille
  const grille = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 24), chrome);
  grille.rotation.x = Math.PI / 2;
  grille.position.set(0, 0.6, 2.32);
  grille.scale.set(0.8, 1, 1);
  g.add(grille);

  // headlights
  for (const sx of [-0.65, 0.65]) {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.1), glowC);
    hl.position.set(sx, 0.78, 2.28);
    g.add(hl);
  }
  // taillight bar
  const tail = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.08), glowR);
  tail.position.set(0, 0.8, -2.28);
  g.add(tail);

  // wheels
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, metalness: 0.2, roughness: 0.85 });
  for (const sx of [-1, 1]) {
    for (const sz of [1.4, -1.4]) {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.34, 28), tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(sx * 1.02, 0.52, sz);
      g.add(tire);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.36, 12), chrome);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(sx * 1.02, 0.52, sz);
      g.add(rim);
      const rimGlow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 24), glowC);
      rimGlow.position.set(sx * 1.04, 0.52, sz);
      rimGlow.rotation.y = Math.PI / 2;
      g.add(rimGlow);
    }
  }

  // ---- Interior (visible when camera enters) ----
  const interior = new THREE.Group();
  // dashboard
  const dash = new THREE.Mesh(rounded(1.7, 0.35, 0.5, 0.1), black);
  dash.position.set(0, 0.92, 1.55);
  interior.add(dash);
  // instrument screen
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.28), new THREE.MeshStandardMaterial({ color: 0x001a14, emissive: 0x38e8a0, emissiveIntensity: 1.6 }));
  screen.position.set(0, 0.98, 1.32);
  screen.rotation.x = -0.25;
  interior.add(screen);
  // steering wheel
  const wheel = new THREE.Group();
  const rimW = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 16, 40), new THREE.MeshStandardMaterial({ color: 0x111119, metalness: 0.7, roughness: 0.4 }));
  wheel.add(rimW);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 20), chrome);
  hub.rotation.x = Math.PI / 2;
  wheel.add(hub);
  const logo = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), glowR);
  wheel.add(logo);
  for (const a of [0, Math.PI / 2, Math.PI]) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x15151c, metalness: 0.6, roughness: 0.5 }));
    spoke.rotation.z = a;
    wheel.add(spoke);
  }
  wheel.position.set(0, 0.92, 1.0);
  wheel.rotation.x = -1.15;
  interior.add(wheel);
  // seats
  for (const sx of [-0.42, 0.42]) {
    const seat = new THREE.Mesh(rounded(0.42, 0.7, 0.5, 0.12), new THREE.MeshStandardMaterial({ color: 0x0d0d14, metalness: 0.3, roughness: 0.7 }));
    seat.position.set(sx, 0.78, 0.3);
    interior.add(seat);
  }
  g.add(interior);

  return g;
}

// rounded box helper (bevel via scaled BoxGeometry segments approximation)
function rounded(w, h, d, r) {
  const geo = new THREE.BoxGeometry(w, h, d, 4, 4, 4);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  const hw = w / 2 - r, hh = h / 2 - r, hd = d / 2 - r;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const cx = THREE.MathUtils.clamp(v.x, -hw, hw);
    const cy = THREE.MathUtils.clamp(v.y, -hh, hh);
    const cz = THREE.MathUtils.clamp(v.z, -hd, hd);
    const dx = v.x - cx, dy = v.y - cy, dz = v.z - cz;
    const len = Math.hypot(dx, dy, dz) || 1;
    v.set(cx + (dx / len) * r, cy + (dy / len) * r, cz + (dz / len) * r);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}
