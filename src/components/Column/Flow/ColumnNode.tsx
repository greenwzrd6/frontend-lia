import { Handle, Position } from "@xyflow/react";

export function ColumnNode() {
  return (
    <div className="react-flow__node-default cursor-default">
      <Handle
        position={Position.Bottom}
        type="source"
        className="!w-2.5 !h-2.5 !border !border-gray-500 !bg-white"
      />
      <Handle
        position={Position.Top}
        type="target"
        className="!w-2.5 !h-2.5 !border !border-gray-500 !bg-white"
      />
      Custom Node
    </div>
  );
}
