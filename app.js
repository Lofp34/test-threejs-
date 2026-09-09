import * as THREE from 'three';

const stages = [
  { name: 'Prospects', count: 48, value: '312 k€', conversion: '—', action: 12, progress: 25, color: 0x2aabee, tip: '12 prospects sont sans prochaine action planifiée.' },
  { name: 'RDV', count: 21, value: '184 k€', conversion: '44 %', action: 5, progress: 50, color: 0x56c2ff, tip: '5 rendez-vous nécessitent une préparation ou une relance.' },
  { name: 'Offres', count: 9, value: '97 k€', conversion: '43 %', action: 3, progress: 75, color: 0xa17cff, tip: '3 offres arrivent à échéance dans les prochains jours.' },
  { name: 'Gagnés', count: 4, value: '41 k€', conversion: '44 %', action: 1, progress: 100, color: 0x54d68a, tip: '1 nouveau client attend son passage en onboarding.' }
];

const els = {
  canvas: document.querySelector('#scene'),
  sceneCard: document.querySelector('#sceneCard'),
  stagePill: document.querySelector('#stagePill'),
  stageTitle: document.querySelector('#stageTitle'),
  stageCount: document.querySelector('#stageCount'),
  stageValue: document.querySelector('#stageValue'),
  stageConversion: document.querySelector('#stageConversion'),
  stageAction: document.querySelector('#stageAction'),
  stageTip: document.querySelector('#stageTip'),
  progressBar: document.querySelector('#progressBar'),
  runtimeBadge: document.querySelector('#runtimeBadge'),
  resetButton: document.querySelector('#resetButton'),
  telegramButton: document.querySelector('#telegramButton'),
  toast: document.querySelector('#toast')
};

const tg = window.Telegram?.WebApp;
const inTelegram = Boolean(tg?.initData);

if (tg) {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor('#07111f');
    tg.setBackgroundColor('#07111f');
    if (tg.isVersionAtLeast?.('8.0')) tg.lockOrientation?.();
  } catch (_) {}
}

els.runtimeBadge.textContent = inTelegram ? `Telegram · ${tg.platform || 'mobile'}` : 'Safari · démo';
els.telegramButton.textContent = inTelegram ? 'Envoyer au bot' : 'Simuler Telegram';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07111f, 0.12);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(0, 0.15, 8.2);

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

const root = new THREE.Group();
scene.add(root);

scene.add(new THREE.AmbientLight(0xb9ddff, 1.4));
const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
keyLight.position.set(4, 5, 7);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x2aabee, 22, 18, 2);
rimLight.position.set(-4, -1, 3);
scene.add(rimLight);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.72, 2),
  new THREE.MeshPhysicalMaterial({
    color: 0x0e84bd,
    roughness: 0.3,
    metalness: 0.35,
    clearcoat: 0.75,
    clearcoatRoughness: 0.18,
    emissive: 0x083c59,
    emissiveIntensity: 0.72
  })
);
root.add(core);

const coreWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.83, 1),
  new THREE.MeshBasicMaterial({ color: 0x72d4ff, wireframe: true, transparent: true, opacity: 0.23 })
);
root.add(coreWire);

function makeLabel(text, count, color) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(5,13,24,.80)';
  roundRect(ctx, 8, 8, 496, 144, 38);
  ctx.fill();
  ctx.strokeStyle = `#${color.getHexString()}`;
  ctx.lineWidth = 4;
  roundRect(ctx, 8, 8, 496, 144, 38);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 43px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText(text, 34, 67);
  ctx.fillStyle = '#9eb0c7';
  ctx.font = '600 31px -apple-system, BlinkMacSystemFont, Arial';
  ctx.fillText(`${count} éléments`, 34, 113);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2.05, 0.64, 1);
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

const stageMeshes = [];
const stageGroups = [];
const radius = 2.25;

stages.forEach((stage, i) => {
  const angle = i * Math.PI * 0.5 + 0.55;
  const group = new THREE.Group();
  group.position.set(Math.cos(angle) * radius, (i - 1.5) * 0.72, Math.sin(angle) * radius * 0.48);
  group.userData.baseY = group.position.y;
  group.userData.stageIndex = i;

  const color = new THREE.Color(stage.color);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.52, 0.10, 14, 44),
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.32, roughness: 0.28, metalness: 0.2 })
  );
  ring.rotation.x = Math.PI * 0.37;
  ring.userData.stageIndex = i;
  group.add(ring);
  stageMeshes.push(ring);

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.29, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 1.5, roughness: 0.22 })
  );
  orb.userData.stageIndex = i;
  group.add(orb);
  stageMeshes.push(orb);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    root.worldToLocal(core.getWorldPosition(new THREE.Vector3())).sub(group.position)
  ]);
  const line = new THREE.Line(
    lineGeometry,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.24 })
  );
  group.add(line);

  const label = makeLabel(stage.name, stage.count, color);
  label.position.set(0, -0.82, 0);
  label.userData.stageIndex = i;
  group.add(label);

  stageGroups.push(group);
  root.add(group);
});

const particleCount = 72;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 3.2 + Math.random() * 2.7;
  const a = Math.random() * Math.PI * 2;
  positions[i * 3] = Math.cos(a) * r;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
  positions[i * 3 + 2] = Math.sin(a) * r * 0.58;
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: 0x87d7ff, size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true })
);
scene.add(particles);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let selectedIndex = 0;
let dragging = false;
let pointerDown = { x: 0, y: 0 };
let lastPointer = { x: 0, y: 0 };
let targetRotationY = -0.35;
let targetRotationX = -0.08;
let idle = true;
let toastTimer;

function selectStage(index, haptic = true) {
  selectedIndex = index;
  const stage = stages[index];
  els.stagePill.textContent = `${stage.name} · ${stage.count}`;
  els.stageTitle.textContent = stage.name;
  els.stageCount.textContent = stage.count;
  els.stageValue.textContent = stage.value;
  els.stageConversion.textContent = stage.conversion;
  els.stageAction.textContent = stage.action;
  els.stageTip.textContent = stage.tip;
  els.progressBar.style.width = `${stage.progress}%`;
  els.progressBar.style.background = `linear-gradient(90deg, #${new THREE.Color(stage.color).getHexString()}, #bdeeff)`;

  stageGroups.forEach((group, i) => {
    group.userData.targetScale = i === index ? 1.18 : 1;
  });

  if (haptic && inTelegram) {
    try { tg.HapticFeedback?.selectionChanged(); } catch (_) {}
  }
}

function resize() {
  const rect = els.sceneCard.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function pick(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(stageMeshes, false);
  if (hits.length) selectStage(hits[0].object.userData.stageIndex);
}

els.canvas.addEventListener('pointerdown', (event) => {
  dragging = true;
  idle = false;
  pointerDown = { x: event.clientX, y: event.clientY };
  lastPointer = { ...pointerDown };
  els.canvas.setPointerCapture?.(event.pointerId);
});

els.canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const dx = event.clientX - lastPointer.x;
  const dy = event.clientY - lastPointer.y;
  targetRotationY += dx * 0.009;
  targetRotationX = THREE.MathUtils.clamp(targetRotationX + dy * 0.0045, -0.34, 0.24);
  lastPointer = { x: event.clientX, y: event.clientY };
});

function finishPointer(event) {
  if (!dragging) return;
  const distance = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
  dragging = false;
  window.setTimeout(() => { idle = true; }, 1200);
  if (distance < 9) pick(event.clientX, event.clientY);
}
els.canvas.addEventListener('pointerup', finishPointer);
els.canvas.addEventListener('pointercancel', () => { dragging = false; idle = true; });

els.resetButton.addEventListener('click', () => {
  targetRotationY = -0.35;
  targetRotationX = -0.08;
  selectStage(0);
});

els.telegramButton.addEventListener('click', () => {
  const stage = stages[selectedIndex];
  const payload = { type: 'pipeline_stage', stage: stage.name, count: stage.count, value: stage.value };

  if (inTelegram) {
    try {
      tg.HapticFeedback?.impactOccurred('medium');
      tg.sendData(JSON.stringify(payload));
      return;
    } catch (_) {
      showToast('Le payload Telegram est prêt, mais ce mode de lancement ne permet pas sendData.');
    }
  } else {
    showToast(`Simulation → ${JSON.stringify(payload)}`);
  }
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
window.addEventListener('orientationchange', () => window.setTimeout(resize, 200));

let lastTime = performance.now();
function animate(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.033);
  lastTime = now;

  if (idle && !dragging) targetRotationY += dt * 0.10;
  root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, targetRotationY, 0.075);
  root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, targetRotationX, 0.075);

  core.rotation.x += dt * 0.20;
  core.rotation.y += dt * 0.32;
  coreWire.rotation.x -= dt * 0.15;
  coreWire.rotation.y += dt * 0.22;
  particles.rotation.y -= dt * 0.018;

  stageGroups.forEach((group, i) => {
    const targetScale = group.userData.targetScale ?? (i === selectedIndex ? 1.18 : 1);
    const s = THREE.MathUtils.lerp(group.scale.x, targetScale, 0.09);
    group.scale.setScalar(s);
    group.position.y = group.userData.baseY + Math.sin(now * 0.0014 + i * 1.7) * 0.06;
  });

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
document.addEventListener('visibilitychange', () => {
  renderer.setAnimationLoop(document.hidden ? null : animate);
});

selectStage(0, false);
resize();
