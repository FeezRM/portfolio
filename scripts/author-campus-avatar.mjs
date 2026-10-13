/** Original portfolio character. Reproducible mesh/skeleton authoring; ships as GLB. */
import * as THREE from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
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
    jacket: ["#17222c", 0.82],
    trousers: ["#242830", 0.86],
    shirt: ["#232c32", 0.86],
    skin: ["#bf8c69", 0.8],
    hair: ["#201d1b", 0.72],
    hairHighlight: ["#38302a", 0.73],
    facialHair: ["#453328", 0.94],
    lips: ["#a66f61", 0.78],
    frame: ["#20232a", 0.32],
    silver: ["#bcc7c6", 0.3],
    lens: ["#9fc4ce", 0.15],
    earbud: ["#f1eee8", 0.3],
    shoes: ["#172127", 0.36],
    sole: ["#4a5152", 0.85],
    gold: ["#b5a16a", 0.36],
    headset: ["#2dc9cc", 0.28],
    eye: ["#382d22", 0.45],
    highlight: ["#f6f0df", 0.6],
    tie: ["#244456", 0.72],
  }).map(([name, [color, roughness]]) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness:
        name === "silver"
          ? 0.8
          : ["gold", "headset", "frame"].includes(name)
            ? 0.5
            : 0,
      transparent: name === "lens",
      opacity: name === "lens" ? 0.12 : 1,
      depthWrite: name !== "lens",
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
const head = bone("Head", [0, 0.22, 0], neck);
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
// Continuous waistband bridges the tee and the two individually skinned trouser legs.
loft(
  [
    [0, 0.82, 0, 0.213, 0.133],
    [0, 0.9, 0, 0.228, 0.145],
    [0, 0.975, 0, 0.214, 0.143],
  ],
  "trousers",
  () => ["Hips", "Spine", 0],
);
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
// Reference wardrobe: a dark crew-neck tee and a small silver chain.
ring([0, -0.068, 0], 0.077, 0.007, "shirt", [Math.PI / 2, 0, 0], neck);
function tube(
  points,
  radius,
  material,
  parent = head,
  steps = 24,
  closed = false,
) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    closed,
  );
  return smoothMesh(
    new THREE.TubeGeometry(curve, steps, radius, 6, closed),
    material,
    parent,
  );
}
const chainPoints = [
  [-0.075, 0.112, 0.065],
  [-0.11, 0.015, 0.145],
  [-0.075, -0.095, 0.18],
  [0, -0.135, 0.186],
  [0.075, -0.095, 0.18],
  [0.11, 0.015, 0.145],
  [0.075, 0.112, 0.065],
];
tube(chainPoints, 0.0043, "silver", chest, 64).name = "Silver_Chain";
sphere([0, 0, 0], [0.065, 0.14, 0.064], "skin", neck);
// Head shape is sculpted from a sphere, with a narrower jaw and flattened facial plane.
function faceSurface(x, y) {
  const ny = y / 0.235;
  const jaw = 1 - THREE.MathUtils.smoothstep(-ny, 0.1, 0.95) * 0.14;
  const bridge =
    Math.exp(-((x / 0.024) ** 2) - ((y + 0.024) / 0.066) ** 2) * 0.018;
  const tip = Math.exp(-((x / 0.03) ** 2) - ((y + 0.071) / 0.022) ** 2) * 0.035;
  return (
    0.173 * Math.sqrt(Math.max(0, 1 - ny ** 2 - (x / (0.185 * jaw)) ** 2)) +
    bridge +
    tip
  );
}
const face = new THREE.SphereGeometry(1, 64, 48),
  fp = face.getAttribute("position");
for (let i = 0; i < fp.count; i++) {
  const x = fp.getX(i),
    y = fp.getY(i),
    z = fp.getZ(i);
  const jaw = 1 - THREE.MathUtils.smoothstep(-y, 0.1, 0.95) * 0.14;
  const px = x * 0.185 * jaw,
    py = y * 0.235;
  fp.setXYZ(i, px, py, z > 0 ? faceSurface(px, py) : z * 0.18);
}
face.computeVertexNormals();
const faceColors = [];
for (let i = 0; i < fp.count; i++) {
  const x = Math.abs(fp.getX(i)),
    y = -fp.getY(i);
  const center =
    THREE.MathUtils.smoothstep(y, 0.185, 0.203) *
    (1 - THREE.MathUtils.smoothstep(x, 0.055, 0.078));
  const sides =
    THREE.MathUtils.smoothstep(x, 0.032, 0.045) *
    (1 - THREE.MathUtils.smoothstep(x, 0.068, 0.085)) *
    THREE.MathUtils.smoothstep(y, 0.183, 0.195);
  const coverage =
    fp.getZ(i) > 0.04
      ? Math.max(center, sides) *
        (1 - THREE.MathUtils.smoothstep(y, 0.214, 0.233))
      : 0;
  const shade = 1 - coverage * 0.75;
  faceColors.push(shade, shade, shade);
}
face.setAttribute("color", new THREE.Float32BufferAttribute(faceColors, 3));
const faceMesh = smoothMesh(face, "skin", head);
faceMesh.name = "Faiz_Face";
faceMesh.material = materials.skin.clone();
faceMesh.material.name = "Face_Skin";
faceMesh.material.vertexColors = true;
// Eyes sit on the facial surface instead of protruding as separate eyeballs.
function faceDetail(geometry, x, y, material, offset = 0.002) {
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const px = positions.getX(i) + x,
      py = positions.getY(i) + y;
    positions.setXYZ(i, px, py, faceSurface(px, py) + offset);
  }
  geometry.computeVertexNormals();
  return smoothMesh(geometry, material, head);
}
for (const side of [-1, 1]) {
  const eyeShape = new THREE.Shape();
  eyeShape.moveTo(-0.033, 0);
  eyeShape.quadraticCurveTo(0, 0.021, 0.033, 0);
  eyeShape.quadraticCurveTo(0, -0.017, -0.033, 0);
  faceDetail(
    new THREE.ShapeGeometry(eyeShape, 16),
    side * 0.073,
    0.022,
    "highlight",
  ).name = `${side < 0 ? "Left" : "Right"}_Eye`;
  faceDetail(
    new THREE.CircleGeometry(0.0085, 24),
    side * 0.073,
    0.023,
    "eye",
    0.004,
  );
  faceDetail(
    new THREE.CircleGeometry(0.002, 12),
    side * 0.073 - 0.0025,
    0.026,
    "highlight",
    0.005,
  );
  const brow = smoothMesh(
    new THREE.CapsuleGeometry(0.006, 0.066, 4, 12),
    "hair",
    head,
  );
  brow.position.set(
    side * 0.075,
    0.06,
    faceSurface(side * 0.075, 0.06) + 0.003,
  );
  brow.rotation.z = side * 1.42;
  sphere(
    [side * 0.192, -0.013, -0.002],
    [0.035, 0.06, 0.023],
    "skin",
    head,
    24,
  );
  sphere(
    [side * 0.215, -0.028, 0.018],
    [0.018, 0.027, 0.019],
    "earbud",
    head,
    16,
  ).name = `${side < 0 ? "Left" : "Right"}_Earbud`;
  const stem = smoothMesh(
    new THREE.CapsuleGeometry(0.008, 0.032, 4, 10),
    "earbud",
    head,
  );
  stem.position.set(side * 0.215, -0.065, 0.025);
  // Rounded browline frames: dark upper rims, thin silver lower rims and clear lenses.
  const outline = [
    [-0.063, 0.035],
    [-0.035, 0.048],
    [0.035, 0.046],
    [0.064, 0.032],
    [0.066, -0.013],
    [0.042, -0.042],
    [-0.03, -0.044],
    [-0.063, -0.025],
  ];
  const cx = side * 0.083,
    cy = 0.025;
  tube(
    outline.map(([x, y]) => [cx + x, cy + y, 0.195]),
    0.0032,
    "silver",
    head,
    48,
    true,
  ).name = `${side < 0 ? "Left" : "Right"}_Glasses_Rim`;
  tube(
    [
      [-0.065, 0.035],
      [-0.035, 0.048],
      [0.035, 0.046],
      [0.064, 0.032],
    ].map(([x, y]) => [cx + x, cy + y, 0.198]),
    0.005,
    "frame",
    head,
    24,
  );
  const lensShape = new THREE.Shape();
  outline.forEach(([x, y], i) =>
    i ? lensShape.lineTo(x, y) : lensShape.moveTo(x, y),
  );
  lensShape.closePath();
  const lens = smoothMesh(new THREE.ShapeGeometry(lensShape), "lens", head);
  lens.position.set(cx, cy, 0.195);
  lens.name = `${side < 0 ? "Left" : "Right"}_Glasses_Lens`;
  tube(
    [
      [side * 0.146, 0.059, 0.197],
      [side * 0.188, 0.054, 0.11],
      [side * 0.207, 0.013, -0.02],
    ],
    0.0038,
    "frame",
    head,
    20,
  );
}
tube(
  [
    [-0.018, 0.044, 0.199],
    [0, 0.052, 0.216],
    [0.018, 0.044, 0.199],
  ],
  0.0032,
  "silver",
  head,
  16,
).name = "Glasses_Bridge";
const mouth = new THREE.Shape();
mouth.moveTo(-0.033, 0);
mouth.quadraticCurveTo(-0.01, 0.006, 0, 0.003);
mouth.quadraticCurveTo(0.014, 0.006, 0.033, 0);
mouth.quadraticCurveTo(0, -0.015, -0.033, 0);
faceDetail(new THREE.ShapeGeometry(mouth, 20), 0, -0.13, "lips", 0.002);
for (const side of [-1, 1]) {
  const mustache = sphere(
    [side * 0.023, -0.108, faceSurface(side * 0.023, -0.108) + 0.002],
    [0.027, 0.0055, 0.003],
    "facialHair",
    head,
    16,
  );
  mustache.rotation.z = side * 0.13;
  mustache.name = "Mustache";
}
function beardPatch(points, name) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const outlineGeometry = new THREE.ShapeGeometry(shape);
  const source = outlineGeometry.toNonIndexed().getAttribute("position");
  let triangles = [];
  for (let i = 0; i < source.count; i += 3)
    triangles.push(
      [0, 1, 2].map((j) => [source.getX(i + j), source.getY(i + j)]),
    );
  // Subdivide before projecting so the goatee hugs the curved jaw during head animation.
  for (let pass = 0; pass < 2; pass++)
    triangles = triangles.flatMap(([a, b, c]) => {
      const ab = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2],
        bc = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2],
        ca = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
      return [
        [a, ab, ca],
        [ab, b, bc],
        [ca, bc, c],
        [ab, bc, ca],
      ];
    });
  outlineGeometry.dispose();
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      triangles.flatMap((triangle) => triangle.flatMap(([x, y]) => [x, y, 0])),
      3,
    ),
  );
  const positions = geometry.getAttribute("position");
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i),
      y = positions.getY(i),
      z = faceSurface(x, y);
    positions.setZ(i, z + 0.002);
  }
  geometry.computeVertexNormals();
  smoothMesh(geometry, "facialHair", head).name = name;
}
beardPatch(
  [
    [-0.009, -0.16],
    [0.009, -0.16],
    [0.007, -0.173],
    [0, -0.177],
    [-0.006, -0.173],
  ],
  "Soul_Patch",
);
const capGeometry = new THREE.SphereGeometry(
  0.209,
  32,
  20,
  0,
  Math.PI * 2,
  0,
  1.76,
);
const capPositions = capGeometry.getAttribute("position");
for (let i = 0; i < capPositions.count; i++) {
  const y = capPositions.getY(i),
    z = capPositions.getZ(i);
  if (y < 0.075 && z > 0)
    capPositions.setY(
      i,
      y + (0.075 - y) * THREE.MathUtils.smoothstep(z, 0.025, 0.17),
    );
}
capGeometry.computeVertexNormals();
const cap = smoothMesh(capGeometry, "hair", head);
cap.position.set(0, 0.065, -0.027);
cap.scale.set(1, 1.06, 1.04);
// Short, irregular curved tufts create Faiz's fuller, tousled top and trimmed sides.
function lock(points, radius, material = "hair") {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  const steps = 9,
    radial = 6,
    frames = curve.computeFrenetFrames(steps, false),
    pos = [],
    idx = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps,
      p = curve.getPointAt(t),
      r = radius * Math.pow(1 - t, 0.85) + 0.003;
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
          k + 1,
          k + radial + 1,
          k + 1,
          k + radial + 2,
          k + radial + 1,
        );
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  smoothMesh(g, material, head);
}
for (let i = 0; i < 44; i++) {
  const angle = i * 2.39996,
    radius = Math.sqrt((i + 0.5) / 44);
  const x = Math.cos(angle) * 0.183 * radius,
    z = Math.sin(angle) * 0.17 * radius - 0.02;
  const y = 0.08 + 0.207 * Math.sqrt(1 - radius * radius);
  lock(
    [
      [x * 0.85, y - 0.025, z],
      [x + Math.sin(i * 3.1) * 0.017, y + 0.028, z + 0.018],
      [x + Math.cos(angle) * 0.032, y + 0.005, z + Math.sin(angle) * 0.025],
      [x + Math.cos(angle) * 0.045, y - 0.038, z + Math.sin(angle) * 0.04],
    ],
    0.03 + (i % 3) * 0.004,
    i % 7 === 0 ? "hairHighlight" : "hair",
  );
}
for (let i = 0; i < 9; i++) {
  const x = -0.15 + i * 0.038;
  lock(
    [
      [x * 0.8, 0.21, 0.085],
      [x, 0.17, 0.16],
      [x + Math.sin(i * 2) * 0.022, 0.105, 0.186],
      [x - 0.014, 0.098 + Math.cos(i * 1.7) * 0.015, 0.182],
    ],
    0.03,
  );
}
for (const side of [-1, 1])
  for (let i = 0; i < 5; i++)
    lock(
      [
        [side * 0.13, 0.16, -0.03 - i * 0.025],
        [side * 0.212, 0.085, -0.02 - i * 0.025],
        [side * 0.206, 0.015, -0.04 - i * 0.023],
        [side * 0.185, -0.018, -0.055 - i * 0.023],
      ],
      0.027,
    );

for (const side of [-1, 1]) {
  const name = side === -1 ? "Left" : "Right";
  loft(
    [
      [side * 0.24, 1.46, 0, 0.095, 0.112],
      [side * 0.28, 1.41, 0, 0.092, 0.094],
      [side * 0.3, 1.32, 0, 0.077, 0.083],
      [side * 0.315, 1.285, 0, 0.082, 0.084],
    ],
    "jacket",
    (y) => [`${name}Arm`, `${name}ForeArm`, blend(y, 1.18, 0.08)],
  );
  loft(
    [
      [side * 0.302, 1.3, 0, 0.066, 0.071],
      [side * 0.32, 1.17, 0, 0.063, 0.067],
      [side * 0.33, 1.12, 0, 0.062, 0.065],
      [side * 0.342, 1.01, 0, 0.051, 0.054],
      [side * 0.346, 0.965, 0, 0.048, 0.052],
    ],
    "skin",
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
// Keep the richer hairstyle to two draw calls while retaining the Head bone transform.
for (const materialName of ["hair", "hairHighlight"]) {
  const pieces = head.children.filter(
    (node) =>
      node instanceof THREE.Mesh && node.material === materials[materialName],
  );
  const inverse = head.matrixWorld.clone().invert();
  const geometries = pieces.map((mesh) => {
    const geometry = mesh.geometry.clone();
    geometry.deleteAttribute("uv");
    return geometry.applyMatrix4(
      new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld),
    );
  });
  const geometry = mergeGeometries(geometries, false);
  if (!geometry) throw new Error(`Could not merge ${materialName}`);
  geometries.forEach((part) => part.dispose());
  pieces.forEach((mesh) => {
    head.remove(mesh);
    mesh.geometry.dispose();
  });
  smoothMesh(geometry, materialName, head).name = `${materialName}_Sculpt`;
}
model.userData = {
  author: "Original Faiz portfolio asset",
  license: "Project-owned",
  units: "meters",
  forward: "+Z",
  likeness:
    "Photo-referenced: tousled hair, browline glasses, mustache and goatee, earbuds, dark tee, silver chain",
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
