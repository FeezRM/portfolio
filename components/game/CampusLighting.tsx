"use client";

import { useMemo } from "react";
import { Environment } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  N8AO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

const skyVertex = `varying vec3 vDirection; void main(){ vDirection=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const skyFragment = `
uniform vec3 uTop; uniform vec3 uHorizon; uniform vec3 uBottom; varying vec3 vDirection;
void main(){
  vec3 d=normalize(vDirection); float h=max(d.y,0.);
  vec3 c=mix(uHorizon,uTop,pow(h,.42));
  c=mix(c,uBottom,1.-smoothstep(-.35,0.,d.y));
  float sun=pow(max(dot(d,normalize(vec3(-.8,.19,-.55))),0.),280.);
  c+=vec3(.65,.38,.15)*sun;
  gl_FragColor=vec4(c,1.);
  #include <colorspace_fragment>
}`;

export function CampusLighting({
  night,
  quality,
}: {
  night: boolean;
  quality: "high" | "low";
}) {
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(night ? "#07152e" : "#47728a") },
      uHorizon: { value: new THREE.Color(night ? "#27445d" : "#d9c8ab") },
      uBottom: { value: new THREE.Color(night ? "#18283d" : "#779c9e") },
    }),
    [night],
  );
  return (
    <>
      <color attach="background" args={[night ? "#101f34" : "#acbdba"]} />
      <fog attach="fog" args={[night ? "#162d46" : "#b9c7bf", 38, 115]} />
      <mesh renderOrder={-10}>
        <sphereGeometry args={[145, 32, 16]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          side={THREE.BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <Environment
        files="/environments/kiara-dawn-1k.hdr"
        background={false}
        environmentIntensity={night ? 0.2 : 0.55}
        environmentRotation={[0, 1.3, 0]}
      />
      <hemisphereLight
        args={[
          night ? "#7dadd9" : "#c9e2e4",
          night ? "#182e47" : "#6d7764",
          night ? 0.8 : 1.05,
        ]}
      />
      <directionalLight
        position={[-18, 20, -12]}
        color={night ? "#85baff" : "#ffe3ae"}
        intensity={night ? 1.7 : 3.1}
        castShadow={quality === "high"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-camera-near={0.5}
        shadow-camera-far={70}
        shadow-bias={-0.00025}
        shadow-normalBias={0.035}
      />
      <directionalLight
        position={[12, 8, 14]}
        color="#8ed5e2"
        intensity={night ? 0.25 : 0.45}
      />
      {night && (
        <>
          <pointLight
            position={[0, 4.4, 1]}
            color="#56e8e0"
            intensity={10}
            distance={8}
            decay={2}
          />
          <pointLight
            position={[-7, 2.6, -9.7]}
            color="#ffd39a"
            intensity={14}
            distance={9}
            decay={2}
          />
          <pointLight
            position={[12, 2.5, 3]}
            color="#91b7ff"
            intensity={12}
            distance={8}
            decay={2}
          />
        </>
      )}
    </>
  );
}

export function WorldEffects({ quality }: { quality: "high" | "low" }) {
  if (quality === "low") return null;
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <N8AO
        aoRadius={0.7}
        distanceFalloff={1.2}
        intensity={1.35}
        quality="medium"
        halfRes
      />
      <Bloom
        luminanceThreshold={1.15}
        luminanceSmoothing={0.3}
        intensity={0.28}
        mipmapBlur
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
