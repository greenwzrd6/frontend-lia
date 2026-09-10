import { useSortable } from "@dnd-kit/sortable";

import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  index: number;
  isOverlay?: boolean;
};

export default function PlacementCard({
  entity,
  placement,
  isOverlay = false,
}: Readonly<Props>) {
  const { attributes, listeners, setNodeRef, isDragging } =
    useSortable({
      id: entity.Id,
      data: {
        type: "card",
        entityId: entity.Id,
        columnId: placement?.columnId,
      },
      disabled: isOverlay,
    });

  return (
    <article
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`
        outline my-3 py-1 px-1
        flex flex-col items-left justify-center
        select-none cursor-grab
        ${
          isDragging ? "opacity-25" : ""
        }
      `}
    >
      <h3>{entity.Title}</h3>
      <small>Entity: {entity.Id}</small>
      <small>sortKey: {placement?.sortKey}</small>
      <small>Parent: {entity?.ParentId}</small>
    </article>
  );
}
