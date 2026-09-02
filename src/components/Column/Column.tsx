import { useColumns } from "../../hooks/useColumns";
import type { Entity as EntityType } from "../../types/entity";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  entities: EntityType[];
  getPlacements: () => Promise<void>;
};
export default function Column({
  entities,
  getPlacements,
}: Readonly<Props>) {
  const { data: columns = [] } = useColumns();

  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);

  return (
    <section className="outline flex flex-col">
      {sortedColumns.map((column) => {

        return (
          <>
            <ColumnHeader column={column} />

            <PlacementList
              columnId={column.id}
              entities={entities}
              getPlacements={getPlacements}
            />
          </>
        );
      })}
    </section>
  );
}
