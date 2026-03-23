import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { postSchema } from "./types";

const posts = defineCollection({
    loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/posts" }),
    schema: postSchema,
});

export const collections = {
    posts,
};
