import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  columnId: string;
  index: number;
  disabled: boolean;
};

export default function DndPlacementCard({
  entity,
  columnId,
  index,
  // placement,
  disabled,
}: Readonly<Props>) {
  const { ref, isDropTarget, isDragging } = useSortable({
    id: entity.Id,
    index,
    group: columnId,
    type: "card",
    accept: "card",
    disabled,
    data: {
      type: "card",
      entityId: entity.Id,
      columnId,
    },
  });

  return (
    <article
      ref={ref}
      className={`flex flex-row items-center justify-center h-30 bg-white rounded-2xl p-5 m-1 border border-gray-200
        ${isDragging ? "opacity-0" : ""}
        ${disabled ? "opacity-25 cursor-not-allowed" : "cursor-grab"}
        ${isDropTarget ? "dnd-over" : ""}`}
    >
      <h3>{entity.Title}</h3>
      {/* <small>sortKey: {placement?.sortKey}</small>
      <br></br>
      <small>entityId: {placement?.entityId}</small> */}
    </article>
  );
}
