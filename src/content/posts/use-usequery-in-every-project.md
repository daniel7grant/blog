---
title: "Use useQuery in every project"
description: "Data fetching is one of the most complicated parts of React codebases, but there is a simple and declarative way of fetching data: useQuery"
category: webdev
pubDate: 2024-12-07
---

Data fetching is one of the most complicated parts of React codebases, many times a lot of custom code repeating on every page with a lot of small states intertwining. But there is a simple and declarative way of fetching data and I say every React app should use it: this is `useQuery`.

## Fetching data

Let's start with an example that probably everyone who worked on an SPA connecting to the server wrote at least once:

```tsx
const App = () => {
    const [data, setData] = useState();

    useEffect(() => {
        apiCall().then((d) => setData(d));
    }, []);

    // ...
};
```

This is the data fetching bread and butter, a Promise that fires when the component is first mounted, and sets the value of a state when finished. Now, this doesn't look like a big deal, but I want to show why this code fundemantally doesn't make sense. [^boilerplate]

[^boilerplate]: In a real life code there would be probably a loading state, an error state and maybe some caching, but I don't want to focus on the boilerplate. Others already did a great job at showing how Tanstack Query frees you from [a bunch of boilerplate](https://www.youtube.com/watch?v=OrliU0e09io) and [a whole list of bugs](https://tkdodo.eu/blog/why-you-want-react-query).

Let's turn this example for a moment into synchronous code to show the issue:

```tsx
const App = () => {
    const [data, setData] = useState();

    useEffect(() => {
        setData({ ... })
    }, []);

    // setData is not used from here
    // ...
}
```

If you see in a review that a junior developer wrote this code, you would probably immediately reject it. First, you should never use an effect to set a default value. And most cases the `setData` is only called once and never again which makes it even worse. This shouldn't even be a state, this is just a constant.

If you think about it, this is the same case with the async example. The `setData` only ever gets called once, in the setup function, and never again. This is what we really want here: [^rsc]

[^rsc]: Don't get confused by the await, this is not a React Server Component, we just want to resolve this promise in a simple way.

```tsx
const App = () => {
    // THIS DOESN'T WORK!
    const data = await apiCall();

    // ...
};
```

We just want to get the data and use it! But alas, it's not that simple on the frontend. You don't want to freeze the whole UI while we are doing an API call. We need to handle loading states, errors and everything else. [^suspense]

[^suspense]: Originally this is what [Suspense](https://react.dev/reference/react/Suspense) was promising, but unfortunately it kind of disappeared.

So doing the second best thing, we do the React way: create a hook to reimplement await for us:

```tsx
const App = () => {
    const data = useAwait(() => apiCall());

    // ...
};
```

In the real world, this hook is called `useQuery` (in Tanstack Query and SWR, or `useAsyncData` in Nuxt). We pass our async code into it, and it turns it into a loading, and eventually a success or error state:

```tsx
const App = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["apiCall"],
        queryFn: () => apiCall(),
    });

    // ...
};
```

This is what `useQuery` is in a nutshell: a way to linearize Promises into synchronous reactive code. In its core it doesn't have anything specific to querying or fetching, only to asynchronous code.

## Client state vs server state

But let's take a step back first. Why do we use `setData` only once? This is a difference between two kind of states: client state and server state. It is a confusing topic, because in React we only have one hook for them: `useState`. But in reality we are using this for multiple things, depending on where the data is actually stored.

Let's look at client state first. This is the data concerning about the user's current actions in the browser. It is your bog standard dropdowns, filters, form inputs and the routing.

```tsx
const App = () => {
    // client state: stored on the client
    const [name, setName] = useState("");

    return (
        <form>
            <label>What is your name:</label>
            <input value={name} onChange={(ev) => setName(ev.target.value)} />
        </form>
    );
};
```

On the contrary, server state is what we hold on the server, usually saved in a database or the session. This is the current user data, the rendered products, settings and others. We load this into our client, using `useQuery`.

```tsx
const App = () => {
    // server state: stored on the server, loaded to the client
    const { data, isLoading } = useQuery({
        queryKey: ['name'],
        queryFn: ...
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>Hello {data.name}</div>
    );
}
```

To understand the difference it is best to look at where the data is _updated_. In the client state you just call `setState` and that's all. In the server state however, you are doing an API call, update the state on the server and usually modify the state locally based on the response. With `useQuery`, you don't even have to modify the local state manually, you can just refetch it. And this is even better! When using server state, all you want is the client to be the same as on the server. This will have the additional benefit that if someone else changed the data, it will reflect that as well.

```tsx
const App = () => {
    // Setup local state and server state
    const [name, setName] = useState("");
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['name'],
        queryFn: ...
    });

    // Set the local state, when the page is loaded
    useEffect(() => {
        setName(data.name)
    }, [data]);

    // Refetch the server on submit
    async function onSubmit() {
        await saveOnServer(name);
        // Don't setName manually... just refetch!
        refetch();
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <form onSubmit={onSubmit}>
            <label>What is your name:</label>
            <input value={name} onChange={ev => setName(ev.target.value)} />
        </form>
    );
}
```

You can refetch the state manually, on page focus, on reconnection to the internet or sometimes even on an interval (with [Tanstack Query](https://tanstack.com/query/v4/docs/framework/react/guides/important-defaults) you get all of these out of the box). The main idea is to think of the local state as an always outdated version of the server: this is the _stale-while-revalidate_ principle (the other big data fetching library, [swr](https://swr.vercel.app/) gets its name from this). This also avoids loading spinners after the first one, because you can always just show the stale data while you are revalidating.

## So, what now?

If you haven't already, I recommend you to think about server state and client state while writing your next frontend application. You'd be surprised how many times you don't really want to manage another state, just keep up-to-date with what's on the server. And in these cases make your life simpler and look at [Tanstack Query](https://tanstack.com/query/latest), [SWR](https://swr.vercel.app/) or your framework's built-ins like Nuxt's [useFetch](https://nuxt.com/docs/getting-started/data-fetching). [^goodies]

[^goodies]: And I haven't even talked about all the goodies you get with these libraries like automatic deduplication (copy paste your `useQuery` calls everywhere and fetch once), infinite scroll/paginated queries and smart retries.
