import type { Config } from '@docusaurus/types';
import type { ThemeConfig } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Nexus Encryption Docs',
  tagline: 'Enterprise-grade crypto, desktop-first.',
  url: 'https://jasonteixeira.github.io',
  baseUrl: '/NexusEncryption/',
  trailingSlash: false,
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  organizationName: 'JasonTeixeira',
  projectName: 'NexusEncryption',
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          routeBasePath: '/',
          editUrl: 'https://github.com/JasonTeixeira/NexusEncryption/edit/main/docs/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      } satisfies ThemeConfig,
    ],
  ],
  markdown: { mermaid: true },
  themesConfig: {},
};

export default config;


