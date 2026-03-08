/**
 * App Loader for navigation.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Navigation - ${meta.title}`;
        }

        // 2. GPX Downloads (from tourPlan)
        const tourPlan = dataProvider.getTourPlan();
        if (tourPlan && tourPlan.stages) {
            const gpxContainer = document.getElementById("gpx-list-container");
            if (gpxContainer) {
                gpxContainer.innerHTML = "";
                tourPlan.stages.forEach((stage) => {
                    const item = document.createElement("div");
                    item.className = "download-item";
                    item.innerHTML = `
                        <span class="material-symbols-outlined download-item__icon">route</span>
                        <div class="download-item__body">
                            <p class="download-item__name">Etappe ${stage.id}: ${stage.route}</p>
                            <p class="download-item__meta">GPX · ${stage.distance} · ${stage.elevation}</p>
                        </div>
                        <a href="assets/gpx/${stage.gpx}" class="btn btn--primary btn--sm" download>
                            <span class="material-symbols-outlined">download</span>
                        </a>
                    `;
                    gpxContainer.appendChild(item);
                });
            }
        }

        // 3. Navigation Apps & Tips
        const navData = dataProvider.getNavigation();
        if (navData) {
            // Apps
            const appsContainer = document.getElementById(
                "apps-grid-container",
            );
            if (appsContainer && navData.apps) {
                appsContainer.innerHTML = "";
                navData.apps.forEach((app) => {
                    const card = document.createElement("div");
                    card.className = "app-card";
                    card.innerHTML = `
                        <div class="app-card__icon"><img src="${app.icon}" alt="${app.name} Icon"></div>
                        <div>
                            <p class="app-card__name">${app.name}</p>
                            <p class="app-card__desc">${app.desc}</p>
                            <div class="app-card__links">
                                <a href="${app.links.apple}" target="_blank" rel="noopener" class="app-badge-link app-badge-link--apple">
                                    <img src="assets/images/app-store-badge.svg" alt="Download on the App Store">
                                </a>
                                <a href="${app.links.google}" target="_blank" rel="noopener" class="app-badge-link app-badge-link--google-play">
                                    <img src="assets/images/google-play-badge.svg" alt="Get it on Google Play">
                                </a>
                            </div>
                        </div>
                    `;
                    appsContainer.appendChild(card);
                });
            }

            // Tips
            const tipsContainer = document.getElementById(
                "tips-list-container",
            );
            if (tipsContainer && navData.tips) {
                tipsContainer.innerHTML = "";
                navData.tips.forEach((tip) => {
                    const li = document.createElement("li");
                    li.className = "feature-item";
                    li.innerHTML = `
                        <span class="material-symbols-outlined">${tip.icon}</span>
                        <span class="feature-item__text">${tip.text}</span>
                    `;
                    tipsContainer.appendChild(li);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
