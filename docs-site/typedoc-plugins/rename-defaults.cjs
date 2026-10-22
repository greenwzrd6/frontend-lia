/**
 * TypeDoc documents default exports under the name "default", so React
 * components declared as `export default function DndBoard(...)` show up in
 * the API reference as "Function: default()".
 *
 * TypeDoc has no built-in option to change this (see TypeStrong/typedoc#1460),
 * so this tiny plugin renames any reflection named "default" to the base name
 * of the file it is declared in (DndBoard.tsx -> DndBoard). This matches the
 * component's real name in every file in this project.
 *
 * Wired up via the `plugin` option in docusaurus.config.ts.
 */
const path = require("path");

exports.load = function ({ application }) {
  application.converter.on("end", (context) => {
    const renameDefaults = (reflections) => {
      for (const reflection of reflections ?? []) {
        if (reflection.name === "default") {
          const file = reflection.sources?.[0]?.fileName;
          if (file) {
            const name = path.basename(file, path.extname(file));
            reflection.name = name;
            // The signature keeps its own name (used in "default(props)").
            for (const signature of reflection.signatures ?? []) {
              signature.name = name;
            }
          }
        }
        renameDefaults(reflection.children);
      }
    };

    renameDefaults(context.project?.children);
  });
};
