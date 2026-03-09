/**
 * App Loader for unterkuenfte.html
 * Fetches data via the HikeDataProvider and binds it to the DOM.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        // 1. Meta Title
        const meta = dataProvider.getMeta();
        if (meta) {
            document.title = `Unterkünfte - ${meta.title}`;
        }

        // 2. Fetch Accommodations Data
        const accomData = dataProvider.getAccommodations();
        if (accomData) {
            // List of Accommodations
            const listContainer = document.getElementById(
                "accommodations-list-container",
            );
            if (listContainer && accomData.list) {
                listContainer.innerHTML = "";
                accomData.list.forEach((item) => {
                    const container = document.createElement("div");
                    container.innerHTML = AccommodationCard.render(item);
                    listContainer.appendChild(container.firstElementChild);
                });
            }

            // Costs Table
            const costsContainer = document.getElementById(
                "costs-list-container",
            );
            if (costsContainer && accomData.list) {
                costsContainer.innerHTML = "";
                accomData.list.forEach((item) => {
                    const badgeClass =
                        item.statusClass === "paid"
                            ? "badge--paid"
                            : "badge--pending";

                    const tr = document.createElement("tr");
                    // We extract short dates roughly
                    const shortDateMatch = item.date.match(/(\d{2}\.)/g) || [
                        item.date,
                    ];
                    let shortDate = item.date;
                    if (
                        shortDateMatch.length === 2 &&
                        item.date.includes("-")
                    ) {
                        shortDate = `${shortDateMatch[0]}-${shortDateMatch[1]}05.`; // Do - Fr, 07. - 08. Mai 2026 -> 07.-08.05.
                    } else if (
                        item.date.includes("04.") ||
                        item.date.includes("05.") ||
                        item.date.includes("06.") ||
                        item.date.includes("09.")
                    ) {
                        const m = item.date.match(/(\d{2}\.\s*Mai)/);
                        if (m) shortDate = m[1].replace(" Mai", "05."); // 04. Mai -> 04.05.
                    }

                    tr.innerHTML = `
                        <td>${item.name}</td>
                        <td>${shortDate}</td>
                        <td>${item.details.price}</td>
                        <td><span class="badge ${badgeClass}">${item.status}</span></td>
                    `;
                    costsContainer.appendChild(tr);
                });
            }

            // Total Costs Summary
            if (accomData.costs) {
                const totalContainer = document.getElementById(
                    "costs-total-container",
                );
                if (totalContainer) {
                    totalContainer.innerHTML = `Gesamt: ${accomData.costs.total} · davon bezahlt: ${accomData.costs.paid}`;
                }
            }
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
});
