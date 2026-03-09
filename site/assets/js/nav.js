/**
 * nav.js - Dynamic Header & Footer Injection, Mobile Toggle & Active Link Highlighting
 */
(async function () {
    "use strict";

    // --- Inject Header ---
    const headerContainer = document.getElementById("main-header");
    if (headerContainer) {
        headerContainer.innerHTML = `
        <div class="container site-header__inner">
            <a href="index.html" class="site-header__brand">
                <span class="material-symbols-outlined site-header__brand-icon">terrain</span>
                <span class="site-header__brand-name">Malerweg 2026</span>
            </a>
            <nav class="site-nav" aria-label="Hauptnavigation">
                <a class="site-nav__link" href="unterkuenfte.html">Unterkünfte</a>
                <a class="site-nav__link" href="organisation.html">Organisation</a>
                <a class="site-nav__link" href="navigation.html">Navigation</a>
                <a class="site-nav__link" href="anreise.html">Anreise</a>
                <a class="site-nav__link" href="links.html">Links</a>
                <a class="site-nav__link" href="downloads.html">Downloads</a>
            </nav>
            <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-mobile" aria-label="Menü öffnen">
                <span class="material-symbols-outlined">menu</span>
            </button>
        </div>
        <nav class="site-nav-mobile" id="nav-mobile" aria-label="Mobile Navigation">
            <a class="site-nav__link" href="unterkuenfte.html">Unterkünfte</a>
            <a class="site-nav__link" href="organisation.html">Organisation</a>
            <a class="site-nav__link" href="navigation.html">Navigation</a>
            <a class="site-nav__link" href="anreise.html">Anreise</a>
            <a class="site-nav__link" href="links.html">Links</a>
            <a class="site-nav__link" href="downloads.html">Downloads</a>
        </nav>`;
    }

    // --- Mobile nav toggle (after injection) ---
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
        let emergency = { rescue: "112", police: "110" };
        try {
            if (window.dataProvider) {
                await dataProvider.init();
                const meta = dataProvider.getMeta();
                if (meta && meta.emergency) {
                    emergency = meta.emergency;
                }
            }
        } catch (e) {
            console.warn("Footer: Could not load emergency data from JSON.");
        }

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
                            Rettungsdienst: ${emergency.rescue}
                        </li>
                        <li class="site-footer__emergency-item">
                            <span class="material-symbols-outlined">local_hospital</span>
                            Polizei: ${emergency.police}
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
