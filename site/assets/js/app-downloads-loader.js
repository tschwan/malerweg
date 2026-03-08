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

        // 3. Other Documents
        const downloadsData = dataProvider.getDownloads();
        if (downloadsData && downloadsData.documents) {
            const docsContainer = document.getElementById(
                "document-list-container",
            );
            if (docsContainer) {
                docsContainer.innerHTML = "";
                downloadsData.documents.forEach((doc) => {
                    const item = document.createElement("div");
                    item.className = "download-item";
                    // Check if it has a file to download or if it is just a status indicator
                    let actionHtml = "";
                    if (doc.status === "Folgt") {
                        actionHtml = `<span class="btn btn--outline btn--sm" style="cursor:default;opacity:.5;">${doc.status}</span>`;
                    } else if (doc.file) {
                        actionHtml = `
                            <a href="${doc.file}" class="btn btn--primary btn--sm" download>
                                <span class="material-symbols-outlined">download</span> ${doc.actionLabel || "Download"}
                            </a>
                        `;
                    }

                    item.innerHTML = `
                        <span class="material-symbols-outlined download-item__icon">${doc.icon}</span>
                        <div class="download-item__body">
                            <p class="download-item__name">${doc.title}</p>
                            <p class="download-item__meta">${doc.desc}</p>
                        </div>
                        ${actionHtml}
                    `;
                    docsContainer.appendChild(item);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
