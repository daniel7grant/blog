import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
    site: "https://danielgrants.com",
    integrations: [sitemap()],
    markdown: {
        rehypePlugins: [
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "append",
                },
            ],
        ],
    },
});
