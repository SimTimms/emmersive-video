import { Canvas } from "@react-three/fiber";
import { use, useEffect, useRef, useState } from "react";
import Scene from "./Scene";
import url from "./assets/car.mp4";
import url2 from "./assets/car2.mp4";
import * as THREE from "three";

function App() {
  const ref = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<HTMLVideoElement | null>(null);
  const [path, setPath] = useState<any[] | null>(null);
  const [sceneNbr, setSceneNbr] = useState<number>(0);

  const path1 = [new THREE.Vector3(0.5, 0, 4), new THREE.Vector3(0.1, 0, 4)];
  const path2 = [
    new THREE.Vector3(1.0, 1.6, -3),
    new THREE.Vector3(1.5, 1.6, -3),
  ];

  const paths = [path1, path2];
  useEffect(() => {
    if (ref.current) {
      setVideoState(ref.current);
    }
  }, [videoState]);

  useEffect(() => {
    setPath(paths[sceneNbr]);
    if (ref.current && sceneNbr > 0) {
      ref.current.src = url2;
    }
  }, [sceneNbr]);

  return (
    <div className="background">
      <video src={`${url}`} muted className="video-full" ref={ref} autoPlay />
      <Canvas
        className="canvas"
        camera={{ fov: 35, position: [0, 0, 4], far: 400 }}
        shadows
      >
        {path && (
          <Scene
            video={videoState}
            path={path}
            setSceneNbr={setSceneNbr}
            sceneNbr={sceneNbr}
          />
        )}
      </Canvas>
    </div>
  );
}
export default App;
