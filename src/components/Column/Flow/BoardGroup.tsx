import type { NodeProps } from "@xyflow/react";

export default function BoardGroup({ data }: NodeProps) {
  return (
    <div className="size-full rounded-lg border-2 border-gray-400 cursor-default">
      <div className="absolute -top-7 text-lg">{String(data.label)}</div>
    </div>
  );
}
