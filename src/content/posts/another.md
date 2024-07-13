---
title: "Let's get down to business"
pubDate: 2022-07-02
description: "This is the first post of my new Astro blog."
image:
    url: "https://docs.astro.build/assets/rose.webp"
    alt: "The Astro logo on a dark background with a pink glow."
category: frontend
---

To defeat the Huns[^mulan] [^huns].

[^mulan]: This is a reference to Mulan.
[^huns]: The Great Wall was actually not built against the Huns, but rather the various Eurasian nomads.

## This is some code shit

If I want to add more ideas here then it will be above the footnotes.

For example here is how you can fill an array with a range of numbers[^start]:

```ts
function range(n: number) {
    return [...Array(n)].map((, i) => i);
}
```

[^start]: If you also want to add the start:

    ```ts
    function range(n: number, start: number = 0) {
        return [...Array(n)].map((, i) => i)
    }
    ```

Let's say we have some more text to add, I don't know.

For example a quote that seems kinda important:

> Never gonna give you up.
>
> Never gonna let you down.
>
> -- _Richard Paul Astley_

## And we can have a checklist shit

For example say I want to have a checklist:

-   Write a blogpost
-   Add sidenotes
-   Deploy it to somewhere [^deploy]

[^deploy]: You can deploy Astro to Netlify, Vercel or any place where you can deploy HTML files.

## What else can we do?

Uhm nothing. Bye.
