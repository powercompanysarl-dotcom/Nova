/* Novaris Mobility — scène 3D cinématique (Three.js core, script classique).
   Aucun module ES : fonctionne aussi en ouverture directe (file://) tant que
   three.min.js a pu se charger. Repli gracieux si la 3D est indisponible. */
(function () {
  var canvas = document.getElementById('nv-3d');
  var stage = document.getElementById('nv-stage');
  if (!canvas || !stage) return;

  function fallback() {
    stage.classList.add('no3d');
    if (canvas) canvas.style.display = 'none';
  }

  // Three.js indisponible (hors-ligne / bloqué) → repli propre.
  if (typeof THREE === 'undefined') { fallback(); return; }

  try { boot(); } catch (e) { console.error('[Novaris 3D]', e); fallback(); }

  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function boot() {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { fallback(); return; }

    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (THREE.ACESFilmicToneMapping) renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    var scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080f, 0.03);

    // Environnement (reflets) via PMREM d'une mini-scène procédurale.
    try {
      var pmrem = new THREE.PMREMGenerator(renderer);
      var envScene = new THREE.Scene();
      var top = new THREE.Mesh(
        new THREE.SphereGeometry(50, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x335580, side: THREE.BackSide })
      );
      envScene.add(top);
      var lightPanel = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshBasicMaterial({ color: 0xbfe6ff })
      );
      lightPanel.position.set(0, 30, 0);
      lightPanel.rotation.x = Math.PI / 2;
      envScene.add(lightPanel);
      scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    } catch (e) { /* reflets optionnels */ }

    var camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(6, 2.6, 7);

    // Lumières
    scene.add(new THREE.AmbientLight(0x88aaff, 0.4));
    var key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(5, 8, 6); scene.add(key);
    var neon1 = new THREE.PointLight(0x38e8a0, 60, 30, 2); neon1.position.set(-6, 3, 4); scene.add(neon1);
    var neon2 = new THREE.PointLight(0x4d8dff, 60, 30, 2); neon2.position.set(6, 2, -4); scene.add(neon2);
    var neon3 = new THREE.PointLight(0xff3d8b, 45, 30, 2); neon3.position.set(0, 4, -8); scene.add(neon3);

    // Sol réfléchissant + grille néon
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: 0x05070d, metalness: 1, roughness: 0.14 })
    );
    floor.rotation.x = -Math.PI / 2; scene.add(floor);
    var grid = new THREE.GridHelper(120, 120, 0x38e8a0, 0x12305a);
    grid.position.y = 0.001; grid.material.transparent = true; grid.material.opacity = 0.25; scene.add(grid);

    // Particules
    var pCount = 650, pGeo = new THREE.BufferGeometry(), pos = new Float32Array(pCount * 3);
    for (var i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    var particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false }));
    scene.add(particles);

    // Voiture
    var car = buildCar();
    scene.add(car);

    // Halos additifs (effet "glow" sans post-traitement)
    var glowTex = makeGlowTexture();
    function halo(color, size, x, y, z) {
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      s.scale.set(size, size, 1); s.position.set(x, y, z); car.add(s); return s;
    }
    halo(0x9ffdf0, 1.2, -0.65, 0.78, 2.3);
    halo(0x9ffdf0, 1.2, 0.65, 0.78, 2.3);
    halo(0xff2e6e, 2.0, 0, 0.8, -2.3);

    // Parallaxe souris
    var mx = 0, my = 0;
    window.addEventListener('pointermove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5);
      my = (e.clientY / window.innerHeight - 0.5);
    });

    function getProgress() {
      var r = stage.getBoundingClientRect();
      var total = stage.offsetHeight - window.innerHeight;
      var p = -r.top / total;
      return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    var captions = Array.prototype.slice.call(document.querySelectorAll('.nv-caption'));
    var camPos = new THREE.Vector3(), camTarget = new THREE.Vector3(), curP = 0;

    var A1 = new THREE.Vector3(Math.sin(0.30) * 6, 2.0, Math.cos(0.30) * 6);
    var A2 = new THREE.Vector3(0, 1.28, 2.7);
    var A3 = new THREE.Vector3(0, 1.12, 0.05);
    var T0 = new THREE.Vector3(0, 0.85, 0);
    var T1 = new THREE.Vector3(0, 1.0, 0.5);
    var T2 = new THREE.Vector3(0, 0.95, 1.4);

    function journey(p) {
      if (p < 0.30) {
        var t = p / 0.30, ang = -0.55 + t * 0.85, r = 7.6 - t * 1.6;
        camPos.set(Math.sin(ang) * r, 2.7 - t * 0.7, Math.cos(ang) * r);
        camTarget.copy(T0);
      } else if (p < 0.62) {
        var t2 = ease((p - 0.30) / 0.32);
        camPos.lerpVectors(A1, A2, t2); camTarget.lerpVectors(T0, T1, t2);
      } else {
        var t3 = ease((p - 0.62) / 0.38);
        camPos.lerpVectors(A2, A3, t3); camTarget.lerpVectors(T1, T2, t3);
      }
    }

    function updateCaptions(p) {
      var idx = p < 0.30 ? 0 : p < 0.62 ? 1 : 2;
      for (var i = 0; i < captions.length; i++) captions[i].style.opacity = (i === idx ? '1' : '0');
    }

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    var clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      var dt = clock.getDelta();
      curP += (getProgress() - curP) * 0.08;
      journey(curP);
      camera.position.lerp(camPos, 0.12);
      var tgt = camTarget.clone(); tgt.x += mx * 0.6; tgt.y += -my * 0.4;
      camera.lookAt(tgt);
      car.rotation.y += dt * 0.05 * (1 - curP);
      particles.rotation.y += dt * 0.02;
      neon1.position.x = Math.sin(clock.elapsedTime * 0.6) * 6;
      neon2.position.z = Math.cos(clock.elapsedTime * 0.5) * 6;
      updateCaptions(curP);
      renderer.render(scene, camera);
    })();
  }

  function makeGlowTexture() {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var ctx = c.getContext('2d');
    var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    var tex = new THREE.CanvasTexture(c);
    return tex;
  }

  function buildCar() {
    var g = new THREE.Group();
    var blue = new THREE.MeshStandardMaterial({ color: 0x0b2c7a, metalness: 0.95, roughness: 0.22, envMapIntensity: 1.6 });
    var black = new THREE.MeshStandardMaterial({ color: 0x070a12, metalness: 0.9, roughness: 0.35 });
    var glass = new THREE.MeshPhysicalMaterial({ color: 0x10243f, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.5 });
    var chrome = new THREE.MeshStandardMaterial({ color: 0xcfe3ff, metalness: 1, roughness: 0.08 });
    var glowC = new THREE.MeshStandardMaterial({ color: 0x9ffdf0, emissive: 0x38e8a0, emissiveIntensity: 4 });
    var glowR = new THREE.MeshStandardMaterial({ color: 0xff9bbf, emissive: 0xff2e6e, emissiveIntensity: 4 });

    var lower = new THREE.Mesh(rounded(4.4, 0.55, 2.0, 0.18), blue); lower.position.y = 0.62; g.add(lower);
    var nose = new THREE.Mesh(rounded(3.0, 0.32, 1.85, 0.14), blue); nose.position.set(0, 0.82, 0.9); g.add(nose);
    var cabin = new THREE.Mesh(rounded(2.0, 0.5, 1.6, 0.2), black); cabin.position.set(0, 1.05, -0.2); g.add(cabin);
    var wind = new THREE.Mesh(rounded(1.8, 0.42, 1.5, 0.16), glass); wind.position.set(0, 1.12, 0.05); g.add(wind);
    var spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 2.0), black); spine.position.set(0, 0.95, -0.2); g.add(spine);

    var grille = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.1, 24), chrome);
    grille.rotation.x = Math.PI / 2; grille.position.set(0, 0.6, 2.32); grille.scale.set(0.8, 1, 1); g.add(grille);

    [-0.65, 0.65].forEach(function (sx) {
      var hl = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.1), glowC); hl.position.set(sx, 0.78, 2.28); g.add(hl);
    });
    var tail = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.1, 0.08), glowR); tail.position.set(0, 0.8, -2.28); g.add(tail);

    var tireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, metalness: 0.2, roughness: 0.85 });
    [-1, 1].forEach(function (sx) {
      [1.4, -1.4].forEach(function (sz) {
        var tire = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.34, 28), tireMat);
        tire.rotation.z = Math.PI / 2; tire.position.set(sx * 1.02, 0.52, sz); g.add(tire);
        var rim = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.36, 12), chrome);
        rim.rotation.z = Math.PI / 2; rim.position.set(sx * 1.02, 0.52, sz); g.add(rim);
        var rimGlow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 24), glowC);
        rimGlow.position.set(sx * 1.04, 0.52, sz); rimGlow.rotation.y = Math.PI / 2; g.add(rimGlow);
      });
    });

    // Habitacle
    var dash = new THREE.Mesh(rounded(1.7, 0.35, 0.5, 0.1), black); dash.position.set(0, 0.92, 1.55); g.add(dash);
    var screen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.28), new THREE.MeshStandardMaterial({ color: 0x001a14, emissive: 0x38e8a0, emissiveIntensity: 1.8 }));
    screen.position.set(0, 0.98, 1.32); screen.rotation.x = -0.25; g.add(screen);

    var wheel = new THREE.Group();
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.04, 16, 40), new THREE.MeshStandardMaterial({ color: 0x111119, metalness: 0.7, roughness: 0.4 })));
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 20), chrome); hub.rotation.x = Math.PI / 2; wheel.add(hub);
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 24), glowR));
    [0, Math.PI / 2, Math.PI].forEach(function (a) {
      var sp = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0x15151c, metalness: 0.6, roughness: 0.5 }));
      sp.rotation.z = a; wheel.add(sp);
    });
    wheel.position.set(0, 0.92, 1.0); wheel.rotation.x = -1.15; g.add(wheel);

    [-0.42, 0.42].forEach(function (sx) {
      var seat = new THREE.Mesh(rounded(0.42, 0.7, 0.5, 0.12), new THREE.MeshStandardMaterial({ color: 0x0d0d14, metalness: 0.3, roughness: 0.7 }));
      seat.position.set(sx, 0.78, 0.3); g.add(seat);
    });

    return g;
  }

  function rounded(w, h, d, r) {
    var geo = new THREE.BoxGeometry(w, h, d, 4, 4, 4);
    var p = geo.attributes.position, v = new THREE.Vector3();
    var hw = w / 2 - r, hh = h / 2 - r, hd = d / 2 - r;
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var cx = Math.max(-hw, Math.min(hw, v.x));
      var cy = Math.max(-hh, Math.min(hh, v.y));
      var cz = Math.max(-hd, Math.min(hd, v.z));
      var dx = v.x - cx, dy = v.y - cy, dz = v.z - cz, len = Math.hypot(dx, dy, dz) || 1;
      p.setXYZ(i, cx + (dx / len) * r, cy + (dy / len) * r, cz + (dz / len) * r);
    }
    geo.computeVertexNormals();
    return geo;
  }
})();
