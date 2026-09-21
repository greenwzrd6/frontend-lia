import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function ColumnEdgeCreator() {
  return (
    <div
      className="border rounded-2xl bg-white"
      style={{ height: "80%", width: "80%" }}
    >
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
