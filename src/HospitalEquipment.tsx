import { useState, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function HospitalEquipmentScene() {
  const [equipmentModel, setEquipmentModel] = useState<any>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "./models/hospital-equipment.glb",
      (gltf) => setEquipmentModel(gltf.scene),
      undefined,
      (error) => console.error(error)
    );
  }, []);

  return equipmentModel && <primitive object={equipmentModel} />;
}

export default HospitalEquipmentScene;
