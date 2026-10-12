/** Original portfolio character. Reproducible mesh/skeleton authoring; ships as GLB. */
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mkdir, writeFile } from "node:fs/promises";

// GLTFExporter's binary-only path uses FileReader; Node's Blob supplies the data.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};

const scene = new THREE.Scene(),
  model = new THREE.Group();
model.name = "Faiz_BlueHour";
scene.add(model);
const materials = Object.fromEntries(
  Object.entries({
    jacket: ["#142954", 0.72],
    trousers: ["#202e3b", 0.82],
    shirt: ["#e8e4d8", 0.84],
    skin: ["#dbb391", 0.72],
    hair: ["#122235", 0.7],
    shoes: ["#172127", 0.36],
    sole: ["#4a5152", 0.85],
    gold: ["#b5a16a", 0.36],
    headset: ["#2dc9cc", 0.28],
    eye: ["#293a46", 0.45],
    highlight: ["#f6f0df", 0.6],
    tie: ["#244456", 0.72],
  }).map(([name, [color, roughness]]) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: ["gold", "headset"].includes(name) ? 0.5 : 0,
    });
    material.name = name;
    return [name, material];
  }),
);

const bones = [],
  named = {};
function bone(name, position, parent) {
  const b = new THREE.Bone();
  b.name = name;
  b.position.set(...position);
  (parent || model).add(b);
  named[name] = b;
  bones.push(b);
  return b;
}
const hips = bone("Hips", [0, 0.91, 0]);
const spine = bone("Spine", [0, 0.27, 0], hips);
const chest = bone("Chest", [0, 0.27, 0], spine);
const neck = bone("Neck", [0, 0.17, 0], chest);
const head = bone("Head", [0, 0.14, 0], neck);
for (const side of [-1, 1]) {
  const name = side === -1 ? "Left" : "Right";
  const arm = bone(`${name}Arm`, [side * 0.265, 0.015, 0], chest);
  const forearm = bone(`${name}ForeArm`, [side * 0.052, -0.29, 0], arm);
  bone(`${name}Hand`, [side * 0.022, -0.25, 0], forearm);
  const thigh = bone(`${name}UpLeg`, [side * 0.12, -0.015, 0], hips);
  const calf = bone(`${name}Leg`, [0, -0.41, 0], thigh);
  bone(`${name}Foot`, [0, -0.37, 0.035], calf);
}
scene.updateMatrixWorld(true);
const skeleton = new THREE.Skeleton(bones);

function smoothMesh(geometry, material, parent = model) {
  const mesh = new THREE.Mesh(geometry, materials[material]);
  mesh.name = material;
  parent.add(mesh);
  return mesh;
}
function sphere(position, scale, material, parent = model, segments = 32) {
  const mesh = smoothMesh(
    new THREE.SphereGeometry(1, segments, 20),
    material,
    parent,
  );
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  return mesh;
}
function ring(
  position,
  radius,
  thickness,
  material,
  rotation = [0, 0, 0],
  parent = model,
) {
  const mesh = smoothMesh(
    new THREE.TorusGeometry(radius, thickness, 10, 36),
    material,
    parent,
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  return mesh;
}

// Elliptical surface rings model cloth contours and subtle folds without box geometry.
function loft(rings, material, skinning) {
  const count = 32,
    positions = [],
    uvs = [],
    indices = [],
    skinIndices = [],
    skinWeights = [];
  rings.forEach(([x, y, z, rx, rz], row) => {
    for (let j = 0; j <= count; j++) {
      const a = (j / count) * Math.PI * 2;
      const fold = 1 + Math.cos(a * 5 + row * 0.7) * 0.018;
      positions.push(
        x + Math.cos(a) * rx * fold,
        y,
        z + Math.sin(a) * rz * fold,
      );
      uvs.push(j / count, row / (rings.length - 1));
      if (skinning) {
        const [first, second, blend] = skinning(y);
        skinIndices.push(
          bones.indexOf(named[first]),
          bones.indexOf(named[second]),
          0,
          0,
        );
        skinWeights.push(1 - blend, blend, 0, 0);
      }
      if (row < rings.length - 1 && j < count) {
        const k = row * (count + 1) + j;
        if (rings.at(-1)[1] > rings[0][1])
          indices.push(
            k,
            k + count + 1,
            k + 1,
            k + 1,
            k + count + 1,
            k + count + 2,
          );
        else
          indices.push(
            k,
            k + 1,
            k + count + 1,
            k + 1,
            k + count + 2,
            k + count + 1,
          );
      }
    }
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(indices);
  g.computeVertexNormals();
  if (skinning) {
    g.setAttribute(
      "skinIndex",
      new THREE.Uint16BufferAttribute(skinIndices, 4),
    );
    g.setAttribute(
      "skinWeight",
      new THREE.Float32BufferAttribute(skinWeights, 4),
    );
    const mesh = new THREE.SkinnedMesh(g, materials[material]);
    model.add(mesh);
    mesh.bind(skeleton);
    mesh.name = material;
    return mesh;
  }
  return smoothMesh(g, material);
}
const blend = (y, mid, range) =>
  THREE.MathUtils.clamp((mid + range - y) / (range * 2), 0, 1);
loft(
  [
    [0, 0.96, 0, 0.225, 0.15],
    [0, 1.01, 0, 0.24, 0.16],
    [0, 1.1, 0, 0.225, 0.15],
    [0, 1.24, 0, 0.235, 0.155],
    [0, 1.38, 0, 0.27, 0.165],
    [0, 1.47, 0, 0.265, 0.145],
    [0, 1.52, 0, 0.185, 0.11],
    [0, 1.56, 0, 0.073, 0.075],
  ],
  "jacket",
  (y) => ["Spine", "Chest", 1 - blend(y, 1.31, 0.15)],
);
// Shirt bib and lapels are curved surfaces, following the chest rather than floating cubes.
function panel(points, material, parent = chest) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const mesh = smoothMesh(new THREE.ShapeGeometry(shape), material, parent);
  mesh.position.set(0, -1.45, 0.176);
  return mesh;
}
panel(
  [
    [-0.055, 1.5],
    [0.055, 1.5],
    [0.075, 1.03],
    [-0.075, 1.03],
  ],
  "shirt",
);
panel(
  [
    [-0.12, 1.51],
    [-0.065, 1.49],
    [-0.09, 1.37],
    [-0.032, 1.25],
    [-0.15, 1.39],
  ],
  "tie",
);
panel(
  [
    [0.12, 1.51],
    [0.065, 1.49],
    [0.09, 1.37],
    [0.032, 1.25],
    [0.15, 1.39],
  ],
  "tie",
);
panel(
  [
    [-0.02, 1.47],
    [0.025, 1.47],
    [0.028, 1.12],
    [0, 1.075],
    [-0.026, 1.12],
  ],
  "tie",
);
for (let i = 0; i < 3; i++)
  sphere(
    [0.095, -0.16 - i * 0.09, 0.169],
    [0.012, 0.012, 0.006],
    "gold",
    chest,
    12,
  );
ring([0, -0.07, -0.026], 0.055, 0.006, "headset", [Math.PI / 2, 0, 0], neck);
sphere([0, 0, 0], [0.065, 0.14, 0.064], "skin", neck);
// Head shape is sculpted from a sphere, with a narrower jaw and flattened facial plane.
const face = new THREE.SphereGeometry(1, 40, 32),
  fp = face.getAttribute("position");
for (let i = 0; i < fp.count; i++) {
  const x = fp.getX(i),
    y = fp.getY(i),
    z = fp.getZ(i);
  const jaw = y < -0.15 ? 0.75 + (y + 1) * 0.24 : 1;
  fp.setXYZ(i, x * 0.203 * jaw, y * 0.255, z * 0.184 * (z > 0 ? 0.94 : 1));
}
face.computeVertexNormals();
smoothMesh(face, "skin", head);
sphere([0, -0.045, 0.174], [0.025, 0.047, 0.033], "skin", head, 20);
for (const side of [-1, 1]) {
  sphere(
    [side * 0.076, 0.021, 0.163],
    [0.047, 0.023, 0.013],
    "highlight",
    head,
    24,
  );
  sphere([side * 0.076, 0.019, 0.176], [0.021, 0.022, 0.008], "eye", head, 20);
  sphere(
    [side * 0.071, 0.026, 0.183],
    [0.005, 0.006, 0.003],
    "highlight",
    head,
    12,
  );
  const brow = smoothMesh(
    new THREE.CapsuleGeometry(0.006, 0.066, 4, 12),
    "hair",
    head,
  );
  brow.position.set(side * 0.08, 0.061, 0.16);
  brow.rotation.z = side * 1.42;
  sphere(
    [side * 0.202, -0.013, -0.002],
    [0.035, 0.06, 0.023],
    "skin",
    head,
    24,
  );
  ring(
    [side * 0.229, -0.008, -0.012],
    0.082,
    0.021,
    "shoes",
    [0, Math.PI / 2, 0],
    head,
  );
  sphere(
    [side * 0.231, -0.008, -0.012],
    [0.018, 0.068, 0.068],
    "headset",
    head,
    24,
  );
}
const mouth = smoothMesh(
  new THREE.CapsuleGeometry(0.003, 0.041, 4, 10),
  "skin",
  head,
);
mouth.position.set(0, -0.135, 0.137);
mouth.rotation.z = Math.PI / 2;
const cap = smoothMesh(
  new THREE.SphereGeometry(0.217, 40, 24, 0, Math.PI * 2, 0, 1.84),
  "hair",
  head,
);
cap.position.set(0, 0.08, -0.025);
cap.scale.set(1, 1.04, 1.06);
// Smooth tapered locks give the hair a designed silhouette with curved fringe.
function lock(points, radius) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const steps = 14,
    radial = 8,
    frames = curve.computeFrenetFrames(steps, false),
    pos = [],
    idx = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps,
      p = curve.getPointAt(t),
      r = radius * Math.pow(1 - t, 0.65) + 0.001;
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const v = p
        .clone()
        .addScaledVector(frames.normals[i], Math.cos(a) * r)
        .addScaledVector(frames.binormals[i], Math.sin(a) * r * 0.52);
      pos.push(v.x, v.y, v.z);
      if (i < steps && j < radial) {
        const k = i * (radial + 1) + j;
        idx.push(
          k,
          k + radial + 1,
          k + 1,
          k + 1,
          k + radial + 1,
          k + radial + 2,
        );
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  smoothMesh(g, "hair", head);
}
for (let i = 0; i < 11; i++) {
  const x = -0.18 + i * 0.034;
  lock(
    [
      [x * 0.5, 0.22, 0.04],
      [x * 0.8, 0.16, 0.16],
      [x, 0.055, 0.19],
      [x - 0.025, -0.035 - Math.sin(i * 0.67) * 0.032, 0.182],
    ],
    0.036,
  );
}
for (const side of [-1, 1])
  for (let i = 0; i < 5; i++)
    lock(
      [
        [side * 0.13, 0.16, -0.03 - i * 0.025],
        [side * 0.212, 0.085, -0.02 - i * 0.025],
        [side * 0.22, -0.08, -0.04 - i * 0.023],
        [side * 0.18, -0.16, -0.055 - i * 0.023],
      ],
      0.027,
    );
ring([0, 0.045, -0.038], 0.225, 0.013, "headset", [0, Math.PI / 2, 0], head);

for (const side of [-1, 1]) {
  const name = side === -1 ? "Left" : "Right";
  loft(
    [
      [side * 0.24, 1.46, 0, 0.095, 0.112],
      [side * 0.28, 1.41, 0, 0.092, 0.094],
      [side * 0.3, 1.32, 0, 0.077, 0.083],
      [side * 0.32, 1.17, 0, 0.064, 0.072],
      [side * 0.33, 1.12, 0, 0.068, 0.068],
      [side * 0.342, 1.01, 0, 0.052, 0.057],
      [side * 0.346, 0.965, 0, 0.05, 0.055],
    ],
    "jacket",
    (y) => [`${name}Arm`, `${name}ForeArm`, blend(y, 1.18, 0.08)],
  );
  sphere(
    [0, -0.022, 0],
    [0.044, 0.084, 0.045],
    "skin",
    named[`${name}Hand`],
    24,
  );
  sphere(
    [-side * 0.035, -0.015, 0.022],
    [0.015, 0.04, 0.019],
    "skin",
    named[`${name}Hand`],
    16,
  );
  loft(
    [
      [side * 0.12, 0.9, 0, 0.115, 0.125],
      [side * 0.12, 0.82, 0, 0.113, 0.124],
      [side * 0.12, 0.68, 0.003, 0.089, 0.102],
      [side * 0.12, 0.49, 0.005, 0.079, 0.087],
      [side * 0.12, 0.42, 0, 0.076, 0.087],
      [side * 0.12, 0.25, 0, 0.061, 0.073],
      [side * 0.12, 0.115, 0.01, 0.055, 0.064],
    ],
    "trousers",
    (y) => [`${name}UpLeg`, `${name}Leg`, blend(y, 0.49, 0.09)],
  );
  sphere(
    [0, -0.048, 0.065],
    [0.087, 0.072, 0.18],
    "shoes",
    named[`${name}Foot`],
    32,
  );
  sphere(
    [0, -0.089, 0.074],
    [0.09, 0.023, 0.177],
    "sole",
    named[`${name}Foot`],
    24,
  );
  sphere(
    [0, 0.015, 0.018],
    [0.06, 0.07, 0.082],
    "shoes",
    named[`${name}Foot`],
    24,
  );
}

function rotationTrack(name, duration, fn) {
  const times = [],
    values = [];
  for (let i = 0; i <= 32; i++) {
    const t = (i / 32) * duration;
    times.push(t);
    const [x, y, z] = fn((t / duration) * Math.PI * 2);
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    values.push(q.x, q.y, q.z, q.w);
  }
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, times, values);
}
const walk = [];
for (const side of [-1, 1]) {
  const name = side === -1 ? "Left" : "Right",
    offset = side === -1 ? 0 : Math.PI;
  walk.push(
    rotationTrack(`${name}UpLeg`, 0.82, (t) => [
      Math.sin(t + offset) * 0.45,
      0,
      0,
    ]),
  );
  walk.push(
    rotationTrack(`${name}Leg`, 0.82, (t) => [
      Math.max(0, Math.sin(t + offset + 1)) * 0.55,
      0,
      0,
    ]),
  );
  walk.push(
    rotationTrack(`${name}Foot`, 0.82, (t) => [
      -Math.max(0, Math.sin(t + offset)) * 0.2,
      0,
      0,
    ]),
  );
  walk.push(
    rotationTrack(`${name}Arm`, 0.82, (t) => [
      -Math.sin(t + offset) * 0.3,
      0,
      side * 0.035,
    ]),
  );
  walk.push(
    rotationTrack(`${name}ForeArm`, 0.82, (t) => [
      -0.13 - Math.max(0, Math.sin(t + offset)) * 0.13,
      0,
      0,
    ]),
  );
}
walk.push(rotationTrack("Spine", 0.82, (t) => [0.02, Math.sin(t) * 0.045, 0]));
const idle = [
  rotationTrack("Chest", 3.6, (t) => [Math.sin(t) * 0.013, 0, 0]),
  rotationTrack("Head", 3.6, (t) => [0, Math.sin(t) * 0.035, 0]),
];
for (const name of ["Left", "Right"]) {
  idle.push(
    rotationTrack(`${name}Arm`, 3.6, (t) => [
      Math.sin(t) * 0.014,
      0,
      name === "Left" ? -0.025 : 0.025,
    ]),
  );
  idle.push(rotationTrack(`${name}ForeArm`, 3.6, () => [-0.08, 0, 0]));
}
scene.updateMatrixWorld(true);
model.userData = {
  author: "Original Faiz portfolio asset",
  license: "Project-owned",
  units: "meters",
  forward: "+Z",
};
const exporter = new GLTFExporter();
const buffer = await exporter.parseAsync(scene, {
  binary: true,
  animations: [
    new THREE.AnimationClip("Idle", 3.6, idle),
    new THREE.AnimationClip("Walk", 0.82, walk),
  ],
});
await mkdir("public/models", { recursive: true });
await writeFile("public/models/faiz-blue-hour.glb", Buffer.from(buffer));
console.log(
  `Authored original rigged avatar: ${(buffer.byteLength / 1024).toFixed(0)} KB, ${bones.length} bones, Idle + Walk.`,
);
