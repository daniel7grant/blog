document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(min-width: 1000px)").matches) {
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
                const top = Math.max(
                    numberRect.top - mainRect.top,
                    previousNoteBottom
                );
                note.setAttribute("style", `position: absolute; top: ${top}px`);

                const nodeRect = note.getBoundingClientRect();
                previousNoteBottom = nodeRect.bottom - mainRect.top;
            }
        }
    }
});
