import * as THREE from 'three';

const interests = [
  {
    title: 'IA générative',
    icon: '✦',
    color: 0x7b8cff,
    text: 'Comprendre les modèles, tester les usages réels et transformer l’IA en avantage opérationnel.',
    tags: ['LLM', 'cas d’usage', 'expérimentation']
  },
  {
    title: 'Vente & développement',
    icon: '↗',
    color: 0x20d6a5,
    text: 'Transformer le chaos commercial en système simple, mesurable et entraînable pour faire progresser les équipes.',
    tags: ['vente B2B', 'coaching', 'process']
  },
  {
    title: 'Agents & automatisation',
    icon: '◎',
    color: 0x25b9f5,
    text: 'Créer des agents qui travaillent vraiment : CRM, prospection, organisation, production et workflows métier.',
    tags: ['agents IA', 'OpenClaw', 'workflows']
  },
  {
    title: 'Tech & code',
    icon: '</>',
    color: 0xf39b45,
    text: 'Construire rapidement des applications utiles, connecter les API et faire passer une idée du prototype à la production.',
    tags: ['GitHub', 'Vercel', 'API']
  },
  {
    title: 'Créer & transmettre',
    icon: '◈',
    color: 0xf264a8,
    text: 'Partager ce qui fonctionne, former par la pratique et créer du contenu à partir d’expériences concrètes.',
    tags: ['formation', 'contenu', 'build in public']
  },
  {
    title: 'Voile & nautisme',
    icon: '≈',
    color: 0x64d8ff,
    text: 'La mer comme terrain de progression : navigation, technique, météo, bateaux et plaisir d’apprendre par la pratique.',
    tags: ['voile', 'navigation', 'bateaux']
  }
];

const els = {
  canvas: document.querySelector('#scene'),
  sceneCard: document.querySelector('#sceneCard'),
  interestPill: document.querySelector('#interestPill'),
  interestIcon: document.querySelector('#interestIcon'),
  interestTitle: document.querySelector('#interestTitle'),
  interestNumber: document.querySelector('#interestNumber'),
  interestText: document.querySelector('#interestText'),
  tagList: document.querySelector('#tagList'),
  runtimeBadge: document.querySelector('#runtimeBadge'),
  resetButton: document.querySelector('#resetButton'),
  exploreButton: document.querySelector('#exploreButton'),
  toast: document.querySelector('#toast')
};

const tg = window.Telegram?.WebApp;
const inTelegram = Boolean(tg?.initData);
if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor('#050816');
    tg.setBackgroundColor('#050816');
  } catch (_) {}
}
els.runtimeBadge.textContent = inTelegram ? `Telegram · ${tg.platform || 'mobile'}` : 'iPhone · Web';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050816, 0.082);

const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
camera.position.set(0, 0.25, 8.5);

const renderer = new THREE.WebGLRenderer({
  canvas: els.canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  precision: 'mediump'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x000000, 0);

scene.add(new THREE.AmbientLight(0xc8d7ff, 1.2));
const key = new THREE.DirectionalLight(0xffffff, 3.4);
key.position.set(4, 6, 7);
scene.add(key);
const blueRim = new THREE.PointLight(0x536dff, 28, 18, 2);
blueRim.position.set(-3, 1.5, 3.5);
scene.add(blueRim);

const universe = new THREE.Group();
universe.rotation.x = -0.08;
universe.rotation.y = -0.35;
scene.add(universe);

function roundedPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function glowTexture(color = '#7b8cff') {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,.95)');
  g.addColorStop(.12, color);
  g.addColorStop(.42, color.replace(')', ', .22)').replace('rgb', 'rgba'));
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function hexToRgb(hex) {
  const c = new THREE.Color(hex);
  return `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`;
}

function createGlow(hex, size, opacity = .55) {
  const material = new THREE.SpriteMaterial({
    map: glowTexture(hexToRgb(hex)),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  return sprite;
}

function makeLabel(title, index, color) {
  const c = document.createElement('canvas');
  c.width = 640;
  c.height = 170;
  const ctx = c.getContext('2d');
  const colorCss = `#${new THREE.Color(color).getHexString()}`;

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = 'rgba(4,8,20,.82)';
  roundedPath(ctx, 8, 8, 624, 154, 42);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.11)';
  ctx.lineWidth = 3;
  roundedPath(ctx, 8, 8, 624, 154, 42);
  ctx.stroke();

  ctx.fillStyle = colorCss;
  ctx.beginPath();
  ctx.arc(50, 53, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = colorCss;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 40px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText(title, 78, 66, 520);
  ctx.fillStyle = '#8795ac';
  ctx.font = '700 25px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText(`UNIVERS ${String(index + 1).padStart(2, '0')}`, 78, 112);

  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(2.35, .625, 1);
  return sprite;
}

function makeCenterLabel() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 128;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText('LAURENT', 256, 56);
  ctx.fillStyle = '#8e9bb2';
  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText('CURIOSITÉ → ACTION', 256, 92);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(2.35, .59, 1);
  sprite.position.set(0, -1.05, .05);
  return sprite;
}

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(.8, 3),
  new THREE.MeshStandardMaterial({
    color: 0x4356d8,
    emissive: 0x202d8b,
    emissiveIntensity: 1.35,
    roughness: .27,
    metalness: .38
  })
);
universe.add(core);

const coreWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(.96, 1),
  new THREE.MeshBasicMaterial({ color: 0xa8b0ff, wireframe: true, transparent: true, opacity: .18 })
);
universe.add(coreWire);
universe.add(createGlow(0x6574ff, 3.0, .28));
universe.add(makeCenterLabel());

const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x8190b7, transparent: true, opacity: .11 });
[2.15, 2.55, 2.95].forEach((r, ringIndex) => {
  const points = [];
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r * .52));
  }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), orbitMaterial.clone());
  line.rotation.x = (ringIndex - 1) * .19;
  line.rotation.z = (ringIndex - 1) * .11;
  universe.add(line);
});

const nodes = [];
const pickMeshes = [];
const radii = [2.2, 2.65, 2.95, 2.32, 2.72, 2.9];
const heights = [.72, -.55, .05, .88, -.84, .34];

interests.forEach((interest, i) => {
  const angle = i * (Math.PI * 2 / interests.length) + .25;
  const group = new THREE.Group();
  group.position.set(
    Math.cos(angle) * radii[i],
    heights[i],
    Math.sin(angle) * radii[i] * .48
  );
  group.userData.baseY = group.position.y;
  group.userData.index = i;
  group.userData.phase = i * 1.4;

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(.34, 26, 20),
    new THREE.MeshStandardMaterial({
      color: interest.color,
      emissive: interest.color,
      emissiveIntensity: .74,
      roughness: .24,
      metalness: .25
    })
  );
  orb.userData.index = i;
  group.add(orb);
  pickMeshes.push(orb);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(.5, .035, 10, 48),
    new THREE.MeshBasicMaterial({ color: interest.color, transparent: true, opacity: .55 })
  );
  ring.rotation.x = Math.PI * (.28 + (i % 3) * .09);
  ring.rotation.y = i * .22;
  ring.userData.index = i;
  group.add(ring);
  pickMeshes.push(ring);

  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(.62, 10, 8),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
  );
  hitArea.userData.index = i;
  group.add(hitArea);
  pickMeshes.push(hitArea);

  const glow = createGlow(interest.color, 1.75, .23);
  glow.userData.index = i;
  group.add(glow);

  const label = makeLabel(interest.title, i, interest.color);
  label.position.set(0, -.78, 0);
  group.add(label);

  const stem = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-group.position.x, -group.position.y, -group.position.z)
    ]),
    new THREE.LineBasicMaterial({ color: interest.color, transparent: true, opacity: .14 })
  );
  group.add(stem);

  nodes.push({ group, orb, ring, glow, label });
  universe.add(group);
});

const particleCount = 115;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 3.5 + Math.random() * 3.8;
  const a = Math.random() * Math.PI * 2;
  positions[i * 3] = Math.cos(a) * r;
  positions[i * 3 + 1] = (Math.random() - .5) * 6.3;
  positions[i * 3 + 2] = Math.sin(a) * r * .72;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: 0xb8c4ff, size: .035, transparent: true, opacity: .55, sizeAttenuation: true })
);
scene.add(particles);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedIndex = 0;
let dragging = false;
let idle = true;
let down = { x: 0, y: 0 };
let last = { x: 0, y: 0 };
let targetRotationY = -.35;
let targetRotationX = -.08;
let toastTimer;

function setTags(tags) {
  els.tagList.replaceChildren(...tags.map(tag => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = tag;
    return span;
  }));
}

function selectInterest(index, haptic = true) {
  selectedIndex = index;
  const interest = interests[index];
  els.interestPill.textContent = interest.title;
  els.interestIcon.textContent = interest.icon;
  els.interestTitle.textContent = interest.title;
  els.interestNumber.textContent = String(index + 1).padStart(2, '0');
  els.interestText.textContent = interest.text;
  setTags(interest.tags);

  nodes.forEach((node, i) => {
    node.group.userData.targetScale = i === index ? 1.28 : 1;
    node.label.material.opacity = i === index ? 1 : .7;
    node.ring.material.opacity = i === index ? .95 : .42;
    node.glow.material.opacity = i === index ? .5 : .2;
  });

  if (haptic && inTelegram) {
    try { tg.HapticFeedback?.selectionChanged(); } catch (_) {}
  }
}

function resize() {
  const rect = els.sceneCard.getBoundingClientRect();
  const w = Math.max(1, rect.width);
  const h = Math.max(1, rect.height);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function pick(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(pickMeshes, false);
  if (hits.length) selectInterest(hits[0].object.userData.index);
}

els.canvas.addEventListener('pointerdown', event => {
  dragging = true;
  idle = false;
  down = { x: event.clientX, y: event.clientY };
  last = { ...down };
  els.canvas.setPointerCapture?.(event.pointerId);
});

els.canvas.addEventListener('pointermove', event => {
  if (!dragging) return;
  const dx = event.clientX - last.x;
  const dy = event.clientY - last.y;
  targetRotationY += dx * .009;
  targetRotationX = THREE.MathUtils.clamp(targetRotationX + dy * .004, -.34, .24);
  last = { x: event.clientX, y: event.clientY };
});

function finishPointer(event) {
  if (!dragging) return;
  const distance = Math.hypot(event.clientX - down.x, event.clientY - down.y);
  dragging = false;
  window.setTimeout(() => { idle = true; }, 1400);
  if (distance < 10) pick(event.clientX, event.clientY);
}
els.canvas.addEventListener('pointerup', finishPointer);
els.canvas.addEventListener('pointercancel', () => { dragging = false; idle = true; });

els.resetButton.addEventListener('click', () => {
  targetRotationY = -.35;
  targetRotationX = -.08;
  selectInterest(0);
});

els.exploreButton.addEventListener('click', () => {
  const interest = interests[selectedIndex];
  if (inTelegram) {
    try {
      tg.HapticFeedback?.impactOccurred('medium');
      tg.sendData(JSON.stringify({ type: 'interest', interest: interest.title, tags: interest.tags }));
      return;
    } catch (_) {}
  }
  showToast(`${interest.title} · ${interest.tags.join(' · ')}`);
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('visible');
  toastTimer = window.setTimeout(() => els.toast.classList.remove('visible'), 2600);
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(els.sceneCard);
window.visualViewport?.addEventListener('resize', resize);
window.addEventListener('orientationchange', () => window.setTimeout(resize, 180));

let lastTime = performance.now();
function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, .033);
  lastTime = now;

  if (idle && !dragging) targetRotationY += dt * .075;
  universe.rotation.y = THREE.MathUtils.lerp(universe.rotation.y, targetRotationY, .065);
  universe.rotation.x = THREE.MathUtils.lerp(universe.rotation.x, targetRotationX, .065);

  core.rotation.x += dt * .19;
  core.rotation.y += dt * .27;
  coreWire.rotation.x -= dt * .12;
  coreWire.rotation.y += dt * .18;
  particles.rotation.y -= dt * .012;

  nodes.forEach((node, i) => {
    const target = node.group.userData.targetScale ?? (i === selectedIndex ? 1.28 : 1);
    const s = THREE.MathUtils.lerp(node.group.scale.x, target, .085);
    node.group.scale.setScalar(s);
    node.group.position.y = node.group.userData.baseY + Math.sin(now * .0012 + node.group.userData.phase) * .055;
    node.orb.rotation.y += dt * (.24 + i * .025);
    node.ring.rotation.z += dt * (.12 + (i % 2) * .05);
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
document.addEventListener('visibilitychange', () => {
  renderer.setAnimationLoop(document.hidden ? null : animate);
});

selectInterest(0, false);
resize();
