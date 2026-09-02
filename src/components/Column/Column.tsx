import { mockEntities } from "../../services/mockEntities";
import type { ColumnType } from "../../types/column";
import PlacementList from "../Placement/PlacementList";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType,
};

export default function Column({ column }: Readonly<Props>) {
  return (
    <section className="outline flex flex-col">
      <ColumnHeader column={column} />

      <PlacementList
        columnId={column.id}
        entities={mockEntities}
      />
    </section>
  );
}