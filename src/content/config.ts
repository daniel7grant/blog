import { defineCollection } from "astro:content";
import { postSchema } from "../types";

const posts = defineCollection({
    type: "content",
    schema: postSchema,
});

export const collections = {
    posts,
};
