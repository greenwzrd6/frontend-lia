import type { Column as ColumnType } from "../../types/column";
import ColumnHeader from "./ColumnHeader";

type Props = {
  column: ColumnType;
};
export default function Column({ column }: Readonly<Props>) {
  return (
    <section>
      <ColumnHeader column={column} />
        
      <div>Placement area.</div>
    </section>
  );
}
