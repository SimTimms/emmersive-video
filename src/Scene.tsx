import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader, useThree, useFrame } from "@react-three/fiber";
import {
  Vignette,
  EffectComposer,
  Bloom,
  Noise,
} from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface SceneProps {
  video: HTMLVideoElement | null;
  path: THREE.Vector3[];
  setSceneNbr: any;
  sceneNbr: number;
}
function Scene(props: SceneProps) {
  const { video, path, setSceneNbr, sceneNbr } = props;

  const carModel = useLoader(GLTFLoader, "./models/car-low.glb");
  const tunnelModel = useLoader(GLTFLoader, "./models/tunnel.glb");
  const camera = useThree((state: any) => state.camera);
  const chassisRef = useRef<any>(null);
  const headlightsRef = useRef<any>(null);
  const brakelightsRef = useRef<any>(null);
  const [carColour, setCarColour] = useState<any>("hsl(0, 0%, 100%)");

  carModel.scene.traverse(function (node) {
    if (node.name === "headlights") {
      headlightsRef.current = node;
      //@ts-ignore
      node.material = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xffffff,
      });
    }
    if (node.name === "chassis" && node instanceof THREE.Mesh) {
      chassisRef.current = node;
      node.material.color.set(carColour);
      node.material.roughness = 1.2;
      node.material.metalness = 0.8;
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

    const curve = new THREE.CatmullRomCurve3(path, false, "catmullrom", 0.1);
    chassisRef.current.material.color.set(
      `hsl(${(Math.sin(elapsedTime * 0.2) * 180 + 180) % 360}, 100%, 50%)`
    );
    if (video) {
      if (video.currentTime / video.duration >= 1 && sceneNbr === 0) {
        setSceneNbr(1);
      }
      const position = curve.getPoint(video.currentTime / video.duration);
      camera.position.copy(position);
      camera.lookAt(position.x, position.y, position.z);
    }

    if (actions[Math.floor(elapsedTime)]) {
      actions[Math.floor(elapsedTime)]();
    }
  });
  return (
    <>
      <EffectComposer>
        <Vignette eskil={false} offset={0.025} darkness={1.5} />
        <Bloom luminanceThreshold={0.1} mipmapBlur />
        <Noise opacity={0.02} />
      </EffectComposer>

      <Perf position="top-right" />

      <Environment
        preset="forest"
        // can be true, false or "only" (which only sets the background) (default: false)
        environmentIntensity={0.8} // optional environment light intensity (default: 1)
      />

      {/*
      <mesh rotation={[0, 0, 0]} position={[0, 10, -10.1]} scale={2}>
        <planeGeometry args={[10.2, 20.2]} />
        <meshStandardMaterial emissive={"white"} side={THREE.DoubleSide}>
          <videoTexture
            attach="map"
            args={[video]}
            colorSpace={THREE.SRGBColorSpace}
          />
          <videoTexture
            attach="emissiveMap"
            args={[video]}
            colorSpace={THREE.SRGBColorSpace}
          />
        </meshStandardMaterial>
      </mesh>
      */}
      <group
        position={[0, -2.2, -5]}
        rotation={[0, -Math.PI / 0.5, 0]}
        scale={0.5}
      >
        {carModel.scene && <primitive object={carModel.scene} />}
      </group>

      <group>
        <mesh
          position={[0, -2.3, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1, 1, 1]}
          receiveShadow
        >
          <planeGeometry args={[100, 100]} />
          <shadowMaterial opacity={0.8} />
        </mesh>
      </group>
      <ambientLight intensity={10} />
      <directionalLight
        position={[-4, 12, -40]}
        castShadow
        intensity={0.3}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        color={"white"}
      />

      <OrbitControls />
    </>
  );
}
export default Scene;
