/**
 * AccommodationCard Component
 * Returns the HTML string for an accommodation card.
 * Shared between unterkuenfte.html and etappe.html
 */
const AccommodationCard = {
    render: (accommodation) => {
        if (!accommodation) return "";

        // Status Badge Mapping
        const badgeClass =
            accommodation.statusClass === "paid"
                ? "badge--paid"
                : accommodation.statusClass === "pending"
                  ? "badge--pending"
                  : "badge--white";

        const badgeHtml =
            accommodation.statusClass === "open"
                ? `<span class="badge badge--pending">${accommodation.status}</span>`
                : `<span class="badge ${badgeClass}">${accommodation.status}</span>`;

        let warningHtml = "";
        if (accommodation.warning) {
            warningHtml = `
                <div class="info-box info-box--warning mt-4">
                    <span class="material-symbols-outlined">warning</span>
                    <span>${accommodation.warning}</span>
                </div>
            `;
        }

        return `
            <div class="accom-card">
                <div class="accom-card__header">
                    <div>
                        <p class="accom-card__date">${accommodation.date}</p>
                        <p class="accom-card__name">${accommodation.name}</p>
                    </div>
                    ${badgeHtml}
                </div>
                <div class="accom-card__body">
                    <div class="accom-card__details">
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Typ</span>
                            <span class="accom-card__detail-value">${accommodation.details.type}</span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Ort</span>
                            <span class="accom-card__detail-value">${accommodation.details.location}</span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Webseite</span>
                            <span class="accom-card__detail-value">
                                <a href="${accommodation.details.website.url}" target="_blank" rel="noopener">${accommodation.details.website.label}</a>
                            </span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Preis</span>
                            <span class="accom-card__detail-value">${accommodation.details.price}</span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Frühstück</span>
                            <span class="accom-card__detail-value">${accommodation.details.breakfast}</span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Check-in</span>
                            <span class="accom-card__detail-value">${accommodation.details.checkIn}</span>
                        </div>
                        <div class="accom-card__detail-item">
                            <span class="accom-card__detail-label">Storno</span>
                            <span class="accom-card__detail-value">${accommodation.details.cancellation}</span>
                        </div>
                    </div>
                    ${warningHtml}
                </div>
            </div>
        `;
    },
};
