import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
};

export default function PlacementCard({ entity, placement }: Readonly<Props>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: entity.id,
      data: {
        entityId: entity.id,
        columnId: placement?.columnId,
      },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="outline my-3 py-1 px-1 flex flex-col items-center justify-center cursor-grab"
    >
      <h3>{entity.title}</h3>

      <small>Entity: {entity.id}</small>

      <small>sortKey: {placement?.sortKey}</small>
    </article>
  );
}
