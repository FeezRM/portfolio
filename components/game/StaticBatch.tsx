"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** Collapse authored static trim into a few material batches, retaining texture signs. */
export function StaticBatch({ children }: { children: ReactNode }) {
  const root = useRef<THREE.Group>(null);
  useLayoutEffect(() => {
    const group = root.current;
    if (!group) return;
    group.updateWorldMatrix(true, true);
    const inverse = group.matrixWorld.clone().invert();
    const buckets = new Map<
      string,
      {
        material: THREE.MeshStandardMaterial;
        geometries: THREE.BufferGeometry[];
      }
    >();
    const originals: THREE.Mesh[] = [];
    group.traverse((node) => {
      if (
        !(node instanceof THREE.Mesh) ||
        node instanceof THREE.SkinnedMesh ||
        node instanceof THREE.InstancedMesh ||
        !(node.material instanceof THREE.MeshStandardMaterial)
      )
        return;
      const material = node.material;
      const key = [
        material.color.getHex(),
        material.roughness,
        material.metalness,
        material.emissive.getHex(),
        material.emissiveIntensity,
        material.map?.uuid ?? "",
        material.side,
      ].join(":");
      let bucket = buckets.get(key);
      if (!bucket) {
        bucket = { material, geometries: [] };
        buckets.set(key, bucket);
      }
      const transform = new THREE.Matrix4().multiplyMatrices(
        inverse,
        node.matrixWorld,
      );
      let geometry = node.geometry.clone();
      if (geometry.index) {
        const expanded = geometry.toNonIndexed();
        geometry.dispose();
        geometry = expanded;
      }
      bucket.geometries.push(geometry.applyMatrix4(transform));
      originals.push(node);
    });
    const merged: THREE.Mesh[] = [];
    buckets.forEach(({ material, geometries }) => {
      const geometry = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      if (!geometry) return;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = mesh.receiveShadow = true;
      geometry.computeBoundingSphere();
      merged.push(mesh);
    });
    // Hide only after a complete successful bake; the authored graph remains editable.
    if (merged.length === buckets.size) {
      originals.forEach((mesh) => {
        mesh.visible = false;
      });
      merged.forEach((mesh) => group.add(mesh));
    }
    return () => {
      originals.forEach((mesh) => {
        mesh.visible = true;
      });
      merged.forEach((mesh) => {
        group.remove(mesh);
        mesh.geometry.dispose();
      });
    };
  }, [children]);
  return <group ref={root}>{children}</group>;
}
