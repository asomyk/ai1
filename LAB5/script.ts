const msg: string = "Hello!";
alert(msg);

const styles: { [key: string]: string } = {
    "Różowy styl": "css/page1.css",
    "Mroczny styl": "css/page2.css",
    "Patelowy styl": "css/page3.css",
};

// Aktualnie załadowany styl
let currentStyle: string | null = null;

function switchStyle(styleName: string) {
    const head = document.querySelector("head");
    if (!head) return;

    const oldLink = document.getElementById("dynamic-style") as HTMLLinkElement;
    if (oldLink) {
        head.removeChild(oldLink);
    }

    const newLink = document.createElement("link");
    newLink.id = "dynamic-style";
    newLink.rel = "stylesheet";
    newLink.href = styles[styleName];
    head.appendChild(newLink);

    currentStyle = styleName;
}

function generateStyleLinks() {
    const container = document.querySelector(".link");
    if (!container) return;

    container.innerHTML = "";

    for (const styleName in styles) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = styleName;
        link.addEventListener("click", () => switchStyle(styleName));

        const paragraph = document.createElement("p");
        paragraph.appendChild(link);
        container.appendChild(paragraph);
    }
}

// Inicjalizacja
document.addEventListener("DOMContentLoaded", () => {
    generateStyleLinks();
    switchStyle("Różowy styl"); // Domyślny styl
});
