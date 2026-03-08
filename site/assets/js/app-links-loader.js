/**
 * App Loader for links.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Nützliche Links - ${meta.title}`;
        }

        // 2. Links Data
        const linksData = dataProvider.getLinks();
        if (linksData) {
            const container = document.getElementById("links-container");
            if (container) {
                container.innerHTML = "";
                linksData.forEach((categoryMap) => {
                    const card = document.createElement("div");
                    card.className = "card";

                    let itemsHtml = "";
                    if (categoryMap.items) {
                        categoryMap.items.forEach((item) => {
                            itemsHtml += `
                                <li class="feature-item">
                                    <span class="material-symbols-outlined">${item.icon}</span>
                                    <a href="${item.url}" target="_blank" rel="noopener" class="feature-item__text" style="text-decoration: underline;">
                                        ${item.label}
                                    </a>
                                </li>
                            `;
                        });
                    }

                    card.innerHTML = `
                        <div class="section-icon-header" style="margin-bottom: var(--space-4);">
                            <span class="material-symbols-outlined">${categoryMap.icon}</span>
                            <h3>${categoryMap.category}</h3>
                        </div>
                        <ul class="feature-list">
                            ${itemsHtml}
                        </ul>
                    `;
                    container.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
