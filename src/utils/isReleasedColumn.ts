import type { ColumnType } from "../types/column";

/**
 * Returns true when the column is the board's release stage. Matches the
 * column title case-insensitively ("release"/"released") so it works on any
 * board without hardcoding column ids.
 */
export function isReleasedColumn(
  column: Pick<ColumnType, "title">,
): boolean {
  const title = column.title.trim().toLowerCase();
  return title === "release" || title === "released";
}
