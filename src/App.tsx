import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import lightson from "./assets/lights-on.mp3";
import buzzing from "./assets/buzzing.mp3";
import lightSwitch from "./assets/light-switch.mp3";
import HospitalEquipmentScene from "./HospitalEquipment";
import { OrbitControls } from "@react-three/drei";
import { Vignette, EffectComposer, Bloom } from "@react-three/postprocessing";
import { Perf } from "r3f-perf";
import { SoftShadows, Html } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import GUI from "lil-gui";

const HospitalLightSwitch = lazy(() => import("./HospitalLightSwitch"));
const DoctorScene = lazy(() => import("./DoctorScene"));
const HospitalScene = lazy(() => import("./HospitalScene"));

function App() {
  const [sceneNbr, setSceneNbr] = useState<number>(0);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buzzingRef = useRef<HTMLAudioElement>(null);
  const lightSwitchRef = useRef<HTMLAudioElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [gameConfig, setGameConfig] = useState({
    equipment: true,
    doctor: true,
    lightSwitch: true,
    room: true,
    environment: false,
    effects: false,
    softShadows: false,
  });

  const gui = useMemo(() => {
    const gui = new GUI();

    const debugFolder = gui.addFolder("Debug");
    debugFolder.add(gameConfig, "equipment").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, equipment: value });
    });
    debugFolder.add(gameConfig, "doctor").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, doctor: value });
    });
    debugFolder.add(gameConfig, "lightSwitch").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, lightSwitch: value });
    });
    debugFolder.add(gameConfig, "room").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, room: value });
    });
    debugFolder.add(gameConfig, "environment").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, environment: value });
    });
    debugFolder.add(gameConfig, "effects").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, effects: value });
    });
    debugFolder.add(gameConfig, "softShadows").onChange((value: boolean) => {
      setGameConfig({ ...gameConfig, softShadows: value });
    });
  }, []);

  useEffect(() => {
    if (buzzingRef.current) {
      buzzingRef.current.volume = 0.025;
    }
  }, [buzzingRef.current]);

  useEffect(() => {
    if (!audioRef.current || audioLoaded) return;
    setAudioLoaded(true);
  }, [audioRef.current]);

  const memoizedHospitalScene = useMemo(() => {
    return (
      <HospitalScene
        setSceneNbr={setSceneNbr}
        sceneNbr={sceneNbr}
        audioRef={audioRef.current}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        isLightOn={isLightOn}
      />
    );
  }, [
    sceneNbr,
    currentStep,
    audioRef.current,
    buzzingRef.current,
    lightSwitchRef.current,
    isLightOn,
  ]);

  const memoizedHospitalEquipmentScene = useMemo(() => {
    return <HospitalEquipmentScene />;
  }, []);

  const memoizedDoctorScene = useMemo(() => {
    return <DoctorScene />;
  }, []);

  const memoizedHospitalLightSwitch = useMemo(() => {
    return (
      <HospitalLightSwitch
        lightIsOn={false}
        setLightIsOn={setIsLightOn}
        lightSwitchSoundRef={lightSwitchRef.current}
      />
    );
  }, [lightSwitchRef.current]);

  return (
    <div className="background">
      <audio ref={audioRef} src={lightson} />
      <audio ref={buzzingRef} src={buzzing} loop />
      <audio ref={lightSwitchRef} src={lightSwitch} />
      <Canvas
        className="canvas"
        camera={{ fov: 45, position: [0, 2.8, -5], far: 800 }}
        shadows
      >
        {gameConfig.effects && (
          <EffectComposer>
            <Vignette eskil={false} offset={0.015} darkness={1.0} />
            <Bloom luminanceThreshold={0.025} />
          </EffectComposer>
        )}
        {gameConfig.softShadows && (
          <SoftShadows size={10} focus={1} samples={20} />
        )}
        <Perf position="top-left" />

        {gameConfig.environment && (
          <Environment
            preset="forest"
            // can be true, false or "only" (which only sets the background) (default: false)
            environmentIntensity={0.8} // optional environment light intensity (default: 1)
            background={true} // optional background (default: true)
            backgroundBlurriness={0.5}
          />
        )}

        <ambientLight intensity={0.5} />
        <group
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 1.2, 0]}
          scale={0.5}
        >
          <Suspense fallback={null}>
            {audioRef.current && gameConfig.room && memoizedHospitalScene}
          </Suspense>
          <Suspense
            fallback={<Html style={{ background: "red" }}>loading...</Html>}
          >
            {gameConfig.equipment && memoizedHospitalEquipmentScene}
          </Suspense>
          <Suspense fallback={null}>
            {gameConfig.doctor && memoizedDoctorScene}
          </Suspense>
          <Suspense fallback={null}>
            {gameConfig.lightSwitch && memoizedHospitalLightSwitch}
          </Suspense>
        </group>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;
