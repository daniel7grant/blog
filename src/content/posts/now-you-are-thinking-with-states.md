---
title: "Now you are thinking with states"
description: "The most important yet most confusing part of writing a frontend application is handling state. It is easy to add a little bit of state here and there, ending up a spiderweb of interconnected components. How can we do it correctly?"
category: webdev
pubDate: 2024-09-22
---

The most important yet most confusing part of writing a frontend application is handling state. It is easy to add a little bit of state here and there, ending up a spiderweb of interconnected components. How can we do it correctly?

> Even though most examples are written in React, these tips can be used for every JavaScript framework, including Vue, Svelte and maybe even Angular.

## TL;DR

1. Always think about the minimal necessary state before writing a component, use derived states when possible.
2. Prefer pure components to stateful ones and keep related states together, even by putting it in a context.

## What is state?

The first question we have to answer is what even is state. State (not to be confused with `useState`) is the data in our application as a whole that can be modified to change the rendered output.

### UI is the function of State

If you read some articles about JavaScript frameworks, you might have come across this equation:

```
UI = F(State)
```

This is one of the most important concept to understand in frontend frameworks. This means that we always have some internal state of our application and the UI is automatically synced to it (the F function is our components).

For example if we have a calculator component in React, we would setup the inputs as two states and show the result. Changing any of the parameters would automatically recalculate everything, keeping the application always up-to-date.

```tsx
function Calculator() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // This will be recalculated on every change to x or y!
    const result = x + y;

    return (
        <>
            <input id="x" value={x} onChange={(e) => setX(e.target.value)} />
            <input id="y" value={y} onChange={(e) => setY(e.target.value)} />
            <div id="result">Result: {result}</div>
        </>
    );
}
```

In the pre-framework days when we wanted to update part of a website, we had to wire these changes manually. For example for the above simple calculator example in vanilla JavaScript would be:

```ts
const x = document.getElementById("x");
const y = document.getElementById("y");

function updateResult() {
    const resultElement = document.getElementById("result");
    const result = x.value + y.value;
    resultElement.innerHTML = `Result: ${result}`;
}
x.addEventListener("change", updateResult);
y.addEventListener("change", updateResult);
```

As you can imagine this could be pretty slow, reading and writing the HTML elements every time. You have to manage the event listeners for every element and calculate the results correctly. And it will just get even more unwieldy with every new feature added, yielding an exponential growth of new event handlers and elements to update.

However, just because we don't declare the state specifically in the beginning, it doesn't mean we don't have any. In the vanilla JavaScript example, the state is stored in the DOM, the HTML elements. This is why it is necessary to retrieve and update the data every time, and this is the reason behind all kinds of synchronisation issues. Components and holding the state in the memory were the important advantages of JavaScript frameworks, that made it really hard to go back.

### Centralised state

Now, if we come back to our equation it is pretty easy to imagine our application as pipeline. We throw in a state on the top and the framework does its magic and renders a bunch of HTML for us.

```tsx
 /-----\         +-------+
| State | -----> | magic | -----> <div>{result}</div>
 \-----/         +-------+
```

However, applications are rarely that simple.

When React first came around managing state was more complex and people often reached for global state management tools (or **stores**) like Redux. This actually looked like our equation: there was a big cloud of state above everything else and we read or wrote the data that we wanted. This was great because it was very easy to understand and debug, we could just dump our whole application state and inspect it. But it was also very slow (everything had to be updated on every change) and was complicated for data that was only needed in one place. [^redux]

[^redux]: After all these years, I feel like Redux got a bad rep. In many aspects I even miss it, especially the Redux DevTools, with which you could see every update happening in your application, inspecting the state and the differences. It even had "time travel debugging": a way to move back and forth between the state changes, that we all used once to demo it to our coworkers and never touched it again. React hooks never really caught on with the debugging experience of Redux, and to this day it is pretty hard to figure out which state changes and when in your application.

Then came hooks.

Hooks did the same to stores that components did to HTML: made it very easy to split up big things into small, modular pieces. This started the proliferation of little states in the application pushing it down to lower level components. On one hand it is was neat, if we had a calculator component, it could encapsulate all the state necessary for the inputs and the results. On the other hand, component-level states made the question of ownership harder: where should I put my state and who will need access to it? This makes many applications a mess of interconnected states where somebody just needed the value of the password input to show a cute password strength animation and now these two components are connected across the whole application.

## How to manage state efficiently?

Now that we know the history and states and how we got into this `useState`-`useEffect` mess, let's see what we can do about it.

### Find the minimal state necessary

The first tip is probably the simplest: **try to find the smallest state possible and base everything off of it**. It is always a good rule of thumb to reduce the number of states, but it is even more important to never add a state that could be sourced from other states.

A common rookie mistake for the calculator component above is to make the `result` into a state as well:

```ts
function Calculator() {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [result, setResult] = useState(0);

    function onXChange(ev) {
        setX(ev.target.value);
        setResult(ev.target.value + y);
    }

    return (/* ... */);
}
```

This is a common source of bugs, because now every time you are setting `x`or `y` you have to follow up with setting the `result` too. Also we could set result without changing the parameters that would make no sense in the context of the application. It is easy to see how this would lead to out-of-sync data. In this instance, we are doing the job of the framework, instead of the framework handling reactivity for us.

These data that are dependent on other states are called **derived** or **computed state**. It is better to have derived states because they will never change unless their dependencies change, eliminating a whole range of bugs. I like it even better in Vue, because these data are even clearer, denoted with the computed keyword: [^vue]

[^vue]: This is really just a difference in the rendering logic in React versus Vue. In React on every change the whole component function is rerun (_except_ the `useState`, `useEffect` etc. bits), while in Vue and most other frameworks, the component is only run once and only the `ref`, `computed` and other reactive elements are tracked for changes. You can debate which one is clearer, but I prefer the explicitness of Vue in this case.

```vue
<script setup>
const x = ref(0);
const y = ref(0);
const result = computed(() => x.value + y.value);
</script>
```

### Make illegal states irrepresentable

An extension of the previous tip, often heard in Rust circles, is to **make illegal states irrepresentable**. This means that there are sometimes relations between states, that makes some combination of them impossible. For example if we have two states, a success and a failure, in theory there shouldn't be a case where we are both in success and failure or in neither of them. But if we have two states, it could 100% happen:

```tsx
function Quiz() {
    const [successfulAnswer, setSuccessfulAnswer] = useState<string>();
    const [failedAnswer, setFailedAnswer] = useState<string>();

    if (failedAnswer) {
        return <div>Wrong answer: {failedAnswer}. Try again!</div>;
    }

    // What happens if successfulAnswer is undefined? 🤔
    return <div>You are right, it's {successfulAnswer}.</div>;
}
```

In this case we can depend on TypeScript to help us out. We can make a type of the two possible states with a [**discriminated union**](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions), that can only be in either of the two statuses:

```tsx
type QuizState =
    | { status: "correct"; correctAnswer: string }
    | { status: "failed"; failedAnswer: string };

function Quiz() {
    const [quiz, setQuiz] = useState<QuizState>({
        status: "correct",
        correctAnswer: "Marco Polo",
    });

    if (quiz.status === "failed") {
        return <div>Wrong answer: {quiz.failedAnswer}. Try again!</div>;
    }

    // TypeScript knows that we must be in status === "success"!
    return <div>You are right, it's {quiz.successfulAnswer}.</div>;
}
```

This is a great pattern that rules out cases that should never occur and avoids the bugs had our application ever get into these states.

### Prefer pure to stateful

With the deprecation of class components, the distinction between smart components and dumb components has somewhat disappeared. Smart (or container) components are those that can have state, while dumb (or presentational) components are only for rendering UI based on their props. Nowadays these ideas are largely deprecated, but I still like this distinction, albeit in a different name: stateful and pure components. [^pure] We can usually tell them apart whether the component has a `useState` or `useEffect` (or a stateful hook). Pure components can only have props and derived states and cannot modify anything (only call events with their props).

[^pure]: _Pure components_ is a phrase already coined for a [class component escape hatch](https://react.dev/reference/react/PureComponent), but I decided to reclaim this word. Dumb components still feel like a negative word for a largely positive concept, so it is due for a little bit of rebranding.

The reason I like this distinction is because it is connected to my favourite idea in all of programming: pure functions (functions that return the same thing with the same inputs). Pure functions are analogous to pure components, because they are only dependent on their input (props) and have no internal state. This makes pure components great, because they are very easy to understand and debug, because we can just look at the props and we can reproduce it entirely. **My rule of thumb is to use pure components as long as you can** and add the state and events as props, concentrating the state in one super stateful component.

To hammer this home, let's see an example: a table component. I think most people would probably implement a table correctly this way:

```tsx
function PureCell({ content }: { content: string }) {
    return <td>{content}</td>;
}

function PureRow({ cells }: { cells: string[] }) {
    return (
        <tr>
            {cells.map((cell) => (
                <PureCell content={cell} />
            ))}
        </tr>
    );
}

function StatefulTable() {
    const [table, setTable] = useState({
        headers: ["1", "2", "3"],
        rows: [
            { cells: ["1", "2", "3"] },
            { cells: ["4", "5", "6"] },
            { cells: ["7", "8", "9"] },
        ],
    });

    // Imagine table sorting, column reordering logic here

    return (
        <table>
            <tr>
                {table.headers.map((header) => (
                    <th>{header}</th>
                ))}
            </tr>
            {table.rows.map((row) => (
                <PureRow row={row} />
            ))}
        </table>
    );
}
```

But what if we want to add a feature that you can select rows with a checkbox? We are now tempted to upgrade our `PureRow` component to smarten up with a checked state:

```tsx
function ImpureRow({ cells }: { cells: string[] }) {
    const [checked, setChecked] = useState(false);
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={setChecked((c) => !c)}
                />
            </td>
            {cells.map((cell) => (
                <PureCell content={cell} />
            ))}
        </tr>
    );
}
```

This seems like a good choice but now we have multiple pieces of state in multiple places, that makes all too easy to reach out-of-sync issues. For example what happens if the row sorting is changed? Or what happens if we filter some rows with a search? These are tough problems, probably involving keys and events and it all stems from making more things stateful than they should be.

The better way would be to lift the state up to the already stateful component and let them do it:

```tsx
function StatefulTable() {
    const [table, setTable] = useState({
        headers: ["1", "2", "3"],
        rows: [
            { cells: ["1", "2", "3"], checked: false },
            { cells: ["4", "5", "6"], checked: false },
            { cells: ["7", "8", "9"], checked: false },
        ],
    });
    return (/*...*/);
}
```

And let the pure component remain pure using props:

```tsx
function StillPureRow({ cells, checked, onChecked }: { ... }) {
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChecked}
                />
            </td>
            {cells.map(cell => <PureCell content={cell} />)}
        </tr>
    );
}
```

This keeps this component small and testable, while only affecting the stateful component a little.

### Colocate states

This is a continuation of the previous tip but it's good to articulate it: **prefer having the related state in one place**. This makes adding new features easier, because you already have everything to create new derived states without the need to reinvent it all.

For example, imagine a new feature popping up to create a Select All checkbox in the table header. With the `SmartenedRow` component, it would be nearly impossible. On the other hand, with `checked` in the `SmartTable` component it is a trivial case of the derived state:

```tsx
function SmartTable() {
    const [table, setTable] = useState(/*...*/);

    // Is the header checkbox checked?
    const isAllChecked = table.rows.every(row => row.checked);

    function checkAll() {
        setTable(table => ({
            ...table,
            rows: table.rows.map(row => ({ ...row, checked: true }))
        }));
    }

    // unCheckAll is left as an excercise for the reader

    return (/*...*/);
}
```

I hope this convices you to keep states together as possible.

One possible issue is that your stateful components are now huge and unwieldy and difficult to test. One way to solve this is to simply copy-paste the logic of your component into a separate hook / composable:

```tsx
function useTable() {
    const [table, setTable] = useState(/*...*/);

    function sortBy(columnId: number) { ... }

    function onChecked(rowId: number) { ... }

    const isAllChecked = table.rows.every(row => row.checked);
    function checkAll() { ... }
    function unCheckAll() { ... }

    return {
        table,
        sortBy,
        onChecked,
        isAllChecked,
        checkAll,
        unCheckAll,
    };
}
```

This makes your component clean and your logic easily testable and reusable.

### Don't be afraid of contexts

Now you are getting to the end of this, so here is a pop quiz. Is the following component stateful or pure?

```tsx
function UserHeader() {
    const { user, logout } = useContext(UserContext);

    return (
        <div>
            Welcome {user.name}!<button onClick={logout}>Logout</button>
        </div>
    );
}
```

This component is actually still considered a pure component.

As confusing as it sounds, looking from the component's side, contexts are equivalent to props coming from a far-away component ([React handles them the same way internally](https://www.joshwcomeau.com/react/why-react-re-renders/#what-about-context-4)). [^props] This makes **contexts great for implementing state that is used in many different parts of the application like global states**. Even though the syntax is scary and they are hard to use, they are useful for user management, theming and sharing data between pages -- all the things that we used to love state management solutions for.

[^props]: This might beg the question: is using the `useTable` above also keeps our component pure? The answer is **no**. Since a state in a hook / composable is still tied to the component calling it, it is basically equivalent as including the state in the component. In the case of the context the state is tied to the `Context.Provider`. But it will get more interesting, just read on!

## Bonus topics

Now that we covered some tips for handling state in your application, let's look at some specific cases where state behaves differently. This is also a great place to promote two of my favourite React libraries, so stick around!

### Server state

Server state is a common scenario where we request data from the server and then render a page based on this data. This is a special case of state, because most of the time we only mutate once on page load and it never changes again. If we want to change the server state we don't change the variable directly, but instead change it on the server, and refetch it, with the new data.

```tsx
function Page() {
    const [data, setData] = useState();
    useEffect(() => {
        fetchData().then((serverData) => setData(serverData));
    }, []);
    // ...
}
```

If we look at like this, we can consider server state as external to the component, maintaining some level of pureness [^pureness]. So with an advanced enough hook, we could just get the data and use it similar how we would a context:

[^pureness]: I admit, you have to squint a bit for this.

```tsx
function Page() {
    const { data } = useFetchFromServer();
    // ...
}
```

This is the way how [TanStack Query](https://tanstack.com/query/latest) works. Instead of managing the server state, you can just query it with a hook and refetch it, if you think it changed. It reduces out-of-sync issues with your server, while also handling loading and error states. I recommend using Tanstack Query (or [useFetch](https://nuxt.com/docs/api/composables/use-fetch) if you use Nuxt) for every application that has to talk to a server.

```tsx
function Page() {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: "data",
        queryFn: () => fetch("/data").then((res) => res.json()),
    });
    // ...
}
```

### Internal state

There are also components which for better or worse may hold some internal state. We are taught to use refs with them. For example an external carousel library might be similar to this:

```tsx
function MyCarousel() {
    const carouselRef = useRef();
    return (
        <Carousel
            ref={carouselRef}
            onClick={() => {
                console.log(carouselRef.currentIndex);
            }}
        />
    );
}
```

This is definitely not particularly relevant [^newton], but there is one element that even Dan Abramov say holds [local and ephemeral state](https://github.com/reduxjs/redux/issues/1287#issuecomment-175351978): the `input` element. Instead of binding a state to the input we could use a ref to only access the data when necessary (also known as an **uncontrolled component**):

[^newton]: According to the Newton's Third Law, for every _something_ npm library, there is an equal and opposite _react-something_ library.

```tsx
function SearchComponent() {
    const searchRef = useRef(null);

    function onSearch() {
        console.log(searchRef.current.value);
    }

    return (
        <form onSubmit={onSsearch}>
            <input name="search" ref={searchRef} />
            <button type="submit">Search</button>
        </form>
    );
}
```

This is equivalent to a state, but it only accesses the state lazily at the end, so it doesn't need to be updated on every keystroke. This makes it faster even though a bit harder to understand. Now, I wouldn't recommend writing every form like this, but you don't have to: there is [react-hook-form](https://react-hook-form.com/)!

React-hook-form exposes a register function that [binds a ref to the input elements](https://blog.stackademic.com/exploring-react-hook-form-understanding-the-inner-mechanics-of-real-time-form-management-through-e85106e9f654), and only reads them on submit with the `handleSubmit` wrapper function. This makes it not only easier to use forms but also faster. React-hook-form also handles validation, while being 100% typesafe, even for nested forms.

```tsx
function LoginPage() {
    const { handleSubmit, register } = useForm<{ search: string }>();

    function onSubmit(data) {
        console.log(data.search);
    }

    return (
        <form onSubmit={handleSubmit(onSearch)}>
            <input {...register("search")} />
            <button type="submit">Log me in</button>
        </form>
    );
}
```

## Conclusion

I hope this post helped you gain some insight into states. There are no clear answers in programming but these few rules should help to start writing states in a cleaner way.
