import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'introduction',
    {
      type: 'category',
      label: 'Core Model',
      items: [
        'core/graph-model',
        'core/node-model',
        'core/port-model',
        'core/edge-model',
      ],
    },
    {
      type: 'category',
      label: 'Engine Systems',
      items: [
        'engine/events',
        'engine/selection',
        'engine/history',
        'engine/commands',
      ],
    },
    {
      type: 'category',
      label: 'Interaction Systems',
      items: [
        'interactions/overview',
        'interactions/drag',
        'interactions/marquee',
        'interactions/hit-testing',
        'interactions/keyboard',
      ],
    },
    {
      type: 'category',
      label: 'Serialization',
      items: ['serialization/json-serialization'],
    },
  ],
};

export default sidebars;
