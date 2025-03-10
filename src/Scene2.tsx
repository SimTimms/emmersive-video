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

interface Scene2Props {
  setSceneNbr: any;
  sceneNbr: number;
  videoRef: HTMLVideoElement;
}
function Scene2(props: Scene2Props) {
  const { setSceneNbr, sceneNbr, videoRef } = props;
  const path = [new THREE.Vector3(0.5, 0, 4), new THREE.Vector3(0.1, 0, 4)];

  const carModel = useLoader(GLTFLoader, "./models/car-low.glb", (loader) => {
    loader.manager.onLoad = () => {
      videoRef.play();
    };
  });
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
      node.material.roughness = 0.2;
      node.material.metalness = 0.7;
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
    if (videoRef) {
      if (videoRef.currentTime / videoRef.duration >= 1 && sceneNbr === 0) {
        setSceneNbr(1);
      }
      const position = curve.getPoint(videoRef.currentTime / videoRef.duration);
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

      <Environment
        preset="city"
        // can be true, false or "only" (which only sets the background) (default: false)
        environmentIntensity={0.8} // optional environment light intensity (default: 1)
        background={true} // optional background (default: true)
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
        position={[0, 1.2, -10]}
        rotation={[0.5, -Math.PI / 0.7, 0]}
        scale={5.5}
      >
        {carModel.scene && <primitive object={carModel.scene} />}
        <group>
          <mesh
            position={[0, -0.7, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.7} />
          </mesh>
        </group>
      </group>

      <ambientLight intensity={10} />
      <directionalLight
        position={[-4, 5, 10]}
        castShadow
        intensity={0.3}
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-camera-left={-100}
        shadow-camera-right={200}
        color={"white"}
      />

      <OrbitControls />
    </>
  );
}
export default Scene2;
