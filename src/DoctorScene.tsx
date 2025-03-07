import { useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { useAnimations } from "@react-three/drei";

function DoctorScene() {
  const doctor = useLoader(GLTFLoader, "./models/doctor.glb", () => {});
  const doctorAnimations = useAnimations(doctor.animations, doctor.scene);

  useEffect(() => {
    if (!doctorAnimations) return;

    const action = doctorAnimations.actions["Take 001"];
    if (action) action.play();
  }, [doctorAnimations]);

  doctor.scene.traverse(function (node) {
    if (!(node instanceof THREE.Mesh)) return;
    node.castShadow = true;
  });

  return (
    <>
      {doctor.scene && (
        <primitive
          object={doctor.scene}
          scale={0.5}
          position={[0, 1.5, -1]}
          rotation={[0, -Math.PI / 1.6, 0]}
        />
      )}
    </>
  );
}
export default DoctorScene;
