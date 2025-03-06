import { OrbitControls } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader, useFrame } from "@react-three/fiber";
import { Vignette, EffectComposer, Bloom } from "@react-three/postprocessing";
//import { Perf } from "r3f-perf";
import * as THREE from "three";
import { SoftShadows, useAnimations, Html } from "@react-three/drei";
import { Environment } from "@react-three/drei";

interface HospitalSceneProps {
  setSceneNbr: any;
  sceneNbr: number;
  videoRef: HTMLVideoElement | null;
  audioRef: HTMLAudioElement | null;
  buzzingRef: HTMLAudioElement | null;
  lightSwitchSoundRef: HTMLAudioElement | null;
  currentStep: number;
  setCurrentStep: any;
}

function HospitalScene(props: HospitalSceneProps) {
  const {
    videoRef,
    audioRef,
    currentStep,
    setCurrentStep,
    buzzingRef,
    lightSwitchSoundRef,
  } = props;
  const lightRef = useRef<any>(null);
  const lightSwitchRef = useRef<any>(null);
  const lightModelRef = useRef<any>(null);
  const lightsOn = useRef<any>(null);
  const carModel = useLoader(
    GLTFLoader,
    "./models/hospital-room.glb",
    (loader) => {
      loader.manager.onLoad = () => {
        if (videoRef) {
          videoRef.play();
        }
      };
    }
  );

  const doctor = useLoader(GLTFLoader, "./models/doctor.glb", (loader) => {});
  const hospitalLight = useLoader(
    GLTFLoader,
    "./models/hospital-room-light.glb",
    (loader) => {}
  );
  const doctorAnimations = useAnimations(doctor.animations, doctor.scene);

  useEffect(() => {
    if (!doctorAnimations) return;

    const action = doctorAnimations.actions["Take 001"];
    if (action) action.play();
  }, [doctorAnimations]);

  carModel.scene.traverse(function (node) {
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

      THREE.MeshBasicMaterial.prototype.copy.call(node.material, prevMaterial);
    } else if (node.name === "floor") {
      const prevMaterial = node.material;
      prevMaterial.color = new THREE.Color("hsl(200, 30%, 70%)");
      node.receiveShadow = true;

      node.material = new THREE.MeshStandardMaterial();
      THREE.MeshBasicMaterial.prototype.copy.call(node.material, prevMaterial);
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
      THREE.MeshBasicMaterial.prototype.copy.call(node.material, prevMaterial);
    }
    //node.castShadow = true;
    //node.receiveShadow = true;
  });

  doctor.scene.traverse(function (node) {
    if (!(node instanceof THREE.Mesh)) return;

    node.castShadow = true;
  });
  const hospitalLightMemo = useMemo(() => {
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
  }, [hospitalLight]);

  hospitalLightMemo;

  useFrame(({ clock }, delta) => {
    if (lightRef.current && lightsOn.current) {
      if (lightRef.current.intensity < 5.5) {
        lightRef.current.intensity += delta * 5;
      }
      if (lightModelRef.current.material.emissiveIntensity < 5.5) {
        lightModelRef.current.material.emissiveIntensity += delta;
      }
    } else if (lightRef.current && !lightsOn.current) {
      if (lightRef.current.intensity > 2.2) {
        lightRef.current.intensity -= delta * 5;
      }
      if (lightModelRef.current.material.emissiveIntensity > 0.8) {
        lightModelRef.current.material.emissiveIntensity -= delta * 3;
      }
    }

    if (currentStep === 1) {
      if (
        lightSwitchRef.current &&
        lightSwitchRef.current.material.opacity !== 0.5
      ) {
        lightSwitchRef.current.material.opacity = 0.5;
        lightSwitchRef.current.material.emissiveIntensity = 2.5;
      }
    }
  });

  return (
    <>
      <EffectComposer>
        <Vignette eskil={false} offset={0.015} darkness={1.0} />
        <Bloom luminanceThreshold={0.025} />
      </EffectComposer>
      <SoftShadows size={10} focus={1} samples={20} />
      {/*<Perf position="top-right" />*/}

      <Environment
        preset="forest"
        // can be true, false or "only" (which only sets the background) (default: false)
        environmentIntensity={0.8} // optional environment light intensity (default: 1)
        background={true} // optional background (default: true)
        backgroundBlurriness={0.5}
      />
      {/*
      <mesh
        rotation={[0, -Math.PI / 1.72, 0]}
        position={[0.9, 0.85, -0.35]}
        scale={0.06}
      >
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial emissive={"white"}>
          {videoRef && (
            <>
              <videoTexture
                attach="map"
                args={[videoRef]}
                colorSpace={THREE.SRGBColorSpace}
              />
              <videoTexture
                attach="emissiveMap"
                args={[videoRef]}
                colorSpace={THREE.SRGBColorSpace}
              />
            </>
          )}
        </meshStandardMaterial>
      </mesh>
*/}
      <group position={[0, 0, 0]} rotation={[0, -Math.PI / 1.2, 0]} scale={0.5}>
        {carModel.scene && <primitive object={carModel.scene} />}
        {hospitalLight.scene && (
          <primitive
            object={hospitalLight.scene}
            onPointerDown={() => {
              const areLightsOn = lightsOn.current;
              lightsOn.current = !areLightsOn;
              lightSwitchSoundRef && lightSwitchSoundRef.pause();
              lightSwitchSoundRef && (lightSwitchSoundRef.currentTime = 0);
              lightSwitchSoundRef && lightSwitchSoundRef.play();

              !areLightsOn && buzzingRef && buzzingRef.play();
              areLightsOn && buzzingRef && buzzingRef.pause();
              lightSwitchRef.current.material.color = new THREE.Color(
                areLightsOn ? "#ff5e99" : "#42f5a7"
              );
              lightSwitchRef.current.material.emissive = new THREE.Color(
                areLightsOn ? "#ff5e99" : "#42f5a7"
              );
              lightSwitchRef.current.material.emissiveIntensity = 2.5;
              setCurrentStep(2);
            }}
          />
        )}
        {doctor.scene && (
          <primitive
            object={doctor.scene}
            scale={0.5}
            position={[0, 1.5, -1]}
            rotation={[0, -Math.PI / 1.6, 0]}
          />
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
      </group>

      <ambientLight intensity={0.5} />

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
      {/*
      <FirstPersonControls
        makeDefault
        activeLook={true}
        autoForward={false}
        constrainVertical={true}
        enabled={true}
        heightCoef={1}
        heightMax={0.2}
        heightMin={0.2}
        heightSpeed={false}
        lookVertical={true}
        lookSpeed={0.15}
        movementSpeed={1}
        verticalMax={Math.PI}
        verticalMin={0}
      />
      */}

      <OrbitControls />
    </>
  );
}
export default HospitalScene;
