"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { SecretId } from "@/lib/game/secrets";
import {
  destinations,
  exhibits,
  trees,
  benches,
  planters,
  movePlayer,
  movementVector,
  cameraOffset,
  nearestTarget,
  type Point,
  type Section,
} from "@/lib/game/world";

export interface WorldProps {
  paused: boolean;
  night: boolean;
  reducedMotion: boolean;
  quality: "high" | "low";
  travel: { position: Point; serial: number };
  joystick: RefObject<Point>;
  onReady: () => void;
  onPosition: (point: Point) => void;
  onTarget: (target: ReturnType<typeof nearestTarget>) => void;
  onOpen: (section: Section, project?: string) => void;
  onFailure: () => void;
  onPerformanceDrop: () => void;
  onSecret: (id: SecretId) => void;
  golden: boolean;
}

function Box({
  position,
  scale,
  color,
  ...props
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

function Sign({
  text,
  position,
  width = 4,
  color = "#bdfcff",
  background = "#082d66",
  rotation = 0,
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
  background?: string;
  rotation?: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 192;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 1024, 192);
    ctx.fillStyle = color;
    ctx.font = "700 76px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 512, 100);
    ctx.fillRect(32, 164, 960, 3);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, [text, background, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[0, rotation, 0]}>
      <planeGeometry args={[width, width * 0.1875]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Tree({ x, z, size = 1 }: { x: number; z: number; size?: number }) {
  return (
    <group position={[x, 0, z]} scale={size}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.17, 2.2, 6]} />
        <meshStandardMaterial color="#657783" />
      </mesh>
      <mesh position={[0, 2.55, 0]} castShadow>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#68aca0" roughness={1} />
      </mesh>
      <mesh position={[0.4, 3.15, 0]} castShadow>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#86cdb4" roughness={1} />
      </mesh>
      <Box position={[0, 0.18, 0]} scale={[1.3, 0.36, 1.3]} color="#a4c7cf" />
    </group>
  );
}

function Bench({
  x,
  z,
  rotation = 0,
}: {
  x: number;
  z: number;
  rotation?: number;
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      <Box position={[0, 0.6, 0]} scale={[2, 0.12, 0.55]} color="#648093" />
      <Box position={[0, 1, -0.2]} scale={[2, 0.65, 0.1]} color="#7c98a3" />
      {[-0.75, 0.75].map((x) => (
        <Box
          key={x}
          position={[x, 0.3, 0]}
          scale={[0.1, 0.6, 0.45]}
          color="#174d74"
        />
      ))}
    </group>
  );
}

function Building({
  x,
  z,
  width,
  depth,
  height,
  name,
  accent,
  side = false,
}: {
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  name: string;
  accent: string;
  side?: boolean;
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, side ? Math.PI / 2 : 0, 0]}>
      <Box
        position={[0, height / 2, 0]}
        scale={[width, height, depth]}
        color="#cadce5"
      />
      <Box
        position={[0, height * 0.6, depth / 2 + 0.03]}
        scale={[width * 0.95, height * 0.55, 0.08]}
        color="#296792"
      />
      {Array.from({ length: Math.ceil(width / 1.4) }, (_, i) => (
        <Box
          key={i}
          position={[
            -width / 2 + 0.4 + i * 1.4,
            height * 0.6,
            depth / 2 + 0.12,
          ]}
          scale={[0.08, height * 0.55, 0.15]}
          color="#96cfdd"
        />
      ))}
      <Box
        position={[0, height * 0.57, depth / 2 + 0.13]}
        scale={[width, 0.1, 0.15]}
        color="#94cbdc"
      />
      <Box
        position={[0, height + 0.1, 0]}
        scale={[width + 0.5, 0.22, depth + 0.5]}
        color="#edf6f8"
      />
      <Box
        position={[0, height + 0.24, depth / 2]}
        scale={[width + 0.5, 0.06, 0.12]}
        color={accent}
      />
      <Box
        position={[0, 1.4, depth / 2 + 0.14]}
        scale={[1.5, 2.7, 0.15]}
        color="#153f73"
      />
      <Box
        position={[0, 2.9, depth / 2 + 0.9]}
        scale={[3.5, 0.12, 2]}
        color="#b4d1dd"
      />
      <Sign
        text={name}
        position={[0, height - 0.5, depth / 2 + 0.18]}
        width={Math.min(width - 0.5, 6)}
        color={accent}
      />
      {[-1.5, 1.5].map((x) => (
        <Box
          key={x}
          position={[x, 1.4, depth / 2 + 1.6]}
          scale={[0.08, 2.8, 0.08]}
          color="#d6f4f3"
        />
      ))}
    </group>
  );
}

function Beacon({
  position,
  color,
  onClick,
  reducedMotion,
}: {
  position: Point;
  color: string;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current && !reducedMotion)
      ring.current.rotation.z = clock.elapsedTime * 0.5;
  });
  return (
    <group
      position={[position.x, 0.06, position.z]}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.79, 40]} />
        <meshBasicMaterial
          color={color}
          side={THREE.DoubleSide}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh ref={ring} position={[0, 2.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.18]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Exhibits({
  onOpen,
  reducedMotion,
}: {
  onOpen: WorldProps["onOpen"];
  reducedMotion: boolean;
}) {
  const sculpture = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (sculpture.current && !reducedMotion)
      sculpture.current.rotation.y = clock.elapsedTime * 0.18;
  });
  return (
    <>
      {exhibits.map((e, index) => (
        <group
          key={e.id}
          position={[e.position.x, 0, e.position.z]}
          onClick={(event) => {
            event.stopPropagation();
            onOpen("projects", e.id);
          }}
        >
          <Box
            position={[0, 0.55, 0]}
            scale={[1.2, 1.1, 1.2]}
            color="#173a69"
          />
          <Box
            position={[0, 1.13, 0]}
            scale={[1.4, 0.06, 1.4]}
            color={e.color}
          />
          <Sign
            text={e.name.toUpperCase()}
            position={[0, 0.68, 0.61]}
            width={1.05}
            color={e.color}
          />
          <group
            ref={index === 0 ? sculpture : undefined}
            position={[0, 1.85, 0]}
          >
            {index === 0 ? (
              <>
                <mesh rotation={[0.4, 0.2, 0]}>
                  <torusGeometry args={[0.38, 0.055, 8, 40]} />
                  <meshStandardMaterial
                    color={e.color}
                    emissive={e.color}
                    emissiveIntensity={0.4}
                  />
                </mesh>
                <mesh>
                  <sphereGeometry args={[0.13, 16, 16]} />
                  <meshBasicMaterial color="#f8fbff" />
                </mesh>
              </>
            ) : index === 1 ? (
              <>
                {[-0.3, 0, 0.3].map((x, i) => (
                  <Box
                    key={x}
                    position={[x, (i % 2) * 0.25, 0]}
                    scale={[0.22, 0.55, 0.14]}
                    color={e.color}
                  />
                ))}
              </>
            ) : index === 2 ? (
              <>
                {Array.from({ length: 7 }, (_, i) => (
                  <Box
                    key={i}
                    position={[(i - 3) * 0.12, 0, 0]}
                    scale={[0.055, 0.2 + Math.sin(i * 1.3) ** 2 * 0.7, 0.08]}
                    color={e.color}
                  />
                ))}
              </>
            ) : (
              <mesh rotation={[0.2, 0.6, 0.1]}>
                <octahedronGeometry args={[0.5]} />
                <meshStandardMaterial color={e.color} wireframe />
              </mesh>
            )}
          </group>
          <mesh position={[0, 2.8, 0]}>
            <octahedronGeometry args={[0.1]} />
            <meshBasicMaterial color={e.color} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Ground() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#c1d3d8";
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "#9dafb9";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, 128, 128);
    ctx.strokeRect(128, 128, 128, 128);
    ctx.strokeRect(128, 0, 128, 128);
    ctx.strokeRect(0, 128, 128, 128);
    const result = new THREE.CanvasTexture(canvas);
    result.wrapS = result.wrapT = THREE.RepeatWrapping;
    result.repeat.set(20, 20);
    result.colorSpace = THREE.SRGBColorSpace;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, -2]}
      receiveShadow
    >
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial map={texture} roughness={0.9} />
    </mesh>
  );
}

const waterVertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const waterFragment = `uniform float uTime; uniform vec3 uColor; varying vec2 vUv; void main(){float w=sin(vUv.x*110.+uTime*.6+sin(vUv.y*25.))*sin(vUv.y*90.-uTime*.35);float line=smoothstep(.76,.94,w);vec3 color=mix(uColor,vec3(.48,.9,.97),line*.42);gl_FragColor=vec4(color,1.);}`;

function Harbor({
  night,
  reducedMotion,
}: {
  night: boolean;
  reducedMotion: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#126caa") },
    }),
    [],
  );
  useFrame(({ clock }) => {
    if (material.current) {
      material.current.uniforms.uTime.value = reducedMotion
        ? 0
        : clock.elapsedTime;
      material.current.uniforms.uColor.value.set(night ? "#063962" : "#126caa");
    }
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -53]}>
        <planeGeometry args={[220, 66]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={waterVertex}
          fragmentShader={waterFragment}
        />
      </mesh>
      <Box
        position={[0, 0.13, -20.4]}
        scale={[40, 0.28, 0.8]}
        color="#ecf5ef"
      />
      {Array.from({ length: 21 }, (_, i) => (
        <Box
          key={i}
          position={[-20 + i * 2, 0.68, -20.4]}
          scale={[0.08, 1.15, 0.08]}
          color="#709aac"
        />
      ))}
      <Box
        position={[0, 1.2, -20.4]}
        scale={[40, 0.07, 0.08]}
        color="#86afc4"
      />
      <Box
        position={[0, 0.68, -20.4]}
        scale={[40, 0.04, 0.04]}
        color="#86afc4"
      />
      {Array.from({ length: 17 }, (_, i) => (
        <Box
          key={i}
          position={[-45 + i * 5.5, 2 + (i % 4), -83 + (i % 2) * 3]}
          scale={[3.5, 4 + (i % 4) * 2, 3]}
          color={night ? "#143c77" : "#83b8ce"}
        />
      ))}
      <Sign
        text="MAKE SOMETHING THAT MATTERS."
        position={[0, 2.1, -20]}
        width={7.5}
      />
    </>
  );
}

function ClockTower() {
  return (
    <group position={[0, 0, 1]}>
      <mesh position={[0, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2, 2.1, 0.4, 48]} />
        <meshStandardMaterial color="#95bbc8" />
      </mesh>
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.85, 48]} />
        <meshStandardMaterial color="#2189b6" metalness={0.3} roughness={0.2} />
      </mesh>
      <Box position={[0, 2.8, 0]} scale={[0.8, 5.2, 0.8]} color="#164c8d" />
      <Box position={[0, 3, 0.43]} scale={[0.07, 4.9, 0.02]} color="#35f2ef" />
      <Box position={[0, 5.3, 0]} scale={[1.8, 1.7, 1.3]} color="#effcff" />
      <mesh position={[0, 5.3, 0.66]}>
        <circleGeometry args={[0.63, 48]} />
        <meshBasicMaterial color="#163a8f" />
      </mesh>
      <Box
        position={[0, 5.49, 0.68]}
        scale={[0.045, 0.4, 0.025]}
        color="#35f2ef"
      />
      <Box
        position={[0.16, 5.3, 0.68]}
        scale={[0.36, 0.045, 0.025]}
        color="#f5fbff"
      />
      <mesh position={[0, 6.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.55, 0.75, 4]} />
        <meshStandardMaterial color="#0d37b1" />
      </mesh>
    </group>
  );
}

function CampusSecrets({
  onDiscover,
  reducedMotion,
}: {
  onDiscover: (id: SecretId) => void;
  reducedMotion: boolean;
}) {
  const tail = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (tail.current && !reducedMotion)
      tail.current.rotation.z = Math.sin(clock.elapsedTime * 5) * 0.2;
  });
  return (
    <>
      <group
        position={[5.6, 0, -17]}
        rotation={[0, -0.5, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onDiscover("campus-dog");
        }}
      >
        <mesh position={[0, 0.4, 0]} scale={[0.7, 0.65, 1.1]} castShadow>
          <sphereGeometry args={[0.4, 12, 8]} />
          <meshToonMaterial color="#f5fbff" />
        </mesh>
        {[-0.17, 0.17].flatMap((x) =>
          [-0.23, 0.23].map((z) => (
            <Box
              key={`${x}:${z}`}
              position={[x, 0.15, z]}
              scale={[0.12, 0.3, 0.16]}
              color="#e1edf3"
            />
          )),
        )}
        <mesh position={[0, 0.65, 0.33]} castShadow>
          <sphereGeometry args={[0.28, 12, 8]} />
          <meshToonMaterial color="#f5fbff" />
        </mesh>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.92, 0.29]} rotation={[0, 0, -x]}>
            <coneGeometry args={[0.12, 0.28, 3]} />
            <meshToonMaterial color="#dce7ef" />
          </mesh>
        ))}
        <Box
          position={[0, 0.63, 0.55]}
          scale={[0.2, 0.15, 0.22]}
          color="#f5fbff"
        />
        <Box
          position={[0, 0.68, 0.67]}
          scale={[0.08, 0.07, 0.045]}
          color="#081020"
        />
        {[-0.12, 0.12].map((x) => (
          <Box
            key={x}
            position={[x, 0.73, 0.565]}
            scale={[0.055, 0.06, 0.025]}
            color="#081020"
          />
        ))}
        <Box
          position={[0, 0.46, 0.31]}
          scale={[0.46, 0.085, 0.16]}
          color="#ff576f"
        />
        <mesh position={[0, 0.36, 0.42]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.14, 0.24, 3]} />
          <meshToonMaterial color="#ff576f" />
        </mesh>
        <mesh ref={tail} position={[0, 0.53, -0.39]} rotation={[0.5, 0, 0]}>
          <torusGeometry args={[0.2, 0.065, 6, 16, Math.PI * 1.6]} />
          <meshToonMaterial color="#f5fbff" />
        </mesh>
      </group>
      <group
        position={[-13.5, 0, -8.5]}
        onClick={(event) => {
          event.stopPropagation();
          onDiscover("velvet-door");
        }}
      >
        <Box position={[0, 1.45, 0]} scale={[1.5, 2.9, 0.55]} color="#071841" />
        <mesh position={[0, 1.45, 0.29]}>
          <planeGeometry args={[1.22, 2.6]} />
          <meshStandardMaterial
            color="#124beb"
            emissive="#123de8"
            emissiveIntensity={0.65}
          />
        </mesh>
        {[-0.58, 0.58].map((x) => (
          <Box
            key={x}
            position={[x, 1.45, 0.31]}
            scale={[0.04, 2.6, 0.025]}
            color="#35f2ef"
          />
        ))}
        <mesh position={[0, 2.15, 0.33]} rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#35f2ef" />
        </mesh>
        <Box
          position={[0.34, 1.3, 0.35]}
          scale={[0.08, 0.08, 0.07]}
          color="#f8e66a"
        />
        <Sign
          text="? / BETWEEN WORLDS"
          position={[0, 3.16, 0.05]}
          width={1.75}
        />
      </group>
      <group
        position={[12.5, 0, 8.5]}
        onClick={(event) => {
          event.stopPropagation();
          onDiscover("moon-soda");
        }}
      >
        <Box position={[0, 1.1, 0]} scale={[1.1, 2.2, 0.8]} color="#173ea9" />
        <Box
          position={[-0.12, 1.32, 0.41]}
          scale={[0.64, 1.3, 0.03]}
          color="#061841"
        />
        {[-0.28, 0, 0.27].flatMap((x) =>
          [1.06, 1.6].map((y) => (
            <Box
              key={`${x}:${y}`}
              position={[x - 0.09, y, 0.44]}
              scale={[0.15, 0.32, 0.04]}
              color={y > 1.5 ? "#35f2ef" : "#ff8bb4"}
            />
          )),
        )}
        <Box
          position={[0.4, 1.13, 0.45]}
          scale={[0.1, 0.2, 0.04]}
          color="#f8e66a"
        />
        <Box
          position={[0, 0.35, 0.42]}
          scale={[0.65, 0.18, 0.03]}
          color="#081020"
        />
        <Sign text="MOON SODA" position={[0, 2.1, 0.43]} width={0.95} />
      </group>
    </>
  );
}

function Avatar({
  root,
  leftLeg,
  rightLeg,
  leftArm,
  rightArm,
  golden,
}: {
  root: RefObject<THREE.Group | null>;
  leftLeg: RefObject<THREE.Group | null>;
  rightLeg: RefObject<THREE.Group | null>;
  leftArm: RefObject<THREE.Group | null>;
  rightArm: RefObject<THREE.Group | null>;
  golden: boolean;
}) {
  const limb = (
    side: number,
    ref: RefObject<THREE.Group | null>,
    leg: boolean,
  ) => (
    <group
      ref={ref}
      position={[side * (leg ? 0.13 : 0.29), leg ? 0.87 : 1.42, 0]}
    >
      <Box
        position={[0, leg ? -0.37 : -0.26, 0]}
        scale={leg ? [0.19, 0.73, 0.21] : [0.16, 0.51, 0.19]}
        color={leg ? "#092449" : golden ? "#ccb650" : "#153ea9"}
      />
      {leg ? (
        <Box
          position={[0, -0.78, 0.055]}
          scale={[0.21, 0.12, 0.38]}
          color="#071124"
        />
      ) : (
        <mesh position={[0, -0.54, 0]} castShadow>
          <sphereGeometry args={[0.085, 8, 6]} />
          <meshToonMaterial color="#dcbfae" />
        </mesh>
      )}
    </group>
  );
  return (
    <group ref={root}>
      <Box
        position={[0, 1.17, 0]}
        scale={[0.46, 0.63, 0.28]}
        color={golden ? "#f8e66a" : "#173c99"}
      />
      <Box
        position={[0, 1.3, 0.15]}
        scale={[0.14, 0.37, 0.015]}
        color="#f2f9fc"
      />
      <Box
        position={[0, 1.26, 0.17]}
        scale={[0.04, 0.25, 0.012]}
        color="#182940"
      />
      <Box position={[0, 1.53, 0]} scale={[0.13, 0.15, 0.15]} color="#dcbfae" />
      <mesh position={[0, 1.77, 0]} castShadow>
        <sphereGeometry args={[0.24, 12, 10]} />
        <meshToonMaterial color="#dcbfae" />
      </mesh>
      <mesh position={[0, 1.86, -0.035]} scale={[1.04, 0.78, 1.1]} castShadow>
        <sphereGeometry args={[0.255, 10, 8]} />
        <meshToonMaterial color="#0a1c40" />
      </mesh>
      {[-0.14, -0.05, 0.04, 0.13].map((x, i) => (
        <mesh
          key={x}
          position={[x, 1.85 - i * 0.014, 0.19]}
          rotation={[0.2, 0, -0.35]}
          castShadow
        >
          <coneGeometry args={[0.1, 0.3, 4]} />
          <meshToonMaterial color="#0d2857" />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={[side * 0.245, 1.77, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.095, 0.095, 0.07, 16]} />
            <meshStandardMaterial
              color="#35f2ef"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
          <Box
            position={[side * 0.085, 1.77, 0.212]}
            scale={[0.045, 0.028, 0.02]}
            color="#081124"
          />
        </group>
      ))}
      <mesh position={[0, 1.84, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.25, 0.018, 6, 24, Math.PI]} />
        <meshStandardMaterial color="#35f2ef" />
      </mesh>
      {limb(-1, leftLeg, true)}
      {limb(1, rightLeg, true)}
      {limb(-1, leftArm, false)}
      {limb(1, rightArm, false)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial
          color="#061841"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Player(props: WorldProps) {
  const { paused, onOpen, onSecret } = props;
  const root = useRef<THREE.Group>(null),
    leftLeg = useRef<THREE.Group>(null),
    rightLeg = useRef<THREE.Group>(null),
    leftArm = useRef<THREE.Group>(null),
    rightArm = useRef<THREE.Group>(null);
  const keys = useRef(new Set<string>()),
    position = useRef<Point>({ x: 0, z: 7 }),
    velocity = useRef({ x: 0, z: 0 }),
    phase = useRef(0),
    elapsed = useRef(0),
    target = useRef<ReturnType<typeof nearestTarget>>(null);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []),
    lookTarget = useMemo(() => new THREE.Vector3(), []);
  const { camera } = useThree();
  useEffect(() => {
    position.current = { ...props.travel.position };
    velocity.current = { x: 0, z: 0 };
    keys.current.clear();
    const offset = cameraOffset(position.current);
    camera.position.set(
      position.current.x + offset.x,
      offset.y,
      position.current.z + offset.z,
    );
  }, [props.travel, camera]);
  useEffect(() => {
    if (props.paused) {
      keys.current.clear();
      velocity.current = { x: 0, z: 0 };
    }
  }, [props.paused]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        paused ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          event.target.matches("input,textarea,select,[contenteditable=true]"))
      )
        return;
      if (
        [
          "w",
          "a",
          "s",
          "d",
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
        ].includes(event.key.toLowerCase())
      ) {
        event.preventDefault();
        keys.current.add(event.key.toLowerCase());
      }
      if (
        !event.repeat &&
        ["e", "Enter"].includes(event.key) &&
        target.current &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest("button,a")
        )
      ) {
        event.preventDefault();
        if (target.current.secret) onSecret(target.current.secret);
        else if (target.current.section)
          onOpen(target.current.section, target.current.project);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const clear = () => {
      keys.current.clear();
      velocity.current = { x: 0, z: 0 };
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [paused, onOpen, onSecret]);
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const input = keys.current;
    const horizontal =
      Number(input.has("d") || input.has("arrowright")) -
      Number(input.has("a") || input.has("arrowleft")) +
      props.joystick.current.x;
    const vertical =
      Number(input.has("s") || input.has("arrowdown")) -
      Number(input.has("w") || input.has("arrowup")) +
      props.joystick.current.z;
    const direction = movementVector(
        horizontal,
        vertical,
        camera.position.x - position.current.x,
        camera.position.z - position.current.z,
      ),
      speed = 4.2;
    velocity.current.x = THREE.MathUtils.damp(
      velocity.current.x,
      props.paused ? 0 : direction.x * speed,
      12,
      delta,
    );
    velocity.current.z = THREE.MathUtils.damp(
      velocity.current.z,
      props.paused ? 0 : direction.z * speed,
      12,
      delta,
    );
    if (!props.paused)
      position.current = movePlayer(
        position.current,
        velocity.current.x * delta,
        velocity.current.z * delta,
      );
    const moving = Math.hypot(velocity.current.x, velocity.current.z);
    phase.current += moving * delta * 3;
    if (root.current) {
      root.current.position.set(
        position.current.x,
        moving > 0.1 ? Math.sin(phase.current * 2) * 0.025 : 0,
        position.current.z,
      );
      if (moving > 0.15) {
        const angle = Math.atan2(velocity.current.x, velocity.current.z);
        const diff = Math.atan2(
          Math.sin(angle - root.current.rotation.y),
          Math.cos(angle - root.current.rotation.y),
        );
        root.current.rotation.y += diff * Math.min(1, delta * 12);
      }
      const swing =
        Math.sin(phase.current) * Math.min(moving / speed, 1) * 0.55;
      if (
        leftLeg.current &&
        rightLeg.current &&
        leftArm.current &&
        rightArm.current
      ) {
        leftLeg.current.rotation.x = swing;
        rightLeg.current.rotation.x = -swing;
        leftArm.current.rotation.x = -swing * 0.65;
        rightArm.current.rotation.x = swing * 0.65;
      }
    }
    const offset = cameraOffset(position.current);
    cameraTarget.set(
      position.current.x + offset.x,
      offset.y,
      position.current.z + offset.z,
    );
    camera.position.lerp(
      cameraTarget,
      props.reducedMotion ? 1 : 1 - Math.exp(-delta * 3),
    );
    lookTarget.set(position.current.x, 0.9, position.current.z - 1);
    camera.lookAt(lookTarget);
    elapsed.current += delta;
    if (elapsed.current > 0.15) {
      elapsed.current = 0;
      props.onPosition({ ...position.current });
      const next = nearestTarget(position.current);
      if (next?.label !== target.current?.label) {
        target.current = next;
        props.onTarget(next);
      }
    }
  });
  return (
    <Avatar
      root={root}
      leftLeg={leftLeg}
      rightLeg={rightLeg}
      leftArm={leftArm}
      rightArm={rightArm}
      golden={props.golden}
    />
  );
}

function Scene(props: WorldProps) {
  const { onReady, onFailure } = props;
  const samples = useRef({ elapsed: 0, frames: 0, warmup: 0, slow: 0 });
  const { gl } = useThree();
  useFrame((_, delta) => {
    if (props.paused || props.quality === "low") return;
    const sample = samples.current;
    sample.warmup += delta;
    if (sample.warmup < 3) return;
    sample.elapsed += Math.min(delta, 0.25);
    sample.frames++;
    if (sample.elapsed > 2) {
      sample.slow = sample.frames / sample.elapsed < 28 ? sample.slow + 1 : 0;
      sample.elapsed = 0;
      sample.frames = 0;
      if (sample.slow >= 3) {
        sample.slow = 0;
        props.onPerformanceDrop();
      }
    }
  });
  useEffect(() => {
    onReady();
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onReady, onFailure]);
  return (
    <>
      <color attach="background" args={[props.night ? "#071d48" : "#b4dcf0"]} />
      <fog attach="fog" args={[props.night ? "#071d48" : "#b4dcf0", 48, 115]} />
      <hemisphereLight
        args={[
          props.night ? "#7cb6ff" : "#e3faff",
          "#527087",
          props.night ? 1.3 : 2.4,
        ]}
      />
      <directionalLight
        position={[-15, 24, 12]}
        color={props.night ? "#77b4ff" : "#fff0d1"}
        intensity={props.night ? 1 : 3}
        castShadow={props.quality === "high"}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0004}
      />
      <Ground />
      <Harbor night={props.night} reducedMotion={props.reducedMotion} />
      <Box position={[0, 0.008, 6]} scale={[4.5, 0.015, 20]} color="#dce8e9" />
      <Box position={[0, 0.008, -8]} scale={[32, 0.015, 3]} color="#dce8e9" />
      {[-5, 5].map((x) => (
        <Box
          key={x}
          position={[x, 0.025, 7]}
          scale={[0.045, 0.018, 16]}
          color="#699ac3"
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 1]}>
        <ringGeometry args={[3.1, 3.16, 64]} />
        <meshBasicMaterial color="#5392b9" transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.034, 1]}>
        <ringGeometry args={[3.5, 3.53, 64]} />
        <meshBasicMaterial color="#5392b9" transparent opacity={0.35} />
      </mesh>
      {planters.map((x) => (
        <group key={x} position={[x, 0, 9]}>
          <Box position={[0, 0.2, 0]} scale={[4, 0.4, 1.8]} color="#789aaa" />
          <Box
            position={[0, 0.41, 0]}
            scale={[3.8, 0.05, 1.6]}
            color="#669788"
          />
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={i}
              position={[-1.5 + i * 0.5, 0.64, Math.sin(i * 3) * 0.4]}
            >
              <icosahedronGeometry args={[0.34, 0]} />
              <meshStandardMaterial color={i % 2 ? "#8cbea0" : "#639c8a"} />
            </mesh>
          ))}
        </group>
      ))}
      <Building
        x={-3}
        z={-13}
        width={15}
        depth={5}
        height={5.7}
        name="02 / PROJECT LABORATORY"
        accent="#35f2ef"
      />
      <Building
        x={-17}
        z={0}
        width={10}
        depth={4}
        height={4.1}
        name="03 / WORKSHOP"
        accent="#f8e66a"
        side
      />
      <Building
        x={17}
        z={0}
        width={10}
        depth={4}
        height={5.4}
        name="04 / ARCHIVE"
        accent="#a9bbff"
        side
      />
      <Building
        x={13}
        z={-15}
        width={7}
        depth={4}
        height={7}
        name="05 / SIGNAL"
        accent="#ff8bb4"
      />
      <group position={[13, 8.2, -15]}>
        <mesh rotation={[0.5, 0, 0]}>
          <sphereGeometry
            args={[1.3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color="#b5d8e7"
            side={THREE.DoubleSide}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <Box position={[0, 0.7, 0.3]} scale={[0.08, 2, 0.08]} color="#35f2ef" />
      </group>
      <ClockTower />
      <CampusSecrets
        onDiscover={props.onSecret}
        reducedMotion={props.reducedMotion}
      />
      <group position={[7.5, 0, 8]}>
        <Box position={[0, 2, 0]} scale={[0.06, 4, 0.06]} color="#688ba4" />
        <Box
          position={[0.55, 3.2, 0]}
          scale={[1.05, 1.65, 0.04]}
          color="#103bcc"
        />
        <Sign text="BLUE HOUR" position={[0.55, 3.45, 0.025]} width={0.95} />
        <Box
          position={[0.55, 2.65, 0.03]}
          scale={[0.95, 0.025, 0.015]}
          color="#35f2ef"
        />
      </group>
      <Exhibits onOpen={props.onOpen} reducedMotion={props.reducedMotion} />
      {destinations.map((d) => (
        <Beacon
          key={d.id}
          position={d.position}
          color={d.color}
          reducedMotion={props.reducedMotion}
          onClick={() => props.onOpen(d.id)}
        />
      ))}
      <Sign text="01 / ARRIVAL COURT" position={[-4.6, 1, 7.2]} width={3.2} />
      <Box position={[-4.6, 0.48, 7]} scale={[3.4, 1, 0.4]} color="#173f6a" />
      {trees.map(([x, z]) => (
        <Tree key={`${x}:${z}`} x={x} z={z} size={x === 13 ? 1.3 : 1} />
      ))}
      {benches.map(([x, z]) => (
        <Bench key={`${x}:${z}`} x={x} z={z} rotation={z < 0 ? Math.PI : 0} />
      ))}
      {[-18, -10, 8, 18].map((x) => (
        <group key={x} position={[x, 0, 10]}>
          <Box
            position={[0, 1.7, 0]}
            scale={[0.07, 3.4, 0.07]}
            color="#527f99"
          />
          <Box
            position={[0.25, 3.4, 0]}
            scale={[0.7, 0.08, 0.18]}
            color="#c9e9f4"
          />
          <mesh position={[0.25, 3.34, 0]}>
            <planeGeometry args={[0.6, 0.12]} />
            <meshBasicMaterial color="#35f2ef" side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      <Box
        position={[0, -0.35, -1.5]}
        scale={[40.3, 0.6, 37]}
        color="#779bac"
      />
      <Player {...props} />
    </>
  );
}

function WorldCanvas(props: WorldProps) {
  return (
    <Canvas
      aria-label="Walkable coastal campus. Move with WASD or arrow keys; use the menu to browse all content."
      shadows={props.quality === "high" ? { type: THREE.PCFShadowMap } : false}
      dpr={props.quality === "high" ? [1, 1.5] : 1}
      frameloop={props.paused ? "demand" : "always"}
      camera={{ position: [9, 12, 20], fov: 43, near: 0.1, far: 160 }}
      gl={{
        antialias: props.quality === "high",
        powerPreference: "high-performance",
      }}
      fallback={<span aria-hidden="true" />}
    >
      <Scene {...props} />
    </Canvas>
  );
}

export default memo(WorldCanvas);
