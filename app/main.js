const tabs = document.querySelectorAll(".tab");
const contents = [];

tabs.forEach(tab => {
    const contentid = tab.getAttribute("for");
    const content = document.querySelector(`#${contentid}`);

    contents.push(content);

    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("current"));
        tab.classList.add("current");

        contents.forEach(c => c.style.display = "none");
        content.style.display = null;
    });
});