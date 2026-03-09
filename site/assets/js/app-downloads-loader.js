/**
 * App Loader for downloads.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Downloads - ${meta.title}`;
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
                            <p class="download-item__meta">GPX-Datei · ${stage.distance} · ${stage.elevation} · ${stage.day} ${stage.date}.</p>
                        </div>
                        <a href="assets/gpx/${stage.gpx}" class="btn btn--primary btn--sm" download>
                            <span class="material-symbols-outlined">download</span> GPX
                        </a>
                    `;
                    gpxContainer.appendChild(item);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
