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

        // 5. Etappen Liste (Grid)
        const tourPlan = dataProvider.getTourPlan();
        const stages = tourPlan ? tourPlan.stages || [] : [];
        if (tourPlan) {
            Helpers.setText("tourplan-lead", tourPlan.lead);
            const stageGrid = document.getElementById("stage-grid-container");
            if (stageGrid && stages) {
                stageGrid.innerHTML = "";
                stages.forEach((stage) => {
                    const a = document.createElement("a");
                    a.className = "stage-card";
                    a.href = stage.link;
                    const colorStyle = stage.color
                        ? ` style="background:${stage.color};"`
                        : "";
                    a.innerHTML = `
                        <div class="stage-card__number"${colorStyle}>${stage.id}</div>
                        <div class="stage-card__body">
                            <span class="stage-card__date">${stage.day}, ${stage.date}.</span>
                            <p class="stage-card__title">${stage.route}</p>
                            <div class="stage-card__meta">
                                <span class="stage-card__stat"><span class="material-symbols-outlined">route</span>${stage.distance}</span>
                                <span class="stage-card__stat"><span class="material-symbols-outlined">landscape</span>${stage.elevation}</span>
                                <span class="stage-card__stat"><span class="material-symbols-outlined">schedule</span>${stage.duration} h</span>
                            </div>
                        </div>
                        <span class="material-symbols-outlined stage-card__arrow">chevron_right</span>
                    `;
                    stageGrid.appendChild(a);
                });
            }
        }

        // 6. Today Widget
        const todayPlaceholder = document.getElementById(
            "today-widget-placeholder",
        );
        const accommodations = dataProvider.getAccommodations();
        if (todayPlaceholder && stages.length > 0) {
            const today = new Date();
            // today.setFullYear(2026, 4, 6); // Mock date for testing: 6. May 2026
            today.setHours(0, 0, 0, 0);
            const parseSimpleDate = (dateStr) => {
                const [d, m] = dateStr.split(".").map(Number);
                return new Date(2026, m - 1, d);
            };
            const getAccInfo = (accId) => {
                if (!accId || !accommodations || !accommodations.list)
                    return null;
                return accommodations.list.find((a) => a.id === accId);
            };
            const startDate = parseSimpleDate(stages[0].date);
            const endDate = parseSimpleDate(stages[stages.length - 1].date);
            endDate.setHours(23, 59, 59, 999);
            let widgetHTML = "";
            if (today < startDate) {
                const diffTime = startDate - today;
                const daysUntilStart = Math.ceil(
                    diffTime / (1000 * 60 * 60 * 24),
                );
                const firstStage = stages[0];
                const acc = getAccInfo(firstStage.accommodationId);
                widgetHTML = `
                    <div class="today-card">
                        <span class="today-card__eyebrow">Countdown: Noch ${daysUntilStart} Tag${daysUntilStart === 1 ? "" : "e"} bis zum Start</span>
                        <h2 class="today-card__title">Start-Etappe: ${firstStage.route}</h2>
                        <p class="today-card__desc">${firstStage.description}</p>
                        <div class="today-card__footer">
                            <div class="today-card__stats">
                                <div class="today-card__stat">
                                    <span class="today-card__stat-label">Distanz</span>
                                    <span class="today-card__stat-value">${firstStage.distance}</span>
                                </div>
                                <div class="today-card__stat">
                                    <span class="today-card__stat-label">Start</span>
                                    <span class="today-card__stat-value">${firstStage.startTime} Uhr</span>
                                </div>
                                ${
                                    acc
                                        ? `
                                <div class="today-card__stat">
                                    <span class="today-card__stat-label">Unterkunft</span>
                                    <span class="today-card__stat-value">${acc.name}</span>
                                </div>
                                <div class="today-card__stat">
                                    <span class="today-card__stat-label">Check-In</span>
                                    <span class="today-card__stat-value">${acc.details.checkIn}</span>
                                </div>
                                `
                                        : ""
                                }
                            </div>
                            <a href="${firstStage.link}" class="today-card__action">Infos zur 1. Etappe</a>
                        </div>
                    </div>`;
            } else if (today <= endDate) {
                const activeStage = stages.find(
                    (s) =>
                        parseSimpleDate(s.date).getTime() === today.getTime(),
                );
                if (activeStage) {
                    const acc = getAccInfo(activeStage.accommodationId);
                    widgetHTML = `
                        <div class="today-card">
                            <span class="today-card__eyebrow">Heute: Etappe ${activeStage.id}</span>
                            <h2 class="today-card__title">${activeStage.route}</h2>
                            <p class="today-card__desc">${activeStage.description}</p>
                            <div class="today-card__footer">
                                <div class="today-card__stats">
                                    <div class="today-card__stat">
                                        <span class="today-card__stat-label">Distanz</span>
                                        <span class="today-card__stat-value">${activeStage.distance}</span>
                                    </div>
                                    <div class="today-card__stat">
                                        <span class="today-card__stat-label">Höhenmeter</span>
                                        <span class="today-card__stat-value">${activeStage.elevation}</span>
                                    </div>
                                    ${
                                        acc
                                            ? `
                                    <div class="today-card__stat">
                                        <span class="today-card__stat-label">Unterkunft</span>
                                        <span class="today-card__stat-value">${acc.name}</span>
                                    </div>
                                    <div class="today-card__stat">
                                        <span class="today-card__stat-label">Check-In</span>
                                        <span class="today-card__stat-value">${acc.details.checkIn}</span>
                                    </div>
                                    `
                                            : ""
                                    }
                                </div>
                                <a href="${activeStage.link}" class="today-card__action">Details anzeigen</a>
                            </div>
                        </div>`;
                }
            }
            todayPlaceholder.innerHTML = widgetHTML;
        }

        // 7. Overview Map Section
        const overviewMap = dataProvider.getOverviewMap();
        if (overviewMap) {
            Helpers.setText("overview-desc", overviewMap.description);
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
