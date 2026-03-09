/**
 * App Loader for index.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta & Document Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = meta.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.content = meta.description;
        }

        // 2. Hero Section
        const hero = dataProvider.getHero();
        if (hero) {
            const heroBg = document.querySelector(".page-hero__bg");
            if (heroBg)
                heroBg.style.backgroundImage = `url("${hero.backgroundImage}")`;

            Helpers.setText("hero-title", hero.title);
            Helpers.setText("hero-subtitle", hero.subtitle);

            Helpers.setText("stat-distance", hero.stats.distance);
            Helpers.setText("stat-stages", hero.stats.stages);
            Helpers.setText("stat-elevation", hero.stats.elevation);
            Helpers.setText("stat-duration", hero.stats.duration);

            // 2.1 Hero Countdown
            const tourPlan = dataProvider.getTourPlan();
            if (tourPlan && tourPlan.stages && tourPlan.stages.length > 0) {
                const firstStage = tourPlan.stages[0];
                const lastStage = tourPlan.stages[tourPlan.stages.length - 1];

                // Parse Start Date (First Stage)
                const [startDay, startMonth] = firstStage.date
                    .split(".")
                    .map(Number);
                const [startHour, startMinute] = firstStage.startTime
                    .split(":")
                    .map(Number);
                const startDate = new Date(
                    2026,
                    startMonth - 1,
                    startDay,
                    startHour,
                    startMinute,
                );

                // Parse End Date (Last Stage + 1 Day)
                const [endDay, endMonth] = lastStage.date
                    .split(".")
                    .map(Number);
                const [endHour, endMinute] = lastStage.startTime
                    .split(":")
                    .map(Number);
                const endDate = new Date(
                    2026,
                    endMonth - 1,
                    endDay,
                    endHour,
                    endMinute,
                );
                endDate.setDate(endDate.getDate() + 1); // 1 Tag nach der letzten Etappe

                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    const countdownPlaceholder = document.getElementById(
                        "hero-countdown-placeholder",
                    );
                    if (countdownPlaceholder) {
                        countdownPlaceholder.innerHTML =
                            HeroCountdown.render("hero-countdown");
                        HeroCountdown.init(startDate, endDate);
                    }
                }
            }
        }

        // 3. Intro Section
        const intro = dataProvider.getIntro();
        if (intro) {
            Helpers.setText("intro-title", intro.title);
            Helpers.setHTML("intro-content", intro.content);
        }

        // 4. Organization (Quick Links Sidebar)
        const org = dataProvider.getOrganization();
        if (org) {
            Helpers.setText("org-date-range", org.dateRange);

            const participantList = document.getElementById(
                "participant-list-container",
            );
            if (participantList && org.participants) {
                participantList.innerHTML = "";
                org.participants.forEach((p) => {
                    const li = document.createElement("li");
                    li.className = "participant-item";
                    li.innerHTML = `
                        <div class="participant-item__avatar">${p.initials}</div>
                        <span class="participant-item__name">${p.name}</span>
                    `;
                    participantList.appendChild(li);
                });
            }
        }

        // 5. Tour Plan (Table)
        const tourPlan = dataProvider.getTourPlan();
        if (tourPlan) {
            Helpers.setText("tourplan-lead", tourPlan.lead);

            const tbody = document.getElementById("tourplan-body");
            if (tbody && tourPlan.stages) {
                tbody.innerHTML = "";
                tourPlan.stages.forEach((stage) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${stage.day}</td>
                        <td>${stage.date}</td>
                        <td><a href="${stage.link}">${stage.route}</a></td>
                        <td>${stage.distance}</td>
                        <td>${stage.elevation}</td>
                        <td>${stage.duration}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }

        // 6. Overview Map Section
        const overviewMap = dataProvider.getOverviewMap();
        if (overviewMap) {
            Helpers.setText("overview-desc", overviewMap.description);
            const featureList = document.getElementById("overview-features");

            if (featureList && overviewMap.features) {
                featureList.innerHTML = "";
                overviewMap.features.forEach((feature) => {
                    const li = document.createElement("li");
                    li.className = "feature-item";
                    li.innerHTML = `
                        <span class="material-symbols-outlined">check_circle</span>
                        <span class="feature-item__text">${feature}</span>
                    `;
                    featureList.appendChild(li);
                });
            }

            const mapContainer = document.getElementById("overview-map");
            if (mapContainer && overviewMap.gpxBaseUrl) {
                mapContainer.dataset.gpxBase = overviewMap.gpxBaseUrl;
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
        // Optional: show a user-friendly error message on the page
    }
});

/**
 * Helper container for DOM manipulation
 */
const Helpers = {
    setText: (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    },
    setHTML: (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    },
};
