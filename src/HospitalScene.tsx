import { useRef, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HospitalSceneProps {
  audioRef: HTMLAudioElement | null;
  isLightOn: boolean;
}

function HospitalScene(props: HospitalSceneProps) {
  const { isLightOn } = props;
  const lightRef = useRef<any>(null);
  const lightModelRef = useRef<any>(null);
  const [hospitalModel, setHospitalModel] = useState<any>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "./models/hospital-room.glb",
      (gltf) => setHospitalModel(gltf.scene),
      undefined,
      (error) => console.error(error)
    );
  }, []);

  useEffect(() => {
    if (!hospitalModel) return;
    hospitalModel.traverse(function (node: any) {
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
        prevMaterial.opacity = 1;
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

  return hospitalModel && <primitive object={hospitalModel} />;
}
export default HospitalScene;
