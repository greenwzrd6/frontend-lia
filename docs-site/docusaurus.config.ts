import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Kanban Frontend',
  tagline: 'React front-end for the Kanban board (LIA)',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Local dev server URL. Change when deploying (e.g. GitHub Pages) and
  // adjust baseUrl to '/<projectName>/' if the site is served from a sub-path.
  url: 'http://localhost:3000',
  baseUrl: '/',

  onBrokenLinks: 'throw',

  // Parse .md as CommonMark and .mdx as MDX, so literal braces/tags in
  // generated TypeDoc output (e.g. GET /api/boards/{id}) are not treated
  // as JSX expressions.
  markdown: {
    format: 'detect',
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Generates the API reference from TSDoc comments in ../src into docs/api
    // as part of `docusaurus start` / `docusaurus build`.
    [
      'docusaurus-plugin-typedoc',
      {
        entryPoints: ['../src'],
        entryPointStrategy: 'expand',
        tsconfig: '../tsconfig.app.json',
        // Renames "default" exports to their file name (see the plugin file).
        plugin: ['./typedoc-plugins/rename-defaults.cjs'],
        exclude: ['**/tests/**', '**/test/**', '**/*.test.*'],
        excludePrivate: true,
        excludeInternal: true,
        readme: 'none',
        sidebar: {
          pretty: true,
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Kanban Frontend',
      logo: {
        alt: 'Kanban Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/api',
          label: 'API',
          position: 'left',
        },
        {
          href: 'https://github.com/greenwzrd6/frontend-lia',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/',
            },
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'API Reference',
              to: '/api',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/greenwzrd6/frontend-lia',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Kanban LIA. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
