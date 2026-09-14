import type { EntityType } from "../../types/entity";
import type { ColumnType } from "../../types/column";
import type { PlacementType } from "../../types/placement";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";
import { useDroppable } from "@dnd-kit/react";
import { useColumn } from "../../hooks/useColumn";

type Props = {
  column: ColumnType;
  boardId: string;
  entities: EntityType[];
};

export default function Column({
  column,
  boardId,
  entities,
}: Readonly<Props>) {

  const { data: columnData = [], isLoading, isError } = useColumn(
    column,
    boardId,
    {
      enabled: !!column && !!boardId,
    },
  );

  const { ref } = useDroppable({
    id: column.id,
    accept: "card",
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <section ref={ref} className="flex flex-col w-75 hover:bg-gray-100">
      <ColumnHeader column={column} />

      <PlacementList
        column={column}
        placements={columnData}
        entities={entities}
        boardId={boardId}
      />
    </section>
  );
}
