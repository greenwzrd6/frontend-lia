import type { TaskType } from "../../types/task";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: TaskType;
  placement: PlacementType | null | undefined;
  columnId: string;
  index: number;
  isReleased?: boolean;
};

export default function DndPlacementCard({
  entity,
  columnId,
  index,
  placement,
  isReleased = false,
}: Readonly<Props>) {
  const { ref, isDropTarget, isDragging } = useSortable({
    id: entity.id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
    data: {
      type: "card",
      entityId: entity.id,
      columnId,
    },
  });

  return (
    <article
      ref={ref}
      className={`flex flex-col items-center justify-center rounded-2xl p-5 border select-none cursor-grab active:cursor-grabbing
        ${isReleased ? "bg-green-100 border-green-500" : "bg-white border-gray-200"}
        ${isDragging ? "opacity-0" : ""}
        ${isDropTarget ? "dnd-over" : ""}`}
    >
      <h3>{entity.title}</h3>
      <small>sortKey: {placement?.sortKey}</small>
      {/* <br></br>
      <small>entityId: {placement?.entityId}</small> */}
    </article>
  );
}
