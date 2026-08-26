/**
 * GLTF 模型深拷贝工具
 *
 * 用于实例化多个相同的机器人模型时，正确复制 SkinnedMesh 及其 Skeleton 绑定关系，
 * 避免共享同一个几何体/材质导致的冲突。
 *
 * 从旧版 minigame-demo/AR/loaders/gltf-clone.js 移植。
 */

export default function cloneGltf(gltf: any, THREE: any) {
  const clone: any = {
    animations: gltf.animations,
    scene: gltf.scene.clone(true),
  };

  const skinnedMeshes: Record<string, any> = {};

  gltf.scene.traverse((node: any) => {
    if (node.isSkinnedMesh) {
      skinnedMeshes[node.name] = node;
    }
  });

  const cloneBones: Record<string, any> = {};
  const cloneSkinnedMeshes: Record<string, any> = {};

  clone.scene.traverse((node: any) => {
    if (node.isBone) {
      cloneBones[node.name] = node;
    }
    if (node.isSkinnedMesh) {
      cloneSkinnedMeshes[node.name] = node;
    }
  });

  for (const name in skinnedMeshes) {
    const skinnedMesh = skinnedMeshes[name];
    const skeleton = skinnedMesh.skeleton;
    const cloneSkinnedMesh = cloneSkinnedMeshes[name];

    const orderedCloneBones: any[] = [];
    for (let i = 0; i < skeleton.bones.length; ++i) {
      const cloneBone = cloneBones[skeleton.bones[i].name];
      orderedCloneBones.push(cloneBone);
    }

    cloneSkinnedMesh.bind(
      new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
      cloneSkinnedMesh.matrixWorld
    );
  }

  return clone;
}
