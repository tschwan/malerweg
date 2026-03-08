/**
 * App Loader for anreise.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Anreise - ${meta.title}`;
        }

        // 2. Transport Data
        const transportData = dataProvider.getTransport();
        if (transportData) {
            // Helper function to render transport items
            const renderTransportItems = (containerId, items) => {
                const container = document.getElementById(containerId);
                if (container && items) {
                    container.innerHTML = "";
                    items.forEach((item) => {
                        const div = document.createElement("div");
                        div.className = "transport-item";
                        div.innerHTML = `
                            <div class="transport-item__icon"><span class="material-symbols-outlined">${item.icon}</span></div>
                            <div>
                                <p class="transport-item__title">${item.title}</p>
                                <p class="transport-item__desc">${item.desc}</p>
                            </div>
                        `;
                        container.appendChild(div);
                    });
                }
            };

            renderTransportItems(
                "arrival-list-container",
                transportData.arrival,
            );
            renderTransportItems(
                "departure-list-container",
                transportData.departure,
            );
            renderTransportItems(
                "local-transport-list-container",
                transportData.localTransport,
            );
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
