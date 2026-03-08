/**
 * nav.js - Mobile Navigation Toggle & Active Link Highlighting
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
    // --- Inject Footer ---
    const footerContainer = document.getElementById("main-footer");
    if (footerContainer) {
        footerContainer.innerHTML = `
<div class="container">
    <div class="site-footer__grid">
        <div>
            <div class="site-footer__brand">
                <span class="material-symbols-outlined site-footer__brand-icon">terrain</span>
                <span class="site-footer__brand-name">Malerweg</span>
            </div>
            <p class="site-footer__desc">
                Unser persönlicher Begleiter für die
                Malerweg-Wanderung 2026 in der Sächsischen Schweiz.
            </p>
        </div>
        <div class="site-footer__col">
            <h5>Informationen</h5>
            <ul>
                <li><a href="anreise.html">Anreise &amp; Parken</a></li>
                <li><a href="organisation.html">Tagesablauf</a></li>
                <li><a href="navigation.html">Empfohlene Apps</a></li>
                <li><a href="links.html">Nützliche Links</a></li>
            </ul>
        </div>
        <div class="site-footer__col">
            <h5>Downloads</h5>
            <ul>
                <li><a href="downloads.html">GPX Tracks</a></li>
                <li><a href="downloads.html">Zeitplan</a></li>
            </ul>
        </div>
        <div class="site-footer__col site-footer__emergency">
            <h5>Notfall</h5>
            <ul>
                <li class="site-footer__emergency-item">
                    <span class="material-symbols-outlined">call</span>
                    Rettungsdienst: 112
                </li>
                <li class="site-footer__emergency-item">
                    <span class="material-symbols-outlined">local_hospital</span>
                    Polizei: 110
                </li>
            </ul>
        </div>
    </div>
    <div class="site-footer__bottom">
        <p class="site-footer__copy">
            Powered by Stagely - Your hike perfectly staged
        </p>
        <div class="site-footer__legal">
            <a href="#">Impressum</a>
            <a href="#">Datenschutz</a>
        </div>
    </div>
</div>`;
    }
})();
