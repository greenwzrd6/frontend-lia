import type { EntityType } from "../../types/entity";
import type { PlacementType } from "../../types/placement";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  entity: EntityType;
  placement: PlacementType | null | undefined;
  index: number;
};

export default function PlacementCard({
  entity,
  placement,
  index
}: Readonly<Props>) {

const { ref } = useSortable({
  id: entity.Id,
  index,
  group: placement?.columnId,
  type: "card",
  accept: "card",

  data: {
    type: "card",
    entityId: entity.Id,
    columnId: placement?.columnId,
  },
});

  return (
    <article
      ref={ref}
      className="bg-white rounded-2xl p-5 m-1 border border-gray-200"
    >
      <h3>{entity.Title}</h3>
      <small>Entity: {entity.Id}</small>
      <small>sortKey: {placement?.sortKey}</small>
      {/* <small>Parent: {entity?.ParentId}</small> */}
    </article>
  );
}