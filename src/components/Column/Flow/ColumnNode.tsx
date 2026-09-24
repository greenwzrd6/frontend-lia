import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ColumnNode({ data }: NodeProps) {
  return (
    <div className="react-flow__node-default cursor-default">
      {String(data.label)}

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
    </div>
  );
}
