import { useRef, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface HospitalSceneProps {
  setSceneNbr: any;
  sceneNbr: number;
  audioRef: HTMLAudioElement | null;
  currentStep: number;
  setCurrentStep: any;
  isLightOn: boolean;
}

function HospitalScene(props: HospitalSceneProps) {
  const { audioRef, currentStep, setCurrentStep, isLightOn } = props;
  const lightRef = useRef<any>(null);
  const lightModelRef = useRef<any>(null);
  const hospitalModel = useLoader(GLTFLoader, "./models/hospital-room.glb");

  const memoizedHospitalScene = useMemo(() => {
    hospitalModel.scene.traverse(function (node) {
      if (!(node instanceof THREE.Mesh)) return;
      if (
        node.name === "wall-1" ||
        node.name === "wall-2" ||
        node.name === "wall-3" ||
        node.name === "wall-4"
      ) {
        const prevMaterial = node.material;
        prevMaterial.color = new THREE.Color("hsl(200, 30%, 70%)");
        prevMaterial.transparent = true;
        prevMaterial.opacity = 0;
        node.material = new THREE.MeshStandardMaterial();

        THREE.MeshBasicMaterial.prototype.copy.call(
          node.material,
          prevMaterial
        );
      } else if (node.name === "floor") {
        const prevMaterial = node.material;
        prevMaterial.color = new THREE.Color("hsl(200, 30%, 70%)");
        node.receiveShadow = true;

        node.material = new THREE.MeshStandardMaterial();
        THREE.MeshBasicMaterial.prototype.copy.call(
          node.material,
          prevMaterial
        );
      } else if (node.name === "roof-lights") {
        node.material = new THREE.MeshStandardMaterial();
        node.material.color = new THREE.Color("white");
        node.material.transparent = true;
        node.material.opacity = 0.5;
        node.material.emissive = new THREE.Color("white");
        node.material.emissiveIntensity = 0;
        lightModelRef.current = node;
      } else if (node.name === "window") {
        node.material = new THREE.MeshStandardMaterial();
        node.material.color = new THREE.Color("hsl(200, 10%, 10%)");
        node.material.transparent = true;
        node.material.opacity = 0.45;
        node.material.metalness = 4.0;
        node.material.roughness = 0.1;
      } else {
        const prevMaterial = node.material;
        node.material = new THREE.MeshStandardMaterial();
        THREE.MeshBasicMaterial.prototype.copy.call(
          node.material,
          prevMaterial
        );
      }
    });
    return hospitalModel;
  }, [hospitalModel]);

  useFrame((_, delta) => {
    if (lightRef.current && isLightOn) {
      if (lightRef.current.intensity < 5.5) {
        lightRef.current.intensity += delta * 5;
      }
      if (lightModelRef.current.material.emissiveIntensity < 5.5) {
        lightModelRef.current.material.emissiveIntensity += delta;
      }
    } else if (lightRef.current && !isLightOn) {
      if (lightRef.current.intensity > 2.2) {
        lightRef.current.intensity -= delta * 5;
      }
      if (lightModelRef.current.material.emissiveIntensity > 0.8) {
        lightModelRef.current.material.emissiveIntensity -= delta * 3;
      }
    }
  });

  return (
    <>
      {memoizedHospitalScene.scene && (
        <primitive object={memoizedHospitalScene.scene} />
      )}

      {currentStep === 0 && (
        <group
          position={[0.4, 1.4, -0.8]}
          rotation={[0, -Math.PI / 0.5, 0]}
          scale={0.5}
        >
          <Html>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                backdropFilter: "blur(20px)",
                padding: 10,
                color: "#fff",
                textAlign: "center",
                boxShadow: "10px 10px 10px 0 rgba(0,0,0,0.2)",
                width: "20vh",
              }}
              onPointerDown={() => {
                audioRef && audioRef.play();
                setCurrentStep(1);
              }}
            >
              <b>Task:</b> <br />
              Talk to Dr Vandergraff
            </div>
          </Html>
        </group>
      )}
      {currentStep === 1 && (
        <group
          position={[-2.4, 1.4, 0.8]}
          rotation={[0, -Math.PI / 0.5, 0]}
          scale={0.5}
        >
          <Html>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                backdropFilter: "blur(20px)",
                padding: 10,
                color: "#fff",
                textAlign: "center",
                boxShadow: "10px 10px 10px 0 rgba(0,0,0,0.2)",
                width: "20vh",
              }}
              onPointerDown={() => {
                audioRef && audioRef.play();
                setCurrentStep(1);
              }}
            >
              <b>Task:</b> <br />
              Turn on Operating Lights
            </div>
          </Html>
        </group>
      )}

      <directionalLight
        ref={lightRef}
        position={[-0.1, 0.8, -0.1]}
        castShadow
        intensity={0.8}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
      />
    </>
  );
}
export default HospitalScene;
