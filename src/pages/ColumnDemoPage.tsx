import { useState, useEffect } from "react";
import { getColumnsByBoardId } from "../services/columnApi";

import type { Column as ColumnType } from "../types/column";
import ColumnList from "../components/Column/ColumnList";

const DEMO_BOARD_ID = "00000000-0000-0000-0000-000000000001";

export default function ColumnDemoPage() {
  const [columns, setColumns] = useState<ColumnType[]>([]);

  useEffect(() => {
    async function load() {
      const result = await getColumnsByBoardId(DEMO_BOARD_ID);

      setColumns(result);
    }
    load();
  }, []);

  return (
    <main>
      <h1>Column Demo</h1>

      <ColumnList columns={columns} />
    </main>
  );
}
