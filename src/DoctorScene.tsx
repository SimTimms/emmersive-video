import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useAnimations } from "@react-three/drei";

function DoctorScene() {
  const [doctorModel, setDoctorModel] = useState<any>(null);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "./models/doctor.glb",
      (gltf) => {
        setDoctorModel(gltf);
      },
      undefined,
      (error) => console.error(error)
    );
  }, []);

  const doctorAnimations = useAnimations(
    doctorModel?.animations || [],
    doctorModel?.scene
  );

  useEffect(() => {
    if (!doctorAnimations) return;

    const action = doctorAnimations.actions["Take 001"];
    if (action) action.play();
  }, [doctorAnimations]);

  useEffect(() => {
    if (!doctorModel) return;

    doctorModel.scene.traverse(function (node: any) {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = true;
    });
  }, [doctorModel]);

  return (
    <>
      {doctorModel && (
        <primitive
          object={doctorModel.scene}
          scale={0.5}
          position={[0, 1.5, -1]}
          rotation={[0, -Math.PI / 1.6, 0]}
        />
      )}
    </>
  );
}
export default DoctorScene;
