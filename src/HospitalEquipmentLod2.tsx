import { useState, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function HospitalEquipmentLod2Scene() {
  const [equipmentModel, setEquipmentModel] = useState<any>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "./models/hospital-equipment-lod-2.glb",
      (gltf) => setEquipmentModel(gltf.scene),
      undefined,
      (error) => console.error(error)
    );
  }, []);

  return equipmentModel && <primitive object={equipmentModel} />;
}

export default HospitalEquipmentLod2Scene;
