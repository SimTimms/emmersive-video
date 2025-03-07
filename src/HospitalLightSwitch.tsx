import { useRef, useState, useMemo, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader } from "@react-three/fiber";

import * as THREE from "three";

interface HospitalLightSwitchProps {
  lightSwitchSoundRef: HTMLAudioElement | null;
  lightIsOn: boolean;
  setLightIsOn: any;
}

function HospitalLightSwitch(props: HospitalLightSwitchProps) {
  const { setLightIsOn, lightSwitchSoundRef } = props;
  const [lightOn, setLightOn] = useState(false);
  const lightSwitchRef = useRef<any>(null);
  const hospitalLight = useLoader(
    GLTFLoader,
    "./models/hospital-room-light.glb"
  );

  const memoizedHospitalLight = useMemo(() => {
    hospitalLight.scene.traverse(function (node) {
      if (!(node instanceof THREE.Mesh)) return;
      if (node.name === "light-switch") {
        lightSwitchRef.current = node;
        node.material = new THREE.MeshStandardMaterial();
        node.material.color = new THREE.Color("#ff5e99");
        node.material.transparent = true;
        node.material.emissive = new THREE.Color("#ff5e99");
        node.material.emissiveIntensity = 0;
      }
    });
    return hospitalLight;
  }, [hospitalLight]);

  useEffect(() => {
    setLightIsOn(lightOn);
  }, [lightOn]);

  return (
    <>
      {memoizedHospitalLight.scene && (
        <primitive
          object={hospitalLight.scene}
          onPointerDown={() => {
            setLightOn((lightOn) => !lightOn);
            lightSwitchSoundRef && lightSwitchSoundRef.pause();
            lightSwitchSoundRef && (lightSwitchSoundRef.currentTime = 0);
            lightSwitchSoundRef && lightSwitchSoundRef.play();

            lightSwitchRef.current.material.color = new THREE.Color(
              lightOn ? "#ff5e99" : "#42f5a7"
            );
            lightSwitchRef.current.material.emissive = new THREE.Color(
              lightOn ? "#ff5e99" : "#42f5a7"
            );
            lightSwitchRef.current.material.emissiveIntensity = 2.5;
          }}
        />
      )}
    </>
  );
}
export default HospitalLightSwitch;
