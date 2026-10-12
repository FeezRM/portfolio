"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { DetailBox } from "./CampusArchitecture";
import { StaticBatch } from "./StaticBatch";
import type { SecretId } from "@/lib/game/secrets";

const coast = [
  [-23, -24],
  [-12, -27],
  [8, -26],
  [21, -24],
  [25, -13],
  [25, 8],
  [22, 20],
  [9, 23],
  [-12, 22],
  [-24, 17],
  [-26, 2],
  [-25, -13],
];

function Label({
  text,
  width,
  position,
  rotation = 0,
}: {
  text: string;
  width: number;
  position: [number, number, number];
  rotation?: number;
}) {
  const map = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 144;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#102b3b";
    context.fillRect(0, 0, 768, 144);
    context.font = "600 58px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#9ce8dd";
    context.fillText(text, 384, 74);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [text]);
  useEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={position} rotation={[0, rotation, 0]}>
      <planeGeometry args={[width, width * 0.1875]} />
      <meshBasicMaterial map={map} />
    </mesh>
  );
}

function Pine({ x, z, height = 4 }: { x: number; z: number; height?: number }) {
  return (
    <group position={[x, 0.35, z]}>
      <mesh position={[0, height * 0.35, 0]}>
        <cylinderGeometry args={[0.13, 0.22, height * 0.7, 10]} />
        <meshStandardMaterial color="#586355" roughness={1} />
      </mesh>
      {[0, 1, 2].map((level) => (
        <mesh key={level} position={[0, height * (0.4 + level * 0.2), 0]}>
          <coneGeometry
            args={[height * (0.28 - level * 0.06), height * 0.5, 20]}
          />
          <meshStandardMaterial
            color={level % 2 ? "#355f61" : "#466d67"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Islet({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 20]} />
        <meshStandardMaterial color="#58746c" roughness={1} />
      </mesh>
      <mesh
        position={[position[0], position[1] - 1.1, position[2]]}
        scale={[scale[0] * 1.09, scale[1] * 0.7, scale[2] * 1.08]}
      >
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#586976" roughness={0.95} />
      </mesh>
    </>
  );
}

function District({ x, z, night }: { x: number; z: number; night: boolean }) {
  return (
    <group position={[x, 0, z]}>
      <Islet position={[0, -2.4, 0]} scale={[30, 3.3, 14]} />
      {Array.from({ length: 11 }, (_, i) => {
        const bx = (i - 5) * 4.5,
          bz = Math.sin(i * 2.1) * 3,
          height = 5 + ((i * 7) % 13),
          width = i % 3 ? 3 : 4;
        return (
          <group key={i} position={[bx, 0.5, bz]}>
            <DetailBox
              position={[0, height / 2, 0]}
              scale={[width, height, 3.3]}
              radius={0.16}
              color={i % 2 ? "#547581" : "#70878e"}
              roughness={0.62}
            />
            <DetailBox
              position={[0, height + 0.25, 0]}
              scale={[width * 0.72, 0.5, 2.7]}
              radius={0.08}
              color="#284d63"
            />
            <DetailBox
              position={[0, height * 0.5, 1.68]}
              scale={[width * 0.73, height * 0.83, 0.035]}
              radius={0.015}
              color="#214656"
              metalness={0.25}
              roughness={0.35}
            />
            {Array.from({ length: Math.floor(height / 1.25) }, (_, row) => (
              <DetailBox
                key={row}
                position={[0, 1 + row * 1.25, 1.72]}
                scale={[width * 0.73, 0.12, 0.018]}
                radius={0.008}
                color={night ? "#8ddbd4" : "#9ebfc2"}
                emissive="#3ba99f"
                emissiveIntensity={night ? 1.8 : 0.1}
              />
            ))}
            {i % 3 === 0 && (
              <mesh position={[0, height + 1, 0]}>
                <cylinderGeometry args={[0.035, 0.07, 1.5, 8]} />
                <meshStandardMaterial color="#c0d1cc" metalness={0.6} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function CoastalWorld({
  night,
  onDiscover,
}: {
  night: boolean;
  onDiscover: (id: SecretId) => void;
}) {
  const terrain = useMemo(() => {
    const shape = new THREE.Shape();
    const last = coast.at(-1)!;
    shape.moveTo((last[0] + coast[0][0]) / 2, -(last[1] + coast[0][1]) / 2);
    coast.forEach(([x, z], i) => {
      const next = coast[(i + 1) % coast.length];
      shape.quadraticCurveTo(x, -z, (x + next[0]) / 2, -(z + next[1]) / 2);
    });
    const cliff = new THREE.ExtrudeGeometry(shape, {
      depth: 4.8,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.5,
      bevelThickness: 0.08,
      curveSegments: 5,
      steps: 1,
    });
    const grass = new THREE.ShapeGeometry(shape, 5);
    return { cliff, grass };
  }, []);
  useEffect(
    () => () => {
      terrain.cliff.dispose();
      terrain.grass.dispose();
    },
    [terrain],
  );
  return (
    <>
      <StaticBatch>
        <mesh
          geometry={terrain.cliff}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -4.97, 0]}
        >
          <meshStandardMaterial color="#52676d" roughness={0.96} />
        </mesh>
        <mesh
          geometry={terrain.grass}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.045, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#647e71" roughness={1} />
        </mesh>
        {coast.flatMap(([x, z], i) =>
          [0, 1].map((j) => (
            <mesh
              key={`${i}:${j}`}
              position={[
                x + Math.sin(i * 5 + j) * 1.3,
                -0.65,
                z + Math.cos(i * 3 + j) * 1.2,
              ]}
              scale={[1.2 + (i % 3) * 0.4, 0.8 + j * 0.4, 1.1 + (i % 2) * 0.3]}
              rotation={[i * 0.7, j * 0.8, i * 0.3]}
            >
              <icosahedronGeometry args={[1, 2]} />
              <meshStandardMaterial
                color={i % 2 ? "#6c7a78" : "#526971"}
                roughness={1}
              />
            </mesh>
          )),
        )}
        {/* Island shoulders and a layered mainland establish land beneath the horizon. */}
        <District x={-12} z={-78} night={night} />
        <District x={12} z={65} night={night} />
        <Islet position={[-48, -1.4, -29]} scale={[13, 2.4, 11]} />
        <Islet position={[53, -1.8, 10]} scale={[15, 2.8, 18]} />
        {[-1, 0, 1].map((i) => (
          <mesh
            key={i}
            position={[-43 + i * 27, 0, -96]}
            scale={[22, 12 + (i + 1) * 4, 17]}
            rotation={[0, i * 0.4, 0]}
          >
            <sphereGeometry args={[1, 32, 20]} />
            <meshStandardMaterial
              color={night ? "#294253" : "#5d7d82"}
              roughness={1}
            />
          </mesh>
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <Pine
            key={`east:${i}`}
            x={48 + Math.sin(i * 2.4) * 7}
            z={3 + i * 1.8}
            height={3 + (i % 3) * 0.8}
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <Pine
            key={`west:${i}`}
            x={-52 + i * 1.8}
            z={-33 + Math.sin(i * 2) * 5}
            height={3.7 + (i % 2)}
          />
        ))}
        {/* A giant integrated circuit is an architectural landmark on the compute islet. */}
        <group position={[-46, 0.75, -28]} rotation={[0, 0.5, 0]}>
          {[-1.5, 1.5].map((x) => (
            <DetailBox
              key={x}
              position={[x, 1, 0]}
              scale={[0.35, 1.8, 0.6]}
              radius={0.04}
              color="#526b70"
              metalness={0.4}
            />
          ))}
          <DetailBox
            position={[0, 4.7, 0]}
            scale={[5.2, 6.4, 0.7]}
            radius={0.24}
            color="#173441"
            metalness={0.35}
            roughness={0.45}
          />
          <DetailBox
            position={[0, 4.7, 0.39]}
            scale={[3.7, 4.6, 0.06]}
            radius={0.14}
            color="#316166"
            metalness={0.3}
            roughness={0.4}
          />
          {Array.from({ length: 8 }, (_, i) =>
            [-1, 1].map((side) => (
              <DetailBox
                key={`${i}:${side}`}
                position={[side * 2.8, 2.1 + i * 0.7, 0]}
                scale={[0.65, 0.12, 0.2]}
                radius={0.03}
                color="#c5b28b"
                metalness={0.8}
              />
            )),
          )}
          {[0, 1, 2, 3].map((i) => (
            <DetailBox
              key={i}
              position={[-1.25 + i * 0.8, 4.7, 0.44]}
              scale={[0.055, 3.1 - i * 0.45, 0.018]}
              radius={0.012}
              color="#75d6c7"
              emissive="#328c85"
              emissiveIntensity={night ? 1.8 : 0.25}
            />
          ))}
        </group>
        {/* A supported causeway connects the lighthouse and compute islets. */}
        <group position={[-36.5, 0, -38]} rotation={[0, -0.907, 0]}>
          <DetailBox
            position={[0, 0.8, 0]}
            scale={[2.8, 0.5, 29.2]}
            radius={0.12}
            color="#7e9393"
          />
          {[-11, -5, 1, 7, 12].map((z) => (
            <mesh key={z} position={[0, -1, z]}>
              <cylinderGeometry args={[0.6, 0.75, 4, 16]} />
              <meshStandardMaterial color="#63777d" roughness={0.9} />
            </mesh>
          ))}
        </group>
      </StaticBatch>
      <Label
        text="01 / COMPUTE"
        width={4.4}
        position={[-46, 9.6, -27.4]}
        rotation={0.5}
      />
      <group
        position={[-25, 0, -47]}
        scale={0.65}
        onClick={(event) => {
          event.stopPropagation();
          onDiscover("hello-world");
        }}
      >
        <StaticBatch>
          <Islet position={[0, -1.6, 0]} scale={[10, 2.5, 8]} />
          <mesh position={[0, 6, 0]}>
            <cylinderGeometry args={[1.35, 2, 10.6, 32]} />
            <meshStandardMaterial color="#d4ddd2" roughness={0.75} />
          </mesh>
          {[2.9, 6.9].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <cylinderGeometry
                args={[1.72 - y * 0.03, 1.82 - y * 0.03, 0.6, 32]}
              />
              <meshStandardMaterial color="#245b6c" roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 11.5, 0]}>
            <cylinderGeometry args={[1.55, 1.6, 0.38, 32]} />
            <meshStandardMaterial
              color="#214250"
              metalness={0.45}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 12.3, 0]}>
            <cylinderGeometry args={[1.14, 1.14, 1.25, 32]} />
            <meshStandardMaterial
              color="#5ca8ab"
              metalness={0.2}
              emissive="#3cac9e"
              emissiveIntensity={night ? 2 : 0.4}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 13.24, 0]}>
            <coneGeometry args={[1.65, 0.7, 32]} />
            <meshStandardMaterial
              color="#284d5b"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 14, 0]}>
            <cylinderGeometry args={[0.03, 0.06, 1, 8]} />
            <meshStandardMaterial color="#bfd9d7" metalness={0.7} />
          </mesh>
          {[-4.8, 4.1].map((x, i) => (
            <Pine key={x} x={x} z={i ? 2 : -2} height={4.3} />
          ))}
        </StaticBatch>
        <Label text="HELLO, WORLD." width={5.5} position={[0, 8.9, 1.68]} />
        <mesh position={[0, 12.3, 0]}>
          <sphereGeometry args={[0.62, 24, 16]} />
          <meshBasicMaterial color="#b5fff0" />
        </mesh>
      </group>
    </>
  );
}
