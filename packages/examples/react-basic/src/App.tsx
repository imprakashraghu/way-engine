import { useState } from "react";
import { createGraph, addNode } from "core";

type Node = {
  id: string;
  position: { x: number; y: number };
  type: string;
  data: any;
  ports?: any[];
};

export default function App() {
  const [graph, setGraph] = useState(() => createGraph());

  const add = () => {
    // Build a proper Node object according to your engine types
    const newNode: Node = {
      id: "node-" + Math.random().toString(36).slice(2),
      position: { x: 150, y: 150 },
      type: "default",
      data: { label: "Hello Node" },
      ports: [] // optional but included since your structure supports it
    };

    const updatedGraph = addNode(graph, newNode);
    setGraph(updatedGraph);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>React Graph Example (Engine)</h1>

      <button onClick={add} style={{ padding: "8px 16px", fontSize: 16 }}>
        Add Node
      </button>

      <h2>Graph State</h2>
      <pre style={{ background: "#f0f0f0", padding: 20, marginTop: 20 }}>
        {JSON.stringify(graph, null, 2)}
      </pre>
    </div>
  );
}
