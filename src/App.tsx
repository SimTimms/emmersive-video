import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import Scene from "./Scene";

function App() {
  useEffect(() => {});
  return (
    <div className="background">
      <Canvas
        className="canvas"
        camera={{ position: [0, 1, 4], far: 1400 }}
        shadows
      >
        <Scene />
      </Canvas>
    </div>
  );
}
export default App;
