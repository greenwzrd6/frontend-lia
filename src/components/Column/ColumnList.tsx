import type { Column as ColumnType } from "../../types/column";
import type { Entity as EntityType } from "../../types/entity";
import type { Placement as PlacementType } from "../../types/placement";
import Column from "./Column";
import EntityColumnMock from "./EntityColumnMock";

type Props = {
  columns: ColumnType[];
  placements: PlacementType[];
  entities: EntityType[];
  reloadPlacements: () => Promise<void>;
};

export default function ColumnList({
  columns,
  placements,
  entities,
  reloadPlacements,
}: Readonly<Props>) {
  return (
    <div className="flex justify-evenly">
      <EntityColumnMock entities={entities}/>
      {columns.map((column) => {
        const columnPlacements = placements.filter(
          (placement) => placement.columnId === column.id,
        );

        return (
          <Column
            key={column.id}
            column={column}
            placements={columnPlacements}
            entities={entities}
            reloadPlacements={reloadPlacements}
          />
        );
      })}
    </div>
  );
}
