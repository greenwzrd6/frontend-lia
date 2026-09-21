import type { NodeProps } from "@xyflow/react";

export default function BoardGroup({ data }: NodeProps) {
  return (
    <div className="size-full rounded-lg border-2 border-gray-400">
      <div className="absolute left-4 top-2 text-md">{String(data.label)}</div>
    </div>
  );
}
