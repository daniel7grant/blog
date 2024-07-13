import { z } from "astro:content";

export const blogTitle = "grant's blog";

export const categoryNames = ["frontend", "backend", "devops"] as const;

export type Category = (typeof categoryNames)[number];

export type CategoryData = {
    name: string;
    color: { dark: string; light: string };
};

export const categories: Record<Category, CategoryData> = {
    frontend: {
        name: "Frontend",
        color: { dark: "0, 216, 255", light: "0, 158, 187" },
    },
    backend: {
        name: "Backend",
        color: { dark: "32, 128, 128", light: "0, 128, 128" },
    },
    devops: {
        name: "Devops",
        color: { dark: "29, 99, 237", light: "29, 99, 237" },
    },
};

export const postSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    category: z.enum(["frontend", "backend", "devops"]),
});

export type Post = z.infer<typeof postSchema>;

export type LayoutData = Partial<Post> & {
    title: string;
};
