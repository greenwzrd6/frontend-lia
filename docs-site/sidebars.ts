import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Generated into docs/api/ by docusaurus-plugin-typedoc when
// `docusaurus start` / `docusaurus build` runs (see docusaurus.config.ts).
// Exports the sidebar item array directly.
import typedocSidebar from './docs/api/typedoc-sidebar.cjs';

const sidebars: SidebarsConfig = {
  docs: [
    'introduction',
    'getting-started',
    {
      type: 'category',
      label: 'API',
      link: {
        type: 'doc',
        id: 'api/index',
      },
      items: typedocSidebar,
    },
  ],
};

export default sidebars;
