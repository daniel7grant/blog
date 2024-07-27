---
title: "How I made my blog"
description: "I always wanted a blog to publish my thoughts and rants, like yelling into the abyss, until it yells right back."
category: webdev
pubDate: 2024-07-27
---

> _I created this blog_<br /> _To feel some control_

I always wanted a blog to publish my thoughts and rants, like yelling into the abyss, until it yells right back. I had some ideas what to do, and how to do it, but I never had the motivation to put together one.

Until this week.

I've read the blog post [Microfeatures I Love in Blogs and Personal Websites](https://danilafe.com/blog/blog_microfeatures/) by Daniel (and the corresponding [Hacker News discussion](https://news.ycombinator.com/item?id=40774277)), and it really kicked me over the edge to implement some features I'd like to see in my blog.

Naturally, I started by compiling a laundry list of features that I want my blog to have.

## The laundry list

As always, I cracked open a new note in my favourite note app (Obsidian), and put together a checklist for the features. My most important feature for my blog was to be able to write it with Markdown. [^editor] This way I'd have a simple workflow of putting together drafts in Obsidian and when all's good I could publish it (copy paste to my repository and commit it).

[^editor]: I worked on tons of Wordpress sites, and I still wouldn't consider using the Gutenberg editor to pen up a single post.

Apart from a Markdown editor, I only had some faint ideas about my blog. I love minimalist designs, so I'd preferably just design over the HTML elements that Markdown spits out. Nevertheless I want it to have neat typography, and be viewable in both dark and light themes. Finally it needs to be accessible with the keyboard and even without any JS. [^404]

[^404]: And of course it should have a fun Easter Egg for the 404 page. Find it for yourself!

After reading through [Microfeatures I Love in Blogs and Personal Websites](https://danilafe.com/blog/blog_microfeatures/) and the [Hacker News comments](https://news.ycombinator.com/item?id=40774277), this list grew with quite a few elements:

-   [sidenotes](#sidenotes): this is the main one, I recently read [Crafting Interpreters](https://craftinginterpreters.com/) and I fell in love with the sidenotes there. [^even]
-   [linkable headings](#linkable-headings): important for accessibility and even more to being able to link to interesting parts of articles.
-   rss feed, sitemap and printing layout: apparently people still use RSS readers and printers, and it is important to maintain as big audience as I can.
-   open graph metadata: I need this for SEO and pretty link sharing.
-   list of all notes: I don't want to put together a search functionality, so it is simpler to have a Ctrl+F-able list of all my posts in chronological order.
-   accessible "skip to content" link: it's just good practice to be able to skip the header links.

[^even]: Even when they take you out from reading a list.

After reading through the comments one mentioned a great article by swyx [The Surprisingly High Table Stakes of Modern Blogs](https://www.swyx.io/the-surprisingly-high-table-stakes-of-modern-blogs), which added some more advanced features (I haven't implemented any of these):

-   reading time: I like to see approximately how long this blog post will take.
-   rich media embedding: Twitter (subsequently X) and YouTube embeds.
-   minimal analytics without GDPR banner: I want to see how little people care about what I write. ([umami?](https://umami.is/), [fathom?](https://usefathom.com))

And finally, if I got stuck (for example what should a front page say?), I looked at other inspiring blogs and websites. Without any specific order:

-   https://fasterthanli.me/
-   https://craftinginterpreters.com/
-   https://verdagon.dev/home
-   https://without.boats/
-   https://matklad.github.io/
-   https://overreacted.io/
-   https://www.joshwcomeau.com/
-   https://www.swyx.io/

## The framework

The first step for making my blog into reality is to figure out how to turn my thoughts into website form. For this I need some kind of CMS or framework. The deciding factor was the editor: CMSs like Wordpress, Ghost or even Medium require a cognitive step to learn their editors, before I could use it. Also they usually need a database and some server side. Markdown was already a format that I was familiar with and even loved it, having written tons of documentation. [^documentation]. For this I wanted a static site generator that could build my `.md` files into beautiful websites.

[^documentation]: Okay not _tons_, I'm a web developer after all.

Now it is a good time to say that, for maximum control, I could even roll my own static site generator. There are lots of libraries for Markdown parsing, so it wouldn't even be that hard to put together a pipeline. However I'm fiercely anti ["Not Invented Here"](https://en.wikipedia.org/wiki/Not_invented_here), and I always want to put off inventing as much as it is humanly possible.

For static site generators it is not a problem it is already a problem space with many great solutions, like [Jekyll](https://jekyllrb.com/), [Hugo](https://gohugo.io/), [11ty](https://www.11ty.dev/) and [Zola](https://www.getzola.org/). I even used 11ty and Zola and it was great! However for my own website I didn't want to put away the option that sometimes I'll need some interactive components, like [Josh W Comeau's blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog/). He uses [Next.js](https://nextjs.org/) but I didn't want to pull in a whole unopinionated framework. So eventually I triangulated on [Astro](https://astro.build/): it is both a great SSG and a full-stack JavaScript framework, ticking all the boxes.

After developing the website, I'd 10/10 recommend Astro to everyone, it has just the right amounts of knobs for building a completely static website, while being able to upgrade with server-side endpoints or client-side components.

## The design

The next step was to figure out some kind of design for my website. I really like the look of the homegrown minimalist websites ([Without Boats](https://without.boats/), [Overreacted](https://overreacted.io/)): a plain background color with some accents and nice typography. For this I previously used my favourite CSS framework [Sakura.css](https://github.com/oxalorg/sakura). This is a "classless" CSS framework, which means it only styles the default HTML tags, which is perfect for Markdown. This time though, I took the hard route and manually styled headings (calculating sizes with [TypeScale](https://typescale.com/)), adding some prettier quotes and checkboxes. For fonts, I chose my old flame [Raleway](https://fonts.google.com/specimen/Raleway) [^raleway].

[^raleway]: Just look at those `w`-s. Love it.

The main reason why I gravitated towards manual implementation is because I wanted one single idea, that would set my website apart from the others. My big idea was that the accent colour should change based on which category you are in. For example if you are in [webdev](/webdev) it would shine in the light blue of React, while [rust](/rust) would show the orange of the crabs (feel free to click around this website to it in action). After all I'd say this is a pretty nice effect and I'm satisfied with how my website looks.

## The implementation

Finally it's time to put everything into practice and build the website. I don't want to get into every line (90% is just straight from the Astro documentation), but I'm not afraid to share the source code: [daniel7grant/blog](https://github.com/daniel7grant/blog). Feel free to check it out and learn, borrow ideas or straight up steal from it.

### Astro

Most of the website is a stock standard Astro website that you'd arrive at by finishing the brilliant [Astro tutorial](https://docs.astro.build/en/tutorial/). It has a generic [layout](https://docs.astro.build/en/basics/layouts/) for all pages that sets up the header, adds SEO tags (with [Astro SEO](https://github.com/jonasmerlin/astro-seo)) and imports the fonts and styles.

One note that is missing from the tutorial and ended up rewriting is to turn the `.md` files into a [content collection](https://docs.astro.build/en/guides/content-collections/). In the beginning I just added the files into the `pages/` directory which worked fine. However collections has some nice additional features, for example frontmatter type safety, which was so good that I could really use it earlier.

I also added [sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) and [RSS](https://docs.astro.build/en/guides/rss/), which were as easy as advertised.

### Linkable headings

My first bout with Astro was to add an icon to every heading which links there. After a little search (and with [Jan Müller's help](https://jan-mueller.at/blog/next-level-heading-anchors/)) I ended up using [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings) and [rehype-slug](https://github.com/rehypejs/rehype-slug). These add id-s to every header and add a link on, after or before the heading.

I configured it in the `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

// https://astro.build/config
export default defineConfig({
    // ...
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
```

And to have a simple `#` style, I added the following CSS:

```css
:is(h1, h2, h3, h4, h5, h6) a {
    font-size: 80%;
    line-height: 100%;
    opacity: 30%;
    text-decoration: none;
    border-bottom: none;
}

:is(h1, h2, h3, h4, h5, h6) a:hover {
    border-bottom: none;
    opacity: 60%;
}

:is(h1, h2, h3, h4, h5, h6) a .icon::after {
    content: "#";
    padding: 8px;
}
```

### Category accents

For my main idea, the different colours for different categories I decided to use CSS variables. These are great, because you can nest them in arbitrarily deep and you could even change them if you want to crosslink between categories. I ended up using `--category-dark-color` and `--category-light-color`. [^lighttheme]

[^lighttheme]: Yes my default is dark theme. What are you doing here if you use light theme?!

I put all my categories into a JavaScript object, and injected the correct variables in the default layout:

```jsx
<main
    id="main"
    style={{
        "--category-dark-color":
            category?.color.dark ?? "var(--fg-dark-color)",
        "--category-light-color":
            category?.color.light ?? "var(--fg-light-color)",
    }}
>
    <!-- content -->
</main>
```

I applied this variable to heading icons, links, blockquotes and sidenotes. I had to practice some amount of self-discipline to not make everything neon color like a 80s disco, but I can tune it in the future. For a taste how the code looks:

```css
a,
a:visited {
    text-decoration: underline;
    color: rgba(var(--category-dark-color), 0.8);
}

@media (prefers-color-scheme: light) {
    a,
    a:visited {
        color: rgba(var(--category-light-color), 0.8);
    }
}
```

### Sidenotes

Finally the star of the show, the reason why I started this whole thing, give a warm welcome to: sidenotes. There has been writings ad infinitum about sidenotes, most exceptional is [Gwern's Sidenotes](https://gwern.net/doc/design/typography/sidenote/index) post, but I felt like none of these really met my needs. The original sidenote library, [Tufte CSS](https://edwardtufte.github.io/tufte-css/), needs the input HTML in a very specific format, and it fails to account for any collisions. Gwern's sidenotes.js are a big ball of JS, which does more that I really wanted.

Naturally, I decided to rewrite it with my own take. [^nih]

[^nih]: Damn, it hasn't even been a page since I whined about the Not Invented Here syndrome.

The main features I wanted:

-   Use the regular Markdown footnotes, no new syntax
-   Fallback to footnotes on mobile, sidenotes on desktop
-   Be readable without JavaScript
-   No collisions [^collision] [^collision2] [^collision3]

[^collision]: Collision is when there are multiple sidenotes near each other.
[^collision2]: If one of them is longer, they end up overlapping and it seriously hinders any kind of readability.
[^collision3]: Therefore you need to push down the later ones.

What I put together at the end is a similar method how for example [Crafting Interpreters](https://craftinginterpreters.com/parsing-expressions.html) does it, but instead of inline notes, with footnotes. I take the footnotes block and if it is a desktop, I move it to the side with `position: absolute`, and hide the header.

```css
/* sidenotes.css */
#footnote-label {
    display: none;
}

.footnotes {
    position: absolute;
    width: var(--aside-width);
    right: 1rem;
    top: 0;
    font-size: 90%;
}
```

This is already neat, but now the numbers doesn't line up with the notes. This is how far CSS allows us, but it is time to bust out the big guns. (But it is still readable even without JS.)

I wrote a function that iterates over the notes, and finds the corresponding number for it. It checks the coordinates for this number and lines the note with it using `position: absolute` and `top`. The only trick is to keep track of the bottom of the previous note, and use that as the minimum for the next note.

The crooks of this function is as simple as this:

```js
const mainRect = document
    .querySelectorAll("main > article")[0]
    .getBoundingClientRect();
const notes = document.querySelectorAll(".footnotes > ol > li");
const numbers = Array.from(
    document.querySelectorAll("a[href*='user-content-fn']")
);
let previousNoteBottom = 0;
for (const note of notes) {
    const number = numbers.find((n) => n.href.endsWith(note.id));
    if (number) {
        const numberRect = number.getBoundingClientRect();
        const top = Math.max(numberRect.top - mainRect.top, previousNoteBottom);
        note.setAttribute("style", `position: absolute; top: ${top}px`);

        const nodeRect = note.getBoundingClientRect();
        previousNoteBottom = nodeRect.bottom - mainRect.top;
    }
}
```

I put this in a function, setup event listeners and checked for the mobile view. See the whole code in all its [38 lines of glory](https://github.com/daniel7grant/blog/blob/master/src/styles/sidenote.js).

## The result

Putting together this website was a lot of fun and I hope it will inspire me to write posts on it further. I still have some more ideas that I will add later (or never), so check back for more. [^ideas] I will also come out with another post that will detail the deployment of this beautiful website.

[^ideas]: I would like to have analytics, some Obsidian-compatible admonitions, X and YouTube embeddings and txt and json versions of the pages.
