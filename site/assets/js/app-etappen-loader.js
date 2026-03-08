/**
 * App Loader for etappen.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta & Document Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Etappen - ${meta.title}`;
        }

        // 2. Overview Map Section
        const overviewMap = dataProvider.getOverviewMap();
        if (overviewMap) {
            const mapContainer = document.getElementById("overview-map");
            if (mapContainer && overviewMap.gpxBaseUrl) {
                mapContainer.dataset.gpxBase = overviewMap.gpxBaseUrl;
            }
        }

        // 3. Tour Plan (Stage Grid)
        const tourPlan = dataProvider.getTourPlan();
        if (tourPlan) {
            const stageGrid = document.getElementById("stage-grid-container");
            if (stageGrid && tourPlan.stages) {
                stageGrid.innerHTML = "";
                tourPlan.stages.forEach((stage) => {
                    const a = document.createElement("a");
                    a.className = "stage-card";
                    a.href = stage.link;

                    const colorStyle = stage.color
                        ? ` style="background:${stage.color};"`
                        : "";

                    a.innerHTML = `
                        <div class="stage-card__number"${colorStyle}>${stage.id}</div>
                        <div class="stage-card__body">
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
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
