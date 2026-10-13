"use client";

import { useRef } from "react";
import { useWorldFrame } from "./WorldAnimation";
import * as THREE from "three";
import { DetailBox } from "./CampusArchitecture";
import { contentAlchemy, isPublicInstagramHref } from "@/lib/game/alchemy";
import type { SecretId } from "@/lib/game/secrets";

export function AlchemyDiscoveries({
  onDiscover,
  reducedMotion,
  children,
}: {
  onDiscover: (id: SecretId) => void;
  reducedMotion: boolean;
  children?: React.ReactNode;
}) {
  const seal = useRef<THREE.Group>(null);
  useWorldFrame((time) => {
    if (seal.current) {
      seal.current.position.y =
        1.95 + (reducedMotion ? 0 : Math.sin(time * 1.2) * 0.045);
      seal.current.rotation.y = reducedMotion ? 0 : time * 0.13;
    }
  });
  return (
    <>
      <group
        position={[-16, 0, 8]}
        onClick={(event) => {
          event.stopPropagation();
          onDiscover("alchemy-lab");
        }}
      >
        <DetailBox
          position={[0, 0.86, 0]}
          scale={[2, 0.13, 0.9]}
          color="#58412d"
          radius={0.05}
          roughness={0.7}
        />
        {[-0.84, 0.84].map((x) => (
          <DetailBox
            key={x}
            position={[x, 0.43, 0]}
            scale={[0.07, 0.86, 0.7]}
            color="#263e4b"
            metalness={0.7}
            radius={0.02}
          />
        ))}
        <DetailBox
          position={[0, 0.95, 0]}
          scale={[1.82, 0.03, 0.73]}
          color="#bbac86"
          radius={0.03}
        />
        {[-0.6, -0.12, 0.36].map((x, i) => (
          <group key={x} position={[x, 1.07, -0.1]}>
            <mesh castShadow>
              <sphereGeometry args={[0.14, 24, 16]} />
              <meshStandardMaterial
                color={i === 0 ? "#f4c779" : i === 1 ? "#86e2d6" : "#e7a0b5"}
                emissive={i === 0 ? "#bf813a" : i === 1 ? "#2a867e" : "#82445f"}
                emissiveIntensity={0.7}
                roughness={0.25}
                metalness={0.25}
              />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.045, 0.07, 0.15, 16]} />
              <meshStandardMaterial
                color="#d8d9b6"
                roughness={0.2}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[0, 0.255, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.055, 16]} />
              <meshStandardMaterial color="#795c38" roughness={0.9} />
            </mesh>
          </group>
        ))}
        <DetailBox
          position={[0.78, 1.03, 0.12]}
          scale={[0.26, 0.1, 0.38]}
          color="#122d44"
          rotation={[0, 0.25, 0]}
          radius={0.018}
        />
        <DetailBox
          position={[0.78, 1.086, 0.12]}
          scale={[0.22, 0.01, 0.32]}
          color="#d8bb73"
          rotation={[0, 0.25, 0]}
          radius={0.002}
        />
        <group ref={seal}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24, 0.012, 8, 48]} />
            <meshStandardMaterial
              color="#f9d882"
              emissive="#dda749"
              emissiveIntensity={1.7}
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.14]} />
            <meshStandardMaterial
              color="#eedb9b"
              metalness={0.6}
              roughness={0.3}
            />
          </mesh>
        </group>
        {children}
      </group>
      {isPublicInstagramHref(contentAlchemy.instagramHref) && (
        <group
          position={[-5.8, 0, 12.4]}
          onClick={(event) => {
            event.stopPropagation();
            onDiscover("creator-signal");
          }}
        >
          <DetailBox
            position={[0, 0.56, 0]}
            scale={[0.1, 1.12, 0.1]}
            color="#284450"
            metalness={0.7}
          />
          <group position={[0, 1.23, 0]} rotation={[-0.15, 0.1, 0]}>
            <DetailBox
              position={[0, 0, 0]}
              scale={[0.32, 0.58, 0.045]}
              color="#0b2335"
              radius={0.035}
              metalness={0.65}
            />
            <DetailBox
              position={[0, 0.005, 0.028]}
              scale={[0.27, 0.48, 0.012]}
              color="#b56470"
              emissive="#a44569"
              radius={0.02}
            />
            <mesh position={[0, 0, 0.046]}>
              <torusGeometry args={[0.076, 0.009, 8, 32]} />
              <meshBasicMaterial color="#f6d49c" />
            </mesh>
          </group>
        </group>
      )}
      {contentAlchemy.offer && (
        <group
          position={[-14.5, 0, 6.7]}
          onClick={(event) => {
            event.stopPropagation();
            onDiscover("alchemy-offer");
          }}
        >
          <DetailBox
            position={[0, 0.5, 0]}
            scale={[0.75, 1, 0.62]}
            color="#2a4150"
            radius={0.08}
          />
          <DetailBox
            position={[0, 1.025, 0]}
            scale={[0.53, 0.035, 0.34]}
            color="#e0cda3"
            radius={0.012}
            rotation={[0, 0.2, 0]}
          />
          <mesh position={[0, 1.056, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.052, 24]} />
            <meshStandardMaterial color="#874145" roughness={0.5} />
          </mesh>
        </group>
      )}
    </>
  );
}
