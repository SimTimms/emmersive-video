import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  Vignette,
  EffectComposer,
  Bloom,
  Noise,
} from "@react-three/postprocessing";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function Scene() {
  const carModel = useLoader(GLTFLoader, "./models/car.glb");
  const tunnelModel = useLoader(GLTFLoader, "./models/tunnel.glb");
  const camera = useThree((state: any) => state.camera);
  const headlightsRef = useRef<any>(null);
  const brakelightsRef = useRef<any>(null);
  carModel.scene.traverse(function (node) {
    if (node.name === "headlights") {
      headlightsRef.current = node;
      //@ts-ignore
      node.material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffffff,
        emissiveIntensity: 0,
      });
    }
    if (node.name === "brakelight") {
      brakelightsRef.current = node;
      //@ts-ignore
      node.material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xff0000,
        emissiveIntensity: 0,
      });
    }
    node.castShadow = true;
  });
  tunnelModel.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.material.normalScale = { x: 0.05, y: 0.05 };
      node.material.metalnessMap = null;
      node.material.metalness = 0;
      node.receiveShadow = true;
      node.castShadow = true;
    }
  });

  const animationTime = 10;
  const actions: { [key: number]: () => void } = {
    0: () => (headlightsRef.current.material.emissiveIntensity = 0),
    5: () => {
      headlightsRef.current.material.emissiveIntensity = 10;
      brakelightsRef.current.material.emissiveIntensity = 10;
    },
  };
  useFrame(({ clock }) => {
    if (!camera) {
      return;
    }
    const elapsedTime = clock.getElapsedTime();

    // const frameDetails = frames[0].points[currentFrame];
    const time = (elapsedTime * (1 / animationTime)) % 1;
    const path = [
      new THREE.Vector3(0, 1, 4),
      new THREE.Vector3(-0.7, 1, 3),
      new THREE.Vector3(4, 0.3, -16),
    ];
    const curve = new THREE.CatmullRomCurve3(path, false, "catmullrom", 0.1);
    const position = curve.getPoint(time);
    camera.position.copy(position);
    if (actions[Math.floor(elapsedTime)]) {
      actions[Math.floor(elapsedTime)]();
    }
    // camera.lookAt(curve.getPoint((time + 0.01) % 1));
    /*
      const differenceX = Math.abs(camera.position.x - frameDetails.x);
      if (camera.position.x < frameDetails.x) {
        camera.position.x += xSpeed * differenceX;
      } else if (camera.position.x > frameDetails.x) {
        camera.position.x -= xSpeed * differenceX;
      }
      const differenceY = Math.abs(camera.position.y - frameDetails.y);
      if (camera.position.y < frameDetails.y) {
        camera.position.y += ySpeed * differenceY;
      } else if (camera.position.x > frameDetails.y) {
        camera.position.y -= ySpeed * differenceY;
      }

      const differenceZ = Math.abs(camera.position.z - frameDetails.z);
      if (camera.position.z < frameDetails.z) {
        camera.position.z += zSpeed * differenceZ;
      } else if (camera.position.z > frameDetails.z) {
        camera.position.z -= zSpeed * differenceZ;
      }

      if (
        Math.abs(differenceZ) <= 0.1 &&
        Math.abs(differenceZ) <= 0.1 &&
        Math.abs(differenceZ) <= 0.1
      ) {
        if (currentFrame + 1 === frames[0].points.length) {
          currentFrame = 0;
        } else {
          if (frames[0].actions[currentFrame]) {
            frames[0].actions[currentFrame]();
          }
          currentFrame++;
        }
      }*/
  });
  return (
    <>
      <Environment
        preset="city"
        // can be true, false or "only" (which only sets the background) (default: false)
        backgroundBlurriness={0.07} // optional blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        environmentIntensity={0.005} // optional environment light intensity (default: 1)
        backgroundIntensity={200}
        background={true}
      />
      <EffectComposer>
        <Vignette eskil={false} offset={0.1} darkness={1.5} />
        <Bloom luminanceThreshold={0.1} mipmapBlur />
        <Noise opacity={0.02} />
      </EffectComposer>

      {/*  <Perf position="top-right" />*/}
      <group position={[5, 0.5, -7]} rotation={[0, Math.PI / 0.54, 0]}>
        {carModel.scene && (
          <primitive
            object={carModel.scene}
            castShadow={true}
            receiveShadow={true}
          />
        )}
      </group>
      {tunnelModel.scene && (
        <primitive
          object={tunnelModel.scene}
          castShadow={true}
          receiveShadow={true}
          scale={2}
          position={[0, -0.7, 0]}
          rotation={[0, Math.PI / 3, 0]}
        />
      )}
      <ambientLight intensity={0.1} />
      <directionalLight
        position={[-40, 3, -10]}
        castShadow
        intensity={1.3}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        color={0x66aaff}
      />

      <OrbitControls />
    </>
  );
}
export default Scene;
