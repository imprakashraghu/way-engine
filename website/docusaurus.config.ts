import type { Config } from '@docusaurus/types';

const config: Config = {
  title: 'Open Flow',
  tagline: 'A modular graph + interaction engine',
  url: 'https://your-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',

  organizationName: 'Open Flow',
  projectName: 'openFlow',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Open Flow',
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/imprakashraghu/way-engine',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
  },
};

export default config;
