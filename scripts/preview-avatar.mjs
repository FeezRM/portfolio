/** Local-only visual review of the shipped GLB. Run after build; --clean removes its generated pages. */
import { mkdir, copyFile, writeFile, unlink, rmdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const workspace = resolve(import.meta.dirname, ".."),
  review = join(workspace, "out", "avatar-review");
const copies = [
  ["build/three.module.js", "three.module.js"],
  ["build/three.core.js", "three.core.js"],
  ["examples/jsm/loaders/GLTFLoader.js", "loaders/GLTFLoader.js"],
  ["examples/jsm/utils/BufferGeometryUtils.js", "utils/BufferGeometryUtils.js"],
  ["examples/jsm/utils/SkeletonUtils.js", "utils/SkeletonUtils.js"],
];
if (process.argv.includes("--clean")) {
  // Delete only this utility's known generated files, never the build or workspace itself.
  for (const file of ["index.html", ...copies.map(([, file]) => file)])
    await unlink(join(review, file)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  for (const folder of ["loaders", "utils", ""])
    await rmdir(join(review, folder)).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  process.exit(0);
}
await mkdir(join(review, "loaders"), { recursive: true });
await mkdir(join(review, "utils"), { recursive: true });
for (const [from, to] of copies)
  await copyFile(
    join(workspace, "node_modules", "three", from),
    join(review, to),
  );
await writeFile(
  join(review, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Faiz / Avatar review</title>
<style>*{box-sizing:border-box}body{margin:0;background:#0d2239;color:#e5eff3;font-family:system-ui,sans-serif}header{position:fixed;top:32px;left:34px;z-index:2;pointer-events:none}small{font:10px monospace;color:#83c8cf;letter-spacing:.12em}h1{font-size:28px;margin:9px 0 0;font-weight:600}canvas{display:block;width:100vw;height:100vh}nav{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2}button{background:#183c52;color:#dce7e9;border:1px solid #456572;padding:10px 18px;font:11px monospace;cursor:pointer}button:hover,button[aria-pressed=true]{color:#102d3d;background:#9bf4e6;border-color:#9bf4e6}#status{position:fixed;right:30px;bottom:30px;font:10px monospace;color:#91b3c2}</style>
<header><small>BLUE HOUR / CHARACTER STUDY</small><h1>Faiz Kerawala.</h1></header><nav aria-label="Character review"><button data-view="full" aria-pressed="true">Full body</button><button data-view="face">Face</button><button data-view="side">Three-quarter</button><button id="motion" aria-pressed="false">Walk</button><button id="gold" aria-pressed="false">Gold outfit</button></nav><output id="status" role="status">Loading rigged avatar…</output>
<script type="importmap">{"imports":{"three":"./three.module.js"}}</script><script type="module">
import * as THREE from 'three'; import {GLTFLoader} from './loaders/GLTFLoader.js';
const scene = new THREE.Scene(); scene.background = new THREE.Color('#0d2239');
const camera = new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.05,50);
const renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05; document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight('#d9eff5','#3a4149',2.4)); const key=new THREE.DirectionalLight('#ffe4c1',3);key.position.set(-3,4,5);scene.add(key);const rim=new THREE.DirectionalLight('#65c6db',1.4);rim.position.set(3,2,-3);scene.add(rim);
const ground=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshStandardMaterial({color:'#17374c',roughness:.9}));ground.rotation.x=-Math.PI/2;ground.position.y=-.012;scene.add(ground);
const views={full:[[0,1.18,3.65],[0,1.06,0]],face:[[0,1.82,1.1],[0,1.8,0]],side:[[2.1,1.35,3.2],[0,1.1,0]]};let current='full';
function view(name){current=name;camera.position.set(...views[name][0]);camera.lookAt(...views[name][1]);document.querySelectorAll('[data-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.view===name)))}view('full');
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>view(button.dataset.view)));
let mixer,walk,idle,isWalking=false,isGold=false;
new GLTFLoader().load('/models/faiz-blue-hour.glb?v=likeness-review',gltf=>{scene.add(gltf.scene);mixer=new THREE.AnimationMixer(gltf.scene);idle=mixer.clipAction(gltf.animations.find(clip=>clip.name==='Idle'));walk=mixer.clipAction(gltf.animations.find(clip=>clip.name==='Walk'));idle.play();document.querySelector('#status').textContent='17 bones / Idle + Walk';document.querySelector('#gold').addEventListener('click',event=>{isGold=!isGold;gltf.scene.traverse(node=>{if(node.isMesh&&node.material.name==='jacket')node.material.color.set(isGold?'#c1a353':'#17222c')});event.currentTarget.setAttribute('aria-pressed',String(isGold))});},undefined,error=>document.querySelector('#status').textContent=String(error));
document.querySelector('#motion').addEventListener('click',event=>{if(!mixer)return;isWalking=!isWalking;(isWalking?idle:walk).stop();(isWalking?walk:idle).reset().play();event.currentTarget.setAttribute('aria-pressed',String(isWalking))});
let last=performance.now();renderer.setAnimationLoop(now=>{const delta=Math.min((now-last)/1000,.05);last=now;mixer?.update(delta);renderer.render(scene,camera)});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);view(current)});
</script></html>`,
);
console.log(
  "Review the actual shipped model at http://127.0.0.1:3000/avatar-review/index.html; clean with node scripts/preview-avatar.mjs --clean.",
);
