"use client";

import { useEffect, useMemo, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/addons/utils/SkeletonUtils.js";
import * as THREE from "three";

export function AvatarModel({
  root,
  speed,
  golden,
  reducedMotion,
}: {
  root: RefObject<THREE.Group | null>;
  speed: RefObject<number>;
  golden: boolean;
  reducedMotion: boolean;
}) {
  const gltf = useGLTF("/models/faiz-blue-hour.glb");
  const { character, coatMaterials } = useMemo(() => {
    const character = clone(gltf.scene);
    const coatMaterials: THREE.MeshStandardMaterial[] = [];
    character.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = true;
      node.receiveShadow = true;
      // Only outfit variants own a cloned material; geometry and other materials stay cached.
      if (
        node.material instanceof THREE.MeshStandardMaterial &&
        node.material.name === "jacket"
      ) {
        node.material = node.material.clone();
        coatMaterials.push(node.material);
      }
    });
    return { character, coatMaterials };
  }, [gltf.scene]);
  const { actions } = useAnimations(gltf.animations, character);
  useEffect(() => {
    actions.Idle?.play();
    actions.Walk?.play();
    actions.Walk?.setEffectiveWeight(0);
    return () => {
      actions.Idle?.stop();
      actions.Walk?.stop();
    };
  }, [actions]);
  useEffect(() => {
    coatMaterials.forEach((material) =>
      material.color.set(golden ? "#c1a353" : "#142954"),
    );
  }, [golden, coatMaterials]);
  useEffect(
    () => () => coatMaterials.forEach((m) => m.dispose()),
    [coatMaterials],
  );
  useFrame((_, delta) => {
    const walk = actions.Walk,
      idle = actions.Idle;
    if (!walk || !idle) return;
    const target = Math.min(1, speed.current / 2.5);
    walk.setEffectiveWeight(
      THREE.MathUtils.damp(
        walk.getEffectiveWeight(),
        target,
        9,
        Math.min(delta, 0.05),
      ),
    );
    idle.setEffectiveWeight(1 - walk.getEffectiveWeight());
    walk.setEffectiveTimeScale(
      THREE.MathUtils.clamp(speed.current / 3.1, 0.65, 1.35),
    );
    idle.setEffectiveTimeScale(reducedMotion ? 0 : 1);
  });
  return (
    <group ref={root}>
      <primitive object={character} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.28, 40]} />
        <meshBasicMaterial
          color="#10252b"
          transparent
          opacity={0.17}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/faiz-blue-hour.glb");
