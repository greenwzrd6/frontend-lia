import { Handle, Position, type NodeProps } from "@xyflow/react";

/**
 * Custom `@xyflow/react` node type (`columnNode`): a default-styled node
 * showing the column title (`data.label`) with a bottom source handle and a
 * top target handle so edges can connect between columns.
 */
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
