import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimations } from "@react-three/drei";

function LowResScene() {
  const cubeMap = useLoader(GLTFLoader, "./models/cubeMap.glb", () => {});

  cubeMap.scene.traverse(function (node) {
    if (!(node instanceof THREE.Mesh)) return;
    const prevMaterial = node.material;
    node.material = new THREE.MeshBasicMaterial();
    THREE.MeshBasicMaterial.prototype.copy.call(node.material, prevMaterial);
    node.castShadow = false;
    node.receiveShadow = false;
  });
  return (
    <>
      {cubeMap.scene && (
        <primitive
          object={cubeMap.scene}
          scale={2}
          position={[0, 2.02, 0]}
          rotation={[0, 0, 0]}
        />
      )}
    </>
  );
}
export default LowResScene;
