import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { blogDescription, blogTitle, blogUrl } from "../types";

export const GET: APIRoute = async function (context) {
    const posts = await getCollection("posts");
    return rss({
        title: blogTitle,
        description: blogDescription,
        site: context.site ?? blogUrl,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/posts/${post.slug}/`,
        })),
        customData: `<language>en-gb</language>`,
    });
};
