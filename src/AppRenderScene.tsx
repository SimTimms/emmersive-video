import { useRef, useState, useMemo } from "react";
import { Environment } from "@react-three/drei";
import HospitalScene from "./HospitalScene";
import HospitalLightSwitch from "./HospitalLightSwitch";
import DoctorScene from "./DoctorScene";
import HospitalEquipmentScene from "./HospitalEquipment";
import HospitalEquipmentLod2Scene from "./HospitalEquipmentLod2";
import HospitalEquipmentLod3Scene from "./HospitalEquipmentLod3";
import { Vignette, EffectComposer, Bloom } from "@react-three/postprocessing";
function AppRenderScene() {
  return (
    <>
      <Environment
        preset="city"
        // can be true, false or "only" (which only sets the background) (default: false)
        environmentIntensity={0.8} // optional environment light intensity (default: 1)
        background={false} // optional background (default: true)
        backgroundBlurriness={0.5}
      />

      <ambientLight intensity={0.5} />
      <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={0.5}>
        <HospitalScene audioRef={null} isLightOn={true} />
        <HospitalEquipmentScene />
        <HospitalEquipmentLod2Scene />
        <HospitalEquipmentLod3Scene />
        <DoctorScene />
      </group>
    </>
  );
}

export default AppRenderScene;
