import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cameraOffset } from "../lib/game/world.ts";

const file = readFileSync(
  new URL("../public/models/faiz-blue-hour.glb", import.meta.url),
);
const jsonSize = file.readUInt32LE(12);
const gltf = JSON.parse(file.subarray(20, 20 + jsonSize).toString("utf8"));
const binaryOffset = 28 + jsonSize;
function accessorValues(index) {
  const accessor = gltf.accessors[index],
    view = gltf.bufferViews[accessor.bufferView];
  const width = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }[
    accessor.type
  ];
  const size = { 5121: 1, 5123: 2, 5125: 4, 5126: 4 }[accessor.componentType];
  const read = {
    5121: "readUInt8",
    5123: "readUInt16LE",
    5125: "readUInt32LE",
    5126: "readFloatLE",
  }[accessor.componentType];
  const start =
    binaryOffset + (view.byteOffset || 0) + (accessor.byteOffset || 0);
  return Array.from({ length: accessor.count }, (_, row) =>
    Array.from({ length: width }, (_, column) =>
      file[read](
        start + row * (view.byteStride || width * size) + column * size,
      ),
    ),
  );
}

test("shipped avatar is a self-contained GLB with a bound rig and resolvable idle/walk animation", () => {
  assert.equal(file.readUInt32LE(0), 0x46546c67);
  assert.equal(file.readUInt32LE(4), 2);
  assert.equal(file.readUInt32LE(8), file.length);
  assert.ok(file.length < 1.2 * 1024 * 1024);
  assert.ok(gltf.buffers.every((buffer) => !buffer.uri));
  assert.deepEqual(
    gltf.animations.map((a) => a.name),
    ["Idle", "Walk"],
  );
  assert.ok(gltf.skins[0].joints.length >= 15);
  for (const animation of gltf.animations) {
    assert.ok(animation.channels.length > 1);
    for (const channel of animation.channels) {
      assert.ok(gltf.nodes[channel.target.node]);
      const sampler = animation.samplers[channel.sampler];
      const times = accessorValues(sampler.input).flat();
      assert.equal(times[0], 0);
      assert.ok(times.at(-1) > 0);
      assert.ok(accessorValues(sampler.output).flat().every(Number.isFinite));
    }
  }
});

test("skin weights are normalized and reference valid joints across the full exported mesh", () => {
  const meshes = gltf.nodes.filter((node) => node.skin !== undefined);
  assert.ok(meshes.length >= 5);
  for (const node of meshes)
    for (const primitive of gltf.meshes[node.mesh].primitives) {
      const weights = accessorValues(primitive.attributes.WEIGHTS_0);
      const joints = accessorValues(primitive.attributes.JOINTS_0);
      weights.forEach((weight, index) => {
        assert.ok(Math.abs(weight.reduce((a, b) => a + b, 0) - 1) < 0.0001);
        assert.ok(weight.every((value) => value >= 0 && value <= 1));
        joints[index].forEach((joint) =>
          assert.ok(joint < gltf.skins[node.skin].joints.length),
        );
      });
    }
});

test("courtyard camera stays close while eastern destinations are viewed from the open plaza", () => {
  const arrival = cameraOffset({ x: 0, z: 7 });
  assert.ok(arrival.y < 7 && arrival.y > 4);
  const archive = cameraOffset({ x: 13, z: 2 });
  assert.ok(
    archive.x < 0,
    "archive wall should be behind the camera direction",
  );
  const offsets = Array.from({ length: 51 }, (_, i) =>
    cameraOffset({ x: 8 + i * 0.12, z: -9 - i * 0.1 }),
  );
  offsets.forEach((offset, index) => {
    assert.ok(Object.values(offset).every(Number.isFinite));
    if (index) assert.ok(Math.abs(offset.y - offsets[index - 1].y) < 0.4);
  });
});
