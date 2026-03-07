/**
 * nav.js – Mobile Navigation Toggle & Active Link Highlighting
 */
(function () {
    "use strict";
    // --- Mobile nav toggle ---
    const toggle = document.getElementById("nav-toggle");
    const mobileNav = document.getElementById("nav-mobile");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", () => {
            const isOpen = mobileNav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
            const icon = toggle.querySelector(".material-symbols-outlined");
            if (icon) icon.textContent = isOpen ? "close" : "menu";
        });
        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                const icon = toggle.querySelector(".material-symbols-outlined");
                if (icon) icon.textContent = "menu";
            }
        });
    }
    // --- Active link highlighting ---
    const currentPath =
        window.location.pathname.split("/").pop() || "index.html";
    document
        .querySelectorAll(".site-nav__link, .site-nav-mobile .site-nav__link")
        .forEach((link) => {
            const linkFile = link.getAttribute("href")?.split("/").pop() || "";
            if (
                linkFile === currentPath ||
                (currentPath === "" && linkFile === "index.html")
            ) {
                link.classList.add("is-active");
            }
        });
    // --- Load Footer dynamically ---
    const footer = document.getElementById("main-footer");
    if (footer) {
        fetch("footer.html")
            .then((response) => {
                if (!response.ok) throw new Error("Could not load footer.");
                return response.text();
            })
            .then((data) => {
                footer.innerHTML = data;
            })
            .catch((err) => console.error(err));
    }
})();
