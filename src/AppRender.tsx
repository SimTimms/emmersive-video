import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { View, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import AppRenderScene from "./AppRenderScene";
import { Vignette, EffectComposer, Bloom } from "@react-three/postprocessing";

const cameraHeight = 0.6;
const partSize = "200px";
function AppRender() {
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  const [cubeTexture, setCubeTexture] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const buzzingRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (buzzingRef.current) {
      buzzingRef.current.volume = 0.025;
    }
  }, [buzzingRef.current]);

  useEffect(() => {
    if (!audioRef.current || audioLoaded) return;
    setAudioLoaded(true);
  }, [audioRef.current]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const view1Ref = useRef<HTMLDivElement>(null);
  const view2Ref = useRef<HTMLDivElement>(null);
  const view3Ref = useRef<HTMLDivElement>(null);
  const view4Ref = useRef<HTMLDivElement>(null);
  const view5Ref = useRef<HTMLDivElement>(null);
  const view6Ref = useRef<HTMLDivElement>(null);
  const viewPart = (rotation: any, ref: any) => {
    return (
      <div
        style={{
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          width: partSize,
          height: partSize,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "101%",
            height: "100%",
          }}
          ref={ref}
        >
          <PerspectiveCamera
            position={[0, cameraHeight, 0]}
            rotation={rotation}
            zoom={1}
            fov={90}
            makeDefault
          />
          <AppRenderScene />
        </View>
      </div>
    );
  };

  const getCanvasTexture = () => {
    // Get the canvas element

    if (!canvasRef.current) return null;

    const context = canvasRef.current.getContext("webgl2");
    if (!context) return;
    // Clear the canvas

    const image = new Image();

    // Assign the canvas content as the source of the image
    image.src = canvasRef.current.toDataURL();
    image.width = 400;
    image.height = 300;

    const textureArr: any[] = [];
    const offSets = [
      [0.75, 0.334, 0],
      [0.25, 0.334, 0],
      [0.5, 0.66666, -Math.PI * 0.5],
      [0.251, 0.334, Math.PI * 0.5],
      [0.5, 0.334, 0],
      [0.0, 0.334, 0],
    ];
    for (let i = 0; i < 6; i++) {
      const texture = new THREE.Texture(image);
      texture.repeat.set(0.25, 0.33);
      texture.offset.set(offSets[i][0], offSets[i][1]);
      texture.rotation = offSets[i][2];
      const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
      texture.needsUpdate = true;
      textureArr.push(newMaterial);
    }

    setCubeTexture(textureArr);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: "0vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => {
        getCanvasTexture();
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        Cube Map
        <Canvas
          className="canvas"
          eventSource={container.current || undefined}
          shadows
          ref={canvasRef}
          gl={{ preserveDrawingBuffer: true }}
          style={{
            width: 800,
            height: 600,
            border: "1px solid rgba(255,255,255,0.3)",
            position: "absolute",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 20px 0 rgba(0,0,0,0.5)",
          }}
        >
          <View.Port />
        </Canvas>
      </div>
      <div
        style={{
          display: "flex",
          position: "relative",
          flexDirection: "column",
        }}
      >
        <Canvas
          className="canvas"
          shadows
          style={{
            top: "calc(100vh - 600px)",
            left: "0vw",
            width: 800,
            height: 600,
            border: "1px solid rgba(255,255,255,0.3)",
            backdropFilter: "blur(20px)",
            zIndex: 100,
            boxShadow: "0 0 20px 0 rgba(0,0,0,0.5)",
          }}
        >
          <mesh scale={13}>
            <boxGeometry args={[1, 1, 1]} />
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[0]}
                attach="material-0"
                side={THREE.BackSide}
                transparent
              />
            )}
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[1]}
                attach="material-1"
                transparent
                side={THREE.BackSide}
              />
            )}
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[2]}
                attach="material-2"
                transparent
                side={THREE.BackSide}
              />
            )}
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[3]}
                attach="material-3"
                transparent
                side={THREE.BackSide}
              />
            )}
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[4]}
                attach="material-4"
                transparent
                side={THREE.BackSide}
              />
            )}
            {cubeTexture && (
              <meshStandardMaterial
                {...cubeTexture[5]}
                attach="material-5"
                transparent
                side={THREE.BackSide}
              />
            )}
          </mesh>
          <ambientLight intensity={3.5} />
          <EffectComposer>
            <Bloom luminanceThreshold={0.015} />
          </EffectComposer>
          <OrbitControls />
        </Canvas>
        asdsad
      </div>
      <main
        ref={container}
        style={{
          background: "transparent",
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          alignContent: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                position: "relative",
                width: partSize,
                height: partSize,
              }}
            ></div>
            {viewPart([Math.PI * 0.5, 0, Math.PI * 0.5], view1Ref)}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            {viewPart([0, 0, 0], view2Ref)}
            {viewPart([0, -Math.PI * 0.5, 0], view3Ref)}
            {viewPart([0, -Math.PI * 1.0, 0], view4Ref)}
            {viewPart([0, -Math.PI * 1.5, 0], view5Ref)}
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                position: "relative",
                width: partSize,
                height: partSize,
              }}
            ></div>
            {viewPart([-Math.PI * 0.5, 0, -Math.PI * 0.5], view6Ref)}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AppRender;
