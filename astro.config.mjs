import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
    integrations: [preact()],
    markdown: {
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
    },
});
