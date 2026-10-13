"use client";
import { AlchemyDiscoveries } from "./AlchemyDiscoveries";
import { CoastalWorld } from "./CoastalWorld";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { AvatarModel } from "./AvatarModel";
import { WorldAnimation, useWorldFrame } from "./WorldAnimation";
import {
  CampusBuilding,
  CampusTree,
  CampusBench,
  CampusClock,
  CampusGround,
  DetailBox,
} from "./CampusArchitecture";
import { CampusLighting, WorldEffects } from "./CampusLighting";
import { RenderAudit } from "./RenderAudit";
import { bindMovementKeys } from "@/lib/game/input";
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

const Box = DetailBox;

function Sign({
  text,
  position,
  width = 4,
  color = "#bdfcff",
  background = "#082d66",
  rotation = 0,
  twoSided = true,
}: {
  text: string;
  position: [number, number, number];
  width?: number;
  color?: string;
  background?: string;
  rotation?: number;
  twoSided?: boolean;
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
      <meshBasicMaterial
        map={texture}
        side={twoSided ? THREE.DoubleSide : THREE.FrontSide}
      />
    </mesh>
  );
}

const Tree = CampusTree;
const Bench = CampusBench;

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
    <CampusBuilding
      x={x}
      z={z}
      width={width}
      depth={depth}
      height={height}
      accent={accent}
      side={side}
    >
      <Sign
        text={name}
        position={[0, height * 0.9, depth / 2 + 0.17]}
        width={Math.min(width - 1, 6)}
        color={accent}
      />
    </CampusBuilding>
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
  useWorldFrame((time) => {
    if (ring.current && !reducedMotion) ring.current.rotation.z = time * 0.5;
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
  useWorldFrame((time) => {
    if (sculpture.current && !reducedMotion)
      sculpture.current.rotation.y = time * 0.18;
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
          <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.73, 0.14, 48]} />
            <meshStandardMaterial color="#c5b69b" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.61, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.47, 0.58, 1.02, 48]} />
            <meshStandardMaterial
              color="#1b3a49"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.06, 48]} />
            <meshStandardMaterial
              color="#6b9697"
              roughness={0.23}
              metalness={0.5}
            />
          </mesh>
          <mesh position={[0, 1.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.58, 0.62, 64]} />
            <meshStandardMaterial
              color={e.color}
              emissive={e.color}
              emissiveIntensity={2.2}
            />
          </mesh>
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

const Ground = CampusGround;

const waterVertex = `uniform float uTime; varying vec2 vUv; varying vec3 vWorld;
void main(){vUv=uv;vec3 p=position;p.z+=sin(p.x*.48+uTime*.6)*.035+sin(p.y*.7-uTime*.4)*.025;vWorld=(modelMatrix*vec4(p,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`;
const waterFragment = `uniform float uTime; uniform vec3 uColor; varying vec2 vUv; varying vec3 vWorld;
void main(){
float ripple=sin(vWorld.x*2.4+sin(vWorld.z*1.1)+uTime*.55)*sin(vWorld.z*3.1-uTime*.45);
vec3 normal=normalize(vec3(cos(vWorld.x*.48+uTime*.6)*.08,1.,sin(vWorld.z*.7-uTime*.4)*.065));
vec3 view=normalize(cameraPosition-vWorld);float fresnel=pow(1.-max(dot(view,normal),0.),3.);
vec3 color=mix(uColor,vec3(.38,.5,.49),fresnel*.7);
color+=vec3(.08,.13,.12)*smoothstep(.78,.99,ripple)*(.2+fresnel);
gl_FragColor=vec4(color,1.);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`;

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
      uColor: { value: new THREE.Color("#2c7788") },
    }),
    [],
  );
  useWorldFrame((time) => {
    if (material.current) {
      material.current.uniforms.uTime.value = reducedMotion ? 0 : time;
      material.current.uniforms.uColor.value.set(night ? "#12334b" : "#2c7788");
    }
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.55, 0]}>
        <planeGeometry args={[320, 320, 96, 96]} />
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
      <Sign
        text="MAKE SOMETHING THAT MATTERS."
        position={[-8, 2.1, -20]}
        width={7.5}
        twoSided={false}
      />
      <Sign
        text="MAKE SOMETHING THAT MATTERS."
        position={[-8, 2.1, -20.025]}
        width={7.5}
        rotation={Math.PI}
        twoSided={false}
      />
    </>
  );
}

const ClockTower = CampusClock;

function CampusSecrets({
  onDiscover,
  reducedMotion,
}: {
  onDiscover: (id: SecretId) => void;
  reducedMotion: boolean;
}) {
  const tail = useRef<THREE.Mesh>(null);
  useWorldFrame((time) => {
    if (tail.current && !reducedMotion)
      tail.current.rotation.z = Math.sin(time * 5) * 0.2;
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
          <sphereGeometry args={[0.4, 24, 16]} />
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
          <sphereGeometry args={[0.28, 24, 16]} />
          <meshToonMaterial color="#f5fbff" />
        </mesh>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.92, 0.29]} rotation={[0, 0, -x]}>
            <coneGeometry args={[0.12, 0.28, 12]} />
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
          <torusGeometry args={[0.2, 0.065, 12, 32, Math.PI * 1.6]} />
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

function Player(props: WorldProps) {
  const { paused, onOpen, onSecret } = props;
  const root = useRef<THREE.Group>(null);
  const animationSpeed = useRef(0);
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
      animationSpeed.current = 0;
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
    const clear = () => {
      keys.current.clear();
      velocity.current = { x: 0, z: 0 };
    };
    const unbindMovement = bindMovementKeys(
      window,
      keys.current,
      () => !paused,
      clear,
    );
    window.addEventListener("keydown", down);
    document.addEventListener("visibilitychange", clear);
    return () => {
      unbindMovement();
      window.removeEventListener("keydown", down);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [paused, onOpen, onSecret]);
  useWorldFrame((_, delta) => {
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
    const previousX = position.current.x,
      previousZ = position.current.z;
    if (!props.paused)
      position.current = movePlayer(
        position.current,
        velocity.current.x * delta,
        velocity.current.z * delta,
      );
    const moving =
      delta > 0
        ? Math.hypot(
            position.current.x - previousX,
            position.current.z - previousZ,
          ) / delta
        : 0;
    animationSpeed.current = props.paused ? 0 : moving;
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
    lookTarget.set(position.current.x, 1.65, position.current.z - 1);
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
  }, -1);
  return (
    <AvatarModel
      root={root}
      speed={animationSpeed}
      golden={props.golden}
      reducedMotion={props.reducedMotion}
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
      <CampusLighting night={props.night} quality={props.quality} />
      <Ground />
      <CoastalWorld night={props.night} onDiscover={props.onSecret} />
      <Harbor night={props.night} reducedMotion={props.reducedMotion} />
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
          <Box position={[0, 0.2, 0]} scale={[4, 0.4, 1.8]} color="#cbbda2" />
          <Box
            position={[0, 0.41, 0]}
            scale={[3.8, 0.05, 1.6]}
            color="#454d35"
          />
          {Array.from({ length: 7 }, (_, i) => (
            <mesh
              key={i}
              position={[-1.5 + i * 0.5, 0.64, Math.sin(i * 3) * 0.4]}
            >
              <sphereGeometry args={[0.34, 16, 12]} />
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
      <AlchemyDiscoveries
        onDiscover={props.onSecret}
        reducedMotion={props.reducedMotion}
      >
        <Sign
          text="? / AFTER HOURS"
          position={[0, 1.53, 0.48]}
          width={1.7}
          color="#ffe1a1"
          background="#143446"
        />
      </AlchemyDiscoveries>
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
        <Tree
          key={`${x}:${z}`}
          x={x}
          z={z}
          size={x === 13 ? 1.3 : 1}
          reducedMotion={props.reducedMotion}
        />
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
      <Player {...props} />
      <WorldEffects quality={props.quality} />
      <RenderAudit quality={props.quality} />
    </>
  );
}

function WorldCanvas(props: WorldProps) {
  return (
    <Canvas
      aria-label="Walkable coastal campus. Move with WASD or arrow keys; use the menu to browse all content."
      shadows={
        props.quality === "high" ? { type: THREE.PCFSoftShadowMap } : false
      }
      dpr={props.quality === "high" ? [1, 1.5] : 1}
      frameloop={props.paused ? "demand" : "always"}
      camera={{ position: [6.3, 5.8, 16.8], fov: 45, near: 0.1, far: 170 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        powerPreference: "high-performance",
      }}
      fallback={<span aria-hidden="true" />}
    >
      <Suspense fallback={null}>
        <WorldAnimation paused={props.paused}>
          <Scene {...props} />
        </WorldAnimation>
      </Suspense>
    </Canvas>
  );
}

export default memo(WorldCanvas);
