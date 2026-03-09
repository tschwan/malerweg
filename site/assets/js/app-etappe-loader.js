/**
 * App Etappe Loader
 * Fetches data for a specific stage from HikeDataProvider and populates the etappe.html template.
 */
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await dataProvider.init();

        const urlParams = new URLSearchParams(window.location.search);
        let stageId = parseInt(urlParams.get("id"));

        // Fallback to stage 1 if no valid ID is provided
        if (isNaN(stageId) || stageId < 1 || stageId > 6) {
            stageId = 1;
        }

        const tourPlan = dataProvider.getTourPlan();
        if (!tourPlan || !tourPlan.stages) return;

        const stage = tourPlan.stages.find((s) => s.id === stageId);
        if (!stage) return;

        // --- 1. Meta & Hero ---
        document.getElementById("meta-title").textContent =
            stage.title + " - Malerweg 2026";
        document
            .getElementById("meta-description")
            .setAttribute("content", stage.description);

        document.getElementById("stage-hero").className =
            `stage-hero stage-hero--${stageId}`;
        document.getElementById("breadcrumb-current").textContent =
            `Etappe ${stage.id}`;
        document.getElementById("stage-title").textContent = stage.title;
        document.getElementById("stage-date").textContent = stage.dateSubtitle;

        // --- 2. Stats ---
        document.getElementById("stat-distance").textContent = stage.distance;
        document.getElementById("stat-elevation").textContent = stage.elevation;
        document.getElementById("stat-duration").textContent = stage.duration;
        document.getElementById("stat-difficulty").textContent =
            stage.difficulty;

        // --- 3. Description & InfoBox ---
        document.getElementById("stage-description").textContent =
            stage.description;

        const infoboxContainer = document.getElementById("infobox-container");
        if (infoboxContainer && stage.infoBoxes) {
            infoboxContainer.innerHTML = stage.infoBoxes
                .map(
                    (box, index) => `
                <div class="info-box info-box--${box.type}" style="margin-top:var(--space-${index === 0 ? "4" : "3"});">
                    <span class="material-symbols-outlined">${box.icon}</span>
                    <div>
                        <strong>${box.title}</strong>
                        <p style="margin:0;color:inherit;">${box.text}</p>
                    </div>
                </div>
            `,
                )
                .join("");
        }

        // --- 4. Highlights ---
        const highlightsList = document.getElementById("highlights-list");
        if (highlightsList && stage.highlights) {
            const hHtml = stage.highlights
                .map(
                    (h) => `
                <li class="feature-item">
                    <span class="material-symbols-outlined">${h.icon}</span>
                    <span class="feature-item__text">${h.text}</span>
                </li>
            `,
                )
                .join("");
            highlightsList.innerHTML = hHtml;
        }

        // --- 5. Accommodation ---
        const accomContainer = document.getElementById(
            "accommodation-container",
        );
        if (accomContainer && stage.accommodationId) {
            const accommodations = dataProvider.getAccommodations();
            const accommodation = accommodations.list.find(
                (a) => a.id === stage.accommodationId,
            );

            if (accommodation) {
                const isEndOfTour = accommodation.id === "acc-pirna";

                accomContainer.innerHTML = `
                <div class="card">
                    <div class="section-icon-header" style="margin-bottom:var(--space-4);">
                        <span class="material-symbols-outlined">${accommodation.customIcon || "bed"}</span>
                        <h3 style="font-size:var(--font-size-xl);">${isEndOfTour ? "Tourende" : "Unterkunft heute"}</h3>
                    </div>
                    ${AccommodationCard.render(accommodation)}
                </div>
            `;
            }
        }

        // --- 6. Navigation (Prev / Next) ---
        const prevId = stageId - 1;
        const nextId = stageId + 1;

        if (prevId >= 1) {
            const prevStage = tourPlan.stages.find((s) => s.id === prevId);
            if (prevStage) {
                const navPrev = document.getElementById("nav-prev");
                navPrev.href = `etappe.html?id=${prevId}`;
                navPrev.style.display = "flex";
                navPrev.style.visibility = "visible";
                document.getElementById("nav-prev-name").textContent =
                    prevStage.route;
            }
        }

        if (nextId <= 6) {
            const nextStage = tourPlan.stages.find((s) => s.id === nextId);
            if (nextStage) {
                const navNext = document.getElementById("nav-next");
                navNext.href = `etappe.html?id=${nextId}`;
                navNext.style.display = "flex";
                navNext.style.visibility = "visible";
                document.getElementById("nav-next-name").textContent =
                    nextStage.route;
            }
        } else if (stageId === 6) {
            // Special case for stage 6 -> Next is Overview
            const navNext = document.getElementById("nav-next");
            navNext.href = `etappen.html`;
            navNext.style.display = "flex";
            navNext.style.visibility = "visible";
            document.getElementById("nav-next-meta").textContent = "Übersicht";
            document.getElementById("nav-next-name").textContent =
                "Alle Etappen";
        }

        // --- 7. Map & GPX ---
        document.getElementById("gpx-download-btn").href =
            `assets/gpx/${stage.gpx}`;

        // Setup Map using stage-map.js logic
        initStageMap(stage);
    } catch (error) {
        console.error("Failed to load stage data:", error);
    }
});

function initStageMap(stage) {
    const container = document.getElementById("stage-map");
    if (!container) return;

    // Set dataset properties first so the exact previous logic works flawlessly
    container.dataset.gpx = `assets/gpx/${stage.gpx}`;
    container.dataset.color = stage.color || "#2d4c3b";

    const gpxUrl = container.dataset.gpx;
    if (!gpxUrl) return;
    // Define base layers
    const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap contributors",
        },
    );
    const topo = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
            attribution:
                '© <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            maxZoom: 17,
        },
    );
    const satellite = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
            attribution:
                "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        },
    );
    const map = L.map("stage-map", {
        zoomControl: true,
        scrollWheelZoom: false,
        layers: [osm],
    });
    const baseMaps = {
        "Standard (OSM)": osm,
        Topografie: topo,
        Satellit: satellite,
    };
    L.control.layers(baseMaps).addTo(map);
    const trackColor = container.dataset.color || "#2d4c3b";
    // Load GPX track for visual display
    new L.GPX(gpxUrl, {
        async: true,
        polyline_options: {
            color: trackColor,
            weight: 5,
            opacity: 1,
            lineJoin: "round",
        },
        marker_options: {
            startIconUrl: null,
            endIconUrl: null,
            shadowUrl: null,
            wptIconUrls: { "": null },
        },
    })
        .on("addline", function (e) {
            const halo = L.polyline(e.line.getLatLngs(), {
                color: "#ffffff",
                weight: 10,
                opacity: 0.8,
                lineJoin: "round",
                interactive: false,
            }).addTo(map);
            halo.bringToBack();
        })
        .on("loaded", function (e) {
            map.fitBounds(e.target.getBounds(), { padding: [32, 32] });
        })
        .addTo(map);
    // Initialize elevation profile
    const elevationDiv = document.getElementById("elevation-div");
    if (elevationDiv) {
        // Fix for leaflet-elevation bug where closing reopens immediately
        // due to focus and click events firing toggle in quick succession.
        if (!L.Control.Elevation.prototype._toggleDebounced) {
            const originalToggle = L.Control.Elevation.prototype._toggle;
            L.Control.Elevation.prototype._toggle = function () {
                if (this._isToggling) return;
                this._isToggling = true;
                setTimeout(() => {
                    this._isToggling = false;
                }, 100);
                originalToggle.apply(this, arguments);
            };
            L.Control.Elevation.prototype._toggleDebounced = true;
        }

        // Hover marker shown on map when chart is hovered
        const hoverMarker = L.circleMarker([0, 0], {
            radius: 8,
            fillColor: trackColor,
            fillOpacity: 1,
            color: "#ffffff",
            weight: 3,
            interactive: false,
        });
        const elevationControl = L.control.elevation({
            theme: "lime-theme",
            detached: true,
            elevationDiv: "#elevation-div",
            height: 200,
            autofitBounds: false,
            position: "bottomleft",
            summary: "inline",
            altitude: true,
            slope: "disabled",
            speed: false,
            acceleration: false,
            time: false,
            legend: true,
            followMarker: false,
            almostOver: false,
            distanceMarkers: false,
            downloadLink: false,
            polyline: {
                color: "transparent",
                weight: 0,
                opacity: 0,
            },
        });
        elevationControl.addTo(map);
        elevationControl.load(gpxUrl);
        // Listen to chart mouse events for hover marker
        elevationControl.on("elechart_hover", function (e) {
            if (e && e.data && e.data.latlng) {
                hoverMarker.setLatLng(e.data.latlng).addTo(map);
            }
        });
        elevationControl.on("elechart_leave", function () {
            hoverMarker.remove();
        });
    }
    map.setView([50.955, 14.28], 13);
}
