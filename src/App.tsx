import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, lazy, Suspense, useMemo } from "react";
import url from "./assets/hospital.mp4";
import lightson from "./assets/lights-on.mp3";
import buzzing from "./assets/buzzing.mp3";
import lightSwitch from "./assets/light-switch.mp3";

const HospitalScene = lazy(() => import("./HospitalScene"));

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sceneNbr, setSceneNbr] = useState<number>(0);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buzzingRef = useRef<HTMLAudioElement>(null);
  const lightSwitchRef = useRef<HTMLAudioElement>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = () => {
        setVideoLoaded(true);
      };
    }
  }, [videoRef.current]);

  useEffect(() => {
    if (audioRef.current) {
      setVideoLoaded(true);
    }
  }, [audioRef.current]);

  useEffect(() => {
    if (buzzingRef.current) {
      buzzingRef.current.volume = 0.025;
    }
  }, [buzzingRef.current]);

  const memoizedHospitalScene = useMemo(() => {
    return (
      <HospitalScene
        setSceneNbr={setSceneNbr}
        sceneNbr={sceneNbr}
        videoRef={videoRef.current}
        audioRef={audioRef.current}
        buzzingRef={buzzingRef.current}
        lightSwitchSoundRef={lightSwitchRef.current}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    );
  }, [
    sceneNbr,
    currentStep,
    videoRef.current,
    audioRef.current,
    buzzingRef.current,
    lightSwitchRef.current,
  ]);

  return (
    <div className="background">
      <audio ref={audioRef} src={lightson} />
      <audio ref={buzzingRef} src={buzzing} loop />
      <audio ref={lightSwitchRef} src={lightSwitch} />
      <video
        src={`${url}`}
        muted
        className="video-full"
        ref={videoRef}
        loop
        style={{ display: "none" }}
      />
      <Canvas
        className="canvas"
        camera={{ fov: 45, position: [0, 2.8, -5], far: 800 }}
        shadows
      >
        <Suspense fallback={null}>
          {sceneNbr === 0 &&
            videoRef.current &&
            audioRef.current &&
            memoizedHospitalScene}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
