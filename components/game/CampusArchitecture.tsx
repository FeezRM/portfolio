"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { StaticBatch } from "./StaticBatch";

type Triple = [number, number, number];
const stone = "#c9bda6",
  trim = "#ede1c9",
  steel = "#254554";

// Bevels are authored at world scale, so a tall facade never stretches its corners.
export function DetailBox({
  position,
  scale,
  color,
  rotation,
  radius = 0.035,
  metalness = 0,
  roughness = 0.65,
  emissive,
}: {
  position: Triple;
  scale: Triple;
  color: string;
  rotation?: Triple;
  radius?: number;
  metalness?: number;
  roughness?: number;
  emissive?: string;
}) {
  const [width, height, depth] = scale;
  const geometry = useMemo(
    () =>
      new RoundedBoxGeometry(
        width,
        height,
        depth,
        2,
        Math.min(radius, Math.min(width, height, depth) * 0.24),
      ),
    [width, height, depth, radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        emissive={emissive}
        emissiveIntensity={emissive ? 1.5 : 0}
      />
    </mesh>
  );
}

function Surface({
  size,
  color,
  glass = false,
}: {
  size: [number, number];
  color: string;
  glass?: boolean;
}) {
  return (
    <mesh receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={glass ? 0.16 : 0.9}
        metalness={glass ? 0.48 : 0}
      />
    </mesh>
  );
}

export function CampusBuilding({
  x,
  z,
  width,
  depth,
  height,
  side = false,
  accent,
  children,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  side?: boolean;
  accent: string;
  children?: React.ReactNode;
}) {
  const bays = Math.max(3, Math.floor(width / 1.55));
  const bayWidth = (width - 1.2) / bays;
  return (
    <StaticBatch>
      <group
        position={[x, 0, z]}
        rotation={[0, side ? (x > 0 ? -Math.PI / 2 : Math.PI / 2) : 0, 0]}
      >
        <DetailBox
          position={[0, height / 2, 0]}
          scale={[width, height, depth]}
          color={stone}
          radius={0.12}
        />
        {/* An inset dark facade with actual stone piers, framed panes, and a shadowed entrance. */}
        <DetailBox
          position={[0, height * 0.53, depth / 2 + 0.015]}
          scale={[width - 0.6, height * 0.67, 0.04]}
          color="#162c35"
          radius={0.008}
        />
        {Array.from({ length: bays }, (_, i) => {
          const bx = -width / 2 + 0.6 + bayWidth * (i + 0.5);
          return (
            <group key={i} position={[bx, 0, depth / 2 + 0.04]}>
              {[0.4, 0.69].map((row, ri) => (
                <group key={row} position={[0, height * row, 0]}>
                  <Surface
                    size={[bayWidth - 0.18, height * 0.24]}
                    color={(i + ri) % 4 === 0 ? "#355661" : "#234650"}
                    glass
                  />
                  <DetailBox
                    position={[0, -height * 0.12, 0.055]}
                    scale={[bayWidth, 0.065, 0.14]}
                    color={steel}
                    radius={0.01}
                    metalness={0.65}
                  />
                  <DetailBox
                    position={[0, 0, 0.04]}
                    scale={[0.032, height * 0.24, 0.06]}
                    color="#899590"
                    radius={0.005}
                    metalness={0.6}
                  />
                  <DetailBox
                    position={[0, height * 0.035, 0.035]}
                    scale={[bayWidth - 0.18, 0.025, 0.045]}
                    color="#b6c0af"
                    radius={0.004}
                    metalness={0.5}
                  />
                </group>
              ))}
              <DetailBox
                position={[bayWidth / 2, height * 0.53, 0.075]}
                scale={[0.16, height * 0.7, 0.25]}
                color={trim}
                radius={0.025}
              />
              <DetailBox
                position={[0, height * 0.23, 0.12]}
                scale={[bayWidth - 0.1, 0.14, 0.32]}
                color={trim}
                radius={0.03}
              />
              {[-1, 1].map((s) => (
                <DetailBox
                  key={s}
                  position={[s * (bayWidth / 2 - 0.14), height * 0.69, 0.07]}
                  scale={[0.026, height * 0.2, 0.07]}
                  color="#c8c2aa"
                  radius={0.004}
                />
              ))}
            </group>
          );
        })}
        {width > 12 && Array.from({ length: bays }, (_, i) => (
          <group key={`rear-${i}`} position={[-width / 2 + 0.6 + bayWidth * (i + 0.5), 0, -depth / 2 - 0.035]} rotation={[0, Math.PI, 0]}>
            {[0.43, 0.7].map((level) => (
              <group key={level} position={[0, height * level, 0]}>
                <Surface size={[bayWidth - 0.28, height * 0.22]} color="#31515a" glass />
                {[-1, 1].map((s) => (
                  <DetailBox key={s} position={[s * (bayWidth - 0.2) / 2, 0, 0.06]} scale={[0.08, height * 0.25, 0.16]} color={trim} radius={0.014} />
                ))}
                <DetailBox position={[0, -height * 0.12, 0.075]} scale={[bayWidth - 0.12, 0.12, 0.24]} color={trim} radius={0.02} />
                <DetailBox position={[0, height * 0.12, 0.05]} scale={[bayWidth - 0.12, 0.07, 0.16]} color={trim} radius={0.016} />
                <DetailBox position={[0, 0, 0.035]} scale={[0.028, height * 0.22, 0.07]} color="#a7b4ab" metalness={0.6} radius={0.005} />
              </group>
            ))}
          </group>
        ))}
        {[0.18, 0.87, 1].map((level, i) => (
          <DetailBox
            key={level}
            position={[0, height * level, 0]}
            scale={[
              width + (i === 2 ? 0.45 : 0.16),
              i === 2 ? 0.21 : 0.13,
              depth + 0.22,
            ]}
            color={i === 1 ? "#a6a896" : trim}
            radius={0.025}
          />
        ))}
        <DetailBox
          position={[0, height + 0.22, 0]}
          scale={[width - 0.15, 0.26, depth - 0.1]}
          color="#6a7a77"
          radius={0.025}
        />
        <DetailBox
          position={[0, height + 0.38, depth / 2]}
          scale={[width + 0.2, 0.07, 0.15]}
          color={trim}
        />
        <DetailBox
          position={[0, height * 0.92, depth / 2 + 0.07]}
          scale={[width - 0.5, 0.035, 0.08]}
          color={accent}
          emissive={accent}
          radius={0.005}
        />
        <group position={[0, 0, depth / 2 + 0.08]}>
          <DetailBox
            position={[0, 1.24, 0.1]}
            scale={[1.7, 2.48, 0.18]}
            color="#142d3b"
            radius={0.03}
          />
          {[-1, 1].map((s) => (
            <group key={s}>
              <DetailBox
                position={[s * 0.9, 1.28, 0.18]}
                scale={[0.16, 2.6, 0.28]}
                color={trim}
              />
              <DetailBox
                position={[s * 0.42, 1.26, 0.22]}
                scale={[0.75, 2.27, 0.05]}
                color="#253e4c"
                metalness={0.4}
                roughness={0.2}
                radius={0.015}
              />
              <DetailBox
                position={[s * 0.12, 1.12, 0.27]}
                scale={[0.025, 0.36, 0.07]}
                color="#d5b974"
                metalness={0.8}
                roughness={0.2}
                radius={0.008}
              />
            </group>
          ))}
          <DetailBox
            position={[0, 2.62, 0.18]}
            scale={[2.04, 0.22, 0.3]}
            color={trim}
          />
          <DetailBox
            position={[0, 2.9, 0.8]}
            scale={[3.6, 0.12, 1.8]}
            color={steel}
            metalness={0.5}
            radius={0.02}
          />
          <DetailBox
            position={[0, 2.82, 0.8]}
            scale={[3.4, 0.02, 1.62]}
            color="#d6b977"
            emissive="#a88b48"
            radius={0.003}
          />
          {[-1.5, 1.5].map((px) => (
            <DetailBox
              key={px}
              position={[px, 1.4, 1.5]}
              scale={[0.06, 2.8, 0.06]}
              color={steel}
              metalness={0.7}
              radius={0.015}
            />
          ))}
        </group>
        {children}
      </group>
    </StaticBatch>
  );
}

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function CampusTree({
  x,
  z,
  size = 1,
  reducedMotion = false,
}: {
  x: number;
  z: number;
  size?: number;
  reducedMotion?: boolean;
}) {
  const crown = useRef<THREE.Group>(null);
  const foliage = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);
  const seed = Math.abs(x * 1531 + z * 7187);
  const leafTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!,
      rand = random(823);
    for (let i = 0; i < 40; i++) {
      ctx.save();
      ctx.translate(32 + rand() * 192, 32 + rand() * 192);
      ctx.rotate(rand() * Math.PI * 2);
      const length = 13 + rand() * 22,
        width = 6 + rand() * 8;
      const gradient = ctx.createLinearGradient(-width, 0, width, 0);
      gradient.addColorStop(0, "#a4b59b");
      gradient.addColorStop(0.48, "#f4f4df");
      gradient.addColorStop(1, "#bac5a1");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, -length);
      ctx.bezierCurveTo(width, -length * 0.55, width, length * 0.6, 0, length);
      ctx.bezierCurveTo(
        -width,
        length * 0.6,
        -width,
        -length * 0.55,
        0,
        -length,
      );
      ctx.fill();
      ctx.strokeStyle = "#727e6f66";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -length * 0.8);
      ctx.lineTo(0, length * 0.85);
      ctx.stroke();
      ctx.restore();
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return map;
  }, []);
  useEffect(() => () => leafTexture.dispose(), [leafTexture]);
  const branches = useMemo(() => {
    const rand = random(seed);
    return Array.from({ length: 8 }, (_, i) => {
      const angle = i * 2.4;
      const end = new THREE.Vector3(
        Math.cos(angle) * (0.6 + rand() * 0.55),
        2.6 + rand() * 1.1,
        Math.sin(angle) * 0.9,
      );
      return new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 1.3, 0),
          new THREE.Vector3(end.x * 0.35, 2.4, end.z * 0.35),
          end,
        ]),
        7,
        0.055,
        6,
        false,
      );
    });
  }, [seed]);
  useEffect(() => () => branches.forEach((g) => g.dispose()), [branches]);
  useEffect(() => {
    if (!foliage.current || !leaves.current) return;
    const rand = random(seed),
      dummy = new THREE.Object3D(),
      color = new THREE.Color();
    for (let i = 0; i < 120; i++) {
      const a = rand() * Math.PI * 2,
        r = Math.sqrt(rand()) * 1.12;
      dummy.position.set(
        Math.cos(a) * r,
        2.9 + rand() * 1.25 - r * 0.3,
        Math.sin(a) * r,
      );
      dummy.scale.setScalar(0.65 + rand() * 0.45);
      dummy.rotation.set(
        rand() * Math.PI,
        rand() * Math.PI * 2,
        rand() * Math.PI,
      );
      dummy.updateMatrix();
      foliage.current.setMatrixAt(i, dummy.matrix);
      color.setHSL(
        0.36 + rand() * 0.035,
        0.23 + rand() * 0.15,
        0.22 + rand() * 0.16,
      );
      foliage.current.setColorAt(i, color);
    }
    for (let i = 0; i < 320; i++) {
      const a = rand() * Math.PI * 2,
        r = Math.sqrt(rand()) * 1.5;
      dummy.position.set(
        Math.cos(a) * r,
        2.95 + rand() * 1.5 - r * 0.35,
        Math.sin(a) * r,
      );
      dummy.rotation.set(rand() * 3, rand() * 6, rand() * 3);
      dummy.scale.set(
        0.1 + rand() * 0.1,
        0.035 + rand() * 0.025,
        0.04 + rand() * 0.09,
      );
      dummy.updateMatrix();
      leaves.current.setMatrixAt(i, dummy.matrix);
      color.setHSL(
        0.32 + rand() * 0.055,
        0.28 + rand() * 0.2,
        0.26 + rand() * 0.22,
      );
      leaves.current.setColorAt(i, color);
    }
    foliage.current.instanceMatrix.needsUpdate = true;
    leaves.current.instanceMatrix.needsUpdate = true;
    if (foliage.current.instanceColor)
      foliage.current.instanceColor.needsUpdate = true;
    if (leaves.current.instanceColor)
      leaves.current.instanceColor.needsUpdate = true;
    foliage.current.computeBoundingSphere();
    leaves.current.computeBoundingSphere();
  }, [seed]);
  useFrame(({ clock }) => {
    if (crown.current)
      crown.current.rotation.z = reducedMotion
        ? 0
        : Math.sin(clock.elapsedTime * 0.65 + seed) * 0.009;
  });
  return (
    <group position={[x, 0, z]} scale={size}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.18, 2.6, 16]} />
        <meshStandardMaterial color="#635b4b" roughness={0.95} />
      </mesh>
      {branches.map((geometry, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial color="#635b4b" roughness={0.95} />
        </mesh>
      ))}
      <group ref={crown}>
        <instancedMesh
          ref={foliage}
          args={[undefined, undefined, 120]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[1.15, 1.15]} />
          <meshStandardMaterial
            map={leafTexture}
            alphaTest={0.45}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </instancedMesh>
        <instancedMesh ref={leaves} args={[undefined, undefined, 320]}>
          <sphereGeometry args={[1, 6, 4]} />
          <meshStandardMaterial roughness={0.85} />
        </instancedMesh>
      </group>
      <DetailBox
        position={[0, 0.16, 0]}
        scale={[1.4, 0.32, 1.4]}
        color={trim}
        radius={0.07}
      />
      <DetailBox
        position={[0, 0.33, 0]}
        scale={[1.25, 0.06, 1.25]}
        color="#3d4937"
        radius={0.035}
      />
    </group>
  );
}

export function CampusBench({
  x,
  z,
  rotation = 0,
}: {
  x: number;
  z: number;
  rotation?: number;
}) {
  return (
    <StaticBatch>
      <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
        {Array.from({ length: 5 }, (_, i) => (
          <DetailBox
            key={i}
            position={[0, 0.57, -0.22 + i * 0.115]}
            scale={[2, 0.055, 0.09]}
            color={i % 2 ? "#89704d" : "#9e815b"}
            radius={0.018}
            roughness={0.82}
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <DetailBox
            key={i}
            position={[0, 0.79 + i * 0.12, -0.27 - i * 0.018]}
            scale={[2, 0.09, 0.05]}
            color="#9e815b"
            radius={0.016}
          />
        ))}
        {[-0.8, 0.8].map((px) => (
          <group key={px}>
            <DetailBox
              position={[px, 0.28, 0]}
              scale={[0.055, 0.56, 0.46]}
              color={steel}
              radius={0.016}
              metalness={0.75}
            />
            <DetailBox
              position={[px, 0.74, 0]}
              scale={[0.045, 0.36, 0.045]}
              color={steel}
              radius={0.015}
              metalness={0.75}
            />
            <DetailBox
              position={[px, 0.91, 0]}
              scale={[0.07, 0.045, 0.45]}
              color={steel}
              radius={0.015}
              metalness={0.75}
            />
          </group>
        ))}
      </group>
    </StaticBatch>
  );
}

export function CampusClock() {
  const shaft = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.64, 0.44),
          new THREE.Vector2(0.64, 0.6),
          new THREE.Vector2(0.41, 0.78),
          new THREE.Vector2(0.31, 1),
          new THREE.Vector2(0.28, 4.25),
          new THREE.Vector2(0.39, 4.42),
          new THREE.Vector2(0.43, 4.52),
        ],
        48,
      ),
    [],
  );
  useEffect(() => () => shaft.dispose(), [shaft]);
  return (
    <StaticBatch>
      <group position={[0, 0, 1]}>
        {[
          { r: 2.05, h: 0.2, y: 0.1 },
          { r: 1.85, h: 0.18, y: 0.27 },
          { r: 0.8, h: 0.16, y: 0.43 },
        ].map(({ r, h, y }) => (
          <mesh key={r} position={[0, y, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r + 0.025, h, 64]} />
            <meshStandardMaterial color={trim} roughness={0.7} />
          </mesh>
        ))}
        <mesh geometry={shaft} castShadow>
          <meshStandardMaterial
            color="#1c3b49"
            roughness={0.32}
            metalness={0.7}
          />
        </mesh>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(a) * 0.295, 2.7, Math.cos(a) * 0.295]}
            >
              <cylinderGeometry args={[0.012, 0.012, 3, 6]} />
              <meshStandardMaterial
                color="#a0b3a8"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          );
        })}
        <DetailBox
          position={[0, 4.93, 0]}
          scale={[1.45, 1.25, 1.45]}
          color={trim}
          radius={0.16}
        />
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle) => (
          <group key={angle} rotation={[0, angle, 0]}>
            <mesh position={[0, 4.93, 0.743]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 0.035, 64]} />
              <meshStandardMaterial
                color="#1c414e"
                metalness={0.4}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, 4.93, 0.77]}>
              <torusGeometry args={[0.53, 0.025, 8, 64]} />
              <meshStandardMaterial
                color="#c2ab75"
                metalness={0.75}
                roughness={0.25}
              />
            </mesh>
            {Array.from({ length: 12 }, (_, i) => (
              <DetailBox
                key={i}
                position={[
                  Math.sin((i * Math.PI) / 6) * 0.42,
                  4.93 + Math.cos((i * Math.PI) / 6) * 0.42,
                  0.78,
                ]}
                rotation={[0, 0, (-i * Math.PI) / 6]}
                scale={[i % 3 ? 0.016 : 0.028, i % 3 ? 0.04 : 0.065, 0.012]}
                color="#e1d6b9"
                radius={0.003}
              />
            ))}
            <DetailBox
              position={[0.075, 5.03, 0.8]}
              rotation={[0, 0, -0.62]}
              scale={[0.025, 0.28, 0.012]}
              color="#f5e7bd"
              radius={0.005}
            />
            <DetailBox
              position={[-0.14, 4.87, 0.815]}
              rotation={[0, 0, 1.17]}
              scale={[0.018, 0.36, 0.012]}
              color="#64f1e5"
              emissive="#35aaa2"
              radius={0.004}
            />
          </group>
        ))}
        <mesh position={[0, 5.62, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.75, 0.12, 48]} />
          <meshStandardMaterial color={steel} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 5.92, 0]} castShadow>
          <sphereGeometry
            args={[0.63, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#2c5c68"
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, 6.63, 0]} castShadow>
          <coneGeometry args={[0.09, 0.48, 16]} />
          <meshStandardMaterial
            color="#cfb374"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.39, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.42, 1.46, 96]} />
          <meshStandardMaterial
            color="#74e8d5"
            emissive="#3ea99d"
            emissiveIntensity={1.6}
          />
        </mesh>
      </group>
    </StaticBatch>
  );
}

export function CampusGround() {
  const textures = useMemo(() => {
    const color = document.createElement("canvas"),
      bump = document.createElement("canvas");
    color.width = color.height = bump.width = bump.height = 512;
    const ctx = color.getContext("2d")!,
      relief = bump.getContext("2d")!,
      rand = random(37);
    ctx.fillStyle = "#5f6e70";
    ctx.fillRect(0, 0, 512, 512);
    relief.fillStyle = "#373737";
    relief.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 4; x++) {
        const v = Math.floor(153 + rand() * 9);
        ctx.fillStyle = `rgb(${v + 5},${v + 7},${v})`;
        ctx.fillRect(x * 128 + 2, y * 128 + 2, 124, 124);
        relief.fillStyle = "#c0c0c0";
        relief.fillRect(x * 128 + 3, y * 128 + 3, 122, 122);
      }
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = rand() > 0.5 ? "#ffffff09" : "#102d3a09";
      ctx.fillRect(rand() * 512, rand() * 512, 1, 1);
    }
    const map = new THREE.CanvasTexture(color),
      bumpMap = new THREE.CanvasTexture(bump);
    map.colorSpace = THREE.SRGBColorSpace;
    [map, bumpMap].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(16, 16);
      t.anisotropy = 4;
    });
    return { map, bumpMap };
  }, []);
  useEffect(
    () => () => {
      textures.map.dispose();
      textures.bumpMap.dispose();
    },
    [textures],
  );
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.012, -2]}
      receiveShadow
    >
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        {...textures}
        bumpScale={0.032}
        roughness={0.82}
        color="#ddd8c5"
      />
    </mesh>
  );
}
