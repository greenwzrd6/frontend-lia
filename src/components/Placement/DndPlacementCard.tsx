import type { TaskType } from "../../types/task";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: TaskType;
  placement: PlacementType | null | undefined;
  columnId: string;
  index: number;
};

export default function DndPlacementCard({
  entity,
  columnId,
  index,
  placement,
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
      className={`flex flex-col items-center justify-center bg-white rounded-2xl p-5 border border-gray-200 select-none cursor-grab active:cursor-grabbing
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
